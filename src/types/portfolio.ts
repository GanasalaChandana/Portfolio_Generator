// types/portfolio.ts - Complete type definitions

// Core portfolio data types
export interface Project {
  title: string;
  summary: string;
  bullets: string[];
  image: string;
  link?: string;
}

export interface SkillBucket {
  group: string;
  items: string[];
}

export interface Contact {
  cta: string;
}

export interface PortfolioContent {
  name: string;
  role: string;
  bio : string;
  tagline: string;
  projects: Project[];
  skills: SkillBucket[];
  contact: Contact;
  theme: ThemeVariant;
}

// Theme types
export type ThemeVariant = 'classic' | 'bold' | 'mono';

export interface PortfolioTheme {
  variant: ThemeVariant;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
    };
    weights: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Theme configurations
export const PORTFOLIO_THEMES: Record<ThemeVariant, PortfolioTheme> = {
  classic: {
    variant: 'classic',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#ffffff',
      surface: '#f8fafc',
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#64748b'
      }
    },
    typography: {
      fontFamily: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, Consolas, monospace'
      },
      weights: {
        normal: 400,
        medium: 500,
        bold: 600
      }
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem'
    }
  },
  
  bold: {
    variant: 'bold',
    colors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#f59e0b',
      background: '#111827',
      surface: '#1f2937',
      text: {
        primary: '#ffffff',
        secondary: '#d1d5db',
        muted: '#9ca3af'
      }
    },
    typography: {
      fontFamily: {
        primary: 'Poppins, system-ui, sans-serif',
        secondary: 'Poppins, system-ui, sans-serif',
        mono: 'Fira Code, JetBrains Mono, monospace'
      },
      weights: {
        normal: 500,
        medium: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '0.75rem',
      sm: '1.25rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem'
    }
  },
  
  mono: {
    variant: 'mono',
    colors: {
      primary: '#059669',
      secondary: '#065f46',
      accent: '#10b981',
      background: '#0f172a',
      surface: '#1e293b',
      text: {
        primary: '#00ff41',
        secondary: '#4ade80',
        muted: '#22c55e'
      }
    },
    typography: {
      fontFamily: {
        primary: 'JetBrains Mono, Consolas, monospace',
        secondary: 'JetBrains Mono, Consolas, monospace',
        mono: 'JetBrains Mono, Consolas, monospace'
      },
      weights: {
        normal: 400,
        medium: 500,
        bold: 600
      }
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem'
    }
  }
};

// Theme utilities
export function getTheme(variant: ThemeVariant): PortfolioTheme {
  return PORTFOLIO_THEMES[variant] || PORTFOLIO_THEMES.classic;
}

export function getThemeOptions(): Array<{ value: ThemeVariant; label: string; description: string }> {
  return [
    { 
      value: 'classic', 
      label: 'Classic', 
      description: 'Clean and professional with modern blues' 
    },
    { 
      value: 'bold', 
      label: 'Bold', 
      description: 'Dark theme with vibrant reds and high contrast' 
    },
    { 
      value: 'mono', 
      label: 'Mono', 
      description: 'Terminal-inspired with green monospace fonts' 
    }
  ];
}

// CSS custom properties generator
export function generateThemeCSS(theme: PortfolioTheme): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text-primary: ${theme.colors.text.primary};
      --color-text-secondary: ${theme.colors.text.secondary};
      --color-text-muted: ${theme.colors.text.muted};
      
      --font-primary: ${theme.typography.fontFamily.primary};
      --font-secondary: ${theme.typography.fontFamily.secondary};
      --font-mono: ${theme.typography.fontFamily.mono};
      
      --font-weight-normal: ${theme.typography.weights.normal};
      --font-weight-medium: ${theme.typography.weights.medium};
      --font-weight-bold: ${theme.typography.weights.bold};
      
      --spacing-xs: ${theme.spacing.xs};
      --spacing-sm: ${theme.spacing.sm};
      --spacing-md: ${theme.spacing.md};
      --spacing-lg: ${theme.spacing.lg};
      --spacing-xl: ${theme.spacing.xl};
    }
    
    body {
      background-color: var(--color-background);
      color: var(--color-text-primary);
      font-family: var(--font-primary);
    }
    
    .theme-${theme.variant} {
      --primary: ${theme.colors.primary};
      --secondary: ${theme.colors.secondary};
      --accent: ${theme.colors.accent};
    }
  `;
}