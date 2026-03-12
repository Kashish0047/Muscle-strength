import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/api';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await apiService.getOrders();
                setOrders(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8 text-white">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-4">
                        My <span className="text-white/20">Orders</span>
                    </h1>
                    <p className="text-blue-500 font-bold tracking-[0.4em] uppercase text-xs">View your past order history</p>
                </motion.div>

                {orders.length > 0 ? (
                    <div className="space-y-8">
                        {orders.map((order, idx) => (
                            <motion.div 
                                key={order._id || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-panel p-8 rounded-[3rem] border-white/5 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                                    <h2 className="text-9xl font-black italic uppercase tracking-tighter">#{idx + 1}</h2>
                                </div>

                                <div className="flex flex-col xl:flex-row gap-12 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-4 mb-8">
                                            <span className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                                                order.OrderStatus === 'Completed' ? 'bg-green-500 text-white' : 
                                                order.OrderStatus === 'Processing' ? 'bg-blue-600 text-white' : 
                                                'bg-white/10 text-gray-400'
                                            }`}>
                                                {order.OrderStatus || 'Active'}
                                            </span>
                                            <span className="text-white/30 font-bold uppercase text-[10px] tracking-widest">
                                                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {order.Items?.map((item, i) => (
                                                <div key={item._id || i} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden glass-panel border-white/5 flex-shrink-0">
                                                        {item.productId?.ProductImages?.[0] && (
                                                            <img src={item.productId.ProductImages[0]} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase truncate w-32">{item.productId?.ProductName || 'Item'}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="xl:w-64 flex flex-col justify-between border-l border-white/5 pl-12">
                                        <div>
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-2">Total Amount</p>
                                            <p className="text-4xl font-black italic tracking-tighter">₹{order.TotalAmount}</p>
                                        </div>
                                        <button className="mt-8 py-4 glass-panel border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                                            Order Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center">
                        <h3 className="text-2xl font-black text-white/20 uppercase tracking-widest">No orders yet</h3>
                        <p className="text-gray-600 mt-4 font-bold uppercase text-xs tracking-[0.2em]">You haven't placed any orders in our store yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
