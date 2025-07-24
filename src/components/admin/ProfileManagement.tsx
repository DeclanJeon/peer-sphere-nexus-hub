import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// TODO: Replace with actual user data from API
const mockUserData = {
  id: '1',
  name: '김민수',
  email: 'kim.minsu@example.com',
  phone: '010-1234-5678',
  address: '서울시 강남구 테헤란로 123',
  bio: '안녕하세요! 뷰티 전문가 김민수입니다. 10년 이상의 경험을 바탕으로 최고의 제품만을 선별하여 고객님께 제공하고 있습니다.',
  avatarUrl: '/placeholder-avatar.jpg',
  joinDate: '2024-01-01',
  birthDate: '1990-05-15',
};

export function ProfileManagement() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockUserData);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: API call to update profile
      console.log('Saving profile:', formData);
      
      toast({
        title: '프로필이 업데이트되었습니다.',
        description: '개인정보가 성공적으로 저장되었습니다.',
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: '오류',
        description: '프로필 업데이트 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData(mockUserData);
    setIsEditing(false);
  };

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    console.log('Upload avatar');
  };

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
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
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
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.avatarUrl} alt={formData.name} />
              <AvatarFallback className="text-lg">
                {formData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" onClick={handleAvatarUpload} className="gap-2">
                <Upload className="h-4 w-4" />
                프로필 사진 변경
              </Button>
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
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                연락처
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
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
                value={formData.birthDate}
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
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">자기소개</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="자기소개를 입력하세요..."
              />
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
                {new Date(formData.joinDate).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div className="space-y-2">
              <Label>사용자 ID</Label>
              <div className="p-2 border rounded bg-muted">
                {formData.id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>보안 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full md:w-auto">
            비밀번호 변경
          </Button>
          <div className="text-sm text-muted-foreground">
            보안을 위해 정기적으로 비밀번호를 변경하는 것을 권장합니다.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}