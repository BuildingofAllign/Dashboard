
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  homeHref = '/',
  className = '',
}) => {
  if (!items.length) return null;

  return (
    <nav className={`flex items-center text-sm ${className}`}>
      <ol className="flex items-center space-x-1">
        <li>
          <Link 
            to={homeHref}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Hjem</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </li>
            <li>
              {item.href ? (
                <Link
                  to={item.href}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors flex items-center"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-gray-200 font-medium flex items-center">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
