
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './button';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = '',
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnline, setLastOnline] = useState<string | null>(null);
  const [isAttemptingReconnect, setIsAttemptingReconnect] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(null);
      toast({
        title: "Online igen",
        description: "Din internetforbindelse er genetableret.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnline(new Date().toLocaleTimeString());
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

  const attemptReconnect = () => {
    setIsAttemptingReconnect(true);
    // Simulate attempting to reconnect
    setTimeout(() => {
      // If we're actually online now, this will trigger the online event listener
      if (navigator.onLine) {
        setIsOnline(true);
        setLastOnline(null);
        toast({
          title: "Forbindelse genetableret",
          description: "Du er nu online igen.",
        });
      } else {
        toast({
          title: "Stadig offline",
          description: "Kunne ikke genetablere forbindelsen. Prøv igen senere.",
          variant: "destructive",
        });
      }
      setIsAttemptingReconnect(false);
    }, 1500);
  };

  if (isOnline) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-red-500 dark:bg-red-700 text-white px-4 py-3 rounded-lg flex flex-col space-y-2 shadow-lg ${className}`}>
      <div className="flex items-center space-x-2">
        <WifiOff className="h-5 w-5" />
        <span className="font-medium">Du er offline</span>
      </div>
      {lastOnline && (
        <div className="text-xs">
          Sidst online: {lastOnline}
        </div>
      )}
      <Button 
        variant="outline" 
        className="bg-white/10 border-white/30 hover:bg-white/20 text-white w-full"
        size="sm"
        disabled={isAttemptingReconnect}
        onClick={attemptReconnect}
      >
        {isAttemptingReconnect ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Forsøger at forbinde...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Forsøg at forbinde igen
          </>
        )}
      </Button>
    </div>
  );
};
