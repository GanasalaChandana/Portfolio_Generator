// lib/config.ts
import { TraeConfig } from './trae';

export interface AppConfig {
  github: {
    enabled: boolean;
    token?: string;
    username?: string;
  };
  trae: {
    enabled: boolean;
  };
}

export function loadConfig(): AppConfig {
  // Load environment variables
  const githubToken = process.env.GITHUB_TOKEN || 
                     process.env.NEXT_PUBLIC_GITHUB_TOKEN || 
                     '';
  
  const githubUsername = process.env.GITHUB_USERNAME || 
                        process.env.NEXT_PUBLIC_GITHUB_USERNAME || 
                        '';

  // Validate GitHub token format if provided
  const isValidToken = githubToken ? validateGitHubTokenFormat(githubToken) : false;
  
  if (githubToken && !isValidToken) {
    console.warn('Invalid GitHub token format detected in environment variables');
  }

  return {
    github: {
      enabled: !!(githubToken && isValidToken),
      token: isValidToken ? githubToken : undefined,
      username: githubUsername || undefined
    },
    trae: {
      enabled: true
    }
  };
}

function validateGitHubTokenFormat(token: string): boolean {
  // GitHub token patterns
  const tokenPatterns = [
    /^ghp_[A-Za-z0-9_]{36}$/, // Classic personal access token
    /^github_pat_[A-Za-z0-9_]{82}$/, // Fine-grained personal access token
    /^gho_[A-Za-z0-9_]{36}$/, // OAuth token
    /^ghu_[A-Za-z0-9_]{36}$/, // User-to-server token
    /^ghs_[A-Za-z0-9_]{36}$/, // Server-to-server token
  ];

  return tokenPatterns.some(pattern => pattern.test(token));
}

// Usage function for your existing TraeConfig
export function createTraeConfigFromEnv(): TraeConfig {
  const appConfig = loadConfig();
  
  return {
    enabled: appConfig.trae.enabled,
    useGitHubAPI: appConfig.github.enabled,
    githubToken: appConfig.github.token
  };
}