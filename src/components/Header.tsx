
import React from 'react';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 lg:px-8 flex justify-between items-center">
      <Logo />
      <div className="flex gap-4">
        <button className="text-love-500 hover:text-love-600 font-medium transition-colors">
          PT
        </button>
        <span className="text-gray-400">|</span>
        <button className="text-gray-500 hover:text-love-600 font-medium transition-colors">
          EN
        </button>
      </div>
    </header>
  );
};

export default Header;
