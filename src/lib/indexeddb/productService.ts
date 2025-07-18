import { dbManager, Product } from './database';

export class ProductService {
  // 상품 생성
  async createProduct(productData: Omit<Product, 'id' | 'rating' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const product: Product = {
      id: crypto.randomUUID(),
      rating: 0,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('products', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.add(product);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return product;
  }

  // 상품 조회 (ID로)
  async getProductById(id: string): Promise<Product | null> {
    const store = await dbManager.getStore('products');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // 피어몰의 상품 목록 조회
  async getProductsByPeermallId(peermallId: string): Promise<Product[]> {
    const store = await dbManager.getStore('products');
    const index = store.index('peermallId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(peermallId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 사용자의 상품 목록 조회
  async getProductsByOwnerId(ownerId: string): Promise<Product[]> {
    const store = await dbManager.getStore('products');
    const index = store.index('ownerId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(ownerId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 모든 상품 조회
  async getAllProducts(): Promise<Product[]> {
    const store = await dbManager.getStore('products');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 카테고리별 상품 조회
  async getProductsByCategory(category: string): Promise<Product[]> {
    const store = await dbManager.getStore('products');
    const index = store.index('category');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(category);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 신규 상품 조회 (최근 생성순)
  async getNewProducts(limit: number = 10): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    return allProducts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // 베스트 상품 조회 (평점 기준)
  async getBestProducts(limit: number = 10): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    return allProducts
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // 상품 정보 업데이트
  async updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'ownerId' | 'createdAt'>>): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    const updatedProduct: Product = {
      ...product,
      ...updates,
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('products', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.put(updatedProduct);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return updatedProduct;
  }

  // 상품 삭제
  async deleteProduct(id: string): Promise<void> {
    const store = await dbManager.getStore('products', 'readwrite');
    
    await new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 상품 검색
  async searchProducts(query: string): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    const lowercaseQuery = query.toLowerCase();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const productService = new ProductService();