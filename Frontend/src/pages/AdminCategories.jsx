import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const AdminCategories = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, categoryId: null });
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('list');

    const [formData, setFormData] = useState({
        CategoryName: '',
        CategoryDescription: '',
        categoryType: '',
        CategoryImage: null,
        isActive: true
    });

    const [editingCategory, setEditingCategory] = useState(null);

    const categoryTypes = [
        'Creatine', 'Protein', 'Fat Burner', 'Pre-Workout', 'Post Workout',
        'Mass-gainer', 'EAA', 'BCAA', 'Vitamin', 'Collagen', 'Fish Oil'
    ];

    useEffect(() => {
        if (!isAdmin) navigate('/');
        loadCategories();
    }, [isAdmin]);

    const loadCategories = async () => {
        try {
            const response = await apiService.getCategories();
            const categoryData = response.data || (Array.isArray(response) ? response : []);
            setCategories(categoryData);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            CategoryImage: e.target.files[0]
        }));
    };

    const resetForm = () => {
        setFormData({
            CategoryName: '',
            CategoryDescription: '',
            categoryType: '',
            CategoryImage: null,
            isActive: true
        });
        setEditingCategory(null);
        setActiveTab('list');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingCategory) {
                await apiService.updateCategory(editingCategory._id, formData);
                showToast('Category updated successfully!', 'success');
            } else {
                await apiService.createCategory(formData);
                showToast('Category created successfully!', 'success');
            }
            resetForm();
            loadCategories();
        } catch (err) {
            console.error('Error saving category:', err);
            showToast(err.response?.data?.message || 'Failed to save category.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            CategoryName: category.CategoryName,
            CategoryDescription: category.CategoryDescription,
            categoryType: category.categoryType,
            CategoryImage: category.CategoryImage,
            isActive: category.isActive
        });
        setActiveTab('add');
    };

    const handleDelete = async (id) => {
        try {
            await apiService.deleteCategory(id);
            loadCategories();
            showToast('Category deleted successfully.', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete category.', 'error');
        }
    };

    if (!isAdmin) return null;

    const inputClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all";
    const labelClasses = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1";

    return (
        <div className="min-h-screen bg-black pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">Category <span className="text-blue-500">Taxonomy</span></h1>
                        <p className="text-gray-400">Classify and structure your product lines</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                        >
                            All Categories
                        </button>
                        <button
                            onClick={() => { resetForm(); setActiveTab('add'); }}
                            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'add' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                        >
                            {editingCategory ? 'Edit Mode' : '+ Add New'}
                        </button>
                    </div>
                </div>


                {activeTab === 'add' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 md:p-12 rounded-[2.5rem]"
                    >
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className={labelClasses}>Category Name</label>
                                    <input type="text" name="CategoryName" value={formData.CategoryName} onChange={handleChange} className={inputClasses} placeholder="e.g. Pure Protein" required />
                                </div>
                                <div>
                                    <label className={labelClasses}>System Type</label>
                                    <select name="categoryType" value={formData.categoryType} onChange={handleChange} className={`${inputClasses} text-white`} required>
                                        <option value="" className="text-black bg-white">Select Primary Type</option>
                                        {categoryTypes.map(type => <option key={type} value={type} className="text-black bg-white">{type}</option>)}
                                    </select>
                                </div>
                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-blue-500" />
                                        <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Active Category</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className={labelClasses}>Description</label>
                                    <textarea name="CategoryDescription" value={formData.CategoryDescription} onChange={handleChange} className={`${inputClasses} h-32 resize-none`} placeholder="Describe this category segment..." required />
                                </div>
                                <div>
                                    <label className={labelClasses}>Conceptual Media</label>
                                    <div className="flex items-center gap-6">
                                        {formData.CategoryImage && (
                                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 group">
                                                <img 
                                                    src={typeof formData.CategoryImage === 'string' ? formData.CategoryImage : URL.createObjectURL(formData.CategoryImage)} 
                                                    className="w-full h-full object-cover" 
                                                    alt="" 
                                                />
                                            </div>
                                        )}
                                        <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-blue-500/50 transition-colors group">
                                            <span className="text-gray-500 group-hover:text-blue-500 font-bold block mb-1 tracking-widest uppercase text-[10px]">Upload Image</span>
                                            <input type="file" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-8 flex gap-4">
                                <button type="submit" disabled={loading} className="flex-1 btn-premium py-5 bg-blue-600 rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)] disabled:opacity-50">
                                    {loading ? 'Processing Node...' : editingCategory ? 'Sync Taxonomy' : 'Deploy Category'}
                                </button>
                                {editingCategory && (
                                    <button type="button" onClick={resetForm} className="px-10 py-5 bg-white/5 rounded-2xl font-bold hover:bg-white/10 transition-all">Cancel</button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {categories.map(cat => (
                                <motion.div
                                    key={cat._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel p-6 rounded-[2.5rem] group"
                                >
                                    <div className="relative aspect-video rounded-3xl overflow-hidden mb-6">
                                        <img src={cat.CategoryImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cat.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                                                {cat.isActive ? 'Active' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-blue-500 font-black uppercase tracking-widest text-[10px] mb-2">{cat.categoryType}</p>
                                    <h3 className="text-2xl font-black text-white mb-3 tracking-tighter">{cat.CategoryName}</h3>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed mb-8">{cat.CategoryDescription}</p>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => startEdit(cat)} className="py-3 bg-white/5 rounded-2xl font-bold text-xs hover:bg-white/10 transition-all border border-white/5">Configure</button>
                                        <button onClick={() => setConfirmDelete({ isOpen: true, categoryId: cat._id })} className="py-3 bg-red-500/10 rounded-2xl font-bold text-xs text-red-400 hover:bg-red-500/20 transition-all border border-red-500/10">Archive</button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                <ConfirmModal
                    isOpen={confirmDelete.isOpen}
                    onClose={() => setConfirmDelete({ isOpen: false, categoryId: null })}
                    onConfirm={() => handleDelete(confirmDelete.categoryId)}
                    title="Delete Category?"
                    message="Are you sure you want to permanently delete this category? All associations will be severed."
                    confirmText="Delete"
                    variant="danger"
                />
            </div>
        </div>
    );
};

export default AdminCategories;
