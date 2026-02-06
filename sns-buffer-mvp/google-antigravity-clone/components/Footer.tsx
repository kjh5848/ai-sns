import React from 'react';
import { SectionContainer } from './ui/Common';
import { FOOTER_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="pt-20 pb-12 bg-white">
      <SectionContainer>
        <div className="flex flex-col md:flex-row justify-between mb-20 gap-12">
          <div className="md:w-1/3">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Experience liftoff</h3>
          </div>
          
          <div className="flex gap-16 md:gap-32">
            <div className="flex flex-col gap-3">
              {FOOTER_LINKS.primary.map(link => (
                <a key={link.label} href={link.href} className="text-gray-600 hover:text-black font-medium transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {FOOTER_LINKS.secondary.map(link => (
                <a key={link.label} href={link.href} className="text-gray-600 hover:text-black font-medium transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Big Antigravity Text SVG Representation */}
        <div className="w-full mb-12 overflow-hidden select-none pointer-events-none opacity-5">
           <svg viewBox="0 0 1000 120" className="w-full h-auto">
             <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="100" fontWeight="900" fontFamily="Inter, sans-serif" fill="currentColor">
               ANTIGRAVITY
             </text>
           </svg>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-500 font-medium">
             <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400" fill="currentColor">
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
             </svg>
             Google
          </div>
          
          <div className="flex gap-6 text-sm text-gray-500 font-medium">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">About Google</a>
            <a href="#" className="hover:text-gray-900">Google Products</a>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
};

export default Footer;