// IndexedDB 데이터베이스 초기화 및 관리
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Peermall {
  id: string;
  name: string;
  address: string;
  category: string;
  description: string;
  image?: string;
  ownerId: string;
  ownerName: string;
  familyCompany: '클레오파트라솔트' | '대한물산' | '메리밀스' | '퓨어펌' | '벤투즈' | '솔트넬';
  referralCode?: string;
  rating: number;
  sales: number;
  status: 'active' | 'inactive';
  logo?: string;
  footerInfo?: string;
  companyInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  peermallId: string;
  ownerId: string;
  rating: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  peermallId?: string;
  type: 'community' | 'event';
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  authorId: string;
  rating: number;
  content: string;
  createdAt: Date;
}

const DB_NAME = 'PeermallDB';
const DB_VERSION = 1;

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // Peermalls store
        if (!db.objectStoreNames.contains('peermalls')) {
          const peermallStore = db.createObjectStore('peermalls', { keyPath: 'id' });
          peermallStore.createIndex('ownerId', 'ownerId', { unique: false });
          peermallStore.createIndex('category', 'category', { unique: false });
        }

        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('peermallId', 'peermallId', { unique: false });
          productStore.createIndex('ownerId', 'ownerId', { unique: false });
          productStore.createIndex('category', 'category', { unique: false });
        }

        // Posts store
        if (!db.objectStoreNames.contains('posts')) {
          const postStore = db.createObjectStore('posts', { keyPath: 'id' });
          postStore.createIndex('authorId', 'authorId', { unique: false });
          postStore.createIndex('peermallId', 'peermallId', { unique: false });
          postStore.createIndex('type', 'type', { unique: false });
        }

        // Reviews store
        if (!db.objectStoreNames.contains('reviews')) {
          const reviewStore = db.createObjectStore('reviews', { keyPath: 'id' });
          reviewStore.createIndex('productId', 'productId', { unique: false });
          reviewStore.createIndex('authorId', 'authorId', { unique: false });
        }
      };
    });
  }

  async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init();
    }
    const transaction = this.db!.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  async closeDB(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const dbManager = new IndexedDBManager();