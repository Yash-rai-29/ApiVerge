/** 
 * src/pages/public/Pricing.jsx 
 */ 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaCrown, 
  FaBuilding, 
  FaCheck, 
  FaTimes, 
  FaCloudUploadAlt, 
  FaUserFriends, 
  FaChartLine, 
  FaBell, 
  FaUserShield, 
  FaHistory, 
  FaFileAlt 
} from 'react-icons/fa';
import { MdCompare, MdSupportAgent } from 'react-icons/md';
import { RiArrowRightDoubleLine } from 'react-icons/ri';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started with API testing",
      icon: <FaRocket className="text-blue-500 text-4xl mb-4" />,
      price: isYearly ? "0" : "0",
      features: [
        { name: "5 API projects", included: true },
        { name: "50 API calls per day", included: true },
        { name: "Basic schema validation", included: true },
        { name: "Bearer token authentication", included: true },
        { name: "Limited test case generation", included: true },
        { name: "Basic reporting", included: true },
        { name: "Community support", included: true },
        { name: "AI test generation", included: false },
        { name: "Schema versioning", included: false },
        { name: "Team collaboration", included: false },
        { name: "Webhook notifications", included: false },
        { name: "Historical data (7 days)", included: false },
      ],
      cta: "Get Started",
      ctaColor: "bg-blue-500 hover:bg-blue-600",
      popular: false
    },
    {
      name: "Pro",
      description: "For professionals needing advanced features",
      icon: <FaCrown className="text-purple-500 text-4xl mb-4" />,
      price: isYearly ? "49" : "59",
      features: [
        { name: "25 API projects", included: true },
        { name: "500 API calls per day", included: true },
        { name: "Advanced schema validation", included: true },
        { name: "All authentication methods", included: true },
        { name: "Enhanced test case generation", included: true },
        { name: "Advanced reporting & analytics", included: true },
        { name: "Priority email support", included: true },
        { name: "AI test generation", included: true },
        { name: "Schema versioning", included: true },
        { name: "Team collaboration (up to 5)", included: true },
        { name: "Webhook notifications", included: true },
        { name: "Historical data (30 days)", included: true },
      ],
      cta: "Start 30-Day Free Trial",
      ctaColor: "bg-purple-600 hover:bg-purple-700",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large teams with custom requirements",
      icon: <FaBuilding className="text-gray-700 text-4xl mb-4" />,
      price: "Custom",
      features: [
        { name: "Unlimited API projects", included: true },
        { name: "Unlimited API calls", included: true },
        { name: "Custom schema validation", included: true },
        { name: "Custom authentication flows", included: true },
        { name: "Custom test case generation", included: true },
        { name: "Custom reporting & analytics", included: true },
        { name: "Dedicated support manager", included: true },
        { name: "Advanced AI model options", included: true },
        { name: "Advanced schema versioning", included: true },
        { name: "Team collaboration (unlimited)", included: true },
        { name: "Advanced webhook integrations", included: true },
        { name: "Historical data (unlimited)", included: true },
      ],
      cta: "Contact Sales",
      ctaColor: "bg-gray-800 hover:bg-black",
      popular: false
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            API Testing Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your API testing needs with our flexible pricing options.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 font-medium ${!isYearly ? 'text-blue-600' : 'text-gray-500'}`}>Monthly</span>
            <motion.div 
              className="relative w-16 h-8 bg-gray-200 rounded-full cursor-pointer"
              onClick={() => setIsYearly(!isYearly)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute w-6 h-6 bg-blue-600 rounded-full top-1"
                animate={{ left: isYearly ? '9px' : '1px' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.div>
            <span className={`ml-3 font-medium ${isYearly ? 'text-blue-600' : 'text-gray-500'}`}>
              Yearly <span className="text-green-500 text-xs font-bold ml-1">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300 } }}
              className={`relative bg-white rounded-xl shadow-xl overflow-hidden border ${
                plan.popular ? 'border-purple-500' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="text-xs font-bold uppercase tracking-wider bg-purple-500 text-white py-1 px-3 rounded-bl-lg">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="p-8">
                <div className="flex justify-center">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-center mb-6">{plan.description}</p>
                
                <div className="text-center mb-6">
                  {plan.price === "Custom" ? (
                    <span className="text-4xl font-bold">Custom</span>
                  ) : (
                    <>
                      <span className="text-lg align-top">$</span>
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-gray-500 ml-1">/mo</span>
                    </>
                  )}
                  {isYearly && plan.price !== "Custom" && (
                    <p className="text-green-500 text-sm mt-1">Billed annually</p>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-bold text-white transition ${plan.ctaColor} shadow-lg`}
                >
                  {plan.cta}
                </motion.button>
              </div>
              
              <div className="bg-gray-50 p-8">
                <h4 className="font-semibold text-lg mb-4">Features include:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                      ) : (
                        <FaTimes className="text-red-400 mt-1 mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-blue-50 rounded-2xl p-8 md:p-12 shadow-lg"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features Comparison</h2>
            <p className="text-gray-600">Discover which plan is right for your API testing needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<FaCloudUploadAlt className="text-blue-500" />}
              title="OpenAPI Integration"
              text="Upload OpenAPI specs or provide URLs for automatic parsing and validation"
            />
            <FeatureCard 
              icon={<FaUserShield className="text-blue-500" />}
              title="Authentication Methods"
              text="Support for multiple auth methods including Bearer tokens, OAuth, and custom flows"
            />
            <FeatureCard 
              icon={<RiArrowRightDoubleLine className="text-blue-500" />}
              title="AI Test Generation"
              text="Generate test cases using multiple AI models like ChatGPT, Gemini, and Claude"
            />
            <FeatureCard 
              icon={<FaChartLine className="text-blue-500" />}
              title="Reporting & Analytics"
              text="Get detailed insights on API performance, response times, and error rates"
            />
            <FeatureCard 
              icon={<FaHistory className="text-blue-500" />}
              title="Schema Versioning"
              text="Track and manage changes to your API schemas over time"
            />
            <FeatureCard 
              icon={<FaUserFriends className="text-blue-500" />}
              title="Team Collaboration"
              text="Share projects and test results with team members using role-based access"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <FAQ 
              question="What happens after my free trial ends?"
              answer="After your 30-day free trial ends, you'll automatically be switched to our Free plan unless you choose to upgrade to a paid plan. We'll send you reminders before your trial ends so you can make a decision."
            />
            <FAQ 
              question="Can I change plans later?"
              answer="Yes, you can upgrade, downgrade, or cancel your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes will take effect at the end of your billing cycle."
            />
            <FAQ 
              question="Do you offer refunds?"
              answer="We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with our service, contact us within 14 days of your purchase for a full refund."
            />
            <FAQ 
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, PayPal, and invoicing for annual Enterprise plans. All payments are processed securely through Stripe or PayPal."
            />
          </div>
        </motion.div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 md:p-12 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Our team is here to help you find the perfect plan for your needs.
              Contact us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg flex items-center justify-center"
              >
                <MdSupportAgent className="mr-2 text-xl" />
                Contact Support
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center justify-center"
              >
                <MdCompare className="mr-2 text-xl" />
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, text }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
  >
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </motion.div>
);

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-6 flex-shrink-0 text-gray-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="mt-4 text-gray-600">{answer}</p>
      </motion.div>
    </div>
  );
};

export default Pricing;