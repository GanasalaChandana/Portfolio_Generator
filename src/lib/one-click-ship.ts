// lib/one-click-ship.ts - Updated shipToVercel function
import { PortfolioContent, generateThemeCSS, getTheme } from '@/types/portfolio';

export interface ShipConfig {
  platform: 'vercel' | 'netlify' | 'github-pages';
  githubToken?: string;
  deployToken?: string;
}

export interface ShipResult {
  success: boolean;
  url?: string;
  error?: string;
  deploymentId?: string;
}

// Generate complete HTML for the portfolio
export function generatePortfolioHTML(content: PortfolioContent): string {
  const theme = getTheme(content.theme);
  const themeCSS = generateThemeCSS(theme);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.name} - ${content.role}</title>
  <meta name="description" content="${content.tagline}">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${themeCSS}
    
    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .card {
      background: var(--color-surface);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    
    .skill-tag {
      background: rgba(var(--color-primary-rgb), 0.1);
      border: 1px solid rgba(var(--color-primary-rgb), 0.2);
      color: var(--color-primary);
    }
  </style>
</head>
<body class="theme-${theme.variant}">
  <div class="min-h-screen p-6">
    <div class="max-w-6xl mx-auto space-y-12">
      
      <!-- Hero Section -->
      <section class="text-center space-y-6">
        <h1 class="text-5xl font-bold gradient-text">${content.name}</h1>
        <h2 class="text-2xl" style="color: var(--color-text-secondary)">${content.role}</h2>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--color-text-muted)">
          ${content.tagline}
        </p>
        <div class="flex gap-4 justify-center">
          <button class="px-6 py-3 rounded-lg font-medium" style="background: var(--color-primary); color: var(--color-background)">
            View Projects
          </button>
          <button class="px-6 py-3 rounded-lg font-medium border" style="border-color: var(--color-primary); color: var(--color-primary)">
            ${content.contact.cta}
          </button>
        </div>
      </section>

      <!-- Projects Section -->
      <section id="projects" class="space-y-8">
        <h3 class="text-3xl font-bold text-center" style="color: var(--color-text-primary)">Featured Projects</h3>
        <div class="grid md:grid-cols-3 gap-6">
          ${content.projects.map(project => `
            <div class="card rounded-2xl p-6 space-y-4">
              <div class="text-4xl">${project.image}</div>
              <h4 class="text-xl font-semibold" style="color: var(--color-text-primary)">${project.title}</h4>
              <p class="text-sm" style="color: var(--color-text-secondary)">${project.summary}</p>
              <ul class="space-y-2 text-sm">
                ${project.bullets.map(bullet => `
                  <li style="color: var(--color-text-muted)">• ${bullet}</li>
                `).join('')}
              </ul>
              ${project.link ? `
                <a href="${project.link}" target="_blank" class="inline-flex items-center gap-2 text-sm font-medium" style="color: var(--color-primary)">
                  View Project →
                </a>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Skills Section -->
      <section class="space-y-8">
        <h3 class="text-3xl font-bold text-center" style="color: var(--color-text-primary)">Skills & Technologies</h3>
        <div class="grid md:grid-cols-2 gap-6">
          ${content.skills.map(bucket => `
            <div class="card rounded-2xl p-6">
              <h4 class="font-semibold mb-4" style="color: var(--color-text-primary)">${bucket.group}</h4>
              <div class="flex flex-wrap gap-2">
                ${bucket.items.map(item => `
                  <span class="skill-tag px-3 py-1 text-sm rounded-full">${item}</span>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Contact Section -->
      <section class="text-center space-y-6 py-12">
        <h3 class="text-3xl font-bold" style="color: var(--color-text-primary)">Let's Connect</h3>
        <p class="text-lg" style="color: var(--color-text-secondary)">
          Ready to collaborate on your next project?
        </p>
        <button class="px-8 py-4 rounded-lg font-medium text-lg" style="background: var(--color-primary); color: var(--color-background)">
          ${content.contact.cta}
        </button>
      </section>

    </div>
  </div>

  <script>
    // Add smooth scrolling
    document.addEventListener('click', function(e) {
      if (e.target.textContent === 'View Projects') {
        e.preventDefault();
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
      }
    });
  </script>
</body>
</html>`;
}

// FIXED: Ship to Vercel with correct API format
export async function shipToVercel(
  content: PortfolioContent, 
  config: ShipConfig
): Promise<ShipResult> {
  try {
    const html = generatePortfolioHTML(content);
    const projectName = `${content.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`;
    
    // Create deployment payload with correct files format
    const deploymentData = {
      name: projectName,
      files: [
        {
          file: "index.html",
          data: html
        },
        {
          file: "package.json",
          data: JSON.stringify({
            name: projectName,
            version: '1.0.0',
            scripts: {
              build: 'echo "Static site, no build needed"'
            }
          }, null, 2)
        }
      ],
      projectSettings: {
        framework: null,
        buildCommand: "",
        outputDirectory: ""
      },
      target: "production"
    };

    console.log('Sending deployment request to Vercel...');

    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.deployToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deploymentData)
    });

    const data = await response.json();
    
    console.log('Vercel response:', data);
    
    if (response.ok) {
      return {
        success: true,
        url: `https://${data.url}`,
        deploymentId: data.id
      };
    } else {
      return {
        success: false,
        error: data.error?.message || `Deployment failed: ${JSON.stringify(data)}`
      };
    }
  } catch (error: any) {
    console.error('Vercel deployment error:', error);
    return {
      success: false,
      error: error.message || 'Deployment failed'
    };
  }
}

// Ship to GitHub Pages
export async function shipToGitHub(
  content: PortfolioContent,
  config: ShipConfig
): Promise<ShipResult> {
  try {
    const html = generatePortfolioHTML(content);
    const repoName = `${content.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`;
    
    // Create repository
    const createRepoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${config.githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: `Portfolio for ${content.name} - ${content.role}`,
        public: true,
        auto_init: false
      })
    });

    if (!createRepoResponse.ok && createRepoResponse.status !== 422) {
      throw new Error('Failed to create repository');
    }

    const repoData = await createRepoResponse.json();
    const repoUrl = repoData.full_name || `username/${repoName}`;

    // Create index.html file
    await fetch(`https://api.github.com/repos/${repoUrl}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Initial portfolio deployment',
        content: btoa(html)
      })
    });

    // Enable GitHub Pages
    await fetch(`https://api.github.com/repos/${repoUrl}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${config.githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: {
          branch: 'main',
          path: '/'
        }
      })
    });

    return {
      success: true,
      url: `https://${repoUrl.split('/')[0]}.github.io/${repoName}`,
      deploymentId: repoUrl
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'GitHub deployment failed'
    };
  }
}

// Main ship function
export async function oneClickShip(
  content: PortfolioContent,
  config: ShipConfig
): Promise<ShipResult> {
  switch (config.platform) {
    case 'vercel':
      return shipToVercel(content, config);
    case 'github-pages':
      return shipToGitHub(content, config);
    case 'netlify':
      // Implement Netlify deployment
      return { success: false, error: 'Netlify deployment not implemented yet' };
    default:
      return { success: false, error: 'Unknown deployment platform' };
  }
}