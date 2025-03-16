"use client"
import { motion } from "framer-motion"
import img1 from "../assets/img1.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pt-24 sm:pt-32">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="absolute inset-0 bg-[url('/bg_img.png')] bg-cover bg-center opacity-15 z-0"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                Your Journey to <span className="text-indigo-600">Mental Wellbeing</span> Starts Here
              </h1>
              <p className="text-lg text-slate-600 max-w-lg">
                Join our supportive community where you can connect, share, and grow with others on similar journeys.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/forum')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Join Our Community
                </button>
                <button 
                  onClick={() => navigate('/chatbot')}
                  className="px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors"
                >
                  Talk to an Expert
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src={img1}
                alt="Description"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How We Support You</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our platform offers multiple ways to connect, learn, and grow on your mental health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="👥"
              title="Community Forum"
              description="Connect with others, share experiences, and find support in our moderated community spaces."
              onClick={() => navigate('/forum')}
            />
            <FeatureCard
              icon="💬"
              title="1-on-1 Expert Chat"
              description="Schedule private sessions with licensed mental health professionals for personalized support."
              onClick={() => navigate('/chatbot')}
            />
            <FeatureCard
              icon="🤖"
              title="AI Chatbot"
              description="Get immediate responses to your questions and concerns from our supportive AI assistant."
              onClick={() => navigate('/chatbot')}
            />
            <FeatureCard
              icon="📚"
              title="Resources Library"
              description="Access a curated collection of articles, videos, and tools to support your mental wellbeing."
              onClick={() => navigate('/resources')}
            />
            <FeatureCard
              icon="✏️"
              title="Educational Blog"
              description="Stay informed with the latest research, tips, and stories from mental health experts."
              onClick={() => navigate('/blogs')}
            />
            <FeatureCard
              icon="❤️"
              title="Self-Care Tools"
              description="Discover practical exercises and techniques to incorporate into your daily routine."
              onClick={() => navigate('/resources')}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Community Stories</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Hear from members who have found support and growth through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Finding this community changed everything for me. I no longer feel alone in my struggles."
              author="Alex P."
            />
            <TestimonialCard
              quote="The expert sessions helped me develop coping strategies I use every day. Truly life-changing."
              author="Jamie L."
            />
            <TestimonialCard
              quote="I was skeptical at first, but the resources and support here have been invaluable on my journey."
              author="Sam T."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Journey Today</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Join thousands of others who are taking positive steps toward better mental wellbeing.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-white text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Mental Wellbeing</h3>
              <p className="mb-4">Supporting your journey to better mental health through community and resources.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forum'); }} className="hover:text-white transition">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/chatbot'); }} className="hover:text-white transition">
                    Expert Chat
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/resources'); }} className="hover:text-white transition">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/blogs'); }} className="hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:text-white transition">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition text-2xl">
                  📱
                </a>
                <a href="#" className="hover:text-white transition text-2xl">
                  📷
                </a>
                <a href="#" className="hover:text-white transition text-2xl">
                  👍
                </a>
                <a href="#" className="hover:text-white transition text-2xl">
                  💼
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Mental Wellbeing Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component for feature cards
function FeatureCard({ icon, title, description, onClick }) {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-slate-800">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}

// Component for testimonial cards
function TestimonialCard({ quote, author }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <div className="mb-4 text-indigo-600 text-4xl">❝</div>
      <p className="text-slate-700 mb-4 italic">{quote}</p>
      <p className="text-slate-500 font-medium">{author}</p>
    </div>
  )
}

