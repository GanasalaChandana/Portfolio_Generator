'use client';
import Hero from './Hero';
import ProjectCard from './ProjectCard';
import Skills from './Skills';
import Contact from './Contact';
import { PortfolioContent, generateThemeCSS, getTheme } from '@/types/portfolio';
import { useEffect, useState } from 'react';

interface LivePreviewProps {
  content: PortfolioContent;
}

export default function LivePreview({ content }: LivePreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle scroll animations and parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Trigger animations based on scroll position
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = elementTop < window.innerHeight - 100;
        
        if (elementVisible) {
          element.classList.add('animate-in');
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial animation trigger
    setTimeout(() => setIsVisible(true), 100);
    
    // Trigger initial scroll check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Apply theme CSS when content changes with enhanced animations and responsive design
  useEffect(() => {
    const theme = getTheme(content.theme);
    const themeCSS = generateThemeCSS(theme);
    
    // Remove existing theme styles
    const existingStyle = document.getElementById('portfolio-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Add new theme styles with enhancements
    const styleElement = document.createElement('style');
    styleElement.id = 'portfolio-theme-styles';
    styleElement.textContent = `
      ${themeCSS}
      
      /* Enhanced Animation Keyframes */
      @keyframes portfolioSlideUp {
        from {
          opacity: 0;
          transform: translateY(60px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8) rotate(-2deg);
        }
        to {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      @keyframes bounceIn {
        0% {
          opacity: 0;
          transform: scale(0.3) translateY(100px);
        }
        50% {
          opacity: 1;
          transform: scale(1.05) translateY(-10px);
        }
        70% {
          transform: scale(0.95) translateY(5px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      /* Enhanced Base Animation Styles */
      .portfolio-animate-in {
        opacity: 0;
        transform: translateY(30px);
        animation: portfolioSlideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }

      /* Scroll-triggered animations */
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(60px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Enhanced delay classes */
      .portfolio-animate-delay-1 { animation-delay: 0.1s; }
      .portfolio-animate-delay-2 { animation-delay: 0.2s; }
      .portfolio-animate-delay-3 { animation-delay: 0.3s; }
      .portfolio-animate-delay-4 { animation-delay: 0.4s; }
      .portfolio-animate-delay-5 { animation-delay: 0.5s; }
      .portfolio-animate-delay-6 { animation-delay: 0.6s; }
      .portfolio-animate-delay-7 { animation-delay: 0.7s; }
      
      /* Enhanced project card hover effects */
      .project-card-enhanced {
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform-origin: center bottom;
        position: relative;
        overflow: hidden;
      }

      .project-card-enhanced::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
        transition: left 0.5s;
        z-index: 1;
      }

      .project-card-enhanced:hover::before {
        left: 100%;
      }
      
      .project-card-enhanced:hover {
        transform: translateY(-12px) rotateY(3deg) scale(1.02);
        box-shadow: 
          0 25px 50px rgba(0,0,0,0.15),
          0 10px 30px rgba(0,0,0,0.1),
          0 0 0 1px rgba(255,255,255,0.1);
      }

      /* Enhanced responsive project grid */
      .project-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: 1fr;
        max-width: 7xl;
        margin: 0 auto;
        padding: 0 1rem;
      }

      /* Responsive breakpoints */
      @media (min-width: 640px) {
        .project-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          padding: 0 1.5rem;
        }
      }

      @media (min-width: 1024px) {
        .project-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          padding: 0 2rem;
        }
      }

      @media (min-width: 1280px) {
        .project-grid {
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 3rem;
          padding: 0 2rem;
        }
      }

      /* Stagger animation for project cards with enhanced timing */
      .project-grid > *:nth-child(1) { 
        animation-delay: 0.2s; 
        animation-name: scaleIn;
      }
      .project-grid > *:nth-child(2) { 
        animation-delay: 0.4s; 
        animation-name: slideInRight;
      }
      .project-grid > *:nth-child(3) { 
        animation-delay: 0.6s; 
        animation-name: scaleIn;
      }
      .project-grid > *:nth-child(4) { 
        animation-delay: 0.8s; 
        animation-name: slideInLeft;
      }
      .project-grid > *:nth-child(5) { 
        animation-delay: 1.0s; 
        animation-name: scaleIn;
      }
      .project-grid > *:nth-child(6) { 
        animation-delay: 1.2s; 
        animation-name: slideInRight;
      }

      /* Enhanced mobile responsiveness */
      @media (max-width: 639px) {
        .project-grid {
          gap: 1rem;
          padding: 0 0.5rem;
        }
        
        .project-card-enhanced:hover {
          transform: translateY(-8px) scale(1.01);
        }
      }

      /* Tablet specific adjustments */
      @media (min-width: 640px) and (max-width: 1023px) {
        .project-card-enhanced:hover {
          transform: translateY(-10px) rotateY(2deg) scale(1.01);
        }
      }

      /* Desktop enhancements */
      @media (min-width: 1024px) {
        .project-card-enhanced:hover {
          transform: translateY(-15px) rotateY(5deg) scale(1.03);
        }
        
        /* Add floating animation to alternate cards */
        .project-grid > *:nth-child(even) .project-card-enhanced {
          animation-name: float;
          animation-duration: 4s;
          animation-iteration-count: infinite;
          animation-delay: 2s;
        }
      }

      /* Enhanced section spacing and responsive typography */
      .portfolio-section {
        padding: 2rem 1rem;
      }

      @media (min-width: 640px) {
        .portfolio-section {
          padding: 3rem 1.5rem;
        }
      }

      @media (min-width: 1024px) {
        .portfolio-section {
          padding: 4rem 2rem;
        }
      }

      /* Interactive background effect */
      .portfolio-container {
        position: relative;
        min-height: 100vh;
      }

      .portfolio-bg-effect {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: -1;
        opacity: 0.6;
        transition: opacity 0.3s ease;
      }

      .portfolio-container:hover .portfolio-bg-effect {
        opacity: 0.8;
      }

      /* Focus states for accessibility */
      .project-card-enhanced:focus-within {
        outline: 3px solid #3b82f6;
        outline-offset: 4px;
        transform: translateY(-8px);
      }

      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }

      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        .project-card-enhanced:hover {
          transform: translateY(-4px);
        }
        
        .animate-on-scroll {
          opacity: 1;
          transform: none;
        }
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .project-card-enhanced {
          border: 2px solid;
        }
        
        .project-card-enhanced:hover {
          border-width: 3px;
        }
      }

      /* Print styles */
      @media print {
        .project-card-enhanced {
          break-inside: avoid;
          box-shadow: none !important;
          transform: none !important;
        }
        
        .portfolio-animate-in,
        .animate-on-scroll {
          opacity: 1 !important;
          transform: none !important;
        }
      }

      /* Additional responsive utilities */
      .responsive-padding {
        padding: 1rem;
      }

      @media (min-width: 640px) {
        .responsive-padding {
          padding: 1.5rem;
        }
      }

      @media (min-width: 1024px) {
        .responsive-padding {
          padding: 2rem;
        }
      }

      /* Enhanced loading states */
      .portfolio-loading {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
      }

      .portfolio-loaded {
        opacity: 1;
        transform: translateY(0);
      }
    `;
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
    <div className={`portfolio-container ${isVisible ? 'portfolio-loaded' : 'portfolio-loading'}`}>
      {/* Interactive background effect */}
      <div 
        className="portfolio-bg-effect"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
        }}
      />
      
      <div className="space-y-8">
        <div className="portfolio-animate-in portfolio-animate-delay-1 animate-on-scroll">
          <Hero 
            name={content.name} 
            role={content.role} 
            tagline={content.tagline}
          />
        </div>
        
        <section 
          id="projects" 
          className="project-grid animate-on-scroll"
        >
          {content.projects.map((project, i) => (
            <div key={i} className="portfolio-animate-in project-card-enhanced">
              <ProjectCard {...project} />
            </div>
          ))}
        </section>
        
        <div className="portfolio-animate-in portfolio-animate-delay-5 animate-on-scroll portfolio-section">
          <Skills buckets={content.skills} />
        </div>
        
        <div className="portfolio-animate-in portfolio-animate-delay-6 animate-on-scroll portfolio-section">
          <Contact />
        </div>
      </div>
    </div>
  );
}