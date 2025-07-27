// src/pages/user-peermall/UserQRGenerator.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Download, 
  Search, 
  Palette, 
  Settings, 
  History, 
  AlertCircle,
  Check,
  X,
  Upload,
  Loader2,
  QrCode,
  Link,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  User,
  MapPin,
  Calendar,
  Smartphone,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  DollarSign,
  CreditCard,
  Bitcoin,
  Banknote,
  MessageCircle,
  Send,
  Gamepad,
  Video,
  Ticket,
  Star,
  Cloud,
  Package,
  Trash2,
  Copy,
  Share2,
  Info,
  Zap,
  Shield,
  Activity,
  BarChart3,
  Code2,
  Layers,
  Database,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import * as htmlToImage from 'html-to-image';
import { debounce } from 'lodash';
import { LoadingStates, QRAction, QRState, QRType, QRVersionInfo } from '@/types/qr-generator.types';

// Lazy load QR Code component
const QRCode = lazy(() => import('react-qr-code'));

// 에러 메시지 상수
const ERROR_MESSAGES = {
  DATA_TOO_LARGE: '데이터가 너무 큽니다. 더 높은 버전을 선택하거나 내용을 줄여주세요.',
  INVALID_FORMAT: '올바른 형식이 아닙니다.',
  UPLOAD_FAILED: '파일 업로드에 실패했습니다.',
  GENERATION_FAILED: 'QR코드 생성에 실패했습니다.',
  DOWNLOAD_FAILED: '다운로드에 실패했습니다.',
  COPY_FAILED: '복사에 실패했습니다.',
  NO_DATA: 'QR코드 내용을 입력해주세요!'
};



