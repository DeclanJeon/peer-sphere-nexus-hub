import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Phone, Mail, MapPin, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { userService, authService, UserProfile } from '@/lib/indexeddb';

const MyInfo = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          name: currentUser.name || '',
          phone: currentUser.phone || '',
          address: currentUser.address || '',
        });
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '사용자 정보를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const updatedUser = await userService.updateUser(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      setUser(updatedUser);
      setIsEditing(false);
      
      toast({
        title: '성공',
        description: '정보가 성공적으로 업데이트되었습니다.',
      });
    } catch (error) {
      toast({
        title: '오류',
        description: '정보 업데이트에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">내 정보 관리</h1>
        <p className="text-muted-foreground mt-2">개인정보를 관리하고 업데이트하세요</p>
      </div>

      <div className="grid gap-6">
        {/* 프로필 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              프로필 정보
            </CardTitle>
            <CardDescription>
              기본 개인정보를 관리할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 프로필 이미지 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.profileImage} alt="프로필" />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button type="button" variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    프로필 사진 변경
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG 파일만 업로드 가능합니다
                  </p>
                </div>
              </div>

              {/* 이메일 (읽기 전용) */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user.email}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  이메일은 변경할 수 없습니다
                </p>
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    required
                  />
                </div>
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              {/* 주소 */}
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                    placeholder="주소를 입력하세요"
                    rows={2}
                  />
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || '',
                          phone: user.phone || '',
                          address: user.address || '',
                        });
                      }}
                    >
                      취소
                    </Button>
                    <Button type="submit">
                      저장
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    정보 수정
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 계정 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>계정 정보</CardTitle>
            <CardDescription>
              계정 관련 정보입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">가입일:</span>
                <p className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div>
                <span className="font-medium">최종 수정일:</span>
                <p className="text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyInfo;