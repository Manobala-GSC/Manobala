import React from 'react';
import Navbar from '../components/Navbar';

function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">About Us</h1>
          
          {/* Mission Statement */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We are dedicated to creating a safer world by raising awareness and providing support 
              for those affected by child abuse, domestic women abuse, and workplace harassment. 
              Our platform serves as a comprehensive resource hub, combining education, community support, 
              and immediate assistance for those in need.
            </p>
          </section>

          {/* Key Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Educational Resources</h3>
                <p className="text-gray-600">Comprehensive guides and materials for understanding and preventing abuse.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Community Support</h3>
                <p className="text-gray-600">A safe space for sharing experiences and finding support through our moderated forums.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">24/7 Assistance</h3>
                <p className="text-gray-600">Immediate support through our AI-powered chatbot and emergency contact information.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Expert Guidance</h3>
                <p className="text-gray-600">Access to professional resources and verified information from field experts.</p>
              </div>
            </div>
          </section>

          {/* Privacy Commitment */}
          <section className="bg-white p-8 rounded-lg shadow mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Our Commitment to Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              We prioritize user privacy and data protection, ensuring compliance with GDPR and other 
              relevant data protection laws. All interactions on our platform are encrypted and handled 
              with the utmost confidentiality.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About; 