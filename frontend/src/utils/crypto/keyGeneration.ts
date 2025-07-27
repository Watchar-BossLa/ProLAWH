
import { ed25519 } from '@noble/curves/ed25519';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import { base58 } from '@scure/base';
import type { DigitalIdentity } from '@/types/wallet';

export async function generateIdentity(): Promise<DigitalIdentity> {
  const privateKey = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKey);
  
  // Generate DID using multibase encoding
  const didSuffix = base58.encode(publicKey);
  const did = `did:key:z${didSuffix}`;
  
  return {
    did,
    keyPair: {
      publicKey,
      privateKey
    },
    keyType: 'Ed25519',
    createdAt: new Date().toISOString()
  };
}

export function signMessage(message: Uint8Array, privateKey: Uint8Array): Uint8Array {
  return ed25519.sign(message, privateKey);
}

export function verifySignature(
  signature: Uint8Array,
  message: Uint8Array,
  publicKey: Uint8Array
): boolean {
  return ed25519.verify(signature, message, publicKey);
}

export function hashData(data: string): Uint8Array {
  return sha256(new TextEncoder().encode(data));
}
