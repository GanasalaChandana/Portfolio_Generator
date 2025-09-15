// components/OneClickShip.tsx
'use client';
import { useState } from 'react';
import { PortfolioContent } from '@/types/portfolio';

interface OneClickShipProps {
  content: PortfolioContent | null;
  disabled?: boolean;
}

interface ShipResult {
  success: boolean;
  url?: string;
  error?: string;
  platform?: string;
}

export default function OneClickShip({ content, disabled }: OneClickShipProps) {
  const [isShipping, setIsShipping] = useState(false);
  const [result, setResult] = useState<ShipResult | null>(null);
  const [platform, setPlatform] = useState<'vercel' | 'github-pages'>('vercel');

  const handleShip = async () => {
    if (!content) {
      alert('Please generate a portfolio first!');
      return;
    }

    setIsShipping(true);
    setResult(null);

    try {
      const response = await fetch('/api/ship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platform
        })
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Show success message and open deployed site
        if (confirm(`🎉 Portfolio deployed successfully!\n\nURL: ${data.url}\n\nWould you like to visit your live portfolio?`)) {
          window.open(data.url, '_blank');
        }
      } else {
        console.error('Deployment failed:', data.error);
      }
    } catch (error) {
      console.error('Ship error:', error);
      setResult({
        success: false,
        error: 'Network error occurred during deployment'
      });
    } finally {
      setIsShipping(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Platform Selection */}
      <div className="flex gap-2 items-center">
        <label className="text-sm font-medium">Deploy to:</label>
        <select 
          value={platform} 
          onChange={(e) => setPlatform(e.target.value as 'vercel' | 'github-pages')}
          className="px-3 py-1 rounded border text-sm"
          disabled={isShipping}
        >
          <option value="vercel">Vercel</option>
          <option value="github-pages">GitHub Pages</option>
        </select>
      </div>

      {/* Ship Button */}
      <button
        onClick={handleShip}
        disabled={disabled || isShipping || !content}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${disabled || !content || isShipping
            ? 'bg-gray-500 cursor-not-allowed opacity-50' 
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }
          text-white
        `}
      >
        {isShipping ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Deploying...
          </div>
        ) : (
          'One-Click Ship 🚀'
        )}
      </button>

      {/* Result Display */}
      {result && (
        <div className={`
          p-4 rounded-lg text-sm
          ${result.success 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
          }
        `}>
          {result.success ? (
            <div className="space-y-2">
              <div className="font-medium">✅ Deployment Successful!</div>
              <div>Platform: {result.platform}</div>
              <div>
                URL: <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:no-underline"
                >
                  {result.url}
                </a>
              </div>
              <div className="text-xs opacity-75">
                Note: GitHub Pages may take a few minutes to propagate.
              </div>
            </div>
          ) : (
            <div>
              <div className="font-medium">❌ Deployment Failed</div>
              <div className="mt-1">{result.error}</div>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      {!content && (
        <p className="text-xs text-gray-500">
          Generate a portfolio first to enable one-click deployment
        </p>
      )}
    </div>
  );
}