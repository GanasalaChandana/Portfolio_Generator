import React, { useState } from 'react';
import { Download, FileText, Mail, Send, Save, User, Eye, Wand2, Copy, Check, Star, Github, ExternalLink, Plus, Trash2, Edit3, Sparkles, Clock, Award, Globe, Phone, MapPin, Linkedin, GraduationCap, Palette, Monitor, Heart, DollarSign, Wrench, Briefcase, Layout, Zap, MessageSquare, FileDown, Printer, Share2 } from 'lucide-react';

// Template definitions
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'layout' | 'industry';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  features: string[];
  atsOptimized: boolean;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
}

interface Skill {
  name: string;
  level: number;
}

interface SkillGroup {
  category: string;
  skills: Skill[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

interface ContactForm {
  enabled: boolean;
  title: string;
  description: string;
  fields: {
    name: boolean;
    email: boolean;
    company: boolean;
    message: boolean;
  };
}

interface PortfolioData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  experience: Experience[];
  skills: SkillGroup[];
  education: Education[];
  projects: Project[];
  contactForm: ContactForm;
}

const TEMPLATES: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design with bold typography and subtle gradients',
    category: 'layout',
    preview: 'Modern layout with sidebar and clean typography',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    features: ['Gradient headers', 'Icon integration', 'Card layouts', 'Responsive design'],
    atsOptimized: true
  },
  {
    id: 'traditional',
    name: 'Traditional Classic',
    description: 'Timeless, professional format perfect for conservative industries',
    category: 'layout',
    preview: 'Classic single-column layout with traditional formatting',
    colors: {
      primary: '#374151',
      secondary: '#4B5563',
      accent: '#6B7280',
      background: '#FFFFFF',
      text: '#111827'
    },
    features: ['Clean typography', 'Formal structure', 'Black and white', 'ATS-friendly'],
    atsOptimized: true
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'Bold, artistic design with creative elements and vibrant colors',
    category: 'layout',
    preview: 'Creative layout with artistic elements and color blocks',
    colors: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      background: '#FAFAFA',
      text: '#1F2937'
    },
    features: ['Colorful design', 'Creative blocks', 'Visual hierarchy', 'Portfolio focus'],
    atsOptimized: false
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Ultra-clean design focusing on content with minimal distractions',
    category: 'layout',
    preview: 'Minimal layout with lots of white space',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      background: '#FFFFFF',
      text: '#000000'
    },
    features: ['Lots of whitespace', 'Typography focus', 'Clean lines', 'Minimal colors'],
    atsOptimized: true
  },
  {
    id: 'tech-focused',
    name: 'Tech Professional',
    description: 'Technology-focused design with code-inspired elements',
    category: 'layout',
    preview: 'Tech layout with code elements and dark theme options',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      background: '#F9FAFB',
      text: '#111827'
    },
    features: ['Code elements', 'Tech icons', 'GitHub integration', 'Skills emphasis'],
    atsOptimized: true
  }
];

