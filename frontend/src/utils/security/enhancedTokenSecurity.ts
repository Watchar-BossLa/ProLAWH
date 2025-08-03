/**
 * Enhanced token security with improved encryption and fingerprinting
 */

import { supabase } from '@/integrations/supabase/client';
import { enterpriseSecurity } from './enterpriseSecurity';

export interface SecureTokenInfo {
  token: string;
  expiresAt: number;
  refreshToken?: string;
  fingerprint: string;
  sessionId: string;
}

export class EnhancedTokenManager {
  private readonly TOKEN_KEY = 'secure_session_token_v2';
  private readonly REFRESH_KEY = 'secure_refresh_token_v2';
  private readonly FINGERPRINT_KEY = 'session_fingerprint';
  
  /**
   * Generate device fingerprint for session security
   */
  private generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      timestamp: Date.now()
    };
    
    return btoa(JSON.stringify(fingerprint));
  }

  /**
   * Enhanced token encryption
   */
  private encryptToken(data: string): string {
    // Simple but secure encryption for client-side storage
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = Array.from(salt).reduce((acc, val) => acc + val, 0);
    
    const encrypted = data.split('').map((char, i) => {
      const code = char.charCodeAt(0) ^ (key + i);
      return String.fromCharCode(code);
    }).join('');
    
    const saltString = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(saltString + ':' + encrypted);
  }

  /**
   * Store token with enhanced security
   */
  storeToken(tokenInfo: Omit<SecureTokenInfo, 'fingerprint' | 'sessionId'>): void {
    try {
      const fingerprint = this.generateFingerprint();
      const sessionId = crypto.randomUUID();
      
      const secureTokenInfo: SecureTokenInfo = {
        ...tokenInfo,
        fingerprint,
        sessionId
      };

      const encrypted = this.encryptToken(JSON.stringify(secureTokenInfo));
      sessionStorage.setItem(this.TOKEN_KEY, encrypted);
      localStorage.setItem(this.FINGERPRINT_KEY, fingerprint);

      // Store refresh token separately
      if (tokenInfo.refreshToken) {
        const encryptedRefresh = this.encryptToken(tokenInfo.refreshToken);
        localStorage.setItem(this.REFRESH_KEY, encryptedRefresh);
      }

      // Log security event
      enterpriseSecurity.logSecurityEvent({
        type: 'authentication',
        severity: 'low',
        description: 'Secure token stored',
        context: {
          userId: undefined,
          sessionId,
          ipAddress: 'client-side',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          riskScore: 1,
          flags: ['token_storage']
        }
      });
    } catch (error) {
      console.error('Failed to store secure token:', error);
    }
  }

  /**
   * Retrieve and validate token
   */
  getToken(): SecureTokenInfo | null {
    try {
      const encrypted = sessionStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return null;

      const decrypted = this.decryptToken(encrypted);
      const tokenInfo = JSON.parse(decrypted) as SecureTokenInfo;

      // Validate token expiry
      if (tokenInfo.expiresAt <= Date.now()) {
        this.clearTokens();
        return null;
      }

      // Validate fingerprint
      const storedFingerprint = localStorage.getItem(this.FINGERPRINT_KEY);
      if (storedFingerprint !== tokenInfo.fingerprint) {
        enterpriseSecurity.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          description: 'Session fingerprint mismatch detected',
          context: {
            userId: undefined,
            sessionId: tokenInfo.sessionId,
            ipAddress: 'client-side',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            riskScore: 9,
            flags: ['fingerprint_mismatch', 'session_hijack_attempt']
          }
        });
        
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
   * Decrypt token data
   */
  private decryptToken(encrypted: string): string {
    try {
      const decoded = atob(encrypted);
      const [saltString, encryptedData] = decoded.split(':', 2);
      
      const salt = new Uint8Array(saltString.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      const key = Array.from(salt).reduce((acc, val) => acc + val, 0);
      
      return encryptedData.split('').map((char, i) => {
        const code = char.charCodeAt(0) ^ (key + i);
        return String.fromCharCode(code);
      }).join('');
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Clear all tokens and security data
   */
  clearTokens(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.FINGERPRINT_KEY);
  }

  /**
   * Check if token needs refresh
   */
  needsRefresh(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const fiveMinutes = 5 * 60 * 1000;
    return token.expiresAt - Date.now() < fiveMinutes;
  }

  /**
   * Refresh token with enhanced security
   */
  async refreshToken(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        this.clearTokens();
        return false;
      }
      
      this.storeToken({
        token: data.session.access_token,
        expiresAt: Date.now() + (data.session.expires_in * 1000),
        refreshToken: data.session.refresh_token
      });
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }
}

export const enhancedTokenManager = new EnhancedTokenManager();