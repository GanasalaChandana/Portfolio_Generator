// types/portfolio.ts - Complete type definitions with resume support

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

// Resume configuration
export interface ResumeConfig {
  enabled: boolean;
  filename: string;
  url?: string; // External URL to resume file
  data?: ResumeData; // Inline resume data for PDF generation
  downloadText?: string;
  viewText?: string;
}

// Structured resume data for PDF generation
export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects?: ResumeProject[];
  certifications?: Certification[];
}

export interface WorkExperience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string | 'Present';
  description: string[];
  technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface Contact {
  cta: string;
  note?: string;
  resume?: ResumeConfig;
}

export interface PortfolioContent {
  name: string;
  role: string;
  bio: string;
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

// Resume utilities
export class ResumeGenerator {
  static generatePDF(resumeData: ResumeData, theme: PortfolioTheme): Blob {
    // This would integrate with a PDF generation library like jsPDF
    const content = this.generateResumeHTML(resumeData, theme);
    // Convert HTML to PDF (implementation would depend on chosen library)
    return new Blob([content], { type: 'application/pdf' });
  }

  static generateResumeHTML(resumeData: ResumeData, theme: PortfolioTheme): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Resume - ${resumeData.personalInfo.name}</title>
          <style>
            ${generateThemeCSS(theme)}
            body { font-size: 12px; line-height: 1.4; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .section-title { font-size: 14px; font-weight: bold; border-bottom: 1px solid var(--color-primary); margin-bottom: 8px; }
            .experience-item, .education-item { margin-bottom: 12px; }
            .item-header { font-weight: bold; }
            .item-subheader { color: var(--color-text-secondary); font-size: 11px; }
            .skills-grid { display: flex; flex-wrap: wrap; gap: 15px; }
            .skill-category { flex: 1; min-width: 200px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${resumeData.personalInfo.name}</h1>
            <div>${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone || ''}</div>
            <div>${resumeData.personalInfo.location || ''} | ${resumeData.personalInfo.website || ''}</div>
          </div>
          
          <div class="section">
            <div class="section-title">PROFESSIONAL SUMMARY</div>
            <p>${resumeData.summary}</p>
          </div>
          
          <div class="section">
            <div class="section-title">EXPERIENCE</div>
            ${resumeData.experience.map(exp => `
              <div class="experience-item">
                <div class="item-header">${exp.position} | ${exp.company}</div>
                <div class="item-subheader">${exp.startDate} - ${exp.endDate} | ${exp.location || ''}</div>
                <ul>
                  ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <div class="section-title">EDUCATION</div>
            ${resumeData.education.map(edu => `
              <div class="education-item">
                <div class="item-header">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                <div class="item-subheader">${edu.institution} | ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <div class="section-title">TECHNICAL SKILLS</div>
            <div class="skills-grid">
              ${resumeData.skills.map(skillCat => `
                <div class="skill-category">
                  <strong>${skillCat.category}:</strong> ${skillCat.skills.join(', ')}
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;
  }

  static downloadResume(resumeConfig: ResumeConfig, resumeData?: ResumeData, theme?: PortfolioTheme): void {
    if (resumeConfig.url) {
      // Download from external URL
      const link = document.createElement('a');
      link.href = resumeConfig.url;
      link.download = resumeConfig.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resumeData && theme) {
      // Generate and download PDF
      const pdfBlob = this.generatePDF(resumeData, theme);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resumeConfig.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}

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