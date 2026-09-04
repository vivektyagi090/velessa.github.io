import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] bg-ivory flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] text-champagne font-sans font-medium flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Page Not Found
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl font-light text-charcoal">
          404
        </h1>
        <div className="w-12 h-[1px] bg-champagne mx-auto" />
        <p className="text-sm text-charcoal-muted font-sans font-light leading-relaxed">
          The fine jewellery page or creation you are seeking is either archived or rests in a different salon wing.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link to="/">
            <Button variant="primary" size="md">
              Return Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" size="md" className="flex items-center gap-2">
              <span>View Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
