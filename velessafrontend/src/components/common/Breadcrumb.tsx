import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
      <ol className="flex items-center flex-wrap gap-2 text-xs font-sans tracking-wider uppercase text-charcoal-muted">
        <li>
          <Link to="/" className="hover:text-champagne transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-beige-dark" />
              {isLast || !item.path ? (
                <span className="text-charcoal font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-champagne transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
