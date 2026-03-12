import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const AdminQueries = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, queryId: null });
    const { showToast } = useToast();

    useEffect(() => {
        if (!isAdmin) navigate('/');
        fetchQueries();
    }, [isAdmin]);

    const fetchQueries = async () => {
        try {
            setLoading(true);
            const res = await apiService.getContactInquiries();
            setQueries(res.data || []);
        } catch (err) {
            console.error('Fetch queries error:', err);
            showToast('Failed to load inquiries.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await apiService.updateInquiryStatus(id, status);
            showToast('Status updated successfully.', 'success');
            fetchQueries();
        } catch (err) {
            showToast('Failed to update status.', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiService.deleteInquiry(id);
            showToast('Inquiry deleted successfully.', 'success');
            fetchQueries();
        } catch (err) {
            showToast('Failed to delete.', 'error');
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-black pt-28 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">Customer <span className="text-blue-500">Inquiries</span></h1>
                        <p className="text-gray-400">Manage messages from the Contact Us page</p>
                    </div>
                </div>


                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden border-white/5 bg-white/[0.02]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-500">Sender</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-500">Subject</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-500">Message</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                                        <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {queries.length > 0 ? (
                                            queries.map((q) => (
                                                <motion.tr 
                                                    key={q._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group"
                                                >
                                                    <td className="p-6">
                                                        <p className="font-bold text-white">{q.name}</p>
                                                        <p className="text-xs text-gray-500 mb-1">{q.email}</p>
                                                        <p className="text-[10px] text-blue-500 font-black">{q.phone}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="text-xs font-bold text-gray-300">{q.subject}</span>
                                                    </td>
                                                    <td className="p-6 max-w-xs">
                                                        <p className="text-xs text-gray-500 line-clamp-2 italic group-hover:line-clamp-none transition-all">{q.message}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <select 
                                                            value={q.status}
                                                            onChange={(e) => handleStatusUpdate(q._id, e.target.value)}
                                                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg outline-none border-none cursor-pointer
                                                                ${q.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' : 
                                                                  q.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' : 
                                                                  'bg-green-500/10 text-green-400'}`}
                                                        >
                                                            <option value="Pending" className="bg-black">Pending</option>
                                                            <option value="In Progress" className="bg-black">In Progress</option>
                                                            <option value="Resolved" className="bg-black">Resolved</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <a 
                                                                href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=Hi ${q.name}, this is regarding your inquiry about "${q.subject}" on Muscle Strength Nutrition.`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                                                                title="Reply on WhatsApp"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm4 0a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z"/><path d="M9 14s1.5 2 3 2 3-2 3-2"/></svg>
                                                            </a>
                                                            <a 
                                                                href={`mailto:${q.email}?subject=RE: ${q.subject}&body=Hi ${q.name},%0D%0A%0D%0ARegarding your message: "${q.message}"%0D%0A%0D%0A`}
                                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                                                                title="Reply via Email"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                                            </a>
                                                            <button 
                                                                onClick={() => setConfirmDelete({ isOpen: true, queryId: q._id })}
                                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                                title="Delete Inquiry"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">No inquiries found yet.</td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <ConfirmModal
                    isOpen={confirmDelete.isOpen}
                    onClose={() => setConfirmDelete({ isOpen: false, queryId: null })}
                    onConfirm={() => handleDelete(confirmDelete.queryId)}
                    title="Delete Inquiry?"
                    message="Are you sure you want to permanently delete this customer message? This action is irreversible."
                    confirmText="Delete"
                    variant="danger"
                />
            </div>
        </div>
    );
};

export default AdminQueries;
