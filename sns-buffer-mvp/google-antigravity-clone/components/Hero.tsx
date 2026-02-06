import React from 'react';
import { ParticleCanvas, SectionContainer, TypedText, Button } from './ui/Common';
import { Download, ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 opacity-50">
        <ParticleCanvas theme="light" />
      </div>

      <SectionContainer className="relative z-10 text-center flex flex-col items-center">
        {/* Logo / Badge */}
        <div className="mb-8 animate-fade-in-up">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-600">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             New Release v1.0
           </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
          <span className="block mb-2">Experience liftoff with</span>
          <span className="text-blue-600">
            <TypedText text="the next-generation IDE" startDelay={100} />
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto font-light">
          Google Antigravity is our agentic development platform, evolving the IDE into the agent-first era.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
          <Button variant="primary" icon={<Download className="w-5 h-5"/>}>
            Download for MacOS
          </Button>
          <Button variant="secondary">
            Explore use cases
          </Button>
        </div>
      </SectionContainer>
    </section>
  );
};

export default Hero;