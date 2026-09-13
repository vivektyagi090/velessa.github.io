import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

// Declaration for Google Identity Services Global object
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: string | number;
            }
          ) => void;
          prompt?: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  text?: 'continue_with' | 'signin_with' | 'signup_with';
  disabled?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  text = 'continue_with',
  disabled = false,
}) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const [isGsiRendered, setIsGsiRendered] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoEmail, setDemoEmail] = useState('patron.luxury@gmail.com');
  const [demoName, setDemoName] = useState('Ananya Sen');

  const isRealClient = clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID';

  useEffect(() => {
    if (!isRealClient) return;

    let checkInterval: ReturnType<typeof setInterval> | null = null;

    const tryInitGsi = () => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response.credential) {
                onSuccess(response.credential);
              }
            },
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: text,
            shape: 'rectangular',
            logo_alignment: 'left',
            width: googleButtonRef.current.clientWidth || 320,
          });

          setIsGsiRendered(true);
          if (checkInterval) clearInterval(checkInterval);
        } catch {
          // Fallback to custom button
        }
      }
    };

    tryInitGsi();
    checkInterval = setInterval(tryInitGsi, 500);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [clientId, isRealClient, onSuccess, text]);

  const handleCustomClick = () => {
    if (disabled) return;

    if (isRealClient && window.google?.accounts?.id) {
      window.google.accounts.id.prompt?.();
      return;
    }

    // Open sleek in-app Google simulation modal
    setIsDemoModalOpen(true);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail) return;

    const nameParts = demoName.trim().split(' ');
    const first = nameParts[0] || 'Patron';
    const last = nameParts.slice(1).join(' ') || 'Patron';

    setIsDemoModalOpen(false);
    onSuccess(`demo_google_token:${demoEmail.trim()}:${first}:${last}`);
  };

  return (
    <div className="w-full">
      {/* Container for official Google GSI Button */}
      {isRealClient && (
        <div
          ref={googleButtonRef}
          className={`w-full flex justify-center ${isGsiRendered ? 'block' : 'hidden'}`}
        />
      )}

      {/* Styled Luxury Button */}
      {(!isRealClient || !isGsiRendered) && (
        <button
          type="button"
          onClick={handleCustomClick}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-beige hover:border-champagne text-charcoal hover:text-charcoal-dark text-xs uppercase tracking-wider font-sans font-medium rounded-xs shadow-sm hover:shadow-luxury transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {/* Official Google 'G' SVG */}
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.43 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.29 2.57 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="group-hover:text-charcoal transition-colors">
            Continue with Google
          </span>
          {!isRealClient && (
            <span className="ml-auto text-[9px] lowercase bg-champagne-light/60 text-charcoal-muted px-1.5 py-0.5 rounded-xs">
              local test
            </span>
          )}
        </button>
      )}

      {/* In-App Google Simulation Modal for testing before Google Cloud Console Client ID is set */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Google OAuth Simulator (Local Dev)"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="p-3 bg-champagne-light/30 border border-champagne/40 rounded-xs space-y-1">
            <span className="font-semibold text-charcoal flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              Development Simulation Mode
            </span>
            <p className="text-charcoal-muted leading-relaxed text-[11px]">
              Because <code>VITE_GOOGLE_CLIENT_ID</code> is currently set to <code>YOUR_GOOGLE_CLIENT_ID</code>, you can simulate signing in with any Google account below to test the full OTP verification flow immediately.
            </p>
          </div>

          <form onSubmit={handleSimulateSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-charcoal-muted uppercase tracking-wider mb-1 font-medium">
                Google Full Name
              </label>
              <input
                type="text"
                required
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                placeholder="Ananya Sen"
                className="w-full p-2.5 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
              />
            </div>

            <div>
              <label className="block text-charcoal-muted uppercase tracking-wider mb-1 font-medium">
                Google Account Email
              </label>
              <input
                type="email"
                required
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                placeholder="patron.luxury@gmail.com"
                className="w-full p-2.5 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsDemoModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                <span>Continue to Mobile OTP</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
