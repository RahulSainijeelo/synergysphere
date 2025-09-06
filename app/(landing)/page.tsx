import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import React from 'react';
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        {/* Add more sections here as needed */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
