import React from 'react';
import Logo from './Logo';
import { Instagram, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-night-gradient text-white py-12 px-6 lg:px-8">
      <div className="container mx-auto flex flex-col items-center">
        <div className="space-y-4 flex flex-col items-center">
          <Logo />
          <p className="text-gray-300 mt-2">
            Surpreenda seu amor criando seu contador de tempo de relacionamento personalizado.
          </p>
          <p className="text-sm text-gray-400">
            Copyright © 2025 - Todos os direitos reservados
          </p>
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center border-t border-gray-800 pt-8">
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
