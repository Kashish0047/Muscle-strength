import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import ProductCard from '../components/ProductCard';
import Hero3D from '../components/Hero3D';
import Footer from '../components/Footer';
import { useToast } from '../contexts/ToastContext';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [featuredResponse, categoriesResponse, bestSellingResponse] = await Promise.all([
        apiService.getFeaturedProducts(),
        apiService.getCategories(),
        apiService.getBestSellingProducts()
      ]);

      setFeaturedProducts(featuredResponse.data || []);
      setCategories(categoriesResponse.data || []);
      setBestSellingProducts(bestSellingResponse.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      await apiService.addToCart(productId, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      showToast('Product added to cart! 🛒', 'success');
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast(err.response?.data?.message || 'Failed to add to cart. Please ensure you are logged in.', 'error');
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await apiService.addToWishlist(productId);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
          <p className="text-xl font-medium tracking-wide text-gray-400">Loading Muscle Strength...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative z-0 h-[90vh]">
        <Hero3D />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
      </div>

      <main className="relative z-10 -mt-20">
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative"
                >
                  <Link to={`/categories/${cat.categoryType}`} className="block">
                      <div className="w-16 h-16 mb-4 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
                        <img 
                          src={cat.CategoryImage} 
                          alt={cat.CategoryName} 
                          className="w-10 h-10 object-contain" 
                          onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/287/287221.png' }}
                        />
                        {cat.productCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black shadow-lg">
                            {cat.productCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-300 group-hover:text-white">{cat.CategoryName}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                  Featured <span className="text-blue-500">Selection</span>
                </motion.h2>
                <div className="h-1 w-20 bg-blue-500 rounded-full" />
              </div>
              <Link to="/products" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 group transition-colors">
                View All <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1">
              <span className="text-blue-400 font-bold tracking-tighter uppercase text-sm mb-4 block">Limited Time Offer</span>
              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-none">FUEL THE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">BEAST INSIDE.</span></h2>
              <p className="text-xl text-gray-400 mb-8 max-w-lg">Get flat 20% off on all pre-workout supplements this week.</p>
              <div className="flex gap-4">
                <Link to="/products" className="btn-premium px-8 py-4 bg-blue-600 rounded-full font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]">Grab Offer</Link>
                <Link to="/offers" className="px-8 py-4 border border-white/10 rounded-full font-bold text-white hover:bg-white/5 transition-colors">View All Offers</Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
              <img 
                src="https://res.cloudinary.com/draqmavke/image/upload/v1741272000/bodyraze/static/promo-image.png" 
                alt="Promo" 
                className="relative z-10 w-full max-w-md mx-auto animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Premium+Supplements' }}
              />
            </div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Crowd <span className="text-blue-500">Favorites</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">These are the top-rated formulas our athletes swear by.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellingProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Pure Quality', desc: '100% lab-tested ingredients for maximum safety.', icon: '🛡️' },
              { title: 'Fast Delivery', desc: 'Express shipping to get your stack on time.', icon: '⚡' },
              { title: 'Best Value', desc: 'Premium nutrition at competitive market prices.', icon: '💎' },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-8 rounded-3xl text-center transform transition-transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
