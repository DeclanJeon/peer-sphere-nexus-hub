import { userService } from './userService';
import { UserProfile } from './database';

export class AuthService {
  // 회원가입
  async register(email: string, name: string, phone?: string): Promise<UserProfile> {
    // 이미 존재하는 사용자인지 확인
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 새 사용자 생성
    const newUser = await userService.createUser({
      email,
      name,
      phone,
    });

    // 로그인 토큰 생성 및 저장
    const token = `user_${newUser.id}`;
    localStorage.setItem('peermall_token', token);

    return newUser;
  }

  // 로그인 (간단한 이메일 기반)
  async login(email: string): Promise<UserProfile> {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 로그인 토큰 생성 및 저장
    const token = `user_${user.id}`;
    localStorage.setItem('peermall_token', token);

    return user;
  }

  // 간단한 OTP 로그인 (peermall 입력시)
  async otpLogin(input: string): Promise<UserProfile> {
    if (input.toLowerCase() === 'peermall') {
      // 기본 사용자 생성 또는 조회
      let user = await userService.getUserByEmail('admin@peermall.com');
      
      if (!user) {
        user = await userService.createUser({
          email: 'admin@peermall.com',
          name: '피어몰 관리자',
          phone: '010-1234-5678',
        });
      }

      // 로그인 토큰 생성 및 저장
      const token = `user_${user.id}`;
      localStorage.setItem('peermall_token', token);

      return user;
    } else {
      throw new Error('올바르지 않은 OTP입니다.');
    }
  }

  // 로그아웃
  async logout(): Promise<void> {
    localStorage.removeItem('peermall_token');
  }

  // 현재 로그인 상태 확인
  async isLoggedIn(): Promise<boolean> {
    const token = localStorage.getItem('peermall_token');
    if (!token) return false;

    const currentUser = await userService.getCurrentUser();
    return !!currentUser;
  }

  // 현재 사용자 정보 가져오기
  async getCurrentUser(): Promise<UserProfile | null> {
    return userService.getCurrentUser();
  }
}

export const authService = new AuthService();