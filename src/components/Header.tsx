import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="py-4 px-6 lg:px-8 flex justify-between items-center">
      <Link to="/" onClick={onLogoClick}>
        <Logo />
      </Link>
    </header>
  );
};

export default Header;
