import React from 'react';
import Logo from './Logo';
import { Instagram, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-3 px-6 lg:px-8">
      <div className="container mx-auto flex flex-col items-center">
        <div className="space-y-1 flex flex-col items-center">
          <Logo />
          <p className="text-gray-300 text-sm">
            Surpreenda seu amor criando seu contador de tempo de relacionamento personalizado.
          </p>
          <p className="text-xs text-gray-400">
            Copyright © 2025 - Todos os direitos reservados
          </p>
        </div>
        
        <div className="mt-3 flex flex-col sm:flex-row justify-center items-center border-t border-gray-800 pt-2">
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
