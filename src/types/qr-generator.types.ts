// QR코드 타입 정의
export interface QRType {
  id: string;
  label: string;
  icon: React.ReactNode;
  category:
    | 'basic'
    | 'social'
    | 'payment'
    | 'communication'
    | 'business'
    | 'file';
}

// QR 버전 정보 타입
export interface QRVersionInfo {
  version: number;
  modules: number;
  numeric: number;
  alphanumeric: number;
  byte: number;
  kanji: number;
}

// 로딩 상태 타입
export interface LoadingStates {
  generating: boolean;
  downloading: boolean;
  uploading: boolean;
}

// QR 상태 타입
export interface QRState {
  qrData: string;
  selectedType: string;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  qrSize: number;
  fgColor: string;
  bgColor: string;
  customType: 'none' | 'upload' | 'preset';
  uploadedImage: string | null;
  selectedPreset: string | null;
  logoSize: number;
  logoOpacity: number;
  dynamicFields: Record<string, any>;
  qrVersion: 'auto' | number;
  isDynamic: boolean;
}

// QR 액션 타입
export type QRAction =
  | { type: 'SET_QR_DATA'; payload: string }
  | { type: 'SET_SELECTED_TYPE'; payload: string }
  | { type: 'SET_ERROR_LEVEL'; payload: 'L' | 'M' | 'Q' | 'H' }
  | { type: 'SET_QR_SIZE'; payload: number }
  | { type: 'SET_COLORS'; payload: { fgColor?: string; bgColor?: string } }
  | { type: 'SET_CUSTOM_TYPE'; payload: 'none' | 'upload' | 'preset' }
  | { type: 'SET_UPLOADED_IMAGE'; payload: string | null }
  | { type: 'SET_SELECTED_PRESET'; payload: string | null }
  | { type: 'SET_LOGO_SETTINGS'; payload: { size?: number; opacity?: number } }
  | { type: 'SET_DYNAMIC_FIELDS'; payload: Record<string, any> }
  | { type: 'SET_QR_VERSION'; payload: 'auto' | number }
  | { type: 'SET_IS_DYNAMIC'; payload: boolean }
  | { type: 'RESTORE_FROM_HISTORY'; payload: Partial<QRState> };
