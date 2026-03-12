import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        Name: '',
        Phone: '',
        Address: { street: '', city: '', state: '', pincode: '', country: 'India' }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiService.getUserProfile();
                setProfile(res.data);
                setFormData({
                    Name: res.data.Name || '',
                    Phone: res.data.Phone || '',
                    Address: res.data.Address || { street: '', city: '', state: '', pincode: '', country: 'India' }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateUserProfile(formData);
            setIsEditing(false);
            const res = await apiService.getUserProfile();
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-4">
                        My <span className="text-white/20">Profile</span>
                    </h1>
                    <p className="text-blue-500 font-bold tracking-[0.4em] uppercase text-xs">Account Information & Settings</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Identity Card */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel p-10 rounded-[3rem] border-white/5 border-t-blue-500/20 text-center h-fit">
                        <div className="w-32 h-32 rounded-full mx-auto mb-8 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-5xl font-black text-white italic shadow-2xl shadow-blue-500/20">
                            {profile?.Name?.charAt(0) || 'U'}
                        </div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">{profile?.Name || 'User'}</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-10">{profile?.Email}</p>

                        <div className="space-y-4 pt-10 border-t border-white/5">
                            <button onClick={() => navigate('/orders')} className="w-full py-4 glass-panel border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all mb-4">Order History</button>
                            <button onClick={() => navigate('/wishlist')} className="w-full py-4 glass-panel border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">My Wishlist</button>
                        </div>
                    </motion.div>

                    {/* Operational Data */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-8">
                        <div className="glass-panel p-12 rounded-[3.5rem] border-white/5">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500">Personal Details</h3>
                                <button onClick={() => setIsEditing(!isEditing)} className="text-white/40 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Full Name</label>
                                        <input 
                                            disabled={!isEditing}
                                            className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-white font-bold outline-none focus:border-blue-500 disabled:opacity-50 transition-all"
                                            value={formData.Name}
                                            onChange={(e) => setFormData({...formData, Name: e.target.value})}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Contact Number</label>
                                        <input 
                                            disabled={!isEditing}
                                            className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-white font-bold outline-none focus:border-blue-500 disabled:opacity-50 transition-all"
                                            value={formData.Phone}
                                            onChange={(e) => setFormData({...formData, Phone: e.target.value})}
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-8">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Delivery Address</label>
                                    <input 
                                        disabled={!isEditing}
                                        className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-white font-bold outline-none focus:border-blue-500 disabled:opacity-50 transition-all"
                                        value={formData.Address.street}
                                        onChange={(e) => setFormData({...formData, Address: {...formData.Address, street: e.target.value}})}
                                        placeholder="Flat, House No., Building, Apartment, Area, Street"
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">City</label>
                                        <input disabled={!isEditing} className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-white font-bold outline-none disabled:opacity-50" value={formData.Address.city} onChange={(e) => setFormData({...formData, Address: {...formData.Address, city: e.target.value}})} placeholder="City" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">State</label>
                                        <input disabled={!isEditing} className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-white font-bold outline-none disabled:opacity-50" value={formData.Address.state} onChange={(e) => setFormData({...formData, Address: {...formData.Address, state: e.target.value}})} placeholder="State" />
                                    </div>
                                    <div className="space-y-2 col-span-2 md:col-span-1">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">PIN Code</label>
                                        <input disabled={!isEditing} className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-white font-bold outline-none disabled:opacity-50" value={formData.Address.pincode} onChange={(e) => setFormData({...formData, Address: {...formData.Address, pincode: e.target.value}})} placeholder="110001" />
                                    </div>
                                </div>

                                {isEditing && (
                                    <motion.button 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        type="submit"
                                        className="w-full h-16 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all mt-12"
                                    >
                                        Save Changes
                                    </motion.button>
                                )}
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
