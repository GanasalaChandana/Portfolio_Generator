'use client';
import { useState, useRef } from 'react';
import { ExternalLink, Github, Star, Calendar } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  summary: string;
  bullets: string[];
  image: string;
  link?: string;
  githubLink?: string;
  stars?: number;
  date?: string;
  technologies?: string[];
  screenshot?: string;
}

export default function ProjectCard({ 
  title, 
  summary, 
  bullets, 
  image, 
  link,
  githubLink,
  stars,
  date,
  technologies = [],
  screenshot
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Truncate summary for better layout
  const maxSummaryLength = 120;
  const truncatedSummary = summary.length > maxSummaryLength && !isExpanded
    ? summary.substring(0, maxSummaryLength) + '...'
    : summary;

  // Enhanced tilt calculations
  const tiltX = isHovered ? -(mousePosition.y / 25) : 0;
  const tiltY = isHovered ? (mousePosition.x / 25) : 0;
  const glowX = mousePosition.x + (cardRef.current?.getBoundingClientRect().width ?? 0) / 2;
  const glowY = mousePosition.y + (cardRef.current?.getBoundingClientRect().height ?? 0) / 2;

  return (
    <div 
      ref={cardRef}
      className="group relative rounded-3xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden cursor-pointer bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl"
      style={{
        transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${isHovered ? '20px' : '0px'}) scale(${isHovered ? '1.03' : '1'})`,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'none' : 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: isHovered 
          ? `
              0 40px 80px -8px rgba(0, 0, 0, 0.15),
              0 24px 48px -8px rgba(0, 0, 0, 0.1),
              0 12px 24px -4px rgba(0, 0, 0, 0.06),
              0 0 0 1px rgba(255, 255, 255, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `
          : `
              0 8px 24px -4px rgba(0, 0, 0, 0.08),
              0 4px 12px -2px rgba(0, 0, 0, 0.05),
              0 0 0 1px rgba(0, 0, 0, 0.03)
            `
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Enhanced gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"
        style={{
          background: `
            radial-gradient(
              circle 400px at ${glowX}px ${glowY}px,
              rgba(99, 102, 241, 0.08) 0%,
              rgba(139, 92, 246, 0.06) 25%,
              rgba(236, 72, 153, 0.04) 50%,
              transparent 70%
            )
          `
        }}
      />

      {/* Project screenshot/thumbnail */}
      {screenshot && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={screenshot} 
            alt={`${title} screenshot`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 p-6" style={{ transform: 'translateZ(20px)' }}>
        {/* Header with icon and meta info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="text-4xl transition-all duration-500 ease-out"
              style={{
                transform: isHovered 
                  ? 'translateY(-4px) translateZ(15px) scale(1.1)' 
                  : 'translateY(0px) translateZ(0px) scale(1)',
                filter: isHovered 
                  ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15)) drop-shadow(0 4px 8px rgba(99, 102, 241, 0.2))' 
                  : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05))',
                textShadow: isHovered ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              {image}
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {date}
                  </span>
                )}
                {stars && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {stars}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {technologies.slice(0, 3).map((tech, i) => (
              <span 
                key={i} 
                className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                +{technologies.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Summary with expand/collapse */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {truncatedSummary}
          </p>
          {summary.length > maxSummaryLength && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm mt-1 transition-colors"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Bullets with better spacing */}
        <ul className="space-y-2.5 mb-6">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5" />
              <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Action buttons */}
        <div className="flex gap-3">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 hover:scale-105 text-sm font-medium"
            >
              Live Demo
              <ExternalLink className="w-3 h-3 ml-1.5" />
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-105 text-sm font-medium"
            >
              <Github className="w-3 h-3 mr-1.5" />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}