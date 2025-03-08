/**
 * src/pages/public/About.jsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaLinkedin, 
  FaTwitter, 
  FaGithub, 
  FaLightbulb, 
  FaHandshake, 
  FaRocket, 
  FaUserShield,
  FaGlobe,
  FaAward,
  FaUsers
} from 'react-icons/fa';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-founder",
      image: "/assets/team/sarah.jpg",
      bio: "Former Senior Engineering Manager at Google with 15+ years of experience in API development and testing. Passionate about creating developer-friendly tools.",
      social: {
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson",
        github: "https://github.com/sarahjohnson"
      }
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-founder",
      image: "/assets/team/michael.jpg",
      bio: "AI researcher and former Principal Engineer at Microsoft. Specializes in machine learning and natural language processing for developer tools.",
      social: {
        linkedin: "https://linkedin.com/in/michaelchen",
        twitter: "https://twitter.com/michaelchen",
        github: "https://github.com/michaelchen"
      }
    },
    {
      name: "Priya Patel",
      role: "Head of Product",
      image: "/assets/team/priya.jpg",
      bio: "Product leader with experience at Stripe and Postman. Focused on creating intuitive user experiences for technical products.",
      social: {
        linkedin: "https://linkedin.com/in/priyapatel",
        twitter: "https://twitter.com/priyapatel",
        github: "https://github.com/priyapatel"
      }
    },
    {
      name: "David Rodriguez",
      role: "Lead Engineer",
      image: "/assets/team/david.jpg",
      bio: "Full-stack developer with expertise in API design and testing automation. Previously led engineering teams at Twilio.",
      social: {
        linkedin: "https://linkedin.com/in/davidrodriguez",
        github: "https://github.com/davidrodriguez"
      }
    },
    {
      name: "Aisha Williams",
      role: "AI Research Lead",
      image: "/assets/team/aisha.jpg",
      bio: "PhD in Computer Science specializing in AI and machine learning. Leads our AI model development and research initiatives.",
      social: {
        linkedin: "https://linkedin.com/in/aishawilliams",
        twitter: "https://twitter.com/aishawilliams",
        github: "https://github.com/aishawilliams"
      }
    },
    {
      name: "Jamal Hassan",
      role: "Customer Success Lead",
      image: "/assets/team/jamal.jpg",
      bio: "Customer-focused leader with a background in developer relations. Ensures our users get the most out of Apiverge.",
      social: {
        linkedin: "https://linkedin.com/in/jamalhassan",
        twitter: "https://twitter.com/jamalhassan"
      }
    }
  ];

  const timeline = [
    {
      year: "2020",
      title: "The Idea",
      description: "Sarah and Michael meet at an API conference and identify the need for AI-powered API testing tools."
    },
    {
      year: "2021",
      title: "Foundation",
      description: "Apiverge is founded. The team builds the first prototype focused on OpenAPI schema validation and basic test generation."
    },
    {
      year: "2022",
      title: "Launch & Seed Funding",
      description: "Released our beta product and secured \$3.5M in seed funding to expand the team and enhance AI capabilities."
    },
    {
      year: "2023",
      title: "Growth & Expansion",
      description: "Reached 10,000 users and integrated with multiple AI models. Launched enterprise features and team collaboration tools."
    },
    {
      year: "2024",
      title: "Series A & New Horizons",
      description: "Secured \$15M Series A funding. Expanded internationally with new offices in London and Singapore."
    }
  ];

  const values = [
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible in API testing through research and experimentation."
    },
    {
      icon: <FaUserShield />,
      title: "Security",
      description: "We prioritize the security and privacy of our customers' data in everything we build."
    },
    {
      icon: <FaHandshake />,
      title: "Collaboration",
      description: "We believe in the power of teamwork, both within our company and with our customers and partners."
    },
    {
      icon: <FaRocket />,
      title: "Excellence",
      description: "We strive for excellence in our products, our service, and our impact on the developer community."
    }
  ];

  const stats = [
    { value: "25,000+", label: "Active Users" },
    { value: "100M+", label: "API Tests Run" },
    { value: "150+", label: "Countries" },
    { value: "40+", label: "Team Members" }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute left-0 top-0 w-1/2 h-1/2 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Our Mission is to Transform API Testing
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              At Apiverge, we're building the future of API testing with AI-powered tools that help developers deliver more reliable software faster than ever before.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a href="#team" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300">
                Meet Our Team
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="md:flex items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <img 
                src="/assets/images/company-office.jpg" 
                alt="Apiverge Office" 
                className="rounded-xl shadow-lg w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/800x600/f1f5f9/334155?text=Apiverge+Headquarters'
                }}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Apiverge was founded in 2021 by Sarah Johnson and Michael Chen, two engineers who were frustrated with the manual, time-consuming process of API testing. They envisioned a platform that could automate the entire testing workflow using artificial intelligence.
              </p>
              <p className="text-gray-700 mb-4">
                What began as a small prototype quickly gained traction in the developer community. Today, Apiverge is used by thousands of companies worldwide, from startups to Fortune 500 enterprises.
              </p>
              <p className="text-gray-700">
                Our team has grown to over 40 talented individuals across engineering, product, design, and customer success, all united by our mission to revolutionize API testing through intelligent automation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at Apiverge.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-8 shadow-md text-center"
              >
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The talented people behind Apiverge who are passionate about creating the best API testing platform.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300 } }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-72 object-cover object-center"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/400x400/f1f5f9/334155?text=${member.name.split(' ').join('+')}`
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex space-x-4">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <FaLinkedin size={20} />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                        <FaTwitter size={20} />
                      </a>
                    )}
                      {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors">
                        <FaGithub size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The key milestones that have shaped Apiverge since our founding.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-start mb-12 last:mb-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`hidden md:block md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 text-right' : 'md:pl-12'}`}>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>

                <div className="relative flex-shrink-0 mx-4 md:mx-0">
                  <div className="h-full w-0.5 absolute bg-blue-500 left-1/2 transform -translate-x-1/2 top-6 -bottom-12 last:bottom-0"></div>
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-bold">
                    {item.year}
                  </div>
                </div>

                <div className={`md:w-1/2 md:hidden`}>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors & Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Investors & Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're backed by leading venture capital firms and work with top technology partners.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {['Accel Partners', 'Sequoia Capital', 'Y Combinator', 'Andreessen Horowitz', 'AWS', 'Google Cloud', 'Microsoft', 'Stripe'].map((partner, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center h-24 p-4 bg-white rounded-lg shadow-md"
              >
                <img 
                  src={`/assets/logos/${partner.toLowerCase().replace(' ', '-')}.svg`}
                  alt={partner}
                  className="max-h-12 max-w-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  onError={(e) => {
                    e.target.parentNode.innerHTML = `<div class="text-xl font-bold text-gray-500">${partner}</div>`;
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Global Presence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With offices in three continents, we're building a truly global company.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <LocationCard 
              city="San Francisco"
              country="United States"
              address="123 Market Street, San Francisco, CA 94105"
              image="/assets/locations/san-francisco.jpg"
              isHQ={true}
            />
            <LocationCard 
              city="London"
              country="United Kingdom"
              address="10 Finsbury Square, London, EC2A 1AF"
              image="/assets/locations/london.jpg"
            />
            <LocationCard 
              city="Singapore"
              country="Singapore"
              address="80 Robinson Road, #08-01, Singapore 068898"
              image="/assets/locations/singapore.jpg"
            />
          </motion.div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="md:flex items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
              <p className="text-gray-700 mb-6">
                We're always looking for passionate people to join us in our mission to revolutionize API testing. At Apiverge, you'll work with cutting-edge technology, tackle interesting challenges, and make a real impact.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUsers className="text-blue-600 mr-4 text-xl" />
                  <span className="text-gray-700">Diverse and inclusive workplace</span>
                </div>
                <div className="flex items-center">
                  <FaGlobe className="text-blue-600 mr-4 text-xl" />
                  <span className="text-gray-700">Remote-friendly culture</span>
                </div>
                <div className="flex items-center">
                  <FaRocket className="text-blue-600 mr-4 text-xl" />
                  <span className="text-gray-700">Competitive salary and equity</span>
                </div>
                <div className="flex items-center">
                  <FaAward className="text-blue-600 mr-4 text-xl" />
                  <span className="text-gray-700">Continuous learning opportunities</span>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 inline-block"
              >
                <a href="/careers" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300">
                  View Open Positions
                </a>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:w-1/2"
            >
              <img 
                src="/assets/images/team-culture.jpg" 
                alt="Apiverge Team Culture" 
                className="rounded-xl shadow-lg w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/800x600/f1f5f9/334155?text=Team+Culture'
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your API Testing?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of companies using Apiverge to deliver better APIs, faster.
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a href="/signup" className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300">
                Get Started for Free
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Location Card Component
const LocationCard = ({ city, country, address, image, isHQ = false }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
      className="bg-white rounded-xl overflow-hidden shadow-lg"
    >
      <div className="relative h-48">
        <img 
          src={image} 
          alt={`${city} Office`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x200/f1f5f9/334155?text=${city}`
          }}
        />
        {isHQ && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            HEADQUARTERS
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{city}</h3>
        <p className="text-gray-500 mb-3">{country}</p>
        <p className="text-gray-700">{address}</p>
      </div>
    </motion.div>
  );
};

export default About;