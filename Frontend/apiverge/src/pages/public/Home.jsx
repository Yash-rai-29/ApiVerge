/**
 * src/pages/public/Home.jsx
 * Public homepage for the Apiverge platform.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCode, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaCode className="w-8 h-8" />,
      title: "OpenAPI Integration",
      description: "Upload or provide a URL for your OpenAPI specs. We automatically parse, validate and store your API schema securely."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Advanced Authentication",
      description: "Support for custom API bearer tokens, traditional login, and Firebase-based token generation with secure storage."
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "AI-Powered Testing",
      description: "Generate test cases using various AI models like ChatGPT, Gemini, and Claude with detailed performance metrics."
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Streamline Your API Testing with AI
            </h1>
            <p className="text-lg md:text-xl mb-10 text-blue-100">
              Apiverge is an AI-driven platform that simplifies API testing through intelligent automation, comprehensive analytics, and seamless integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 font-medium transition duration-300 transform hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link 
                to="/features" 
                className="px-8 py-3 rounded-lg bg-transparent border border-white hover:bg-white/10 font-medium transition duration-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,69.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technologies to make API testing intuitive and insightful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white max-w-4xl mx-auto shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your API testing?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of developers who are saving time and improving code quality with Apiverge.
            </p>
            <Link 
              to="/signup" 
              className="inline-block px-8 py-4 rounded-lg bg-white text-blue-600 font-medium hover:bg-blue-50 transition duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
