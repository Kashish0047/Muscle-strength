import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useToast } from '../contexts/ToastContext';

const WishlistPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await apiService.getWishlist();
            setProducts(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWishlist(); }, []);

    const removeProduct = async (id) => {
        try {
            await apiService.removeFromWishlist(id);
            showToast('Removed from wishlist', 'info');
            fetchWishlist();
        } catch (err) {
            console.error(err);
            showToast('Failed to remove from wishlist', 'error');
        }
    };

    const addToCart = async (id) => {
        try {
            await apiService.addToCart(id, 1);
            window.dispatchEvent(new Event('cartUpdated'));
            showToast('Product added to cart! 🛒', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to add to cart', 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-4">
                        My <span className="text-white/20">Wishlist</span>
                    </h1>
                    <p className="text-blue-500 font-bold tracking-[0.4em] uppercase text-xs">Products you've saved for later</p>
                </motion.div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {products.map((product, idx) => (
                                <motion.div 
                                    key={product._id || idx}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="glass-panel p-6 rounded-[2.5rem] border-white/5 group relative"
                                >
                                    <button 
                                        onClick={() => removeProduct(product._id)}
                                        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="aspect-square rounded-3xl overflow-hidden mb-6 bg-white/5">
                                        {product.ProductImages?.[0] && (
                                            <img src={product.ProductImages[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px] mb-1">{product.Brand || 'Generic'}</p>
                                            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight truncate">{product.ProductName}</h3>
                                        </div>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-white italic tracking-tighter">₹{product.OfferPrice || product.Price}</span>
                                            {product.OfferPrice && product.OfferPrice < product.Price && (
                                                <span className="text-xs text-white/20 line-through font-bold">₹{product.Price}</span>
                                            )}
                                        </div>

                                        <button 
                                            onClick={() => addToCart(product._id)}
                                            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 glass-panel rounded-[4rem] border-white/5">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Wishlist Empty</h3>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-12">You haven't saved any products yet.</p>
                        <Link to="/products" className="h-16 px-12 bg-white text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">Browse Products</Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
