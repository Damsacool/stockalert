import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className='loading-screen'>
            <Loader2 className='loading-spinner' size={64} strokeWidth={2} />
            <p>Chargement de votre inventaire...</p>
        </div>
    );
};

export default LoadingScreen;