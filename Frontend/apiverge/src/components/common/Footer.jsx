/**
 * src/components/common/Footer.jsx
 * Modern footer with multiple sections and responsive design
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaGithub, 
  FaDiscord, 
  FaYoutube,
  FaArrowRight,
  FaEnvelope,
  FaHeart,
  FaCheckCircle
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the email to your API
    console.log('Subscribing email:', email);
    
    // Simulate successful subscription
    setTimeout(() => {
      setSubscribed(true);
      setEmail('');
    }, 800);
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        {/* Top Section with Logo + Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 pb-12 border-b border-gray-800">
          {/* Logo and description */}
          <div className="mb-10 lg:mb-0 lg:max-w-sm">
            <div className="flex items-center mb-4">
              {/* Replace with your actual logo SVG or image */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2 text-white font-bold text-lg">
                A
              </div>
              <span className="font-bold text-xl text-white">
                Apiverge
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Revolutionizing API testing with AI-powered automation. Build better, more reliable APIs with less effort.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://twitter.com/apiverge" icon={<FaTwitter />} label="Twitter" />
              <SocialLink href="https://linkedin.com/company/apiverge" icon={<FaLinkedin />} label="LinkedIn" />
              <SocialLink href="https://github.com/apiverge" icon={<FaGithub />} label="GitHub" />
              <SocialLink href="https://discord.gg/apiverge" icon={<FaDiscord />} label="Discord" />
              <SocialLink href="https://youtube.com/c/apiverge" icon={<FaYoutube />} label="YouTube" />
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="w-full lg:w-auto lg:max-w-md">
            <h3 className="text-lg font-bold mb-4">Subscribe to our newsletter</h3>
            <p className="text-gray-400 mb-4">
              Get the latest updates on API testing, automation, and exclusive offers.
            </p>
            
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900 bg-opacity-30 text-green-400 p-4 rounded-lg flex items-center"
              >
                <FaCheckCircle className="mr-2 flex-shrink-0" />
                <span>Thank you for subscribing! Check your inbox soon.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-500"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg flex items-center justify-center transition-colors duration-300"
                >
                  <span className="mr-1">Subscribe</span>
                  <FaArrowRight className="h-3 w-3" />
                </motion.button>
              </form>
            )}
          </div>
        </div>
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-white font-bold mb-4">Products</h3>
            <ul className="space-y-3">
              <FooterLink to="/solutions/api-testing">API Testing</FooterLink>
              <FooterLink to="/solutions/performance-testing">Performance Testing</FooterLink>
              <FooterLink to="/solutions/error-detection">Error Detection</FooterLink>
              <FooterLink to="/solutions/ai-test-generation">AI Test Generation</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <FooterLink to="/documentation">Documentation</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/resources/case-studies">Case Studies</FooterLink>
              <FooterLink to="/resources/webinars">Webinars</FooterLink>
              <FooterLink to="/resources/api-security">API Security Guide</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/press">Press</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/partners">Partners</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/security">Security</FooterLink>
              <FooterLink to="/gdpr">GDPR Compliance</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section with Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Apiverge. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="mr-2">Made with</span>
              <FaHeart className="text-red-500" />
              <span className="ml-2">in San Francisco, CA</span>
            </div>
            <a href="#" className="hover:text-gray-300 transition-colors">Status Page</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social Media Icon Link
const SocialLink = ({ href, icon, label }) => (
  <motion.a
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.95 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors duration-300"
  >
    {icon}
  </motion.a>
);

// Footer Navigation Link
const FooterLink = ({ children, to }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
    >
      {children}
    </Link>
  </li>
);

export default Footer;