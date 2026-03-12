import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const ReturnsPage = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-32">
            <div className="max-w-4xl mx-auto px-4 pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-blue-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Satisfaction</span>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                        Returns <span className="text-white/20">& Refunds</span>
                    </h1>
                </motion.div>

                <div className="glass-panel p-10 md:p-16 rounded-[4rem] border-white/5 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-blue-500 italic">Refund Policy</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            We stand by the quality of our supplements. If you're not satisfied, we offer a hassle-free return and refund process within 7 days of delivery.
                        </p>
                    </section>

                    <div className="space-y-8">
                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-4 right-8 text-4xl font-black italic text-white/5 group-hover:text-blue-500/10 transition-colors">01</div>
                            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Unopened Items</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Full refund or exchange for any product that is unopened and in its original packaging with seals intact.</p>
                        </div>

                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-4 right-8 text-4xl font-black italic text-white/5 group-hover:text-blue-500/10 transition-colors">02</div>
                            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Damaged on Arrival</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">If your package arrives damaged, please take a photo and contact us via WhatsApp immediately. We will arrange a free replacement.</p>
                        </div>

                        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-4 right-8 text-4xl font-black italic text-white/5 group-hover:text-blue-500/10 transition-colors">03</div>
                            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Incorrect Orders</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Received the wrong product? We'll pick it up and deliver the correct item at zero extra cost to you.</p>
                        </div>
                    </div>

                    <section className="bg-blue-600/10 p-10 rounded-3xl border border-blue-500/20">
                        <h2 className="text-xl font-bold mb-4 text-blue-400">Process to Initiate Return</h2>
                        <ol className="space-y-4 text-sm text-gray-300">
                            <li>1. Reach out to our support team on WhatsApp within 7 days.</li>
                            <li>2. Provide your Order ID and clear photos/videos of the issue.</li>
                            <li>3. Our team will verify the request and initiate a pickup.</li>
                            <li>4. Refund will be processed to the original source within 5-7 business days of verification.</li>
                        </ol>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReturnsPage;