const EnhancedResumeGenerator: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
    experience: [],
    skills: [],
    education: [],
    projects: [],
    contactForm: {
      enabled: false,
      title: 'Get In Touch',
      description: 'Feel free to reach out for collaborations or just a friendly chat!',
      fields: {
        name: true,
        email: true,
        company: false,
        message: true
      }
    }
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'layout' | 'industry'>('all');
  const [atsOnly, setAtsOnly] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [aiHelperType, setAIHelperType] = useState<'bullets' | 'keywords' | 'metrics' | 'skills'>('bullets');
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  const filteredTemplates = TEMPLATES.filter(template => {
    if (atsOnly && !template.atsOptimized) return false;
    if (filterCategory === 'all') return true;
    return template.category === filterCategory;
  });

  // Standard input classes with fixed dark mode colors
  const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-300";
  const textareaClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-300";
  const selectClasses = "px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500";

  // AI Helper functions
  const generateAIContent = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let output = '';
      
      switch (aiHelperType) {
        case 'bullets':
          const bulletExamples = [
            `• Developed and implemented ${aiInput || 'solution'} resulting in improved efficiency and user satisfaction`,
            `• Led cross-functional team to successfully deliver ${aiInput || 'project'} ahead of schedule and under budget`,
            `• Optimized ${aiInput || 'processes'} which resulted in 30% reduction in operational costs`,
            `• Collaborated with stakeholders to define requirements and deliver high-quality ${aiInput || 'deliverables'}`,
            `• Mentored junior team members and established best practices for ${aiInput || 'development'}`
          ];
          output = bulletExamples.join('\n');
          break;
          
        case 'keywords':
          const keywords = extractKeywords(aiInput);
          output = `**Key Skills to Highlight:**\n${keywords.skills.join(', ')}\n\n**Action Verbs to Use:**\n${keywords.actions.join(', ')}\n\n**Important Qualifications:**\n${keywords.qualifications.join(', ')}`;
          break;
          
        case 'metrics':
          output = `Consider adding these quantifiable metrics to "${aiInput}":\n\n• Include percentage improvements (e.g., "increased by 25%")\n• Add team size if you managed people (e.g., "led team of 5")\n• Mention budget amounts (e.g., "managed $500K budget")\n• Include time saved (e.g., "reduced processing time by 10 hours/week")\n• Add customer/user numbers (e.g., "served 10,000+ users")\n• Specify project scope (e.g., "delivered 15 features across 3 products")`;
          break;
          
        case 'skills':
          const roleSkills = suggestSkillsForRole(aiInput);
          output = `**Technical Skills:**\n${roleSkills.technical.join(', ')}\n\n**Soft Skills:**\n${roleSkills.soft.join(', ')}\n\n**Tools & Platforms:**\n${roleSkills.tools.join(', ')}`;
          break;
      }
      
      setAiOutput(output);
      setIsGenerating(false);
    }, 1500);
  };
  
  const extractKeywords = (jobDescription: string) => {
    const text = jobDescription.toLowerCase();
    
    const skillKeywords = ['react', 'javascript', 'python', 'java', 'aws', 'docker', 'kubernetes', 'sql', 'agile', 'scrum', 'leadership', 'communication', 'problem-solving', 'teamwork', 'project management'];
    const actionVerbs = ['developed', 'implemented', 'led', 'managed', 'created', 'designed', 'optimized', 'improved', 'delivered', 'achieved'];
    const qualifications = ['bachelor', 'master', 'years experience', 'certification', 'degree'];
    
    return {
      skills: skillKeywords.filter(skill => text.includes(skill)),
      actions: actionVerbs.slice(0, 10),
      qualifications: qualifications.filter(qual => text.includes(qual))
    };
  };
  
  const suggestSkillsForRole = (role: string) => {
    const roleText = role.toLowerCase();
    
    let technical = ['Git', 'CI/CD', 'Agile', 'REST APIs'];
    let soft = ['Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Time Management'];
    let tools = ['Jira', 'Slack', 'VS Code'];
    
    if (roleText.includes('developer') || roleText.includes('engineer')) {
      technical = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs', 'Docker'];
      tools = ['VS Code', 'GitHub', 'Jira', 'Postman', 'AWS', 'Jenkins'];
    } else if (roleText.includes('designer')) {
      technical = ['Figma', 'Adobe XD', 'Sketch', 'UI/UX Design', 'Prototyping', 'Wireframing'];
      tools = ['Figma', 'Adobe Creative Suite', 'InVision', 'Miro', 'Zeplin'];
    } else if (roleText.includes('manager') || roleText.includes('lead')) {
      technical = ['Project Management', 'Budget Planning', 'Strategic Planning', 'KPI Tracking'];
      soft = ['Leadership', 'Communication', 'Decision Making', 'Conflict Resolution', 'Mentoring'];
      tools = ['Jira', 'Asana', 'Microsoft Project', 'Slack', 'Tableau'];
    } else if (roleText.includes('data')) {
      technical = ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'];
      tools = ['Jupyter', 'Tableau', 'Power BI', 'Excel', 'TensorFlow', 'pandas'];
    }
    
    return { technical, soft, tools };
  };

  // Form handlers
  const updatePersonalInfo = (field: string, value: string) => {
    setPortfolioData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setPortfolioData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ['']
      }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string | string[]) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addSkillGroup = () => {
    setPortfolioData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: '', skills: [] }]
    }));
  };

  const updateSkillGroup = (index: number, field: 'category' | 'skills', value: string | Skill[]) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addSkillToGroup = (groupIndex: number) => {
    const newSkill: Skill = { name: '', level: 3 };
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((skillGroup, i) => 
        i === groupIndex 
          ? { ...skillGroup, skills: [...skillGroup.skills, newSkill] }
          : skillGroup
      )
    }));
  };

  const updateSkillInGroup = (groupIndex: number, skillIndex: number, field: 'name' | 'level', value: string | number) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((skillGroup, i) => 
        i === groupIndex 
          ? {
              ...skillGroup,
              skills: skillGroup.skills.map((skill, j) => 
                j === skillIndex ? { ...skill, [field]: value } : skill
              )
            }
          : skillGroup
      )
    }));
  };

  const removeSkillFromGroup = (groupIndex: number, skillIndex: number) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.map((skillGroup, i) => 
        i === groupIndex 
          ? { ...skillGroup, skills: skillGroup.skills.filter((_, j) => j !== skillIndex) }
          : skillGroup
      )
    }));
  };

  const removeSkillGroup = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        url: '',
        github: ''
      }]
    }));
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setPortfolioData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        year: '',
        gpa: ''
      }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateContactForm = (field: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      contactForm: { ...prev.contactForm, [field]: value }
    }));
  };

  const updateContactFormField = (fieldName: string, value: boolean) => {
    setPortfolioData(prev => ({
      ...prev,
      contactForm: {
        ...prev.contactForm,
        fields: { ...prev.contactForm.fields, [fieldName]: value }
      }
    }));
  };

  // Download functions
  const downloadAsHTML = () => {
    const element = document.createElement('a');
    const htmlContent = generateHTMLPortfolio();
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${portfolioData.name || 'portfolio'}-portfolio.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsJSON = () => {
    const element = document.createElement('a');
    const jsonContent = JSON.stringify(portfolioData, null, 2);
    const file = new Blob([jsonContent], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${portfolioData.name || 'portfolio'}-data.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsPDF = () => {
    window.print();
  };

  const downloadAsMarkdown = () => {
    const element = document.createElement('a');
    const markdownContent = generateMarkdownPortfolio();
    const file = new Blob([markdownContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${portfolioData.name || 'portfolio'}-README.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sharePortfolio = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${portfolioData.name}'s Portfolio`,
          text: `Check out ${portfolioData.name}'s professional portfolio`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Portfolio link copied to clipboard!');
      } catch (err) {
        console.log('Clipboard access failed');
      }
    }
  };

  const copyToClipboard = () => {
    const htmlContent = generateHTMLPortfolio();
    navigator.clipboard.writeText(htmlContent).then(() => {
      alert('HTML code copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const generateHTMLPortfolio = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.name || 'Portfolio'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        @media print {
            .no-print { display: none !important; }
        }
        .skill-bar {
            transition: width 0.5s ease;
        }
        .gradient-bg {
            background: linear-gradient(135deg, ${currentTemplate.colors.primary}, ${currentTemplate.colors.accent});
        }
    </style>
</head>
<body class="bg-gray-50">
    ${generateCurrentTemplateHTML()}
    
    <script>
        lucide.createIcons();
        
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contact-form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert('Thank you for your message! This is a demo form.');
                });
            }
        });
    </script>
</body>
</html>`;
  };

  const generateMarkdownPortfolio = () => {
    let markdown = `# ${portfolioData.name || 'Your Name'}\n\n`;
    markdown += `**${portfolioData.role || 'Your Role'}**\n\n`;
    
    if (portfolioData.email || portfolioData.phone || portfolioData.location) {
      markdown += `## Contact Information\n\n`;
      if (portfolioData.email) markdown += `📧 ${portfolioData.email}\n`;
      if (portfolioData.phone) markdown += `📱 ${portfolioData.phone}\n`;
      if (portfolioData.location) markdown += `📍 ${portfolioData.location}\n`;
      if (portfolioData.website) markdown += `🌐 [Website](${portfolioData.website})\n`;
      if (portfolioData.linkedin) markdown += `💼 [LinkedIn](${portfolioData.linkedin})\n`;
      if (portfolioData.github) markdown += `💻 [GitHub](${portfolioData.github})\n`;
      markdown += `\n`;
    }
    
    if (portfolioData.summary) {
      markdown += `## About Me\n\n${portfolioData.summary}\n\n`;
    }
    
    if (portfolioData.skills.length > 0) {
      markdown += `## Skills\n\n`;
      portfolioData.skills.forEach(skillGroup => {
        markdown += `### ${skillGroup.category}\n\n`;
        skillGroup.skills.forEach(skill => {
          const stars = '⭐'.repeat(skill.level);
          markdown += `- **${skill.name}**: ${stars}\n`;
        });
        markdown += `\n`;
      });
    }
    
    if (portfolioData.experience.length > 0) {
      markdown += `## Experience\n\n`;
      portfolioData.experience.forEach(exp => {
        markdown += `### ${exp.position} at ${exp.company}\n`;
        markdown += `*${exp.startDate} - ${exp.endDate}*\n\n`;
        exp.description.forEach(desc => {
          markdown += `- ${desc}\n`;
        });
        markdown += `\n`;
      });
    }
    
    if (portfolioData.projects.length > 0) {
      markdown += `## Projects\n\n`;
      portfolioData.projects.forEach(project => {
        markdown += `### ${project.name}\n\n`;
        markdown += `${project.description}\n\n`;
        if (project.technologies.length > 0) {
          markdown += `**Technologies:** ${project.technologies.join(', ')}\n\n`;
        }
        if (project.url) markdown += `🔗 [Live Demo](${project.url})\n`;
        if (project.github) markdown += `📁 [Source Code](${project.github})\n`;
        markdown += `\n`;
      });
    }
    
    if (portfolioData.education.length > 0) {
      markdown += `## Education\n\n`;
      portfolioData.education.forEach(edu => {
        markdown += `### ${edu.degree}\n`;
        markdown += `**${edu.institution}** - ${edu.year}`;
        if (edu.gpa) markdown += ` (GPA: ${edu.gpa})`;
        markdown += `\n\n`;
      });
    }
    
    return markdown;
  };

  const generateCurrentTemplateHTML = () => {
    return `<div class="p-8 max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4" style="color: ${currentTemplate.colors.primary}">${portfolioData.name || 'Your Name'}</h1>
      <p class="text-xl mb-6 text-gray-600">${portfolioData.role || 'Your Role'}</p>
      ${portfolioData.summary ? `<p class="mb-8 text-gray-700">${portfolioData.summary}</p>` : ''}
    </div>`;
  };

  const SkillRatingStars = ({ level, onLevelChange }: { level: number, onLevelChange: (level: number) => void }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((starLevel) => (
        <button
          key={starLevel}
          onClick={() => onLevelChange(starLevel)}
          className={`w-5 h-5 rounded transition-colors ${
            level >= starLevel
              ? 'text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          <Star className="w-full h-full" fill={level >= starLevel ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );

 const AIHelperModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistant</h2>
          </div>
          <button
            onClick={() => setShowAIHelper(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-2xl dark:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'bullets', label: 'Generate Bullet Points', icon: Edit3 },
            { id: 'keywords', label: 'Analyze Job Description', icon: FileText },
            { id: 'metrics', label: 'Add Metrics', icon: Award },
            { id: 'skills', label: 'Suggest Skills', icon: Sparkles }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setAIHelperType(id as any);
                setAiInput('');
                setAiOutput('');
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                aiHelperType === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto flex-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {aiHelperType === 'bullets' && 'Describe your project or task:'}
            {aiHelperType === 'keywords' && 'Paste the job description:'}
            {aiHelperType === 'metrics' && 'Describe your achievement:'}
            {aiHelperType === 'skills' && 'Enter your job title or role:'}
          </label>
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            rows={aiHelperType === 'keywords' ? 8 : 4}
            className={textareaClasses}
            placeholder={
              aiHelperType === 'bullets' ? 'E.g., Built a web application for tracking inventory' :
              aiHelperType === 'keywords' ? 'Paste the full job description here...' :
              aiHelperType === 'metrics' ? 'E.g., Led project to improve customer satisfaction' :
              'E.g., Full Stack Developer, Product Manager, Data Scientist'
            }
          />
        </div>
        
        <button
          onClick={generateAIContent}
          disabled={!aiInput.trim() || isGenerating}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
            !aiInput.trim() || isGenerating
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate with AI</span>
            </>
          )}
        </button>
        
        {aiOutput && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Generated Content:</label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiOutput);
                  alert('Copied to clipboard!');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">
              {aiOutput}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Tip: Review and customize this content to match your experience
            </p>
          </div>
        )}
      </div>

      {/* NEW: Footer with Back button */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <button
          onClick={() => setShowAIHelper(false)}
          className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          Back to Editor
        </button>
      </div>
    </div>
  </div>
);

  const ContactFormPreview = () => (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{portfolioData.contactForm.title}</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{portfolioData.contactForm.description}</p>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {portfolioData.contactForm.fields.name && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <input type="text" className={inputClasses} placeholder="Your name" />
            </div>
          )}
          {portfolioData.contactForm.fields.email && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input type="email" className={inputClasses} placeholder="your@email.com" />
            </div>
          )}
        </div>
        
        {portfolioData.contactForm.fields.company && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
            <input type="text" className={inputClasses} placeholder="Your company" />
          </div>
        )}
        
        {portfolioData.contactForm.fields.message && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
            <textarea rows={4} className={textareaClasses} placeholder="Your message..."></textarea>
          </div>
        )}
        
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          style={{ backgroundColor: currentTemplate.colors.primary }}
        >
          Send Message
        </button>
      </form>
    </div>
  );

  const TemplateSelector = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Template</h2>
            <button
              onClick={() => setShowTemplateSelector(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-2xl dark:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className={selectClasses}
              >
                <option value="all">All Templates</option>
                <option value="layout">Layout-Based</option>
                <option value="industry">Industry-Specific</option>
              </select>
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={atsOnly}
                onChange={(e) => setAtsOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">ATS-Optimized Only</span>
            </label>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`relative border rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } dark:bg-gray-750`}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setShowTemplateSelector(false);
                }}
              >
                <div 
                  className="h-24 rounded-lg mb-4 flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: template.colors.primary }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      {template.id === 'modern' ? <Zap className="w-6 h-6" /> :
                       template.id === 'traditional' ? <FileText className="w-6 h-6" /> :
                       template.id === 'creative' ? <Palette className="w-6 h-6" /> :
                       template.id === 'minimal' ? <Layout className="w-6 h-6" /> :
                       template.id === 'tech-focused' ? <Monitor className="w-6 h-6" /> :
                       <FileText className="w-6 h-6" />}
                    </div>
                    <div className="text-xs">Preview</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{template.name}</h3>
                    {template.atsOptimized && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 text-xs rounded-full">
                        ATS
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400">{template.description}</p>
                  
                  {selectedTemplate === template.id && (
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <Check className="w-3 h-3 mr-1" />
                      <span className="text-xs">Selected</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const LivePreview = () => (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div 
        className="h-full overflow-y-auto"
        style={{ 
          backgroundColor: currentTemplate.colors.background,
          color: currentTemplate.colors.text 
        }}
      >
        {!portfolioData.name && !portfolioData.role ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Live Preview</h3>
              <p>Start filling out your information to see the preview</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div 
              className="text-center mb-8 p-6 rounded-xl"
              style={{ 
                background: `linear-gradient(135deg, ${currentTemplate.colors.primary}, ${currentTemplate.colors.accent})`,
                color: 'white'
              }}
            >
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                {portfolioData.name ? portfolioData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h1 className="text-3xl font-bold mb-2">{portfolioData.name || 'Your Name'}</h1>
              <p className="text-xl opacity-90 mb-4">{portfolioData.role || 'Your Job Title'}</p>
              <div className="flex justify-center space-x-6 text-sm opacity-80 flex-wrap">
                {portfolioData.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {portfolioData.email}
                  </div>
                )}
                {portfolioData.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {portfolioData.location}
                  </div>
                )}
                {portfolioData.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {portfolioData.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {portfolioData.summary && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold mb-3 dark:text-white" style={{ color: currentTemplate.colors.primary }}>
                    About Me
                  </h2>
                  <p className="leading-relaxed dark:text-gray-300">{portfolioData.summary}</p>
                </div>
              )}

              {portfolioData.skills.length > 0 && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white" style={{ color: currentTemplate.colors.primary }}>
                    Skills
                  </h2>
                  <div className="space-y-6">
                    {portfolioData.skills.map((skillGroup, index) => (
                      <div key={index}>
                        <h3 className="font-semibold mb-3 dark:text-white">{skillGroup.category}</h3>
                        <div className="space-y-3">
                          {skillGroup.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center justify-between">
                              <span className="font-medium dark:text-gray-200">{skill.name}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                                  <div 
                                    className="h-full rounded-full transition-all"
                                    style={{ 
                                      width: `${(skill.level / 5) * 100}%`,
                                      backgroundColor: currentTemplate.colors.primary 
                                    }}
                                  />
                                </div>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <Star 
                                      key={level} 
                                      className={`w-3 h-3 ${skill.level >= level ? 'text-yellow-400' : 'text-gray-300'}`}
                                      fill={skill.level >= level ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {portfolioData.projects.length > 0 && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white" style={{ color: currentTemplate.colors.primary }}>
                    Featured Projects
                  </h2>
                  <div className="grid gap-4">
                    {portfolioData.projects.map((project, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold dark:text-white">{project.name}</h3>
                          <div className="flex space-x-2">
                            {project.url && <ExternalLink className="w-4 h-4 cursor-pointer" style={{ color: currentTemplate.colors.primary }} />}
                            {project.github && <Github className="w-4 h-4 cursor-pointer" style={{ color: currentTemplate.colors.secondary }} />}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 dark:text-gray-200 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {portfolioData.experience.length > 0 && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white" style={{ color: currentTemplate.colors.primary }}>
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {portfolioData.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 pl-4" style={{ borderColor: currentTemplate.colors.primary }}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold dark:text-white">{exp.position}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {exp.description.map((desc, descIndex) => (
                            <li key={descIndex}>• {desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {portfolioData.education.length > 0 && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white" style={{ color: currentTemplate.colors.primary }}>
                    Education
                  </h2>
                  <div className="space-y-4">
                    {portfolioData.education.map((edu, index) => (
                      <div key={index} className="border-l-4 pl-4" style={{ borderColor: currentTemplate.colors.accent }}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold dark:text-white">{edu.degree}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                            <div>{edu.year}</div>
                            {edu.gpa && <div>GPA: {edu.gpa}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {portfolioData.contactForm.enabled && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white" style={{ color: currentTemplate.colors.primary }}>
                    {portfolioData.contactForm.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{portfolioData.contactForm.description}</p>
                  <ContactFormPreview />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Resume Generator</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create professional Resumes with AI-powered templates</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
              >
                <FileDown className="w-4 h-4" />
                <span>Download</span>
                <div className={`transform transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`}>▼</div>
              </button>
              
              {showDownloadMenu && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 min-w-48">
                  <button
                    onClick={() => { downloadAsHTML(); setShowDownloadMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 dark:text-white"
                  >
                    <FileDown className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">HTML File</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Complete webpage</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => { downloadAsMarkdown(); setShowDownloadMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 dark:text-white"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="font-medium">Markdown</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">README format</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => { downloadAsJSON(); setShowDownloadMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 dark:text-white"
                  >
                    <Save className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium">JSON Data</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Backup your data</div>
                    </div>
                  </button>
                  
                  <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>
                  
                  <button
                    onClick={() => { downloadAsPDF(); setShowDownloadMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 dark:text-white"
                  >
                    <Printer className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium">Print/PDF</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Browser print dialog</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => { copyToClipboard(); setShowDownloadMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 dark:text-white"
                  >
                    <Copy className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="font-medium">Copy HTML</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Copy to clipboard</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={sharePortfolio}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm whitespace-nowrap"
              title="Share Portfolio"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
            >
              <Palette className="w-4 h-4" />
              <span>Templates</span>
            </button>
            
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              <span>{showLivePreview ? 'Hide' : 'Show'} Preview</span>
            </button>
            
            <button
              onClick={() => setShowAIHelper(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors text-sm whitespace-nowrap"
            >
              <Wand2 className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className={`${showLivePreview ? 'w-1/2' : 'w-full'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-all duration-300`}>
          <div className="p-6">
            <div className="flex flex-wrap space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-x-auto">
              {[
                { id: 'personal', label: 'Personal', icon: User },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'skills', label: 'Skills', icon: Wrench },
                { id: 'projects', label: 'Projects', icon: Github },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'contact', label: 'Contact', icon: MessageSquare }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === id
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={portfolioData.name}
                        onChange={(e) => updatePersonalInfo('name', e.target.value)}
                        className={inputClasses}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title/Role</label>
                      <input
                        type="text"
                        value={portfolioData.role}
                        onChange={(e) => updatePersonalInfo('role', e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., Full Stack Developer"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={portfolioData.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          className={inputClasses}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={portfolioData.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          className={inputClasses}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <input
                        type="text"
                        value={portfolioData.location}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className={inputClasses}
                        placeholder="City, State/Country"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website (Optional)</label>
                        <input
                          type="url"
                          value={portfolioData.website || ''}
                          onChange={(e) => updatePersonalInfo('website', e.target.value)}
                          className={inputClasses}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn (Optional)</label>
                        <input
                          type="url"
                          value={portfolioData.linkedin || ''}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          className={inputClasses}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub (Optional)</label>
                        <input
                          type="url"
                          value={portfolioData.github || ''}
                          onChange={(e) => updatePersonalInfo('github', e.target.value)}
                          className={inputClasses}
                          placeholder="https://github.com/yourusername"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professional Summary</label>
                      <textarea
                        value={portfolioData.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        rows={4}
                        className={textareaClasses}
                        placeholder="Write a brief summary about yourself, your experience, and your goals..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h2>
                  <button
                    onClick={addExperience}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>
                
                {portfolioData.experience.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No work experience added yet</p>
                    <p className="text-sm">Click "Add Experience" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {portfolioData.experience.map((exp, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-750 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white">Experience #{index + 1}</h3>
                          <button
                            onClick={() => removeExperience(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                className={inputClasses}
                                placeholder="Job title"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                className={inputClasses}
                                placeholder="Company name"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                className={inputClasses}
                                placeholder="Jan 2023"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                className={inputClasses}
                                placeholder="Present"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
                            <textarea
                              value={exp.description.join('\n')}
                              onChange={(e) => updateExperience(index, 'description', e.target.value.split('\n').filter(line => line.trim()))}
                              rows={4}
                              className={textareaClasses}
                              placeholder="• Achieved X by doing Y&#10;• Managed team of Z people&#10;• Improved processes resulting in..."
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Each line will become a bullet point</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Technologies</h2>
                  <button
                    onClick={addSkillGroup}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill Group</span>
                  </button>
                </div>
                
                {portfolioData.skills.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No skills added yet</p>
                    <p className="text-sm">Click "Add Skill Group" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {portfolioData.skills.map((skillGroup, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-750 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white">Skill Group #{index + 1}</h3>
                          <button
                            onClick={() => removeSkillGroup(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <input
                              type="text"
                              value={skillGroup.category}
                              onChange={(e) => updateSkillGroup(index, 'category', e.target.value)}
                              className={inputClasses}
                              placeholder="e.g., Programming Languages, Frameworks, Tools"
                            />
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                              <button
                                onClick={() => addSkillToGroup(index)}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Skill</span>
                              </button>
                            </div>
                            
                            {skillGroup.skills.length === 0 ? (
                              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                                No skills added yet. Click "Add Skill" to start.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                {skillGroup.skills.map((skill, skillIndex) => (
                                  <div key={skillIndex} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <input
                                      type="text"
                                      value={skill.name}
                                      onChange={(e) => updateSkillInGroup(index, skillIndex, 'name', e.target.value)}
                                      placeholder="Skill name"
                                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-300"
                                    />
                                    
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600 dark:text-gray-300">Level:</span>
                                      <SkillRatingStars 
                                        level={skill.level}
                                        onLevelChange={(level) => updateSkillInGroup(index, skillIndex, 'level', level)}
                                      />
                                    </div>
                                    
                                    <button
                                      onClick={() => removeSkillFromGroup(index, skillIndex)}
                                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h2>
                  <button
                    onClick={addProject}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
                
                {portfolioData.projects.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects added yet</p>
                    <p className="text-sm">Click "Add Project" to showcase your work</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {portfolioData.projects.map((project, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-750 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white">Project #{index + 1}</h3>
                          <button
                            onClick={() => removeProject(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => updateProject(index, 'name', e.target.value)}
                              className={inputClasses}
                              placeholder="My Awesome Project"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                              value={project.description}
                              onChange={(e) => updateProject(index, 'description', e.target.value)}
                              rows={3}
                              className={textareaClasses}
                              placeholder="Brief description of what this project does and your role in it..."
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies Used</label>
                            <input
                              type="text"
                              value={project.technologies.join(', ')}
                              onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                              className={inputClasses}
                              placeholder="React, Node.js, MongoDB, AWS"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate technologies with commas</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live URL (Optional)</label>
                              <input
                                type="url"
                                value={project.url || ''}
                                onChange={(e) => updateProject(index, 'url', e.target.value)}
                                className={inputClasses}
                                placeholder="https://myproject.com"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL (Optional)</label>
                              <input
                                type="url"
                                value={project.github || ''}
                                onChange={(e) => updateProject(index, 'github', e.target.value)}
                                className={inputClasses}
                                placeholder="https://github.com/user/repo"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
                  <button
                    onClick={addEducation}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>
                
                {portfolioData.education.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No education added yet</p>
                    <p className="text-sm">Click "Add Education" to include your academic background</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {portfolioData.education.map((edu, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-750 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white">Education #{index + 1}</h3>
                          <button
                            onClick={() => removeEducation(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              className={inputClasses}
                              placeholder="Bachelor of Science in Computer Science"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              className={inputClasses}
                              placeholder="University Name"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                              <input
                                type="text"
                                value={edu.year}
                                onChange={(e) => updateEducation(index, 'year', e.target.value)}
                                className={inputClasses}
                                placeholder="2024"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GPA (Optional)</label>
                              <input
                                type="text"
                                value={edu.gpa || ''}
                                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                className={inputClasses}
                                placeholder="3.8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Form Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="enableContactForm"
                        checked={portfolioData.contactForm.enabled}
                        onChange={(e) => updateContactForm('enabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="enableContactForm" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Contact Form
                      </label>
                    </div>
                    
                    {portfolioData.contactForm.enabled && (
                      <div className="space-y-4 ml-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Form Title</label>
                          <input
                            type="text"
                            value={portfolioData.contactForm.title}
                            onChange={(e) => updateContactForm('title', e.target.value)}
                            className={inputClasses}
                            placeholder="Get In Touch"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Form Description</label>
                          <textarea
                            value={portfolioData.contactForm.description}
                            onChange={(e) => updateContactForm('description', e.target.value)}
                            rows={2}
                            className={textareaClasses}
                            placeholder="Feel free to reach out..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Form Fields</label>
                          <div className="space-y-2">
                            {Object.entries(portfolioData.contactForm.fields).map(([fieldName, enabled]) => (
                              <div key={fieldName} className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  id={`field-${fieldName}`}
                                  checked={enabled}
                                  onChange={(e) => updateContactFormField(fieldName, e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`field-${fieldName}`} className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                  {fieldName}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                          <ContactFormPreview />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showLivePreview && (
          <div className="w-1/2 bg-gray-100 dark:bg-gray-900 p-4">
            <LivePreview />
          </div>
        )}
      </div>

      {showTemplateSelector && <TemplateSelector />}
      {showAIHelper && <AIHelperModal />}
    </div>
  );
};

export default EnhancedResumeGenerator;