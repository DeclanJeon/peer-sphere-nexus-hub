import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Upload,
  Loader2,
  Shield,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { UserProfile, UpdateProfileData } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { userApi } from '@/services/user.api';

export function ProfileManagement() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [passwordData, setPasswordData] = useState({ currentOtp: '', newOtp: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await userApi.getProfile();
      setUser(profileData);
      setFormData(profileData);
    } catch (error: any) {
      console.error('프로필 조회 실패:', error);
      toast({
        title: '오류',
        description: error.response?.data?.message || '프로필 정보를 불러오는 데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData: UpdateProfileData = {
        name: formData.name || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        bio: formData.bio || undefined,
        birthDate: formData.birthDate || undefined,
      };

      const updatedUser = await userApi.updateProfile(updateData);
      setUser(updatedUser);
      setFormData(updatedUser);
      
      toast({
        title: '성공',
        description: '프로필이 업데이트되었습니다.',
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('프로필 업데이트 실패:', error);
      toast({
        title: '오류',
        description: error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) setFormData(user);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: '오류',
        description: '파일 크기는 5MB 이하여야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    // 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: '오류',
        description: '이미지 파일만 업로드 가능합니다. (JPEG, PNG, GIF, WebP)',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const updatedUser = await userApi.uploadAvatar(file);
      setUser(updatedUser);
      setFormData(updatedUser);
      
      toast({
        title: '성공',
        description: '프로필 사진이 변경되었습니다.',
      });
    } catch (error: any) {
      console.error('아바타 업로드 실패:', error);
      toast({
        title: '오류',
        description: error.response?.data?.message || '사진 업로드 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentOtp || !passwordData.newOtp) {
      toast({
        title: '오류',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      const result = await userApi.changePassword(passwordData);
      toast({
        title: '성공',
        description: result.message,
      });
      setIsPasswordDialogOpen(false);
      setPasswordData({ currentOtp: '', newOtp: '' });
    } catch (error: any) {
      console.error('비밀번호 변경 실패:', error);
      toast({
        title: '오류',
        description: error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            프로필 정보를 불러올 수 없습니다. 다시 시도해주세요.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">개인정보 관리</h2>
          <p className="text-muted-foreground">
            개인정보를 확인하고 수정하세요.
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <User className="h-4 w-4" />
            정보 수정
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button 
              onClick={handleSave} 
              className="gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              저장
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={formData.avatarUrl || formData.profile_image || undefined} 
                  alt={formData.name || '프로필'} 
                />
                <AvatarFallback className="text-lg">
                  {formData.name?.charAt(0) || formData.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="gap-2"
                  disabled={isUploadingAvatar}
                >
                  <Upload className="h-4 w-4" />
                  프로필 사진 변경
                </Button>
              </>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                이름
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder="이름을 입력하세요"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || formData.user_email || ''}
                disabled={true}
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                연락처
              </Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="010-0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                생년월일
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate || ''}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                주소
              </Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                placeholder="주소를 입력하세요"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">자기소개</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="자기소개를 입력하세요..."
                maxLength={1000}
              />
              {isEditing && (
                <p className="text-sm text-muted-foreground text-right">
                  {formData.bio?.length || 0} / 1000
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>계정 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>가입일</Label>
              <div className="p-2 border rounded bg-muted">
                {new Date(formData.joinDate || formData.create_date || '').toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div className="space-y-2">
              <Label>사용자 ID</Label>
              <div className="p-2 border rounded bg-muted font-mono text-sm">
                {formData.user_uid}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                이메일 인증
                {formData.email_verified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </Label>
              <div className="p-2 border rounded bg-muted">
                {formData.email_verified ? '인증됨' : '미인증'}
              </div>
            </div>
            <div className="space-y-2">
              <Label>계정 상태</Label>
              <div className="p-2 border rounded bg-muted">
                {formData.status === 'active' ? '활성' : 
                 formData.status === 'suspended' ? '정지' : '삭제됨'}
              </div>
            </div>
            {formData.social_provider && (
              <div className="space-y-2">
                <Label>소셜 로그인</Label>
                <div className="p-2 border rounded bg-muted capitalize">
                  {formData.social_provider}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>보안 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full md:w-auto gap-2"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            <Shield className="h-4 w-4" />
            비밀번호 변경
          </Button>
          <div className="text-sm text-muted-foreground">
            보안을 위해 정기적으로 비밀번호를 변경하는 것을 권장합니다.
          </div>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
            <DialogDescription>
              현재 OTP와 새로운 OTP를 입력하여 비밀번호를 변경합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentOtp">현재 OTP</Label>
              <Input
                id="currentOtp"
                type="text"
                value={passwordData.currentOtp}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentOtp: e.target.value }))}
                placeholder="현재 OTP를 입력하세요"
                disabled={isChangingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newOtp">새 OTP</Label>
              <Input
                id="newOtp"
                type="text"
                value={passwordData.newOtp}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newOtp: e.target.value }))}
                placeholder="새로운 OTP를 입력하세요"
                disabled={isChangingPassword}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordDialogOpen(false)}
              disabled={isChangingPassword}
            >
              취소
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              변경하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 로딩 스켈레톤 컴포넌트
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-10 w-40" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}