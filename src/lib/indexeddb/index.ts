// IndexedDB 서비스들의 진입점
export { dbManager } from './database';
export { userService } from './userService';
export { peermallService } from './peermallService';
export { productService } from './productService';
export { authService } from './authService';

export type {
  UserProfile,
  Peermall,
  Product,
  Post,
  Review
} from './database';

// 초기화 함수
import { dbManager } from './database';

export const initializeDatabase = async () => {
  await dbManager.init();
};