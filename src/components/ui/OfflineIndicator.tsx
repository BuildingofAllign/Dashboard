
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = '',
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Online igen",
        description: "Din internetforbindelse er genetableret.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline tilstand",
        description: "Du er offline. Nogle funktioner vil være begrænsede.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (isOnline) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg animate-pulse ${className}`}>
      <WifiOff className="h-4 w-4" />
      <span className="font-medium">Offline</span>
    </div>
  );
};
