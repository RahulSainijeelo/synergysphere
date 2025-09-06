'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@radix-ui/themes';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Challenge Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.663 17h4.673a1.5 1.5 0 001.2-2.4l-2.336-3.115a1.5 1.5 0 00-2.4 0L8.463 14.6A1.5 1.5 0 009.663 17z" clipRule="evenodd" />
            </svg>
            The Challenge: Advanced Team Collaboration Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-blue-600">SynergySphere</span>
            <br />
            The Central Nervous System
            <br />
            <span className="text-purple-600">for Team Collaboration</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Teams do their best work when their tools truly support how they think, communicate, 
            and move forward together. SynergySphere goes beyond traditional project management 
            by becoming an intelligent backbone for teams.
          </p>

          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673a1.5 1.5 0 001.2-2.4l-2.336-3.115a1.5 1.5 0 00-2.4 0L8.463 14.6A1.5 1.5 0 009.663 17z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Organized</h3>
              <p className="text-gray-600 text-sm">Keep teams aligned and working smarter every day</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Communicate Better</h3>
              <p className="text-gray-600 text-sm">Streamline communication and manage resources effectively</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proactive Intelligence</h3>
              <p className="text-gray-600 text-sm">Catch potential issues early and stay ahead of problems</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Get Started Free
              </Link>
            </Button>
            
            <Button asChild>
              <Link
                href="/demo"
                className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold border border-gray-200 transition-colors"
              >
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Mission Statement */}
          <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Design and build a <strong className="text-blue-600">desktop and mobile-ready platform</strong> that acts 
              like a <strong className="text-purple-600">central nervous system</strong> for team collaboration. 
              SynergySphere streamlines the basics like tasks and communication but also works proactively — 
              catching potential issues early and helping teams stay ahead rather than constantly reacting.
            </p>
            <div className="mt-6 text-center">
              <p className="text-gray-600 italic">
                "A system that feels supportive, insightful, and seamless — something that naturally fits into the rhythm of a working team."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
