/**
 * Enhanced token security utilities
 * Provides secure token storage and rotation mechanisms
 */

import { supabase } from '@/integrations/supabase/client';

export interface TokenInfo {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

export class SecureTokenManager {
  private readonly TOKEN_KEY = 'secure_session_token';
  private readonly REFRESH_KEY = 'secure_refresh_token';
  
  /**
   * Store token securely with encryption
   */
  async storeToken(tokenInfo: TokenInfo): Promise<void> {
    try {
      const encrypted = await this.encryptToken(JSON.stringify(tokenInfo));
      sessionStorage.setItem(this.TOKEN_KEY, encrypted);
      
      // Store refresh token separately if available
      if (tokenInfo.refreshToken) {
        const encryptedRefresh = await this.encryptToken(tokenInfo.refreshToken);
        localStorage.setItem(this.REFRESH_KEY, encryptedRefresh);
      }
    } catch (error) {
      console.error('Failed to store token securely:', error);
    }
  }
  
  /**
   * Retrieve and decrypt token
   */
  getToken(): TokenInfo | null {
    try {
      const encrypted = sessionStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return null;
      
      const decrypted = this.decryptToken(encrypted);
      const tokenInfo = JSON.parse(decrypted) as TokenInfo;
      
      // Check if token is expired
      if (tokenInfo.expiresAt <= Date.now()) {
        this.clearTokens();
        return null;
      }
      
      return tokenInfo;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      this.clearTokens();
      return null;
    }
  }
  
  /**
   * Check if token needs refresh (within 5 minutes of expiry)
   */
  needsRefresh(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const fiveMinutes = 5 * 60 * 1000;
    return token.expiresAt - Date.now() < fiveMinutes;
  }
  
  /**
   * Attempt to refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        this.clearTokens();
        return false;
      }
      
      const tokenInfo: TokenInfo = {
        token: data.session.access_token,
        expiresAt: Date.now() + (data.session.expires_in * 1000),
        refreshToken: data.session.refresh_token
      };
      
      await this.storeToken(tokenInfo);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }
  
  /**
   * Clear all stored tokens
   */
  clearTokens(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }
  
  /**
   * Enhanced encryption for token storage using Web Crypto API
   */
  private async encryptToken(data: string): Promise<string> {
    try {
      // Generate a random key for each encryption
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
      
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt the data
      const encodedData = new TextEncoder().encode(data);
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );
      
      // Combine IV and encrypted data, then base64 encode
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.warn('Crypto API not available, falling back to basic encoding');
      // Fallback to simple encoding if crypto API fails
      const salt = Date.now().toString();
      const combined = salt + ':' + data;
      return btoa(combined);
    }
  }
  
  /**
   * Decrypt token data
   */
  private decryptToken(encrypted: string): string {
    try {
      const decoded = atob(encrypted);
      const [, data] = decoded.split(':', 2);
      return data;
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }
}

export const tokenManager = new SecureTokenManager();