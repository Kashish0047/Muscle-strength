import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import apiService from '../services/api';
import { useToast } from '../contexts/ToastContext';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.submitContactForm(formData);
            showToast('Message sent successfully! We will get back to you soon.', 'success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error) {
            console.error('Contact submit error:', error);
            showToast(error.response?.data?.message || 'Failed to send message. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32">
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-blue-500 font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Get In Touch</span>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                        Contact <span className="text-white/20">Us</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="glass-panel p-10 rounded-[3rem] border-white/5 h-full">
                            <h2 className="text-3xl font-bold mb-10 italic">Let's build your <span className="text-blue-500">Peak Physique.</span></h2>
                            
                            <div className="space-y-12">
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                                        <p className="text-xl font-bold">+91 9050013340</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</p>
                                        <p className="text-xl font-bold">bodysupplement29@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Office</p>
                                        <p className="text-xl font-bold">Muscle strength nutrition, Meerut road near Mahavir hospital opposite sugar mill, Karnal,Haryana</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 pt-12 border-t border-white/5">
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-6">Connect with us</p>
                                <div className="flex gap-4">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-xl glass-panel border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="glass-panel p-10 rounded-[3rem] border-white/5 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Name</label>
                                    <input 
                                        required
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm focus:border-blue-500 outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Email</label>
                                    <input 
                                        required
                                        type="email"
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm focus:border-blue-500 outline-none transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Phone Number</label>
                                <input 
                                    required
                                    type="tel"
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm focus:border-blue-500 outline-none transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="+91 00000 00000"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Subject</label>
                                <input 
                                    required
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm focus:border-blue-500 outline-none transition-all"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Message</label>
                                <textarea 
                                    required
                                    rows="6"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm focus:border-blue-500 outline-none transition-all resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-blue-600 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                            
                        </form>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactPage;
