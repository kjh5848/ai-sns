import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import { VideoSection, AgentFirst, FeatureExplorer } from './components/Features';
import { UseCases, TrySolutions, LatestBlogs, DownloadSection } from './components/Resources';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <VideoSection />
        <AgentFirst />
        <FeatureExplorer />
        <UseCases />
        <TrySolutions />
        <LatestBlogs />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;