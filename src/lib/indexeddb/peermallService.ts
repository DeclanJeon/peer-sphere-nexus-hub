import { dbManager, Peermall } from './database';

export class PeermallService {
  // 피어몰 생성
  async createPeermall(peermallData: Omit<Peermall, 'id' | 'rating' | 'sales' | 'createdAt' | 'updatedAt'>): Promise<Peermall> {
    const peermall: Peermall = {
      id: crypto.randomUUID(),
      rating: 0,
      sales: 0,
      status: 'active', // Default status for new peermalls
      ...peermallData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('peermalls', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.add(peermall);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return peermall;
  }

  // 피어몰 조회 (ID로)
  async getPeermallById(id: string): Promise<Peermall | null> {
    const store = await dbManager.getStore('peermalls');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // 사용자의 피어몰 목록 조회
  async getPeermallsByOwnerId(ownerId: string): Promise<Peermall[]> {
    const store = await dbManager.getStore('peermalls');
    const index = store.index('ownerId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(ownerId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 모든 피어몰 조회
  async getAllPeermalls(): Promise<Peermall[]> {
    const store = await dbManager.getStore('peermalls');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 카테고리별 피어몰 조회
  async getPeermallsByCategory(category: string): Promise<Peermall[]> {
    const store = await dbManager.getStore('peermalls');
    const index = store.index('category');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(category);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 신규 피어몰 조회 (최근 생성순)
  async getNewPeermalls(limit: number = 10): Promise<Peermall[]> {
    const allPeermalls = await this.getAllPeermalls();
    return allPeermalls
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // 베스트 피어몰 조회 (평점 + 판매량 기준)
  async getBestPeermalls(limit: number = 10): Promise<Peermall[]> {
    const allPeermalls = await this.getAllPeermalls();
    return allPeermalls
      .sort((a, b) => {
        const scoreA = a.rating * 0.7 + (a.sales / 100) * 0.3;
        const scoreB = b.rating * 0.7 + (b.sales / 100) * 0.3;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  // 피어몰 정보 업데이트
  async updatePeermall(id: string, updates: Partial<Omit<Peermall, 'id' | 'ownerId' | 'createdAt'>>): Promise<Peermall> {
    const peermall = await this.getPeermallById(id);
    if (!peermall) {
      throw new Error('피어몰을 찾을 수 없습니다.');
    }

    const updatedPeermall: Peermall = {
      ...peermall,
      ...updates,
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('peermalls', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.put(updatedPeermall);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return updatedPeermall;
  }

  // 피어몰 삭제
  async deletePeermall(id: string): Promise<void> {
    const store = await dbManager.getStore('peermalls', 'readwrite');
    
    await new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 피어몰 검색
  async searchPeermalls(query: string): Promise<Peermall[]> {
    const allPeermalls = await this.getAllPeermalls();
    const lowercaseQuery = query.toLowerCase();
    
    return allPeermalls.filter(peermall => 
      peermall.name.toLowerCase().includes(lowercaseQuery) ||
      peermall.description.toLowerCase().includes(lowercaseQuery) ||
      peermall.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  // 피어몰 조회 (이름으로)
  async getPeermallByName(name: string): Promise<Peermall | null> {
    const allPeermalls = await this.getAllPeermalls();
    return allPeermalls.find(peermall => peermall.name === name) || null;
  }
}

export const peermallService = new PeermallService();