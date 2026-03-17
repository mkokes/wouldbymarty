export type ThemeKey = keyof typeof themes;
export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  surface: string;
}

export interface Theme {
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const themes: Record<string, Theme> = {
  'modern-artisan': {
    name: 'Modern Artisan',
    colors: {
      light: {
        bgPrimary: '#F8F9FA',
        bgSecondary: '#E9E5D6',
        textPrimary: '#22223B',
        textSecondary: '#4A4E69',
        accent: '#A3B18A',
        accentHover: '#8A9A70',
        border: '#D4D0C8',
        surface: '#FFFFFF',
      },
      dark: {
        bgPrimary: '#22223B',
        bgSecondary: '#4A4E69',
        textPrimary: '#F8F9FA',
        textSecondary: '#E9E5D6',
        accent: '#A3B18A',
        accentHover: '#B8C49A',
        border: '#5A5E79',
        surface: '#32324F',
      },
    },
    fonts: {
      heading: 'Chango, sans-serif',
      body: 'Montserrat, sans-serif',
    },
  },
  'workshop-heritage': {
    name: 'Workshop Heritage',
    colors: {
      light: {
        bgPrimary: '#F5F0E8',
        bgSecondary: '#E8DCC8',
        textPrimary: '#3D2B1F',
        textSecondary: '#4A3728',
        accent: '#2D6A4F',
        accentHover: '#245840',
        border: '#C9BBA8',
        surface: '#FAF6F0',
      },
      dark: {
        bgPrimary: '#3D2B1F',
        bgSecondary: '#4A3728',
        textPrimary: '#F5F0E8',
        textSecondary: '#E9C46A',
        accent: '#4F772D',
        accentHover: '#6B9A3D',
        border: '#5A4738',
        surface: '#4E3B2F',
      },
    },
    fonts: {
      heading: 'Chango, sans-serif',
      body: 'Montserrat, sans-serif',
    },
  },
  'sleek-contemporary': {
    name: 'Sleek Contemporary',
    colors: {
      light: {
        bgPrimary: '#E0E1DD',
        bgSecondary: '#FFFFFF',
        textPrimary: '#1B263B',
        textSecondary: '#415A77',
        accent: '#005F73',
        accentHover: '#004D5C',
        border: '#CAD0D6',
        surface: '#F8F9FA',
      },
      dark: {
        bgPrimary: '#1B263B',
        bgSecondary: '#415A77',
        textPrimary: '#E0E1DD',
        textSecondary: '#8D99AE',
        accent: '#0A9396',
        accentHover: '#0EB1B4',
        border: '#415A77',
        surface: '#264653',
      },
    },
    fonts: {
      heading: 'Chango, sans-serif',
      body: 'Montserrat, sans-serif',
    },
  },
  'monochromatic-minimal': {
    name: 'Monochromatic Minimalism',
    colors: {
      light: {
        bgPrimary: '#FAF9F6',
        bgSecondary: '#F5F5DC',
        textPrimary: '#44352A',
        textSecondary: '#7A6F63',
        accent: '#C19A6B',
        accentHover: '#A88255',
        border: '#D4CFC4',
        surface: '#FFFFFF',
      },
      dark: {
        bgPrimary: '#44352A',
        bgSecondary: '#5C4A3C',
        textPrimary: '#FAF9F6',
        textSecondary: '#B7A99A',
        accent: '#E3BA8D',
        accentHover: '#D4A67A',
        border: '#6E5C4E',
        surface: '#544035',
      },
    },
    fonts: {
      heading: 'Chango, sans-serif',
      body: 'Montserrat, sans-serif',
    },
  },
};

export const defaultTheme = 'modern-artisan';
export const defaultColorScheme: ColorScheme = 'light';
