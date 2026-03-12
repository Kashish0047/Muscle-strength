import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useToast } from '../contexts/ToastContext';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const { showToast } = useToast();
    
    const [shippingData, setShippingData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'WhatsApp'
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await apiService.getCart();
                setCartItems(res.data || []);
                if (!res.data || res.data.length === 0) navigate('/cart');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

    const total = cartItems.reduce((acc, item) => acc + (item.productId?.OfferPrice || item.productId?.Price || 0) * item.quantity, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        try {
            const manifest = cartItems.map(item => `- ${item.productId?.ProductName || 'Item'} (Qty: ${item.quantity}) - ₹${(item.productId?.OfferPrice || item.productId?.Price || 0) * item.quantity}`).join('\n');
            const message = `*New Order Received*\n\n*Customer Details:*\nName: ${shippingData.fullName}\nPhone: ${shippingData.phone}\n\n*Shipping Address:*\n${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.zipCode}\n\n*Order Details:*\n${manifest}\n\n*Total Payable: ₹${total}*\n\nPlease confirm this order and provide payment details.`;
            const whatsappUrl = `https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


            await apiService.createOrder({
                ShippingAddress: {
                    street: shippingData.address,
                    city: shippingData.city,
                    state: shippingData.state,
                    pincode: shippingData.zipCode,
                    country: 'India'
                },
                PaymentMethod: 'WhatsApp',
                Items: cartItems.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    price: item.productId.OfferPrice || item.productId.Price,
                    total: (item.productId.OfferPrice || item.productId.Price) * item.quantity
                })),
                PaymentStatus: 'Pending',
                TotalAmount: total
            });

            await apiService.clearCart();
            window.dispatchEvent(new Event('cartUpdated'));
            window.open(whatsappUrl, '_blank');
            showToast('Order placed! Opening WhatsApp...', 'success');
            setOrderSuccess(true);
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || "Failed to place order. Please check your connection.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin" />
        </div>
    );

    if (orderSuccess) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-16 rounded-[4rem] border-white/5 text-center max-w-2xl">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/20">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Order Placed Successfully</h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-12">Redirecting to WhatsApp for payment confirmation...</p>
                <button onClick={() => navigate('/orders')} className="h-16 px-12 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all">View Order History</button>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-24">
                    <div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-12 leading-tight">
                                Secure <span className="text-white/20">Checkout</span>
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Full Name</label>
                                        <input 
                                            required
                                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-bold focus:border-blue-500 transition-all outline-none"
                                            value={shippingData.fullName}
                                            onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Phone Number</label>
                                        <input 
                                            required
                                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-bold focus:border-blue-500 transition-all outline-none"
                                            value={shippingData.phone}
                                            onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Full Delivery Address</label>
                                    <input 
                                        required
                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-bold focus:border-blue-500 transition-all outline-none"
                                        value={shippingData.address}
                                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                                        placeholder="Flat, House No., Building, Apartment, Area, Street"
                                    />
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">City</label>
                                        <input required className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-bold outline-none focus:border-blue-500" value={shippingData.city} onChange={(e) => setShippingData({...shippingData, city: e.target.value})} placeholder="City" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">State</label>
                                        <input required className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-bold outline-none focus:border-blue-500" value={shippingData.state} onChange={(e) => setShippingData({...shippingData, state: e.target.value})} placeholder="State" />
                                    </div>
                                    <div className="space-y-2 col-span-2 lg:col-span-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">PIN Code</label>
                                        <input required className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white font-bold outline-none focus:border-blue-500" value={shippingData.zipCode} onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})} placeholder="110001" />
                                    </div>
                                </div>

                                <div className="pt-12">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-8 ml-4">Payment Method</h4>
                                    <div className="grid grid-cols-1 gap-6">
                                        <button 
                                            type="button"
                                            className="h-24 rounded-[2rem] border-2 bg-blue-600/10 border-blue-500 text-blue-500 flex flex-col items-center justify-center font-black uppercase tracking-widest transition-all"
                                        >
                                            <span className="text-lg">Order via WhatsApp</span>
                                            <span className="text-[10px] mt-1 text-green-500">Fast & Secure Confirmation</span>
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-20 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-blue-700 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all text-sm mt-12"
                                >
                                    {isSubmitting ? 'Confirming Order...' : 'Place Order & Send to WhatsApp'}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    <div className="hidden xl:block">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-32 glass-panel p-12 rounded-[4rem] border-white/5">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-12 text-center">Order Summary</h4>
                            <div className="space-y-6 mb-12 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                                {cartItems.map((item, i) => (
                                    <div key={i} className="flex gap-6 items-center">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden glass-panel border-white/5 flex-shrink-0">
                                            {item.productId?.ProductImages?.[0] && (
                                                <img src={item.productId.ProductImages[0]} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black uppercase text-white mb-1">{item.productId?.ProductName || 'Item'}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-xl font-black text-white italic tracking-tighter">₹{(item.productId?.OfferPrice || item.productId?.Price || 0) * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-white/5 pt-12 space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Products Total</span>
                                    <span className="text-white font-black">₹{total}</span>
                                </div>
                                <div className="flex justify-between items-center text-green-500 font-bold uppercase tracking-widest text-xs">
                                    <span>Shipping Fee</span>
                                    <span>FREE</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-8">
                                    <span className="text-white font-bold uppercase tracking-widest text-xs">Grand Total</span>
                                    <span className="text-6xl font-black text-white italic tracking-tighter">₹{total}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
