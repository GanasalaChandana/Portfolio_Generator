'use client';
import Hero from './Hero';
import ProjectCard from './ProjectCard';
import Skills from './Skills';
import Contact from './Contact';
import { PortfolioContent, generateThemeCSS, getTheme } from '@/types/portfolio';
import { useEffect } from 'react';

interface LivePreviewProps {
  content: PortfolioContent;
}

export default function LivePreview({ content }: LivePreviewProps) {
  // Apply theme CSS when content changes
  useEffect(() => {
    const theme = getTheme(content.theme);
    const themeCSS = generateThemeCSS(theme);
    
    // Remove existing theme styles
    const existingStyle = document.getElementById('portfolio-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add new theme styles
    const styleElement = document.createElement('style');
    styleElement.id = 'portfolio-theme-styles';
    styleElement.textContent = themeCSS;
    document.head.appendChild(styleElement);
    
    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.variant}`);
    
    return () => {
      // Cleanup on unmount
      const style = document.getElementById('portfolio-theme-styles');
      if (style) style.remove();
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
    };
  }, [content.theme]);

  return (
    <div className="space-y-8">
      <Hero 
        name={content.name} 
        role={content.role} 
        tagline={content.tagline}
      />
      
      <section id="projects" className="grid md:grid-cols-3 gap-4">
        {content.projects.map((project, i) => (
          <ProjectCard key={i} {...project} />
        ))}
      </section>
      
      <Skills buckets={content.skills} />
      <Contact />
    </div>
  );
}