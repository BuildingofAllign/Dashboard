
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserAvatarProps {
  src?: string;
  name?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'busy' | 'offline';
  className?: string;
  showTooltip?: boolean;
  tooltipContent?: React.ReactNode;
  onClick?: () => void;
  colorScheme?: 'default' | 'primary' | 'secondary' | 'accent' | 'muted';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  initials,
  size = 'md',
  status,
  className,
  showTooltip = false,
  tooltipContent,
  onClick,
  colorScheme = 'default',
}) => {
  // Generate initials from name if not provided
  const derivedInitials = React.useMemo(() => {
    if (initials) return initials;
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [initials, name]);

  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  // Color scheme classes
  const colorSchemeClasses = {
    default: 'bg-muted',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    muted: 'bg-muted text-muted-foreground',
  };

  // Status indicator styles
  const getStatusClass = () => {
    if (!status) return '';
    
    const baseClass = 'absolute -right-0.5 -bottom-0.5 border-2 border-background rounded-full';
    const sizeClass = size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3 w-3';
    
    switch (status) {
      case 'online': return `${baseClass} ${sizeClass} bg-green-500`;
      case 'away': return `${baseClass} ${sizeClass} bg-yellow-500`;
      case 'busy': return `${baseClass} ${sizeClass} bg-red-500`;
      case 'offline': return `${baseClass} ${sizeClass} bg-gray-400`;
      default: return '';
    }
  };

  const avatar = (
    <Avatar 
      className={cn(
        sizeClasses[size],
        onClick && 'cursor-pointer hover:opacity-90',
        'relative transition-all',
        className
      )}
      onClick={onClick}
    >
      {src && <AvatarImage src={src} alt={name || 'User'} />}
      <AvatarFallback className={cn(colorSchemeClasses[colorScheme])}>
        {derivedInitials || <User className="h-4 w-4" />}
      </AvatarFallback>
      {status && <span className={getStatusClass()} />}
    </Avatar>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {avatar}
          </TooltipTrigger>
          <TooltipContent>
            {tooltipContent || name || 'User'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return avatar;
};

// Component for displaying a group of avatars
interface UserAvatarGroupProps {
  users: Array<{
    src?: string;
    name?: string;
    initials?: string;
    status?: 'online' | 'away' | 'busy' | 'offline';
  }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  overlap?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
  onClick?: (index: number) => void;
}

export const UserAvatarGroup: React.FC<UserAvatarGroupProps> = ({
  users,
  max = 5,
  size = 'md',
  overlap = 'md',
  className,
  showTooltip = true,
  onClick,
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const overlapClasses = {
    sm: '-ml-1',
    md: '-ml-2',
    lg: '-ml-3',
  };

  return (
    <div className={cn('flex items-center', className)}>
      {visibleUsers.map((user, index) => (
        <div 
          key={index} 
          className={cn(
            index !== 0 && overlapClasses[overlap],
            'transition-transform hover:z-10 hover:scale-105'
          )}
        >
          <UserAvatar
            src={user.src}
            name={user.name}
            initials={user.initials}
            status={user.status}
            size={size}
            showTooltip={showTooltip}
            onClick={() => onClick && onClick(index)}
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className={cn(overlapClasses[overlap])}>
          <Avatar className={cn(
            size === 'xs' ? 'h-6 w-6 text-xs' :
            size === 'sm' ? 'h-8 w-8 text-sm' :
            size === 'md' ? 'h-10 w-10 text-base' :
            size === 'lg' ? 'h-12 w-12 text-lg' :
            'h-16 w-16 text-xl'
          )}>
            <AvatarFallback className="bg-muted text-muted-foreground">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};
