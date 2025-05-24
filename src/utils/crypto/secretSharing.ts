
import { randomBytes } from '@noble/hashes/utils';
import type { RecoveryShare } from '@/types/wallet';

// Simplified Shamir's Secret Sharing implementation
export function splitSecret(secret: Uint8Array, threshold: number, total: number): RecoveryShare[] {
  if (threshold > total || threshold < 2) {
    throw new Error('Invalid threshold or total shares');
  }

  const shares: RecoveryShare[] = [];
  
  // Generate random coefficients for polynomial
  const coefficients = [secret];
  for (let i = 1; i < threshold; i++) {
    coefficients.push(randomBytes(32));
  }
  
  // Generate shares using polynomial evaluation
  for (let x = 1; x <= total; x++) {
    let result = new Uint8Array(32);
    
    for (let i = 0; i < threshold; i++) {
      const term = multiplyGF256(coefficients[i], Math.pow(x, i) % 256);
      result = xorBytes(result, term);
    }
    
    shares.push({
      index: x,
      share: btoa(String.fromCharCode(...result)),
      threshold,
      total
    });
  }
  
  return shares;
}

export function reconstructSecret(shares: RecoveryShare[]): Uint8Array {
  if (shares.length < shares[0].threshold) {
    throw new Error('Insufficient shares for reconstruction');
  }
  
  const result = new Uint8Array(32);
  
  for (let i = 0; i < shares[0].threshold; i++) {
    const share = new Uint8Array(atob(shares[i].share).split('').map(c => c.charCodeAt(0)));
    const lagrangeCoeff = calculateLagrangeCoefficient(shares, i);
    const term = multiplyGF256(share, lagrangeCoeff);
    result.set(xorBytes(result, term));
  }
  
  return result;
}

function multiplyGF256(a: Uint8Array, scalar: number): Uint8Array {
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = (a[i] * scalar) % 256;
  }
  return result;
}

function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(Math.max(a.length, b.length));
  for (let i = 0; i < result.length; i++) {
    result[i] = (a[i] || 0) ^ (b[i] || 0);
  }
  return result;
}

function calculateLagrangeCoefficient(shares: RecoveryShare[], index: number): number {
  let result = 1;
  const xi = shares[index].index;
  
  for (let j = 0; j < shares.length; j++) {
    if (j !== index) {
      const xj = shares[j].index;
      result = (result * xj) / (xj - xi);
    }
  }
  
  return Math.round(result) % 256;
}
