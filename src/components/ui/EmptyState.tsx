
import React from 'react';
import { NoData } from './NoData';
import { Button } from './button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'file' | 'alert' | 'search' | 'database' | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Ingen data',
  description = 'Der er ingen data at vise på nuværende tidspunkt.',
  icon = 'database',
  actionLabel,
  onAction,
  isLoading = false,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <NoData
        title={title}
        description={description}
        icon={icon}
        actionLabel={actionLabel}
        onAction={onAction}
        className="w-full max-w-md"
      />
    </div>
  );
};
