import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCategories();
        setCategories(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-24 h-24 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-2xl shadow-blue-500/30"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Header */}
      <section className="pt-32 pb-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 bg-blue-500/15 text-blue-400 border border-blue-500/30"
            >
              Browse Categories
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent"
            >
              Explore Our Categories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              Discover premium supplements across different categories tailored to your fitness goals
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {categories.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category._id}
                  variants={cardVariants}
                  custom={index}
                  className="group"
                >
                  <Link to={`/categories/${category._id}`} className="block">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-gray-700 rounded-3xl p-8 hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-blue-600/10 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:shadow-xl group-hover:shadow-blue-500/30 transition-all duration-500 group-hover:scale-110">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>

                      {/* Content */}
                      <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-500">
                        {category.CategoryName}
                      </h3>
                      <p className="text-gray-400 mb-8 line-clamp-3 text-lg leading-relaxed">
                        {category.CategoryDescription}
                      </p>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center text-blue-500">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="font-semibold">
                            {category.productCount || 0} Products
                          </span>
                        </div>
                        <div className={`${(category.productCount || 0) > 0 ? 'text-green-400' : 'text-gray-500'} text-sm font-semibold`}>
                          {(category.productCount || 0) > 0 ? 'In Stock' : 'Coming Soon'}
                        </div>
                      </div>

                      {/* Shop Button */}
                      <div className="flex items-center text-blue-500 font-bold text-lg group-hover:text-blue-400 transition-colors duration-500">
                        <span>Shop Now</span>
                        <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-8 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-400 mb-4">No categories yet</h3>
              <p className="text-gray-500 text-lg mb-8">Categories coming soon!</p>
              <Link 
                to="/products" 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-2xl shadow-blue-500/30"
              >
                Browse All Products
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-4xl p-16 md:p-20 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                  Can't Find What You're Looking For?
                </h2>
                <p className="text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                  Explore our complete product collection or contact our nutrition experts for personalized recommendations
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  <Link 
                    to="/products" 
                    className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 hover:transform hover:scale-105 shadow-2xl text-lg"
                  >
                    Browse All Products
                  </Link>
                  <Link 
                    to="/contact" 
                    className="px-10 py-5 bg-blue-700 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all duration-300 hover:transform hover:scale-105 border-2 border-blue-600 text-lg"
                  >
                    Get Expert Help
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
