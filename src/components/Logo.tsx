
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-love-500 rounded-lg p-1.5 text-white">
        <span className="text-xl animate-pulse-heart inline-block">💖</span>
      </div>
      <span className="text-xl font-bold">Amor em Contagem</span>
    </div>
  );
};

export default Logo;
