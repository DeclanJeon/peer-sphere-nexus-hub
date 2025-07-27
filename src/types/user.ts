export interface UserProfile {
  user_uid: string;
  user_key: string;
  user_email: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  avatarUrl: string | null;
  birthDate: string | null;
  profile_image: string | null;
  social_provider: string | null;
  email_verified: boolean;
  status: 'active' | 'suspended' | 'deleted';
  joinDate: string;
  create_date: string;
  update_date: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  birthDate?: string;
}

export interface ChangePasswordData {
  currentOtp: string;
  newOtp: string;
}
