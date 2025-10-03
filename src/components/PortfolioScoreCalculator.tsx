import React, { useState, useEffect } from 'react';
import type { PortfolioContent } from '@/types/portfolio';

interface ScoreBreakdownItem {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
  color: string;
}

interface PortfolioScoreCalculatorProps {
  content: PortfolioContent;
  name: string;
  role: string;
  bio: string;
}

const PortfolioScoreCalculator: React.FC<PortfolioScoreCalculatorProps> = ({
  content,
  name,
  role,
  bio,
}) => {
  const [score, setScore] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<ScoreBreakdownItem[]>([]);
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  const calculateScore = (): { totalScore: number; breakdown: ScoreBreakdownItem[] } => {
    let totalScore = 0;
    const scoreBreakdown: ScoreBreakdownItem[] = [];

    // Name completeness (0-1.5 points)
    if (name?.length > 0) {
      const nameScore = name.length >= 2 ? 1.5 : 0.8;
      totalScore += nameScore;
      scoreBreakdown.push({
        category: 'Professional Name',
        score: nameScore,
        maxScore: 1.5,
        feedback: name.length >= 2 ? '✅ Clear professional name' : '⚠️ Name could be more complete',
        color: name.length >= 2 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400',
      });
    } else {
      scoreBreakdown.push({
        category: 'Professional Name',
        score: 0,
        maxScore: 1.5,
        feedback: '❌ Missing name',
        color: 'text-red-600 dark:text-red-400',
      });
    }

    // Role clarity (0-1.5 points)
    if (role?.length > 0) {
      const roleScore =
        role.length >= 5 && role.toLowerCase().includes('engineer') ? 1.5 :
        role.length >= 3 ? 1.2 : 0.7;
      totalScore += roleScore;
      scoreBreakdown.push({
        category: 'Role Definition',
        score: roleScore,
        maxScore: 1.5,
        feedback:
          roleScore >= 1.5 ? '✅ Clear professional role' :
          roleScore >= 1.0 ? '⚠️ Role could be more specific' : '❌ Vague role title',
        color:
          roleScore >= 1.5 ? 'text-green-600 dark:text-green-400' :
          roleScore >= 1.0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400',
      });
    } else {
      scoreBreakdown.push({
        category: 'Role Definition',
        score: 0,
        maxScore: 1.5,
        feedback: '❌ Missing role/title',
        color: 'text-red-600 dark:text-red-400',
      });
    }

    // Bio quality (0-2.5 points)
    if (bio?.length > 0) {
      const bioScore =
        bio.length >= 100 ? 2.5 :
        bio.length >= 50 ? 2.0 :
        bio.length >= 20 ? 1.5 : 1.0;
      totalScore += bioScore;
      scoreBreakdown.push({
        category: 'Personal Bio',
        score: bioScore,
        maxScore: 2.5,
        feedback:
          bioScore >= 2.5 ? '✅ Compelling personal story' :
          bioScore >= 2.0 ? '✅ Good bio length' :
          bioScore >= 1.5 ? '⚠️ Bio could be more detailed' : '❌ Bio too brief',
        color:
          bioScore >= 2.0 ? 'text-green-600 dark:text-green-400' :
          bioScore >= 1.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400',
      });
    } else {
      scoreBreakdown.push({
        category: 'Personal Bio',
        score: 0,
        maxScore: 2.5,
        feedback: '❌ Missing personal bio',
        color: 'text-red-600 dark:text-red-400',
      });
    }

    // Project quality (0-2.0 points) — uses only count, not fields
    const projectScore = content.projects?.length ? (content.projects.length >= 3 ? 2.0 : 1.5) : 0;
    totalScore += projectScore;
    scoreBreakdown.push({
      category: 'Project Showcase',
      score: projectScore,
      maxScore: 2.0,
      feedback:
        projectScore >= 2.0 ? '✅ Strong project portfolio' :
        projectScore >= 1.5 ? '✅ Good project examples' : '❌ Missing projects',
      color: projectScore >= 1.5 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    });

    // Skills completeness (0-1.5 points) — uses only count, not fields
    const skillsScore = content.skills?.length ? (content.skills.length >= 3 ? 1.5 : 1.0) : 0;
    totalScore += skillsScore;
    scoreBreakdown.push({
      category: 'Technical Skills',
      score: skillsScore,
      maxScore: 1.5,
      feedback:
        skillsScore >= 1.5 ? '✅ Well-organized skillset' :
        skillsScore >= 1.0 ? '✅ Good skill coverage' : '❌ Missing skills',
      color: skillsScore >= 1.0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    });

    // Contact information (0-1.0 points)
    const contactScore = content.contact ? 1.0 : 0;
    totalScore += contactScore;
    scoreBreakdown.push({
      category: 'Contact Info',
      score: contactScore,
      maxScore: 1.0,
      feedback: contactScore >= 1.0 ? '✅ Contact method available' : '❌ No contact method',
      color: contactScore >= 1.0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    });

    return { totalScore: Math.min(totalScore, 10), breakdown: scoreBreakdown };
  };
  useEffect(() => {
    const result = calculateScore();
    setScore(result.totalScore);
    setBreakdown(result.breakdown);

    let currentScore = 0;
    const increment = result.totalScore / 30;
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= result.totalScore) {
        currentScore = result.totalScore;
        clearInterval(timer);
      }
      setAnimatedScore(currentScore);
    }, 50);

    return () => clearInterval(timer);
  }, [content, name, role, bio]);

  const getScoreColor = (score: number): string => {
    if (score >= 8.5) return "text-green-500 dark:text-green-400";
    if (score >= 7.0) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  const getScoreGrade = (score: number): string => {
    if (score >= 9.0) return "A+";
    if (score >= 8.5) return "A";
    if (score >= 7.5) return "B+";
    if (score >= 7.0) return "B";
    if (score >= 6.0) return "C+";
    return "C";
  };

  const getImprovementTips = (): string[] => {
    const tips: string[] = [];
    breakdown.forEach(item => {
      if (item.score < item.maxScore * 0.8) {
        switch (item.category) {
          case "Personal Bio":
            if (!bio) {
              tips.push("💡 Add a bio describing your experience and passion");
            } else if (bio.length < 50) {
              tips.push("💡 Expand your bio with specific skills and goals");
            }
            break;
          case "Project Showcase":
            if (!content.projects?.length) {
              tips.push("💡 Add some projects to showcase your work");
            } else if (content.projects.length < 3) {
              tips.push("💡 Add more projects to demonstrate range");
            }
            break;
          case "Technical Skills":
            if (!content.skills?.length) {
              tips.push("💡 List your technical skills and expertise");
            }
            break;
        }
      }
    });
    return tips.slice(0, 2);
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Portfolio Score</h3>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {animatedScore.toFixed(1)}/10
          </div>
          <div className={`text-sm font-medium ${getScoreColor(score)}`}>
            Grade: {getScoreGrade(score)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              score >= 8.5 ? 'bg-green-500 dark:bg-green-400' : 
              score >= 7.0 ? 'bg-yellow-500 dark:bg-yellow-400' : 
              'bg-red-500 dark:bg-red-400'
            }`}
            style={{ width: `${(animatedScore / 10) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Needs Work</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Score Breakdown:</h4>
        {breakdown.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="flex-1 text-gray-700 dark:text-gray-300">{item.category}</span>
            <span className={`font-medium ${item.color}`}>
              {item.score.toFixed(1)}/{item.maxScore}
            </span>
          </div>
        ))}
      </div>

      {getImprovementTips().length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">
            Quick Improvements:
          </h4>
          {getImprovementTips().map((tip, index) => (
            <div key={index} className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {tip}
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          📊 Your portfolio scores better than {Math.round(score * 8.7)}% of portfolios
        </div>
      </div>
    </div>
  );
};

export default PortfolioScoreCalculator;