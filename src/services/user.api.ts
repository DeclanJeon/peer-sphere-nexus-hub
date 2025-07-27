import { apiClient } from '@/lib/api/clients';
import {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
} from '@/types/user';

class UserApi {
  private static instance: UserApi;

  private constructor() {}

  public static getInstance(): UserApi {
    if (!UserApi.instance) {
      UserApi.instance = new UserApi();
    }
    return UserApi.instance;
  }

  /**
   * 프로필 조회
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<{
      success: boolean;
      data: UserProfile;
    }>('/users/profile');
    return response.data.data;
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiClient.patch<{
      success: boolean;
      data: UserProfile;
    }>('/users/profile', data);
    return response.data.data;
  }

  /**
   * 아바타 업로드
   */
  async uploadAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{
      success: boolean;
      data: UserProfile;
    }>('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(
    data: ChangePasswordData
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/users/profile/change-password', data);
    return response.data;
  }
}

export const userApi = UserApi.getInstance();