// QR Reducer
const qrReducer = (state: QRState, action: QRAction): QRState => {
  switch (action.type) {
    case 'SET_QR_DATA':
      return { ...state, qrData: action.payload };
    case 'SET_SELECTED_TYPE':
      return { ...state, selectedType: action.payload };
    case 'SET_ERROR_LEVEL':
      return { ...state, errorLevel: action.payload };
    case 'SET_QR_SIZE':
      return { ...state, qrSize: action.payload };
    case 'SET_COLORS':
      return { ...state, ...action.payload };
    case 'SET_CUSTOM_TYPE':
      return { ...state, customType: action.payload };
    case 'SET_UPLOADED_IMAGE':
      return { ...state, uploadedImage: action.payload };
    case 'SET_SELECTED_PRESET':
      return { ...state, selectedPreset: action.payload };
    case 'SET_LOGO_SETTINGS':
      return { 
        ...state, 
        logoSize: action.payload.size ?? state.logoSize,
        logoOpacity: action.payload.opacity ?? state.logoOpacity
      };
    case 'SET_DYNAMIC_FIELDS':
      return { ...state, dynamicFields: action.payload };
    case 'SET_QR_VERSION':
      return { ...state, qrVersion: action.payload };
    case 'SET_IS_DYNAMIC':
      return { ...state, isDynamic: action.payload };
    case 'RESTORE_FROM_HISTORY':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// QR 타입 목록
const QR_TYPES_DATA: QRType[] = [
  // 기본
  { id: 'url', label: 'URL/웹사이트', icon: <Link className="h-5 w-5" />, category: 'basic' },
  { id: 'text', label: '일반 텍스트', icon: <MessageSquare className="h-5 w-5" />, category: 'basic' },
  { id: 'email', label: '이메일', icon: <Mail className="h-5 w-5" />, category: 'basic' },
  { id: 'phone', label: '전화번호', icon: <Phone className="h-5 w-5" />, category: 'basic' },
  { id: 'sms', label: 'SMS 메시지', icon: <MessageSquare className="h-5 w-5" />, category: 'basic' },
  { id: 'wifi', label: 'WiFi 설정', icon: <Wifi className="h-5 w-5" />, category: 'basic' },
  { id: 'vcard', label: '연락처(vCard)', icon: <User className="h-5 w-5" />, category: 'basic' },
  { id: 'location', label: '위치정보', icon: <MapPin className="h-5 w-5" />, category: 'basic' },
  { id: 'event', label: '캘린더 이벤트', icon: <Calendar className="h-5 w-5" />, category: 'basic' },
  { id: 'app', label: '앱 다운로드', icon: <Smartphone className="h-5 w-5" />, category: 'basic' },
];

// 유효성 검증 함수들 (export for testing)
export const validators = {
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  url: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  phone: (phone: string) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(phone)
};

// 데이터 타입 추정 함수 (export for testing)
export const estimateDataType = (data: string): 'numeric' | 'alphanumeric' | 'byte' | 'kanji' => {
  if (/^[0-9]+$/.test(data)) return 'numeric';
  if (/^[0-9A-Z $%*+\-./:]+$/i.test(data)) return 'alphanumeric';
  // 간단히 한자 여부 체크
  if (/[\u4e00-\u9faf]/.test(data)) return 'kanji';
  return 'byte';
};

// QR 버전별 용량 계산 함수
const calculateVersionCapacity = (version: number, errorLevel: 'L' | 'M' | 'Q' | 'H'): QRVersionInfo => {
  const modules = 21 + (version - 1) * 4;
  const totalModules = modules * modules;
  
  // Reed-Solomon 오류 정정에 따른 실제 용량 계산 (근사치)
  const errorCorrectionOverhead = {
    L: 0.93,
    M: 0.85,
    Q: 0.75,
    H: 0.70
  };
  
  // 고정 패턴 영역 제외
  const fixedPatternModules = 
    3 * 64 + // 위치 찾기 패턴
    2 * (modules - 16) + // 타이밍 패턴
    1 + // 다크 모듈
    (version >= 7 ? 36 : 0) + // 버전 정보
    31; // 포맷 정보
  
  const dataModules = Math.floor((totalModules - fixedPatternModules) * errorCorrectionOverhead[errorLevel]);
  const byteCapacity = Math.floor(dataModules / 8);
  
  return {
    version,
    modules,
    numeric: Math.floor(byteCapacity * 3.3),
    alphanumeric: Math.floor(byteCapacity * 2),
    byte: byteCapacity,
    kanji: Math.floor(byteCapacity * 0.6)
  };
};

// 필요한 QR 버전 계산 (export for testing)
export const calculateRequiredVersion = (data: string, errorLevel: 'L' | 'M' | 'Q' | 'H'): number => {
  const dataLength = new TextEncoder().encode(data).length;
  const dataType = estimateDataType(data);
  
  for (let version = 1; version <= 40; version++) {
    const capacity = calculateVersionCapacity(version, errorLevel);
    const typeCapacity = capacity[dataType];
    
    if (dataLength <= typeCapacity) {
      return version;
    }
  }
  
  return 40; // 최대 버전
};

// 입력 데이터 검증
const validateQRData = (data: string, type: string): { isValid: boolean; error?: string } => {
  if (!data.trim()) {
    return { isValid: false, error: ERROR_MESSAGES.NO_DATA };
  }
  
  // 타입별 추가 검증
  switch (type) {
    case 'url':
      return validators.url(data) 
        ? { isValid: true } 
        : { isValid: false, error: ERROR_MESSAGES.INVALID_FORMAT };
        
    case 'email':
      const emailMatch = data.match(/mailto:([^?]+)/);
      const email = emailMatch ? emailMatch[1] : data;
      return validators.email(email)
        ? { isValid: true }
        : { isValid: false, error: ERROR_MESSAGES.INVALID_FORMAT };
        
    case 'phone':
      const phoneNumber = data.replace('tel:', '');
      return validators.phone(phoneNumber)
        ? { isValid: true }
        : { isValid: false, error: ERROR_MESSAGES.INVALID_FORMAT };
        
    default:
      return { isValid: true };
  }
};

// 동적 QR 코드 생성 (실제로는 서버 API 필요)
const generateDynamicQR = (originalUrl: string): string => {
  // 실제 구현에서는 서버 API 호출
  const shortId = Date.now().toString(36);
  return `https://qr.peermall.com/${shortId}`;
};

// 텍스트 sanitize 함수
const sanitizeText = (text: string): string => {
  return text.replace(/[<>&"']/g, (char) => {
    const escapeMap: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[char] || char;
  });
};

// 동적 필드 컴포넌트 (메모이제이션)
const DynamicFields = React.memo<{
  selectedType: string;
  dynamicFields: Record<string, any>;
  onFieldChange: (fields: Record<string, any>) => void;
}>(({ selectedType, dynamicFields, onFieldChange }) => {
  const updateField = (key: string, value: any) => {
    onFieldChange({ ...dynamicFields, [key]: value });
  };

  switch (selectedType) {
    case 'url':
      return (
        <div className="space-y-2">
          <Label>웹사이트 주소</Label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={dynamicFields.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
            aria-label="웹사이트 URL 입력"
          />
          {dynamicFields.url && !validators.url(dynamicFields.url) && (
            <p className="text-xs text-destructive">올바른 URL 형식이 아닙니다</p>
          )}
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2">
          <Label>텍스트 내용</Label>
          <Textarea
            placeholder="텍스트를 입력하세요"
            value={dynamicFields.text || ''}
            onChange={(e) => updateField('text', e.target.value)}
            rows={3}
            aria-label="텍스트 내용 입력"
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground">
            {dynamicFields.text?.length || 0} / 1000자
          </p>
        </div>
      );

    case 'email':
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>이메일 주소</Label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={dynamicFields.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                aria-label="이메일 주소 입력"
              />
              {dynamicFields.email && !validators.email(dynamicFields.email) && (
                <p className="text-xs text-destructive">올바른 이메일 형식이 아닙니다</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>제목</Label>
              <Input
                placeholder="이메일 제목"
                value={dynamicFields.emailSubject || ''}
                onChange={(e) => updateField('emailSubject', e.target.value)}
                aria-label="이메일 제목 입력"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>메시지</Label>
            <Textarea
              placeholder="이메일 내용"
              value={dynamicFields.emailBody || ''}
              onChange={(e) => updateField('emailBody', e.target.value)}
              rows={3}
              aria-label="이메일 내용 입력"
            />
          </div>
        </>
      );

    case 'phone':
      return (
        <div className="space-y-2">
          <Label>전화번호</Label>
          <Input
            type="tel"
            placeholder="+82-10-1234-5678"
            value={dynamicFields.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            aria-label="전화번호 입력"
          />
          {dynamicFields.phone && !validators.phone(dynamicFields.phone) && (
            <p className="text-xs text-destructive">올바른 전화번호 형식이 아닙니다</p>
          )}
        </div>
      );

    case 'sms':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>받는 사람 번호</Label>
            <Input
              type="tel"
              placeholder="+82-10-1234-5678"
              value={dynamicFields.smsNumber || ''}
              onChange={(e) => updateField('smsNumber', e.target.value)}
              aria-label="SMS 수신자 번호 입력"
            />
          </div>
          <div className="space-y-2">
            <Label>메시지</Label>
            <Input
              placeholder="문자 메시지 내용"
              value={dynamicFields.smsMessage || ''}
              onChange={(e) => updateField('smsMessage', e.target.value)}
              maxLength={80}
              aria-label="SMS 메시지 입력"
            />
          </div>
        </div>
      );

    case 'wifi':
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WiFi 이름 (SSID)</Label>
              <Input
                placeholder="네트워크 이름"
                value={dynamicFields.wifiSSID || ''}
                onChange={(e) => updateField('wifiSSID', e.target.value)}
                aria-label="WiFi 네트워크 이름 입력"
              />
            </div>
            <div className="space-y-2">
              <Label>보안 타입</Label>
              <Select
                value={dynamicFields.wifiSecurity || 'WPA'}
                onValueChange={(v) => updateField('wifiSecurity', v)}
              >
                <SelectTrigger aria-label="WiFi 보안 타입 선택">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">보안 없음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="WiFi 비밀번호"
              value={dynamicFields.wifiPassword || ''}
              onChange={(e) => updateField('wifiPassword', e.target.value)}
              disabled={dynamicFields.wifiSecurity === 'nopass'}
              aria-label="WiFi 비밀번호 입력"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wifi-hidden"
              checked={dynamicFields.wifiHidden || false}
              onCheckedChange={(checked) => updateField('wifiHidden', checked)}
              aria-label="숨겨진 네트워크 설정"
            />
            <Label htmlFor="wifi-hidden">숨겨진 네트워크</Label>
          </div>
        </>
      );

    case 'instagram':
      return (
        <div className="space-y-2">
          <Label>Instagram 사용자명</Label>
          <Input
            placeholder="사용자명 (@ 없이)"
            value={dynamicFields.instagramUsername || ''}
            onChange={(e) => updateField('instagramUsername', e.target.value.replace('@', ''))}
            aria-label="Instagram 사용자명 입력"
          />
        </div>
      );

    case 'youtube':
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>YouTube 타입</Label>
            <Select
              value={dynamicFields.youtubeType || 'channel'}
              onValueChange={(v) => updateField('youtubeType', v)}
            >
              <SelectTrigger aria-label="YouTube 콘텐츠 타입 선택">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="channel">채널</SelectItem>
                <SelectItem value="video">동영상</SelectItem>
                <SelectItem value="playlist">재생목록</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>채널ID/동영상ID</Label>
            <Input
              placeholder="YouTube ID"
              value={dynamicFields.youtubeId || ''}
              onChange={(e) => updateField('youtubeId', e.target.value)}
              aria-label="YouTube ID 입력"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
});

DynamicFields.displayName = 'DynamicFields';

// QR 스펙 정보 컴포넌트 (메모이제이션)
const QRSpecInfo = React.memo<{
  qrData: string;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  qrVersion: 'auto' | number;
  isDynamic: boolean;
}>(({ qrData, errorLevel, qrVersion, isDynamic }) => {
  const dataLength = new TextEncoder().encode(qrData).length;
  const dataType = estimateDataType(qrData);
  const requiredVersion = qrVersion === 'auto' ? calculateRequiredVersion(qrData, errorLevel) : qrVersion;
  const versionInfo = calculateVersionCapacity(requiredVersion, errorLevel);
  
  const capacity = versionInfo[dataType];
  const usagePercent = Math.min((dataLength / capacity) * 100, 100);
  
  const errorCorrectionPercent = {
    L: 7,
    M: 15,
    Q: 25,
    H: 30
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          QR코드 상세 스펙
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 기본 정보 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground">QR코드 타입</Label>
            <p className="text-sm font-medium">
              {isDynamic ? '동적(Dynamic) QR' : '정적(Static) QR'}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">데이터 타입</Label>
            <p className="text-sm font-medium">
              {dataType === 'numeric' && '숫자'}
              {dataType === 'alphanumeric' && '영문/숫자'}
              {dataType === 'byte' && '8비트 바이트'}
              {dataType === 'kanji' && '한자'}
            </p>
          </div>
        </div>

        {/* 버전 정보 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">버전 정보</Label>
            <Badge variant="secondary">버전 {requiredVersion}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span>{versionInfo.modules} x {versionInfo.modules} 모듈</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span>최대 {capacity}자</span>
            </div>
          </div>
        </div>

        {/* 용량 사용률 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">용량 사용률</Label>
            <span className="text-sm font-medium">{dataLength} / {capacity}자</span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {usagePercent.toFixed(1)}% 사용 중
          </p>
          {usagePercent > 90 && (
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                용량이 거의 찼습니다. 더 높은 버전을 선택하거나 데이터를 줄이는 것을 권장합니다.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 오류 복원 정보 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Label className="text-muted-foreground">오류 복원 레벨</Label>
          </div>
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">레벨 {errorLevel}</span>
              <Badge variant="outline">{errorCorrectionPercent[errorLevel]}% 복원 가능</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {errorLevel === 'L' && '빠른 스캔에 최적화 (기본 환경)'}
              {errorLevel === 'M' && '균형잡힌 성능 (권장)'}
              {errorLevel === 'Q' && '높은 안정성 (오염 환경)'}
              {errorLevel === 'H' && '최고 안정성 (로고 삽입 시)'}
            </p>
          </div>
        </div>

        {/* 스캔 거리 권장사항 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <Label className="text-muted-foreground">권장 사용 환경</Label>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-muted rounded">
              <p className="font-medium">최소 크기</p>
              <p className="text-muted-foreground">{(versionInfo.modules * 0.5).toFixed(0)}mm</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="font-medium">스캔 거리</p>
              <p className="text-muted-foreground">{(versionInfo.modules * 2).toFixed(0)}-{(versionInfo.modules * 5).toFixed(0)}cm</p>
            </div>
          </div>
        </div>

        {/* 동적 QR 정보 */}
        {isDynamic && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  동적 QR코드 활성화
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  • URL 변경 가능<br />
                  • 스캔 통계 추적<br />
                  • A/B 테스트 지원
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

QRSpecInfo.displayName = 'QRSpecInfo';

// QR코드 에러 바운더리
class QRCodeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">QR코드 생성 중 오류가 발생했습니다</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const QRGeneratorPage: React.FC = () => {
  const { url } = useParams();
  const { toast } = useToast();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 초기 상태
  const initialState: QRState = {
    qrData: `${location.origin}/home/${url}`,
    selectedType: 'url',
    errorLevel: 'M',
    qrSize: 300,
    fgColor: '#000000',
    bgColor: '#ffffff',
    customType: 'none',
    uploadedImage: null,
    selectedPreset: null,
    logoSize: 20,
    logoOpacity: 90,
    dynamicFields: { url: `${location.origin}/home/${url}` },
    qrVersion: 'auto',
    isDynamic: false
  };

  // useReducer로 상태 관리
  const [state, dispatch] = useReducer(qrReducer, initialState);
  
  // 기타 상태
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    generating: false,
    downloading: false,
    uploading: false
  });
  const [history, setHistory] = useState<any[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 로컬 스토리지에서 히스토리 불러오기
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('히스토리 로드 실패:', error);
      }
    }
  }, []);

  // 히스토리 저장
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('qr-history', JSON.stringify(history));
    }
  }, [history]);

  // QR 타입 메모이제이션
  const QR_TYPES = useMemo(() => QR_TYPES_DATA, []);

  // QR 타입별 데이터 생성
  const updateQRContent = useCallback(() => {
    let content = '';
    const fields = state.dynamicFields;
    
    switch (state.selectedType) {
      case 'url':
        content = fields.url || state.qrData;
        break;
      case 'text':
        content = sanitizeText(fields.text || '');
        break;
      case 'email':
        const email = fields.email || '';
        const subject = fields.emailSubject || '';
        const body = fields.emailBody || '';
        content = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : '';
        break;
      case 'phone':
        content = fields.phone ? `tel:${fields.phone}` : '';
        break;
      case 'sms':
        const smsNumber = fields.smsNumber || '';
        const smsMessage = fields.smsMessage || '';
        content = smsNumber ? `sms:${smsNumber}${smsMessage ? '?body=' + encodeURIComponent(smsMessage) : ''}` : '';
        break;
      case 'wifi':
        const ssid = fields.wifiSSID || '';
        const password = fields.wifiPassword || '';
        const security = fields.wifiSecurity || 'WPA';
        const hidden = fields.wifiHidden ? 'true' : 'false';
        content = ssid ? `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;` : '';
        break;
      case 'instagram':
        content = fields.instagramUsername ? `https://instagram.com/${fields.instagramUsername}` : '';
        break;
      case 'youtube':
        const youtubeType = fields.youtubeType || 'channel';
        const youtubeId = fields.youtubeId || '';
        if (youtubeId) {
          if (youtubeType === 'channel') content = `https://youtube.com/channel/${youtubeId}`;
          else if (youtubeType === 'video') content = `https://youtube.com/watch?v=${youtubeId}`;
          else if (youtubeType === 'playlist') content = `https://youtube.com/playlist?list=${youtubeId}`;
        }
        break;
      default:
        content = state.qrData;
    }
    
    // 동적 QR 처리
    if (state.isDynamic && content) {
      content = generateDynamicQR(content);
    }
    
    if (content && content !== state.qrData) {
      dispatch({ type: 'SET_QR_DATA', payload: content });
    }
  }, [state.selectedType, state.dynamicFields, state.qrData, state.isDynamic]);

  // 디바운스된 업데이트
  const debouncedUpdateQR = useMemo(
    () => debounce(updateQRContent, 300),
    [updateQRContent]
  );

  // 타입 변경 시 컨텐츠 업데이트
  useEffect(() => {
    debouncedUpdateQR();
    return () => {
      debouncedUpdateQR.cancel();
    };
  }, [state.selectedType, state.dynamicFields, state.isDynamic, debouncedUpdateQR]);

  // 파일 업로드 처리
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 검증
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "오류",
        description: "PNG, JPG, SVG, WebP 파일만 업로드 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "파일 크기는 5MB 이하여야 합니다.",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingStates(prev => ({ ...prev, uploading: true }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      dispatch({ type: 'SET_UPLOADED_IMAGE', payload: result });
      dispatch({ type: 'SET_CUSTOM_TYPE', payload: 'upload' });
      setLoadingStates(prev => ({ ...prev, uploading: false }));
    };
    reader.onerror = () => {
      toast({
        title: "오류",
        description: ERROR_MESSAGES.UPLOAD_FAILED,
        variant: "destructive"
      });
      setLoadingStates(prev => ({ ...prev, uploading: false }));
    };
    reader.readAsDataURL(file);
  };

  // 다운로드
  const downloadQR = async (format: 'png' | 'svg' | 'jpeg' | 'webp') => {
    if (!qrCodeRef.current) return;
    
    setLoadingStates(prev => ({ ...prev, downloading: true }));
    const fileName = `QR_${state.selectedType}_${Date.now()}.${format}`;
    
    try {
      let dataUrl = '';
      
      if (format === 'svg') {
        const svgElement = qrCodeRef.current.querySelector('svg');
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          dataUrl = URL.createObjectURL(blob);
        }
      } else {
        switch (format) {
          case 'png':
            dataUrl = await htmlToImage.toPng(qrCodeRef.current, { quality: 1 });
            break;
          case 'jpeg':
            dataUrl = await htmlToImage.toJpeg(qrCodeRef.current, { quality: 0.95 });
            break;
          case 'webp':
            dataUrl = await htmlToImage.toCanvas(qrCodeRef.current)
              .then(canvas => canvas.toDataURL('image/webp', 0.95));
            break;
        }
      }
      
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
        
        // Blob URL 정리
        if (format === 'svg') {
          setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
        }
        
        toast({
          title: "다운로드 완료",
          description: `${format.toUpperCase()} 파일이 다운로드되었습니다.`,
        });
      }
    } catch (error) {
      console.error('다운로드 오류:', error);
      toast({
        title: "오류",
        description: ERROR_MESSAGES.DOWNLOAD_FAILED,
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, downloading: false }));
    }
  };

  // QR코드 생성 (히스토리 추가)
  const generateQR = useCallback(() => {
    const validation = validateQRData(state.qrData, state.selectedType);
    
    if (!validation.isValid) {
      toast({
        title: "오류",
        description: validation.error || ERROR_MESSAGES.GENERATION_FAILED,
        variant: "destructive"
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, generating: true }));

    try {
      // 데이터 크기 확인
      const requiredVersion = calculateRequiredVersion(state.qrData, state.errorLevel);
      if (state.qrVersion !== 'auto' && state.qrVersion < requiredVersion) {
        toast({
          title: "경고",
          description: ERROR_MESSAGES.DATA_TOO_LARGE,
          variant: "destructive"
        });
        setLoadingStates(prev => ({ ...prev, generating: false }));
        return;
      }

      // 히스토리에 추가
      const newHistoryItem = {
        id: Date.now(),
        data: state.qrData,
        type: state.selectedType,
        timestamp: new Date().toISOString(),
        settings: {
          errorLevel: state.errorLevel,
          size: state.qrSize,
          fgColor: state.fgColor,
          bgColor: state.bgColor,
          version: state.qrVersion,
          isDynamic: state.isDynamic
        }
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
      
      toast({
        title: "성공",
        description: "QR코드가 생성되었습니다!",
      });
    } catch (error) {
      console.error('QR 생성 오류:', error);
      toast({
        title: "오류",
        description: ERROR_MESSAGES.GENERATION_FAILED,
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, generating: false }));
    }
  }, [state, toast]);

  // 히스토리 아이템 삭제
  const deleteHistoryItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "삭제됨",
      description: "히스토리 항목이 삭제되었습니다.",
    });
  };

  // 전체 히스토리 삭제
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-history');
    toast({
      title: "삭제됨",
      description: "모든 히스토리가 삭제되었습니다.",
    });
  };

  // QR 데이터 복사
  const copyQRData = async () => {
    try {
      await navigator.clipboard.writeText(state.qrData);
      toast({
        title: "복사됨",
        description: "QR코드 데이터가 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류",
        description: ERROR_MESSAGES.COPY_FAILED,
        variant: "destructive"
      });
    }
  };

  // 공유하기
  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR코드 공유',
          text: `QR코드 데이터: ${state.qrData}`,
          url: state.qrData
        });
      } catch (error) {
        console.log('공유 취소 또는 오류:', error);
      }
    } else {
      copyQRData();
    }
  };

  // 카테고리별 필터링 (메모이제이션)
  const filteredTypes = useMemo(() => {
    return QR_TYPES.filter(type => {
      const matchesCategory = selectedCategory === 'all' || type.category === selectedCategory;
      const matchesSearch = type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           type.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [QR_TYPES, selectedCategory, searchTerm]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    const currentImage = state.uploadedImage;
    
    return () => {
      // 컴포넌트 언마운트 시 blob URL 정리
      if (currentImage?.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage);
      }
    };
  }, [state.uploadedImage]);

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 스크린 리더를 위한 상태 알림 */}
        <div role="status" aria-live="polite" className="sr-only">
          {loadingStates.generating && 'QR코드 생성 중...'}
          {loadingStates.downloading && '파일 다운로드 중...'}
          {loadingStates.uploading && '이미지 업로드 중...'}
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            🚀 고급 QR코드 생성기
          </h1>
          <p className="text-muted-foreground">버전 1-40 지원 | 25가지 스마트 QR타입 | 동적 QR 지원</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 왼쪽: 설정 패널 */}
          <div className="space-y-6">
            {/* 기본 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  기본 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR 내용 */}
                <div className="space-y-2">
                  <Label>QR코드 내용</Label>
                  <div className="relative">
                    <Textarea
                      value={state.qrData}
                      onChange={(e) => dispatch({ type: 'SET_QR_DATA', payload: e.target.value })}
                      placeholder="QR코드에 담을 내용을 입력하세요..."
                      rows={3}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyQRData}
                        title="복사"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={shareQR}
                        title="공유"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 색상 설정 */}
                <div className="space-y-2">
                  <Label>색상 설정</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={state.fgColor}
                        onChange={(e) => dispatch({ type: 'SET_COLORS', payload: { fgColor: e.target.value } })}
                        className="h-10 w-16 rounded cursor-pointer"
                        aria-label="QR코드 전경색 선택"
                      />
                      <span className="text-sm">전경색</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={state.bgColor}
                        onChange={(e) => dispatch({ type: 'SET_COLORS', payload: { bgColor: e.target.value } })}
                        className="h-10 w-16 rounded cursor-pointer"
                        aria-label="QR코드 배경색 선택"
                      />
                      <span className="text-sm">배경색</span>
                    </div>
                  </div>
                </div>

                {/* 에러 보정 레벨 */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    오류 복원 레벨
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          QR코드가 손상되어도 읽을 수 있는 정도를 설정합니다.
                          레벨이 높을수록 안정적이지만 저장 용량은 줄어듭니다.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select 
                    value={state.errorLevel} 
                    onValueChange={(v: 'L' | 'M' | 'Q' | 'H') => dispatch({ type: 'SET_ERROR_LEVEL', payload: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">L - 약 7% 복구 (빠른 스캔)</SelectItem>
                      <SelectItem value="M">M - 약 15% 복구 (권장)</SelectItem>
                      <SelectItem value="Q">Q - 약 25% 복구 (안정적)</SelectItem>
                      <SelectItem value="H">H - 약 30% 복구 (최고 안정성)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 크기 */}
                <div className="space-y-2">
                  <Label>크기: {state.qrSize}px</Label>
                  <Slider
                    value={[state.qrSize]}
                    onValueChange={([v]) => dispatch({ type: 'SET_QR_SIZE', payload: v })}
                    min={150}
                    max={800}
                    step={10}
                  />
                </div>

                {/* 고급 설정 토글 */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Code2 className="mr-2 h-4 w-4" />
                  고급 설정 {showAdvanced ? '접기' : '펼치기'}
                </Button>

                {/* 고급 설정 */}
                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t">
                    {/* QR 버전 선택 */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        QR코드 버전
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">
                              버전이 높을수록 더 많은 데이터를 저장할 수 있지만
                              QR코드의 크기와 복잡도가 증가합니다.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select 
                        value={state.qrVersion.toString()} 
                        onValueChange={(v) => dispatch({ type: 'SET_QR_VERSION', payload: v === 'auto' ? 'auto' : parseInt(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">자동 선택 (권장)</SelectItem>
                          {Array.from({ length: 40 }, (_, i) => i + 1).map(v => (
                            <SelectItem key={v} value={v.toString()}>
                              버전 {v} ({21 + (v - 1) * 4}x{21 + (v - 1) * 4} 모듈)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 동적 QR 설정 */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="space-y-0.5">
                        <Label htmlFor="dynamic-qr" className="cursor-pointer">동적 QR코드</Label>
                        <p className="text-xs text-muted-foreground">
                          URL 변경 및 통계 추적 가능
                        </p>
                      </div>
                      <Checkbox
                        id="dynamic-qr"
                        checked={state.isDynamic}
                        onCheckedChange={(checked) => 
                          dispatch({ type: 'SET_IS_DYNAMIC', payload: checked as boolean })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* 생성 버튼 */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={generateQR}
                    disabled={loadingStates.generating || !state.qrData.trim()}
                  >
                    {loadingStates.generating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <QrCode className="mr-2 h-4 w-4" />
                    )}
                    QR코드 생성
                  </Button>
                </div>

                {/* 다운로드 옵션 */}
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQR('png')}
                    disabled={loadingStates.downloading}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    PNG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQR('svg')}
                    disabled={loadingStates.downloading}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    SVG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQR('jpeg')}
                    disabled={loadingStates.downloading}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    JPEG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadQR('webp')}
                    disabled={loadingStates.downloading}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    WebP
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR 타입 선택 */}
            <Card>
              <CardHeader>
                <CardTitle>25가지 스마트 QR코드 타입</CardTitle>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="QR 타입 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* 카테고리 탭 */}
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid grid-cols-7 mb-4">
                    <TabsTrigger value="all">전체</TabsTrigger>
                  </TabsList>

                  {/* QR 타입 그리드 */}
                  <div className="grid grid-cols-3 gap-2">
                    {filteredTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => dispatch({ type: 'SET_SELECTED_TYPE', payload: type.id })}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all",
                          "hover:border-primary hover:bg-primary/5",
                          "flex flex-col items-center gap-2 text-center",
                          state.selectedType === type.id
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        )}
                      >
                        <div className="text-2xl">{type.icon}</div>
                        <span className="text-xs">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </Tabs>

                {/* 동적 입력 필드 */}
                <div className="mt-6 space-y-4">
                  <DynamicFields
                    selectedType={state.selectedType}
                    dynamicFields={state.dynamicFields}
                    onFieldChange={(fields) => dispatch({ type: 'SET_DYNAMIC_FIELDS', payload: fields })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 미리보기 및 정보 */}
          <div className="space-y-6">
            {/* 미리보기 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  미리보기
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center min-h-[350px] bg-muted rounded-lg p-8">
                  <div 
                    ref={qrCodeRef}
                    className="relative bg-white p-4 rounded-lg"
                    style={{ backgroundColor: state.bgColor }}
                  >
                    <QRCodeErrorBoundary>
                      <Suspense fallback={
                        <div className="flex items-center justify-center" style={{ width: state.qrSize, height: state.qrSize }}>
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      }>
                        <QRCode
                          value={state.qrData || 'https://peermall.com'}
                          size={state.qrSize}
                          level={state.errorLevel}
                          fgColor={state.fgColor}
                          bgColor={state.bgColor}
                        />
                      </Suspense>
                    </QRCodeErrorBoundary>
                    
                    {/* 커스텀 로고 오버레이 */}
                    {state.customType !== 'none' && (state.uploadedImage || state.selectedPreset) && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{
                          opacity: state.logoOpacity / 100
                        }}
                      >
                        {state.customType === 'upload' && state.uploadedImage ? (
                          <img
                            src={state.uploadedImage}
                            alt="Logo"
                            style={{
                              width: `${state.logoSize}%`,
                              height: `${state.logoSize}%`,
                              objectFit: 'contain'
                            }}
                          />
                        ) : state.customType === 'preset' && state.selectedPreset ? (
                          <div
                            style={{
                              fontSize: `${(state.qrSize * state.logoSize) / 200}px`,
                              lineHeight: 1
                            }}
                          >
                            {state.selectedPreset}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* QR 정보 */}
                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="text-sm">
                    타입: {QR_TYPES.find(t => t.id === state.selectedType)?.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* QR 스펙 정보 */}
            <QRSpecInfo
              qrData={state.qrData}
              errorLevel={state.errorLevel}
              qrVersion={state.qrVersion}
              isDynamic={state.isDynamic}
            />

            {/* 커스텀 로고 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  커스텀 QR코드
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={state.customType} onValueChange={(v: 'none' | 'upload' | 'preset') => dispatch({ type: 'SET_CUSTOM_TYPE', payload: v })}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="none">없음</TabsTrigger>
                    <TabsTrigger value="upload">이미지 업로드</TabsTrigger>
                    <TabsTrigger value="preset">프리셋</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <div
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      {state.uploadedImage ? (
                        <div className="relative inline-block">
                          <img
                            src={state.uploadedImage}
                            alt="업로드된 이미지"
                            className="max-w-[100px] max-h-[100px] rounded"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch({ type: 'SET_UPLOADED_IMAGE', payload: null });
                            }}
                            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          {loadingStates.uploading ? (
                            <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                          ) : (
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          )}
                          <p className="text-sm text-muted-foreground">
                            클릭해서 이미지 업로드
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, SVG, WebP 지원 (최대 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="preset" className="space-y-4">
                    <div className="grid grid-cols-6 gap-2">
                      {['❤️', '⭐', '🔥', '💎', '🚀', '🎯', '💰', '🎉', '🌟', '⚡', '🎨', '🏆'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => dispatch({ type: 'SET_SELECTED_PRESET', payload: emoji })}
                          className={cn(
                            "aspect-square text-2xl rounded-lg border-2 transition-all",
                            "hover:border-primary hover:scale-110",
                            state.selectedPreset === emoji
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* 로고 설정 */}
                {state.customType !== 'none' && (
                  <div className="mt-4 space-y-4 p-4 bg-muted rounded-lg">
                    <div className="space-y-2">
                      <Label>크기: {state.logoSize}%</Label>
                      <Slider
                        value={[state.logoSize]}
                        onValueChange={([v]) => dispatch({ type: 'SET_LOGO_SETTINGS', payload: { size: v } })}
                        min={10}
                        max={35}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>투명도: {state.logoOpacity}%</Label>
                      <Slider
                        value={[state.logoOpacity]}
                        onValueChange={([v]) => dispatch({ type: 'SET_LOGO_SETTINGS', payload: { opacity: v } })}
                        min={50}
                        max={100}
                      />
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        로고가 너무 크면 QR코드 스캔이 어려울 수 있어요!
                        오류 복원 레벨 H 사용을 권장합니다.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 히스토리 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    생성 히스토리
                  </span>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      전체 삭제
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    아직 생성된 QR코드가 없어요. 첫 번째 QR코드를 만들어보세요! 🚀
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {history.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="relative group"
                      >
                        <button
                          onClick={() => {
                            dispatch({
                              type: 'RESTORE_FROM_HISTORY',
                              payload: {
                                qrData: item.data,
                                selectedType: item.type,
                                errorLevel: item.settings.errorLevel,
                                qrSize: item.settings.size,
                                fgColor: item.settings.fgColor,
                                bgColor: item.settings.bgColor,
                                qrVersion: item.settings.version || 'auto',
                                isDynamic: item.settings.isDynamic || false
                              }
                            });
                          }}
                          className="w-full p-3 border rounded-lg hover:border-primary transition-colors text-left"
                        >
                          <div className="text-xs font-medium mb-1">
                            {QR_TYPES.find(t => t.id === item.type)?.label}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {item.data.substring(0, 20)}...
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </div>
                          {item.settings.version && item.settings.version !== 'auto' && (
                            <Badge variant="outline" className="text-xs mt-1">
                              v{item.settings.version}
                            </Badge>
                          )}
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default QRGeneratorPage;
