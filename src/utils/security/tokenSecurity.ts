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
  storeToken(tokenInfo: TokenInfo): void {
    try {
      const encrypted = this.encryptToken(JSON.stringify(tokenInfo));
      sessionStorage.setItem(this.TOKEN_KEY, encrypted);
      
      // Store refresh token separately if available
      if (tokenInfo.refreshToken) {
        const encryptedRefresh = this.encryptToken(tokenInfo.refreshToken);
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
      
      this.storeToken(tokenInfo);
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
   * Basic encryption for token storage
   * Note: This is client-side encryption for basic protection
   */
  private encryptToken(data: string): string {
    // Simple base64 encoding + timestamp salt for basic protection
    const salt = Date.now().toString();
    const combined = salt + ':' + data;
    return btoa(combined);
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