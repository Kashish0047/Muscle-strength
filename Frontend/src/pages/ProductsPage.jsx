import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import ProductCard from '../components/ProductCard';
import { useToast } from '../contexts/ToastContext';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { showToast } = useToast();

    // Filter states
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const searchQuery = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || '';
    const sortBy = searchParams.get('sort') || '';

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                search: searchQuery,
                category: selectedCategory,
                sort: sortBy,
            };
            const [pRes, cRes] = await Promise.all([
                apiService.getProducts(params),
                apiService.getCategories()
            ]);
            setProducts(pRes.data || []);
            setCategories(cRes.data || []);
            setTotalPages(pRes.pages || 1);
            setTotalProducts(pRes.total || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchQuery, selectedCategory, sortBy]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const updateFilters = (updates) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, val]) => val ? newParams.set(key, val) : newParams.delete(key));
        if (!updates.page) newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handleAddToCart = async (id, qty) => {
        try {
            await apiService.addToCart(id, qty);
            window.dispatchEvent(new Event('cartUpdated'));
            showToast('Product added to cart! 🛒', 'success');
        } catch (err) {
            console.error('Add to cart error:', err);
            showToast(err.response?.data?.message || 'Failed to add. Please ensure you are logged in.', 'error');
        }
    };

    const handleAddToWishlist = async (id) => {
        await apiService.addToWishlist(id);
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Context */}
                <div className="flex flex-col md:flex-row items-baseline justify-between gap-6 mb-16 border-b border-white/5 pb-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                            Our <span className="text-white/20">Store</span>
                        </h1>
                        <p className="text-blue-500 font-bold tracking-widest uppercase text-xs mt-4">Premium Supplements for Your Fitness Journey</p>
                    </motion.div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                defaultValue={searchQuery}
                                onKeyDown={(e) => e.key === 'Enter' && updateFilters({ search: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all w-64 md:w-80"
                            />
                        </div>
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-4 glass-panel rounded-2xl text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex gap-12">
                    {/* Perspective Filters - Sidebar */}
                    <aside className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:block w-full lg:w-72 bg-black/95 lg:bg-transparent p-8 lg:p-0 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-8 right-8 text-white">Close</button>
                        
                        <div className="sticky top-32 space-y-12">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Categories</h4>
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => updateFilters({ category: '' })}
                                        className={`block w-full text-left py-3 px-6 rounded-2xl font-bold transition-all ${!selectedCategory ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        All Products
                                    </button>
                                    {categories.map(c => (
                                        <button 
                                            key={c._id}
                                            onClick={() => updateFilters({ category: c._id })}
                                            className={`block w-full text-left py-3 px-6 rounded-2xl font-bold transition-all ${selectedCategory === c._id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {c.CategoryName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Sort By</h4>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => updateFilters({ sort: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                    <option value="" className="bg-black">Default</option>
                                    <option value="price-low" className="bg-black">Price: Low to High</option>
                                    <option value="price-high" className="bg-black">Price: High to Low</option>
                                    <option value="name" className="bg-black">Name: A to Z</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Discovery Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[4/6] bg-white/5 rounded-[2rem] animate-pulse" />)}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                                    <AnimatePresence>
                                        {products.map((p, i) => (
                                            <motion.div
                                                key={p._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <ProductCard 
                                                    product={p} 
                                                    onAddToCart={handleAddToCart} 
                                                    onAddToWishlist={handleAddToWishlist} 
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Intelligent Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-20 flex justify-center gap-4">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => updateFilters({ page: (i + 1).toString() })}
                                                className={`w-14 h-14 rounded-2xl font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 glass-panel rounded-[3rem] border-white/5">
                                <p className="text-gray-500 font-black uppercase tracking-[0.5em] mb-4">No Products Found</p>
                                <p className="text-white text-lg font-medium">Refine your search parameters.</p>
                                <button onClick={() => updateFilters({ search: '', category: '', sort: '' })} className="mt-8 text-blue-500 font-bold underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
