import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    // Only show offline banner if actually offline
    setShowOffline(!navigator.onLine);

    const handleOnline = () => {
      console.log('[Network] Back online');
      setIsOnline(true);
      setShowOffline(false);
      setShowReconnected(true);
      
      // Hide reconnected message after 3 seconds
      setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
    };

    const handleOffline = () => {
      console.log('[Network] Gone offline');
      setIsOnline(false);
      setShowReconnected(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show green 'reconnected' banner for 3 seconds
  if (showReconnected) {
    return (
      <div className="offline-indicator online">
        <Wifi size={18} />
        <span>Connexion rétablie</span>
      </div>
    );
  }

  // Only show red banner when offline
  if (!isOnline && showOffline) {
    return (
      <div className="offline-indicator offline">
        <WifiOff size={18} />
        <span>Mode Hors Ligne</span>
        <span className="offline-subtitle">Vos données sont sauvegardées localement</span>
      </div>
    );
  }

  // Don't show anything when online
  return null;
};

export default OfflineIndicator;