export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  darkMode: boolean;
  layout: string;
  headerHeight: number;
  sidebarWidth: number;
  contentPadding: number;
  cardShadow: string;
  buttonStyle: string;
  navigationStyle: string;
  logoPosition: string;
  animations: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  customCSS: string;
  favicon: string;
  logoUrl: string;
}
export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isFavorite: boolean;
  isDefault: boolean;
  createdAt: string;
  theme: ThemeConfig;
}
