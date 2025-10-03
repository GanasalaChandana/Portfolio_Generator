'use client';
import { useState } from 'react';
import { 
  Code, 
  Database, 
  Brain, 
  BarChart, 
  Cpu, 
  Globe, 
  Zap,
  Star,
  TrendingUp
} from 'lucide-react';

interface SkillItem {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  years?: number;
  icon?: string;
}

interface SkillBucket {
  group: string;
  items: (string | SkillItem)[];
  category?: 'technical' | 'tools' | 'soft';
}

// Icon mapping
const getIcon = (group: string) => {
  const iconMap: { [key: string]: any } = {
    'ML': Brain,
    'Analysis': BarChart,
    'Big Data': Database,
    'Viz': TrendingUp,
    'Programming': Code,
    'Web': Globe,
    'Cloud': Cpu,
    'Tools': Zap
  };
  
  return iconMap[group] || Code;
};

// Skill level colors and indicators
const getLevelInfo = (level?: string) => {
  const levelMap = {
    'Beginner': { color: 'bg-green-500', width: '25%', textColor: 'text-green-700 dark:text-green-300' },
    'Intermediate': { color: 'bg-blue-500', width: '50%', textColor: 'text-blue-700 dark:text-blue-300' },
    'Advanced': { color: 'bg-purple-500', width: '75%', textColor: 'text-purple-700 dark:text-purple-300' },
    'Expert': { color: 'bg-orange-500', width: '100%', textColor: 'text-orange-700 dark:text-orange-300' }
  };
  
  return level ? levelMap[level as keyof typeof levelMap] : null;
};

export default function Skills({ buckets }: { buckets: SkillBucket[] }) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Normalize skill items to always have consistent structure
  const normalizeSkillItem = (item: string | SkillItem): SkillItem => {
    if (typeof item === 'string') {
      return { name: item };
    }
    return item;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {buckets.map((bucket, i) => {
        const IconComponent = getIcon(bucket.group);
        
        return (
          <div 
            key={i} 
            className="group relative rounded-3xl border border-gray-200/60 dark:border-gray-700/60 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              {/* Header with icon and category */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {bucket.group}
                  </h4>
                  {bucket.category && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {bucket.category} skills
                    </span>
                  )}
                </div>
              </div>
              
              {/* Skills grid */}
              <div className="space-y-4">
                {bucket.items.map((item, j) => {
                  const skill = normalizeSkillItem(item);
                  const levelInfo = getLevelInfo(skill.level);
                  const isHovered = hoveredSkill === `${i}-${j}`;
                  
                  return (
                    <div 
                      key={j}
                      className="group/skill relative"
                      onMouseEnter={() => setHoveredSkill(`${i}-${j}`)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 dark:text-gray-200 group-hover/skill:text-indigo-600 dark:group-hover/skill:text-indigo-400 transition-colors">
                            {skill.name}
                          </span>
                          {skill.level && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${levelInfo?.textColor} bg-current bg-opacity-10`}>
                              {skill.level}
                            </span>
                          )}
                        </div>
                        {skill.years && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {skill.years}+ years
                          </span>
                        )}
                      </div>
                      
                      {/* Skill level bar */}
                      {skill.level && levelInfo && (
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${levelInfo.color} rounded-full transition-all duration-700 ease-out`}
                            style={{ 
                              width: isHovered ? levelInfo.width : '0%',
                              transitionDelay: isHovered ? `${j * 100}ms` : '0ms'
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Simple tag for skills without levels */}
                      {!skill.level && (
                        <div className={`inline-block px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                          isHovered 
                            ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {skill.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Category badge */}
              <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{bucket.items.length} skills</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>Core competencies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}