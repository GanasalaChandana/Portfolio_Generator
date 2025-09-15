import React, { useState, useEffect } from 'react';

interface PortfolioScoreCalculatorProps {
  content: any;
  name: string;
  role: string;
  bio: string;
}

interface ScoreBreakdownItem {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
  color: string;
}

const PortfolioScoreCalculator: React.FC<PortfolioScoreCalculatorProps> = ({ content, name, role, bio }) => {
  const [score, setScore] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<ScoreBreakdownItem[]>([]);
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Calculate score based on portfolio completeness
  const calculateScore = (): { totalScore: number; breakdown: ScoreBreakdownItem[] } => {
    let totalScore = 0;
    const scoreBreakdown: ScoreBreakdownItem[] = [];

    // Name completeness (0-1.5 points)
    if (name?.length > 0) {
      const nameScore = name.length >= 2 ? 1.5 : 0.8;
      totalScore += nameScore;
      scoreBreakdown.push({
        category: "Professional Name",
        score: nameScore,
        maxScore: 1.5,
        feedback: name.length >= 2 ? "✅ Clear professional name" : "⚠️ Name could be more complete",
        color: name.length >= 2 ? "text-green-600" : "text-yellow-600"
      });
    } else {
      scoreBreakdown.push({
        category: "Professional Name",
        score: 0,
        maxScore: 1.5,
        feedback: "❌ Missing name",
        color: "text-red-600"
      });
    }

    // Role clarity (0-1.5 points)
    if (role?.length > 0) {
      const roleScore = role.length >= 5 && role.toLowerCase().includes('engineer') ? 1.5 : 
                      role.length >= 3 ? 1.2 : 0.7;
      totalScore += roleScore;
      scoreBreakdown.push({
        category: "Role Definition", 
        score: roleScore,
        maxScore: 1.5,
        feedback: roleScore >= 1.5 ? "✅ Clear professional role" : 
                 roleScore >= 1.0 ? "⚠️ Role could be more specific" : "❌ Vague role title",
        color: roleScore >= 1.5 ? "text-green-600" : roleScore >= 1.0 ? "text-yellow-600" : "text-red-600"
      });
    } else {
      scoreBreakdown.push({
        category: "Role Definition",
        score: 0,
        maxScore: 1.5,
        feedback: "❌ Missing role/title",
        color: "text-red-600"
      });
    }

    // Bio quality (0-2.5 points)
    if (bio?.length > 0) {
      const bioScore = bio.length >= 100 ? 2.5 :
                      bio.length >= 50 ? 2.0 :
                      bio.length >= 20 ? 1.5 : 1.0;
      totalScore += bioScore;
      scoreBreakdown.push({
        category: "Personal Bio",
        score: bioScore,
        maxScore: 2.5,
        feedback: bioScore >= 2.5 ? "✅ Compelling personal story" :
                 bioScore >= 2.0 ? "✅ Good bio length" :
                 bioScore >= 1.5 ? "⚠️ Bio could be more detailed" : "❌ Bio too brief",
        color: bioScore >= 2.0 ? "text-green-600" : bioScore >= 1.5 ? "text-yellow-600" : "text-red-600"
      });
    } else {
      scoreBreakdown.push({
        category: "Personal Bio",
        score: 0,
        maxScore: 2.5,
        feedback: "❌ Missing personal bio",
        color: "text-red-600"
      });
    }

    // Project quality (0-2.0 points)
    const projectScore = content?.projects?.length > 0 ? 
                        (content.projects.length >= 3 ? 2.0 : 1.5) : 0;
    totalScore += projectScore;
    scoreBreakdown.push({
      category: "Project Showcase",
      score: projectScore,
      maxScore: 2.0,
      feedback: projectScore >= 2.0 ? "✅ Strong project portfolio" :
               projectScore >= 1.5 ? "✅ Good project examples" : "❌ Missing projects",
      color: projectScore >= 1.5 ? "text-green-600" : "text-red-600"
    });

    // Skills completeness (0-1.5 points)
    const skillsScore = content?.skills?.length > 0 ? 
                       (content.skills.length >= 3 ? 1.5 : 1.0) : 0;
    totalScore += skillsScore;
    scoreBreakdown.push({
      category: "Technical Skills",
      score: skillsScore,
      maxScore: 1.5,
      feedback: skillsScore >= 1.5 ? "✅ Well-organized skillset" :
               skillsScore >= 1.0 ? "✅ Good skill coverage" : "❌ Missing skills",
      color: skillsScore >= 1.0 ? "text-green-600" : "text-red-600"
    });

    // Contact information (0-1.0 points)
    const contactScore = content?.contact ? 1.0 : 0;
    totalScore += contactScore;
    scoreBreakdown.push({
      category: "Contact Info",
      score: contactScore,
      maxScore: 1.0,
      feedback: contactScore >= 1.0 ? "✅ Contact form available" : "❌ No contact method",
      color: contactScore >= 1.0 ? "text-green-600" : "text-red-600"
    });

    return { totalScore: Math.min(totalScore, 10), breakdown: scoreBreakdown };
  };

  // Animate score counting up
  useEffect(() => {
    const result = calculateScore();
    setScore(result.totalScore);
    setBreakdown(result.breakdown);

    // Animate score counting
    let currentScore = 0;
    const increment = result.totalScore / 30; // 30 steps
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
    if (score >= 8.5) return "text-green-500";
    if (score >= 7.0) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreGrade = (score: number): string => {
    if (score >= 9.0) return "A+";
    if (score >= 8.5) return "A";
    if (score >= 7.5) return "B+";
    if (score >= 7.0) return "B";
    if (score >= 6.0) return "C+";
    return "C";
  };

  const getSuggestedRoleTitle = (currentRole: string): string => {
    const roleText = currentRole.toLowerCase();
    
    // Frontend suggestions
    if (roleText.includes('frontend') || roleText.includes('front-end') || roleText.includes('react') || roleText.includes('ui')) {
      return 'Senior Frontend Engineer';
    }
    
    // Backend suggestions
    if (roleText.includes('backend') || roleText.includes('back-end') || roleText.includes('api') || roleText.includes('server')) {
      return 'Senior Backend Engineer';
    }
    
    // Full-stack suggestions
    if (roleText.includes('fullstack') || roleText.includes('full-stack') || roleText.includes('full stack')) {
      return 'Full-Stack Engineer';
    }
    
    // Mobile suggestions
    if (roleText.includes('mobile') || roleText.includes('ios') || roleText.includes('android')) {
      return 'Mobile Developer';
    }
    
    // DevOps suggestions
    if (roleText.includes('devops') || roleText.includes('infrastructure') || roleText.includes('cloud')) {
      return 'DevOps Engineer';
    }
    
    // Data/AI suggestions
    if (roleText.includes('data') || roleText.includes('ml') || roleText.includes('ai') || roleText.includes('machine learning')) {
      return 'Data Scientist';
    }
    
    // Security suggestions
    if (roleText.includes('security') || roleText.includes('cybersecurity')) {
      return 'Security Engineer';
    }
    
    // Generic suggestions based on vague terms
    if (roleText.includes('developer') && !roleText.includes('senior')) {
      return 'Software Developer';
    }
    
    if (roleText.includes('engineer') && !roleText.includes('senior')) {
      return 'Software Engineer';
    }
    
    // Catch-all for very vague roles
    if (roleText.includes('programmer') || roleText.includes('coder') || roleText.length < 5) {
      return 'Software Engineer';
    }
    
    // Default suggestion
    return 'Software Engineer';
  };

  const getImprovementTips = (): string[] => {
    const tips: string[] = [];
    breakdown.forEach(item => {
      if (item.score < item.maxScore * 0.8) {
        switch (item.category) {
          case "Personal Bio":
            if (bio.length === 0) {
              tips.push("💡 Add a bio describing your experience and passion for technology");
            } else if (bio.length < 20) {
              tips.push("💡 Expand your bio to 50+ characters with specific skills and goals");
            } else if (bio.length < 50) {
              tips.push("💡 Add more details about your projects and technical expertise");
            } else {
              tips.push("💡 Include quantifiable achievements and years of experience");
            }
            break;
          case "Role Definition":
            const suggestedRole = getSuggestedRoleTitle(role);
            if (role.length === 0) {
              tips.push("💡 Add a specific role title like 'Software Engineer'");
            } else if (role !== suggestedRole) {
              tips.push(`💡 Try a more specific title like "${suggestedRole}"`);
            } else {
              tips.push("💡 Consider adding seniority level like 'Senior' or 'Lead'");
            }
            break;
          case "Professional Name":
            if (name.length === 0) {
              tips.push("💡 Add your professional name (e.g., 'John Smith')");
            } else if (name.length < 2) {
              tips.push("💡 Use your full name for better professional presentation");
            }
            break;
          default:
            break;
        }
      }
    });
    return tips.slice(0, 2); // Show max 2 tips
  };

  return (
    <div className="rounded-2xl border p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Portfolio Score</h3>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {animatedScore.toFixed(1)}/10
          </div>
          <div className={`text-sm font-medium ${getScoreColor(score)}`}>
            Grade: {getScoreGrade(score)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              score >= 8.5 ? 'bg-green-500' : score >= 7.0 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(animatedScore / 10) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Needs Work</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-2 mb-4">
        <h4 className="font-medium text-sm">Score Breakdown:</h4>
        {breakdown.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="flex-1">{item.category}</span>
            <span className={`font-medium ${item.color}`}>
              {item.score.toFixed(1)}/{item.maxScore}
            </span>
          </div>
        ))}
      </div>

      {/* Improvement Tips */}
      {getImprovementTips().length > 0 && (
        <div className="border-t pt-3">
          <h4 className="font-medium text-sm mb-2">Quick Improvements:</h4>
          {getImprovementTips().map((tip, index) => (
            <div key={index} className="text-xs text-gray-600 mb-1">{tip}</div>
          ))}
        </div>
      )}

      {/* Benchmarking */}
      <div className="border-t pt-3 mt-3">
        <div className="text-xs text-gray-500">
          📊 Your portfolio scores better than {Math.round(score * 8.7)}% of portfolios
        </div>
      </div>
    </div>
  );
};

export default PortfolioScoreCalculator;