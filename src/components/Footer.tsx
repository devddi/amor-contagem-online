
import React from 'react';
import Logo from './Logo';
import { Instagram, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-night-gradient text-white py-12 px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-gray-300 mt-2">
              Surpreenda seu amor criando seu contador de tempo de relacionamento personalizado.
            </p>
            <p className="text-sm text-gray-400">
              Copyright © 2025 - Todos os direitos reservados
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-lg">MEUS OUTROS PROJETOS</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-love-300 transition-colors">Checklist para casais</a></li>
              <li><a href="#" className="hover:text-love-300 transition-colors">Template SaaS</a></li>
              <li><a href="#" className="hover:text-love-300 transition-colors">Kaymonya</a></li>
              <li><a href="#" className="hover:text-love-300 transition-colors">MyVendas</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-lg">LEGAL</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-love-300 transition-colors">Termos de uso</a></li>
              <li><a href="#" className="hover:text-love-300 transition-colors">Termos de privacidade</a></li>
              <li><a href="#" className="hover:text-love-300 transition-colors">CNPJ: 52.236.286/0001-02</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center border-t border-gray-800 pt-8">
          <p className="text-gray-400">Feito com ❤️ por Dev Team</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-love-300 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-love-300 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-love-300 transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
