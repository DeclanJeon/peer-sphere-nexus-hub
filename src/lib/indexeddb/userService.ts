import { dbManager, UserProfile } from './database';

export class UserService {
  // 사용자 생성
  async createUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const user: UserProfile = {
      id: crypto.randomUUID(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('users', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.add(user);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return user;
  }

  // 사용자 조회 (이메일로)
  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const store = await dbManager.getStore('users');
    const index = store.index('email');
    
    return new Promise((resolve, reject) => {
      const request = index.get(email);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // 사용자 조회 (ID로)
  async getUserById(id: string): Promise<UserProfile | null> {
    const store = await dbManager.getStore('users');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // 사용자 정보 업데이트
  async updateUser(id: string, updates: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>): Promise<UserProfile> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const updatedUser: UserProfile = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('users', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.put(updatedUser);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return updatedUser;
  }

  // 사용자 삭제
  async deleteUser(id: string): Promise<void> {
    const store = await dbManager.getStore('users', 'readwrite');
    
    await new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 현재 로그인된 사용자 정보 가져오기
  async getCurrentUser(): Promise<UserProfile | null> {
    const token = localStorage.getItem('peermall_token');
    if (!token) return null;

    // 토큰에서 사용자 ID 추출 (실제로는 JWT 디코딩 등을 사용)
    const userId = token.replace('user_', '');
    return this.getUserById(userId);
  }
}

export const userService = new UserService();