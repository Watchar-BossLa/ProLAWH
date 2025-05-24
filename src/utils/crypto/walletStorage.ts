
import type { DigitalIdentity, VerifiableCredential } from '@/types/wallet';

const DB_NAME = 'VeriSkillWallet';
const DB_VERSION = 1;
const IDENTITY_STORE = 'identity';
const CREDENTIALS_STORE = 'credentials';

class WalletStorage {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(IDENTITY_STORE)) {
          db.createObjectStore(IDENTITY_STORE, { keyPath: 'did' });
        }
        
        if (!db.objectStoreNames.contains(CREDENTIALS_STORE)) {
          db.createObjectStore(CREDENTIALS_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  async storeIdentity(identity: DigitalIdentity): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction([IDENTITY_STORE], 'readwrite');
    const store = transaction.objectStore(IDENTITY_STORE);
    
    // Encrypt private key before storage
    const encryptedIdentity = {
      ...identity,
      keyPair: {
        ...identity.keyPair,
        privateKey: await this.encryptPrivateKey(identity.keyPair.privateKey)
      }
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(encryptedIdentity);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getIdentity(): Promise<DigitalIdentity | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction([IDENTITY_STORE], 'readonly');
    const store = transaction.objectStore(IDENTITY_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = async () => {
        const identities = request.result;
        if (identities.length === 0) {
          resolve(null);
          return;
        }
        
        const identity = identities[0];
        // Decrypt private key
        identity.keyPair.privateKey = await this.decryptPrivateKey(identity.keyPair.privateKey);
        resolve(identity);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async storeCredential(credential: VerifiableCredential): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction([CREDENTIALS_STORE], 'readwrite');
    const store = transaction.objectStore(CREDENTIALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(credential);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCredentials(): Promise<VerifiableCredential[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction([CREDENTIALS_STORE], 'readonly');
    const store = transaction.objectStore(CREDENTIALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async encryptPrivateKey(privateKey: Uint8Array): Promise<Uint8Array> {
    // In production, use proper encryption with user password
    // For demo, we'll just return the key (THIS IS NOT SECURE)
    return privateKey;
  }

  private async decryptPrivateKey(encryptedKey: Uint8Array): Promise<Uint8Array> {
    // In production, decrypt with user password
    // For demo, we'll just return the key
    return encryptedKey;
  }
}

export const walletStorage = new WalletStorage();
