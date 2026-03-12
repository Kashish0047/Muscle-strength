import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            category: 'Orders',
            questions: [
                { q: 'How do I track my order?', a: 'Once your order is shipped, you will receive a tracking ID via WhatsApp.' },
                { q: 'Can I cancel my order?', a: 'Orders can only be cancelled before they are shipped. Please contact us immediately if you need to cancel.' },
                { q: 'What payment methods do you accept?', a: 'Currently, we process all payments via WhatsApp for a personalized experience and secure verification.' }
            ]
        },
        {
            category: 'Shipping',
            questions: [
                { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days across India. Remote locations might take slightly longer.' },
                { q: 'Do you offer free shipping?', a: 'Yes! We offer free shipping on all orders nationwide.' },
                { q: 'What courier service do you use?', a: 'We partner with leading logistics providers like shiprocket to ensure safe delivery.' }
            ]
        },
        {
            category: 'Products',
            questions: [
                { q: 'Are your products authentic?', a: '100%. We source directly from manufacturers and official distributors. Every product comes with an authenticity code.' },
                { q: 'Can I get a customized stack?', a: 'Yes! Reach out to us via WhatsApp, and our nutrition experts will help you build a personalized supplement stack.' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-32">
            <div className="max-w-4xl mx-auto px-4 pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-blue-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Help Center</span>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                        Common <span className="text-white/20">Questions</span>
                    </h1>
                </motion.div>

                <div className="space-y-16">
                    {faqs.map((group, gIdx) => (
                        <div key={group.category}>
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 mb-8 ml-4">{group.category}</h2>
                            <div className="space-y-4">
                                {group.questions.map((faq, qIdx) => {
                                    const index = `${gIdx}-${qIdx}`;
                                    const isOpen = activeIndex === index;
                                    return (
                                        <div key={index} className="glass-panel rounded-3xl border-white/5 overflow-hidden">
                                            <button 
                                                onClick={() => setActiveIndex(isOpen ? null : index)}
                                                className="w-full p-8 text-left flex justify-between items-center transition-colors hover:bg-white/5"
                                            >
                                                <span className="text-lg font-bold">{faq.q}</span>
                                                <motion.span 
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    className="text-blue-500"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                                                </motion.span>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="px-8 pb-8 text-gray-400 leading-relaxed"
                                                    >
                                                        {faq.a}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQPage;
