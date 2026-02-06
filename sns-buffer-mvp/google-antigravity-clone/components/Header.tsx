import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Download } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { Button } from './ui/Common';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 z-50">
          {/* Simplified Logo */}
          <div className="flex items-center gap-2 text-gray-900 font-medium text-xl tracking-tight">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-900" fill="currentColor">
               <path d="M12 2L2 19h20L12 2zm0 3.5L18.5 17h-13L12 5.5z"/>
            </svg>
            <span>Antigravity</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-full transition-colors">
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
              </button>
            </div>
          ))}
          <div className="ml-4">
            <Button variant="primary" className="!py-1.5 !px-4 !text-sm" icon={<Download className="w-4 h-4"/>}>
              Download
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-gray-600 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden pt-24 px-6 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.label} 
                href={link.href}
                className="text-2xl font-medium text-gray-900 py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-8">
              <Button variant="primary" className="w-full justify-center">Download Now</Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;