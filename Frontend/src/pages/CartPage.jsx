import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, itemId: null });
    const { showToast } = useToast();

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await apiService.getCart();
            setCartItems(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const updateQty = async (id, qty) => {
        if (qty < 1) return;
        setIsUpdating(true);
        try {
            await apiService.updateCartItem(id, qty);
            await fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to update quantity', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const removeItem = async (id) => {
        setIsUpdating(true);
        try {
            await apiService.removeFromCart(id);
            await fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
            showToast('Item removed from cart', 'info');
        } catch (err) {
            console.error(err);
            showToast('Failed to remove item', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const total = cartItems.reduce((acc, item) => acc + (item.productId?.OfferPrice || item.productId?.Price || 0) * item.quantity, 0);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-4">
                        Shopping <span className="text-white/20">Cart</span>
                    </h1>
                    <p className="text-blue-500 font-bold tracking-[0.3em] uppercase text-xs">Review your items before checkout</p>
                </motion.div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                        {/* Items Section */}
                        <div className="xl:col-span-2 space-y-6">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div 
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="glass-panel p-6 rounded-[2rem] border-white/5 flex flex-col md:flex-row items-center gap-8 group"
                                    >
                                        <div className="w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={item.productId?.ProductImages?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        
                                        <div className="flex-1 text-center md:text-left">
                                            <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2">{item.productId?.Brand}</p>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{item.productId?.ProductName}</h3>
                                            <p className="text-white/30 font-bold uppercase text-xs">High Protein Formula</p>
                                        </div>

                                            <div className="flex items-center gap-8">
                                                <div className="flex items-center glass-panel rounded-xl border-white/5 p-1 bg-white/5">
                                                    <button 
                                                        onClick={() => updateQty(item._id, item.quantity - 1)} 
                                                        disabled={isUpdating || item.quantity <= 1}
                                                        className="w-10 h-10 flex items-center justify-center text-white font-black hover:text-blue-500 disabled:opacity-30"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-10 text-center font-black text-white">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQty(item._id, item.quantity + 1)} 
                                                        disabled={isUpdating}
                                                        className="w-10 h-10 flex items-center justify-center text-white font-black hover:text-blue-500 disabled:opacity-30"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-right min-w-[120px]">
                                                    <p className="text-2xl font-black text-white tracking-tighter">₹{(item.productId?.OfferPrice || item.productId?.Price || 0) * item.quantity}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Unit: ₹{item.productId?.OfferPrice || item.productId?.Price || 0}</p>
                                                </div>

                                                <button 
                                                    onClick={() => setConfirmDelete({ isOpen: true, itemId: item._id })} 
                                                    disabled={isUpdating}
                                                    className="w-12 h-12 flex items-center justify-center text-white/20 hover:text-red-500 transition-colors disabled:opacity-30"
                                                >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Modal */}
                        <ConfirmModal
                            isOpen={confirmDelete.isOpen}
                            onClose={() => setConfirmDelete({ isOpen: false, itemId: null })}
                            onConfirm={() => removeItem(confirmDelete.itemId)}
                            title="Remove Item?"
                            message="Are you sure you want to remove this high-performance formula from your cart?"
                            confirmText="Remove"
                            variant="danger"
                        />

                        {/* Summary Section */}
                        <div className="xl:col-span-1">
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-32 glass-panel p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-10 text-center">Cart Summary</h4>
                                
                                <div className="space-y-6 mb-12">
                                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                                        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Items</span>
                                        <span className="text-white font-black">{cartItems.length} Products</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                                        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Shipping Fee</span>
                                        <span className="text-green-500 font-black">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-6">
                                        <span className="text-white font-black uppercase tracking-widest text-xs">Grand Total</span>
                                        <span className="text-5xl font-black text-white tracking-tighter italic">₹{total}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate('/checkout')}
                                    className="w-full h-20 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-blue-700 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all text-sm mb-6"
                                >
                                    Proceed to Checkout
                                </button>
                                
                                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">Safe & Secure Payments</p>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 glass-panel rounded-[4rem] border-white/5">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Your cart is empty</h3>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-12">Add some products to your collection to get started.</p>
                        <Link to="/products" className="h-16 px-12 bg-white text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">Start Shopping</Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
