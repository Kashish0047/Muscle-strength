import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const ShippingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-32">
            <div className="max-w-4xl mx-auto px-4 pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-blue-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Logistics</span>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                        Shipping <span className="text-white/20">Policy</span>
                    </h1>
                </motion.div>

                <div className="glass-panel p-10 md:p-16 rounded-[4rem] border-white/5 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-blue-500 italic">Nationwide Delivery</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            We ship our premium supplements to every corner of India. Our logistics network ensures that your products reach you in the safest and fastest manner possible.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                            <h3 className="text-lg font-bold mb-3 uppercase tracking-wider">Free Shipping</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">We provide 100% free shipping on all orders across the country, with no minimum purchase required.</p>
                        </div>
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                            <h3 className="text-lg font-bold mb-3 uppercase tracking-wider">Standard Time</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Typically arrives within 3-5 business days. Remote zones may take up to 7 business days.</p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 italic">Order Tracking</h2>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Once your stack is dispatched, you'll receive a unique tracking link via WhatsApp. You can also view real-time updates in your order dashboard.
                        </p>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '70%' }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 italic text-gray-300">Important Notes</h2>
                        <ul className="space-y-4 text-gray-500 text-sm">
                            <li className="flex gap-3"><span className="text-blue-500 font-bold">•</span> Delivery times are estimates and may vary due to holidays or conditions.</li>
                            <li className="flex gap-3"><span className="text-blue-500 font-bold">•</span> Please ensure someone is available at the address to receive the package.</li>
                            <li className="flex gap-3"><span className="text-blue-500 font-bold">•</span> For and queries regarding your shipment, reach out on WhatsApp.</li>
                        </ul>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ShippingPage;
