/**
 * src/pages/public/Solutions.jsx
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRobot, 
  FaCode, 
  FaBolt, 
  FaBug, 
  FaCheckCircle, 
  FaChartLine, 
  FaLock, 
  FaServer, 
  FaMagic, 
  FaChartBar, 
  FaMicrochip,
  FaTools
} from 'react-icons/fa';
import { 
  SiOpenai, 
  SiGooglecloud
} from 'react-icons/si';
import { RiArrowRightLine } from 'react-icons/ri';
import { TbBrandOpenai } from 'react-icons/tb';
import { BiNetworkChart } from 'react-icons/bi';
import { GiArtificialIntelligence } from 'react-icons/gi';
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};
const Solutions = () => {
  const [activeTab, setActiveTab] = useState('testing');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 } 
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pb-32">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-y-0 right-1/3 w-1/2 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 blur-3xl"></div>
          <div className="absolute bottom-1/2 left-1/2 w-1/3 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="flex justify-center mb-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="rounded-full bg-indigo-100 p-3"
              >
                <GiArtificialIntelligence className="text-indigo-600 text-4xl" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              AI-Powered API Testing Solutions
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Revolutionize your API testing process with our intelligent, automated solutions that leverage cutting-edge AI to save time, reduce errors, and improve API quality.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a href="#how-it-works" className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg inline-flex items-center hover:shadow-xl transition-all duration-300">
                <FaBolt className="mr-2" /> See it in action
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-3"></div>
            <div className="p-1 bg-gray-100">
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/images/api-testing-dashboard.png" 
                alt="API Testing Dashboard" 
                className="w-full"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/1200x630/f1f5f9/475569?text=AI-Powered+API+Testing+Dashboard'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Intelligent API Testing Dashboard</h3>
                  <p className="opacity-90">Real-time monitoring and AI-driven test insights in one place</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section id='api-testing' className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive API Testing Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides end-to-end solutions for all your API testing needs
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<FaRobot />}
              title="AI-Driven Test Generation"
              description="Automatically generate comprehensive test cases for your APIs using advanced AI models."
              color="indigo"
              delay={0.1}
            />
            
            <FeatureCard
              icon={<FaCode />}
              title="OpenAPI Integration"
              description="Upload your OpenAPI JSON files or provide URLs for instant schema validation and testing."
              color="blue"
              delay={0.2}
            />
            
            <FeatureCard
              icon={<FaLock />}
              title="Authentication Support"
              description="Test APIs with multiple authentication methods including bearer tokens, OAuth, and custom flows."
              color="purple"
              delay={0.3}
            />
            
            <FeatureCard
              icon={<FaChartLine />}
              title="Performance Testing"
              description="Measure response times, throughput, and identify performance bottlenecks in your APIs."
              color="green"
              delay={0.4}
            />
            
            <FeatureCard
              icon={<FaBug />}
              title="Error Detection & Analysis"
              description="Automatically identify and categorize API errors with intelligent suggestions for fixes."
              color="red"
              delay={0.5}
            />
            
            <FeatureCard
              icon={<FaServer />}
              title="Load & Stress Testing"
              description="Simulate heavy traffic to ensure your APIs can handle real-world demand under pressure."
              color="orange"
              delay={0.6}
            />
          </motion.div>
        </div>
      </section>

      {/* AI Models Section */}
      <section id="ai-models" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Leading AI Models</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from multiple state-of-the-art AI models to generate and optimize your API tests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <AIModelCard 
              icon={<TbBrandOpenai />}
              name="ChatGPT"
              provider="OpenAI"
              description="Generate natural language test cases with detailed assertions and comprehensive coverage."
              color="green"
            />
            
            <AIModelCard 
              icon={<SiGooglecloud />}
              name="Gemini"
              provider="Google"
              description="Create multimodal tests that understand both code and natural language requirements."
              color="blue"
            />
            
            <AIModelCard 
              icon={<RiArrowRightLine />}
              name="Claude"
              provider="Anthropic"
              description="Design context-aware test scenarios with nuanced understanding of API behaviors."
              color="purple"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-indigo-50 rounded-2xl p-8 md:p-12"
          >
            <div className="md:flex items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-4">AI Model Comparison</h3>
                <p className="text-gray-700 mb-6">
                  Each AI model has unique strengths for different testing scenarios. Our platform lets you choose the right model for your specific needs or combine multiple models for comprehensive test coverage.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Switch between models with one click</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Compare test outputs from different models</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Fine-tune prompts for each model</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Automatic model selection based on your API type</span>
                  </li>
                </ul>
              </div>
              
              <div className="md:w-1/2 bg-white rounded-xl p-6 shadow-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3">Feature</th>
                      <th className="text-center pb-3">ChatGPT</th>
                      <th className="text-center pb-3">Gemini</th>
                      <th className="text-center pb-3">Claude</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Code Generation</td>
                      <td className="text-center">⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Edge Case Detection</td>
                      <td className="text-center">⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Schema Analysis</td>
                      <td className="text-center">⭐⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Natural Language</td>
                      <td className="text-center">⭐⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐⭐⭐</td>
                    </tr>
                    <tr>
                      <td className="py-3">Performance</td>
                      <td className="text-center">⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐⭐⭐</td>
                      <td className="text-center">⭐⭐⭐</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Workflow Tabs */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent platform simplifies every step of the API testing process
            </p>
          </motion.div>

          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {['testing', 'automation', 'performance', 'error'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {activeTab === 'testing' && (
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-4">AI-Driven Test Generation</h3>
                  <p className="text-gray-600 mb-6">
                    Our platform automatically analyzes your API specifications and generates comprehensive test cases covering both happy paths and edge cases.
                  </p>
                  <ul className="space-y-4">
                    <WorkflowStep 
                      number="1" 
                      title="Upload your OpenAPI specification" 
                      description="Import your API schema via file upload or URL" 
                    />
                    <WorkflowStep 
                      number="2" 
                      title="Select AI model and testing scope" 
                      description="Choose which endpoints to test and the depth of coverage" 
                    />
                    <WorkflowStep 
                      number="3" 
                      title="Generate test cases" 
                      description="Our AI creates detailed test scenarios based on your schema" 
                    />
                    <WorkflowStep 
                      number="4" 
                      title="Review and customize" 
                      description="Fine-tune generated tests to match your specific requirements" 
                    />
                  </ul>
                </div>
                <div className="md:w-1/2 bg-gray-100 p-4 flex items-center justify-center">
                  <img 
                    src="/assets/images/ai-test-generation.png" 
                    alt="AI Test Generation"
                    className="rounded-lg shadow-lg max-w-full h-auto"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400/f1f5f9/4338ca?text=AI+Test+Generation'
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'automation' && (
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-4">Test Automation & Scheduling</h3>
                  <p className="text-gray-600 mb-6">
                    Set up automated test runs to continuously validate your APIs and catch regressions early.
                  </p>
                  <ul className="space-y-4">
                    <WorkflowStep 
                      number="1" 
                      title="Configure test environments" 
                      description="Define staging, QA, and production environments" 
                    />
                    <WorkflowStep 
                      number="2" 
                      title="Set up authentication" 
                      description="Store and manage tokens securely for each environment" 
                    />
                    <WorkflowStep 
                      number="3" 
                      title="Schedule recurring tests" 
                      description="Run tests hourly, daily, or on custom schedules" 
                    />
                    <WorkflowStep 
                      number="4" 
                      title="Integrate with CI/CD" 
                      description="Connect with GitHub, GitLab, or Jenkins workflows" 
                    />
                  </ul>
                </div>
                <div className="md:w-1/2 bg-gray-100 p-4 flex items-center justify-center">
                  <img 
                    src="/assets/images/test-automation.png" 
                    alt="Test Automation"
                    className="rounded-lg shadow-lg max-w-full h-auto"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400/f1f5f9/4338ca?text=Test+Automation'
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-4">Performance Testing & Analysis</h3>
                  <p className="text-gray-600 mb-6">
                    Identify performance bottlenecks with detailed metrics and visualizations.
                  </p>
                  <ul className="space-y-4">
                    <WorkflowStep 
                      number="1" 
                      title="Define performance scenarios" 
                      description="Set concurrent users, ramp-up periods, and test duration" 
                    />
                    <WorkflowStep 
                      number="2" 
                      title="Execute load tests" 
                      description="Simulate realistic user traffic patterns" 
                    />
                    <WorkflowStep 
                      number="3" 
                      title="Analyze response metrics" 
                      description="Review latency, throughput, error rates, and resource usage" 
                    />
                    <WorkflowStep 
                      number="4" 
                      title="Generate performance reports" 
                      description="Share detailed insights with stakeholders" 
                    />
                  </ul>
                </div>
                <div className="md:w-1/2 bg-gray-100 p-4 flex items-center justify-center">
                  <img 
                    src="/assets/images/performance-testing.png" 
                    alt="Performance Testing"
                    className="rounded-lg shadow-lg max-w-full h-auto"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400/f1f5f9/4338ca?text=Performance+Testing'
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'error' && (
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-4">Error Detection & Resolution</h3>
                  <p className="text-gray-600 mb-6">
                    Automatically detect, analyze, and suggest fixes for API errors.
                  </p>
                  <ul className="space-y-4">
                    <WorkflowStep 
                      number="1" 
                      title="Capture detailed error information" 
                      description="Log request/response data, headers, and system state" 
                    />
                    <WorkflowStep 
                      number="2" 
                      title="Analyze error patterns" 
                      description="Identify common issues and their frequency" 
                    />
                    <WorkflowStep 
                      number="3" 
                      title="Receive AI-powered fix suggestions" 
                      description="Get intelligent recommendations based on error context" 
                    />
                    <WorkflowStep 
                      number="4" 
                      title="Verify fixes with regression tests" 
                      description="Automatically generate tests to validate fixes" 
                    />
                  </ul>
                </div>
                <div className="md:w-1/2 bg-gray-100 p-4 flex items-center justify-center">
                  <img 
                    src="/assets/images/error-analysis.png" 
                    alt="Error Analysis and Resolution"
                    className="rounded-lg shadow-lg max-w-full h-auto"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400/f1f5f9/4338ca?text=Error+Analysis'
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="industry-solutions" className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industry Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how different industries are leveraging our API testing platform
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <UseCaseCard
              title="Financial Services"
              description="Ensure secure, compliant API transactions with comprehensive testing that validates data integrity and system reliability."
              icon={<FaLock />}
            />
            <UseCaseCard
              title="E-commerce Platforms"
              description="Test product APIs, payment gateways, and inventory systems to deliver seamless shopping experiences."
              icon={<FaChartBar />}
            />
            <UseCaseCard
              title="Healthcare Solutions"
              description="Validate patient data APIs and ensure HIPAA compliance with thorough security and performance testing."
              icon={<FaServer />}
            />
            <UseCaseCard
              title="SaaS Products"
              description="Maintain reliable API services with continuous testing that catches regressions before they affect customers."
              icon={<FaTools />}
            />
            <UseCaseCard
              title="IoT Systems"
              description="Test device APIs for reliability, latency, and data accuracy in scaled IoT environments."
              icon={<FaMicrochip />}
            />
            <UseCaseCard
              title="Mobile Applications"
              description="Ensure your backend APIs support smooth mobile experiences across devices and network conditions."
              icon={<BiNetworkChart />}
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your API Testing?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of companies using our AI-powered platform to deliver more reliable APIs and better user experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg shadow-lg"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg"
              >
                Request Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Component for feature cards
const FeatureCard = ({ icon, title, description, color, delay = 0 }) => {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { type: 'spring', stiffness: 100, delay } 
        }
      }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className={`rounded-full w-14 h-14 flex items-center justify-center mb-6 ${colorClasses[color]}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const AIModelCard = ({ icon, name, provider, description, color }) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100 }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${colorClasses[color]} h-2`}></div>
      <div className="p-6">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-4">by {provider}</p>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

// Component for workflow steps
const WorkflowStep = ({ number, title, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Number(number) * 0.1 }}
      className="flex"
    >
      <div className="mr-4 flex-shrink-0">
        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
          {number}
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

// Component for use case cards
const UseCaseCard = ({ title, description, icon }) => {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="text-indigo-600 text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Solutions;