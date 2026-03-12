import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { useToast } from '../contexts/ToastContext';

const CategoryProductsPage = () => {
  const { categoryType } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products for this category and all categories (to find info)
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiService.getProductsByCategory(categoryType),
          apiService.getCategories(),
        ]);

        setProducts(productsResponse.data || []);
        setTotalPages(productsResponse.pages || 1);
        setTotalProducts(productsResponse.total || 0);

        // Find the matching category info
        const categories = categoriesResponse.data || [];
        const matched = categories.find(
          (c) => c.categoryType === categoryType || c._id === categoryType
        );
        setCategoryInfo(matched || null);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products for this category. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (categoryType) {
      setCurrentPage(1);
      fetchData();
    }
  }, [categoryType]);

  const handleAddToCart = async (productId, quantity) => {
    try {
      await apiService.addToCart(productId, quantity);
      window.dispatchEvent(new Event('cartUpdated'));
      showToast('Product added to cart! 🛒', 'success');
    } catch (error) {
      console.error('Add to cart error:', error);
      showToast(error.response?.data?.message || 'Failed to add. Please ensure you are logged in.', 'error');
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await apiService.addToWishlist(productId);
      showToast('Added to wishlist! ❤️', 'success');
    } catch (error) {
      console.error('Wishlist error:', error);
      showToast(error.response?.data?.message || 'Failed to add to wishlist.', 'error');
    }
  };

  // Pagination range
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Loading Products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
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
            <div className="flex gap-4 justify-center">
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                Try Again
              </button>
              <Link to="/categories" className="btn btn-outline">
                All Categories
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Breadcrumb */}
      <section className="pt-24 pb-2">
        <div className="container">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{categoryInfo?.CategoryName || categoryType}</span>
          </motion.nav>
        </div>
      </section>

      {/* Category Header */}
      <section className="pt-6 pb-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-10">
              {categoryInfo?.CategoryImage ? (
                <div className="relative h-64 md:h-72">
                  <img
                    src={categoryInfo.CategoryImage}
                    alt={categoryInfo.CategoryName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="container">
                      <div className="max-w-lg">
                        <motion.h1
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-4xl md:text-5xl font-bold text-white mb-4"
                        >
                          {categoryInfo.CategoryName}
                        </motion.h1>
                        {categoryInfo.CategoryDescription && (
                          <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-300 text-lg leading-relaxed"
                          >
                            {categoryInfo.CategoryDescription}
                          </motion.p>
                        )}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-gray-400 mt-4 text-sm"
                        >
                          {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative py-16 px-8 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <div className="max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      {categoryInfo?.CategoryName || categoryType}
                    </h1>
                    {categoryInfo?.CategoryDescription && (
                      <p className="text-gray-400 text-lg leading-relaxed">
                        {categoryInfo.CategoryDescription}
                      </p>
                    )}
                    <p className="text-gray-500 mt-4 text-sm">
                      {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-20">
        <div className="container">
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No products in this category</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                We're still adding products to this category. Check back soon or explore other categories.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/categories" className="btn btn-outline">
                  Browse Categories
                </Link>
                <Link to="/products" className="btn btn-primary">
                  All Products
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mt-12"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentPage <= 1
                        ? 'bg-[var(--bg-secondary)] text-gray-600 cursor-not-allowed'
                        : 'bg-[var(--bg-secondary)] text-white hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {getPageNumbers()[0] > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="w-10 h-10 rounded-lg text-sm font-medium bg-[var(--bg-secondary)] text-white hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-all"
                      >
                        1
                      </button>
                      {getPageNumbers()[0] > 2 && (
                        <span className="text-gray-500 px-1">...</span>
                      )}
                    </>
                  )}

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        page === currentPage
                          ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-blue-500/30'
                          : 'bg-[var(--bg-secondary)] text-white hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                    <>
                      {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                        <span className="text-gray-500 px-1">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-10 rounded-lg text-sm font-medium bg-[var(--bg-secondary)] text-white hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)] transition-all"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      currentPage >= totalPages
                        ? 'bg-[var(--bg-secondary)] text-gray-600 cursor-not-allowed'
                        : 'bg-[var(--bg-secondary)] text-white hover:bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryProductsPage;
