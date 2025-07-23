import { dbManager, Post } from './database';

export class EventService {
  // 이벤트 생성
  async createEvent(eventData: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const event: Post = {
      id: crypto.randomUUID(),
      likes: 0,
      comments: 0,
      type: 'event',
      title: String(eventData.title || ''),
      content: String(eventData.content || ''),
      authorId: String(eventData.authorId || ''),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('posts', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.add(event);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return event;
  }

  // 이벤트 조회 (ID로)
  async getEventById(id: string): Promise<Post | null> {
    const store = await dbManager.getStore('posts');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.type === 'event') {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 피어몰의 이벤트 목록 조회
  async getEventsByPeermallId(peermallId: string): Promise<Post[]> {
    const store = await dbManager.getStore('posts');
    const index = store.index('peermallId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(peermallId);
      request.onsuccess = () => {
        const posts = request.result || [];
        const events = posts.filter(post => post.type === 'event');
        resolve(events);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 모든 이벤트 조회
  async getAllEvents(): Promise<Post[]> {
    const store = await dbManager.getStore('posts');
    const index = store.index('type');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll('event');
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 인기 이벤트 조회 (좋아요 기준)
  async getPopularEvents(limit: number = 10, peermallId?: string): Promise<Post[]> {
    let events: Post[];
    
    if (peermallId) {
      events = await this.getEventsByPeermallId(peermallId);
    } else {
      events = await this.getAllEvents();
    }
    
    return events
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  // 최신 이벤트 조회
  async getRecentEvents(limit: number = 10, peermallId?: string): Promise<Post[]> {
    let events: Post[];
    
    if (peermallId) {
      events = await this.getEventsByPeermallId(peermallId);
    } else {
      events = await this.getAllEvents();
    }
    
    return events
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // 이벤트 업데이트
  async updateEvent(id: string, updates: Partial<Omit<Post, 'id' | 'authorId' | 'type' | 'createdAt'>>): Promise<Post> {
    const event = await this.getEventById(id);
    if (!event) {
      throw new Error('이벤트를 찾을 수 없습니다.');
    }

    const updatedEvent: Post = {
      ...event,
      ...updates,
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('posts', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.put(updatedEvent);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return updatedEvent;
  }

  // 이벤트 삭제
  async deleteEvent(id: string): Promise<void> {
    const store = await dbManager.getStore('posts', 'readwrite');
    
    await new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 좋아요 증가
  async likeEvent(id: string): Promise<Post> {
    const event = await this.getEventById(id);
    if (!event) {
      throw new Error('이벤트를 찾을 수 없습니다.');
    }

    return this.updateEvent(id, { likes: event.likes + 1 });
  }

  // 댓글 수 업데이트
  async updateCommentCount(id: string, count: number): Promise<Post> {
    return this.updateEvent(id, { comments: count });
  }

  // 이벤트 검색
  async searchEvents(query: string, peermallId?: string): Promise<Post[]> {
    let events: Post[];
    
    if (peermallId) {
      events = await this.getEventsByPeermallId(peermallId);
    } else {
      events = await this.getAllEvents();
    }
    
    const lowercaseQuery = query.toLowerCase();
    
    return events.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.content.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const eventService = new EventService();