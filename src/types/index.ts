/** 문서 (프론트엔드 매핑 후) */
export interface Document {
  id: string;
  category: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl?: string;
  pages?: number | null;
  size?: string;
  tags?: string[];
  addedAt?: string;
}

/** Supabase documents 테이블 행 */
export interface DocumentRow {
  slug: string;
  category: string;
  title: string;
  description: string | null;
  file_name: string;
  file_url: string;
  file_size: string | null;
  pages: number | null;
  tags: string[] | null;
  added_at: string | null;
}

/** 카테고리 */
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

/** Supabase profiles 테이블 행 (회원) */
export interface Member {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

/** 사이트 브랜드 파트 */
export interface BrandPart {
  text: string;
  className: string;
}

/** 네비게이션 / 푸터 링크 */
export interface NavLink {
  label: string;
  path: string;
}

/** Family 사이트 */
export interface FamilySite {
  name: string;
  url: string;
}

/** 회사 정보 */
export interface CompanyInfo {
  name: string;
  ceo: string;
  bizNo: string;
  salesNo: string;
  publishNo: string;
  address: string;
  email: string;
  phone: string;
  kakao: string;
  hours: string;
}

/** 사이트 설정 전체 */
export interface SiteConfig {
  name: string;
  description: string;
  github: string;
  brand: {
    parts: BrandPart[];
  };
  parentSite: FamilySite;
  nav: NavLink[];
  footerLinks: NavLink[];
  familySites: FamilySite[];
  company: CompanyInfo;
}

/** 테마 색상 옵션 */
export interface ThemeColor {
  id: string;
  label: string;
  value: string;
}

/** 토스트 항목 */
export interface Toast {
  id: number;
  message: string;
  type: string;
}

/** 계정 차단 정보 */
export interface AccountBlock {
  status: string;
  reason: string;
  suspended_until: string | null;
}

/** Auth 컨텍스트 값 */
export interface AuthContextValue {
  user: SupabaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  accountBlock: AccountBlock | null;
  clearAccountBlock: () => void;
  signInWithEmail: (email: string, password: string) => Promise<unknown>;
  signInWithGoogle: () => Promise<unknown>;
  signInWithKakao: () => Promise<unknown>;
  signOut: () => Promise<void>;
}

/** Supabase User (최소 필드) */
export interface SupabaseUser {
  id: string;
  email?: string;
  [key: string]: unknown;
}

/** 테마 컨텍스트 값 */
export interface ThemeContextValue {
  mode: string;
  setMode: (mode: string) => void;
  color: string;
  setColor: (color: string) => void;
  resolvedMode: string;
}

/** 토스트 컨텍스트 값 */
export interface ToastContextValue {
  addToast: (message: string, type?: string, duration?: number) => void;
}

/** 문서 생성/수정 페이로드 */
export interface DocumentPayload {
  slug: string;
  category: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  pages: number | null;
  tags: string[];
  addedAt: string;
}

/** 문서 업데이트 (부분) */
export interface DocumentUpdate {
  slug?: string;
  category?: string;
  title?: string;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  pages?: number | null;
  tags?: string[];
  addedAt?: string;
}

/** PDF 업로드 결과 */
export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: string;
}

/** 문서 폼 상태 */
export interface DocumentFormState {
  slug: string;
  category: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  pages: string;
  tags: string;
  addedAt: string;
}
