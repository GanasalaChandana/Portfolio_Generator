'use client';
import { User, Github, Linkedin, Mail } from 'lucide-react';

interface HeroProps {
  name: string;
  role: string;
  tagline?: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export default function Hero({ 
  name, 
  role, 
  tagline, 
  bio, 
  profileImage,
  socialLinks 
}: HeroProps) {
  const displayText = bio || tagline || '';
  
  return (
    // Updated: Better mobile padding and responsive layout
    <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 overflow-visible">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 dark:from-indigo-400/10 dark:via-purple-400/5 dark:to-pink-400/10" />
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:from-transparent dark:via-white/2 dark:to-white/5" />
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/20 dark:border-white/10" />
      
      {/* Animated background orbs - responsive sizing */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl sm:blur-2xl animate-pulse" />
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-xl sm:blur-2xl animate-pulse delay-1000" />
      
      <div className="relative z-10">
        {/* Updated: Better mobile layout - center on mobile, row on desktop */}
        <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-start md:gap-8 gap-4">
          {/* Profile Image Section */}
          <div className="flex-shrink-0 mb-4 sm:mb-6 md:mb-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition duration-300" />
              {/* Updated: Responsive profile image sizing */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border-2 border-white dark:border-gray-800">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-grow w-full">
            {/* Name with responsive sizing */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              {name}
            </h1>
            
            {/* Role with responsive text sizing */}
            <p className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl text-indigo-600 dark:text-indigo-400 font-medium">
              {role}
            </p>
            
            {/* Bio with responsive text and max-width */}
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 max-w-full sm:max-w-2xl md:max-w-3xl font-light tracking-wide">
              {displayText}
            </p>

            {/* Social Links - responsive layout */}
            {socialLinks && (
              <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4 justify-center sm:justify-start">
                {socialLinks.github && (
                  <a 
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a 
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
                {socialLinks.email && (
                  <a 
                    href={`mailto:${socialLinks.email}`}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
              </div>
            )}
            
            {/* Enhanced buttons with mobile-first responsive design */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Primary button - full width on mobile */}
              <a 
                href="#projects" 
                className="group relative w-full sm:w-auto px-6 py-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:from-indigo-600 group-hover:to-purple-700 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300" />
                <span className="relative font-medium text-white text-center block">View Projects</span>
              </a>
              
              {/* Secondary button - full width on mobile */}
              <a 
                href="#contact" 
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 hover:scale-105 active:scale-95 hover:border-indigo-400 dark:hover:border-indigo-500 backdrop-blur-sm touch-manipulation"
              >
                <span className="font-medium text-center block">Get in Touch</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}