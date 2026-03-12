import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';



const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const location = useLocation();



  const navItems = [

    { name: 'Home', href: '/', icon: '' },
    { name: 'Products', href: '/products', icon: '' },
    { name: 'Categories', href: '/categories', icon: '' },
    { 
      name: 'Help', 
      href: '#', 
      dropdown: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
      ]
    },
    { name: 'Offers', href: '/offers', icon: '' },
    { name: 'About', href: '/about', icon: '' },
  ];



  useEffect(() => {

    const handleScroll = () => {

      setIsScrolled(window.scrollY > 50);

    };



    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  const fetchCounts = async () => {
    if (user) {
      try {
        const cartRes = await apiService.getCart();
        setCartCount(cartRes.totalQuantity || cartRes.count || 0);
        
        const userRes = await apiService.getUserProfile();
        setWishlistCount(userRes.data?.Wishlist?.length || 0);
      } catch (err) {
        console.error('Error fetching navbar counts:', err);
      }
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) setCartCount(JSON.parse(savedCart).length);
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) setWishlistCount(JSON.parse(savedWishlist).length);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [user]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchCounts();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cartUpdated', handleUpdate);
    window.addEventListener('wishlistUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cartUpdated', handleUpdate);
      window.removeEventListener('wishlistUpdated', handleUpdate);
    };
  }, [user]);



  const isActiveLink = (href) => {

    if (href === '/') return location.pathname === '/';

    return location.pathname.startsWith(href);

  };



  return (

    <>

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>

        <div className="container flex items-center justify-between h-20">


          <Link to="/" className="flex items-center space-x-3 group">

            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">

              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />

              </svg>

            </div>

            <div>

              <h1 className="text-xl font-bold text-white">Muscle Strength</h1>

              <p className="text-xs text-gray-400">Nutrition</p>

            </div>

          </Link>




          <div className="hidden lg:flex items-center space-x-8">

            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                      onMouseEnter={() => setHelpDropdownOpen(true)}
                      className={`nav-link flex items-center gap-1 ${isActiveLink(item.href) ? 'active' : ''}`}
                    >
                      {item.name}
                      <svg className={`w-4 h-4 transition-transform duration-300 ${helpDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {helpDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          onMouseLeave={() => setHelpDropdownOpen(false)}
                          className="absolute left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              onClick={() => setHelpDropdownOpen(false)}
                              className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

          </div>




          <div className="flex items-center space-x-4">




            <Link to="/wishlist" className="relative p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 group">

              <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />

              </svg>

              {wishlistCount > 0 && (

                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">

                  {wishlistCount > 99 ? '99+' : wishlistCount}

                </span>

              )}

            </Link>




            <Link to="/cart" className="relative p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 group">

              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />

              </svg>

              {cartCount > 0 && (

                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">

                  {cartCount > 99 ? '99+' : cartCount}

                </span>

              )}

            </Link>



            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-semibold pr-2">{user.displayName?.split(' ')[0] || 'User'}</span>
                  <svg className={`w-4 h-4 text-white transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-gray-800">
                        <p className="text-white font-semibold text-sm truncate">{user.displayName || 'User'}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm">Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm">My Orders</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors border-t border-gray-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                          <span className="text-sm font-semibold">Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={async () => {
                          await logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border-t border-gray-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm font-semibold">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/30 text-sm">
                Register/Login
              </Link>
            )}




            <button

              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}

              className="lg:hidden p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200"

            >

              <div className="w-5 h-5 flex flex-col justify-center space-y-1">

                <span className={`block h-0.5 w-full bg-gray-400 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>

                <span className={`block h-0.5 w-full bg-gray-400 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>

                <span className={`block h-0.5 w-full bg-gray-400 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>

              </div>

            </button>

          </div>

        </div>

      </nav>




      {isMobileMenuOpen && (

        <motion.div

          initial={{ opacity: 0, y: -20 }}

          animate={{ opacity: 1, y: 0 }}

          exit={{ opacity: 0, y: -20 }}

          transition={{ duration: 0.3 }}

          className="lg:hidden fixed top-20 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50"

        >

          <div className="container p-6">

            <div className="flex flex-col space-y-4">

              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col space-y-2">
                  {item.dropdown ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 text-gray-400 text-xs font-bold uppercase tracking-widest bg-white/5 rounded-xl">
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-3 p-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-blue-500 transition-all duration-200"
                          >
                            <span className="font-medium">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        isActiveLink(item.href)
                          ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-blue-500'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}

            </div>

          </div>

        </motion.div>

      )}

    </>

  );

};



export default Navbar;

