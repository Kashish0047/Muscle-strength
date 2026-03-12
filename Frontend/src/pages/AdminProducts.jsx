import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const AdminProducts = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null });
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('list');

  const [formData, setFormData] = useState({
    ProductName: '',
    Brand: '',
    Category: '',
    Price: '',
    OfferPrice: '',
    Stock: '',
    Description: '',
    Ingredients: '',
    NutritionalValue: '',
    Benefits: '',
    Usage: '',
    ProductImages: [], 
    isFeatured: false,
    isOnOffer: false,
  });

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!isAdmin) navigate('/');
    loadProducts();
    loadCategories();
  }, [isAdmin]);

  const loadProducts = async () => {
    try {
      const response = await apiService.getProducts();
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

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
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      ProductImages: [...prev.ProductImages, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      ProductImages: prev.ProductImages.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      ProductName: '',
      Brand: '',
      Category: '',
      Price: '',
      OfferPrice: '',
      Stock: '',
      Description: '',
      Ingredients: '',
      NutritionalValue: '',
      Benefits: '',
      Usage: '',
      ProductImages: [],
      isFeatured: false,
      isOnOffer: false,
    });
    setEditingProduct(null);
    setActiveTab('list');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        await apiService.updateProduct(editingProduct._id, formData);
        showToast('Product updated successfully!', 'success');
      } else {
        await apiService.createProduct(formData);
        showToast('Product created successfully!', 'success');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      showToast(err.response?.data?.message || 'Failed to save product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      Category: product.Category?._id || product.Category,
      ProductImages: product.ProductImages || [],
      OfferPrice: product.OfferPrice || '',
    });
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteProduct(id);
      loadProducts();
      showToast('Product deleted successfully.', 'success');
    } catch (err) {
      showToast('Failed to delete product.', 'error');
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
            <h1 className="text-4xl font-extrabold text-white mb-2">Inventory <span className="text-blue-500">Control</span></h1>
            <p className="text-gray-400">Manage your premium supplement catalog</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              All Products
            </button>
            <button 
              onClick={() => { resetForm(); setActiveTab('add'); }}
              className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'add' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              {editingProduct ? 'Edit Mode' : '+ Add New'}
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
                  <label className={labelClasses}>Product Name</label>
                  <input type="text" name="ProductName" value={formData.ProductName} onChange={handleChange} className={inputClasses} placeholder="e.g. Whey Protein Isolate" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Brand</label>
                    <input type="text" name="Brand" value={formData.Brand} onChange={handleChange} className={inputClasses} placeholder="Muscle Strength" required />
                  </div>
                  <div>
                    <label className={labelClasses}>Category</label>
                    <select name="Category" value={formData.Category} onChange={handleChange} className={`${inputClasses} text-white`} required>
                      <option value="" className="text-black bg-white">Select Category</option>
                      {categories.map(cat => <option key={cat._id} value={cat._id} className="text-black bg-white">{cat.CategoryName}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClasses}>Price</label>
                    <input type="number" name="Price" value={formData.Price} onChange={handleChange} className={inputClasses} placeholder="0" required />
                  </div>
                  <div>
                    <label className={labelClasses}>Offer Price</label>
                    <input type="number" name="OfferPrice" value={formData.OfferPrice} onChange={handleChange} className={inputClasses} placeholder="0" />
                  </div>
                  <div>
                    <label className={labelClasses}>Stock</label>
                    <input type="number" name="Stock" value={formData.Stock} onChange={handleChange} className={inputClasses} placeholder="0" required />
                  </div>
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-blue-500" />
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Featured Product</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="isOnOffer" checked={formData.isOnOffer} onChange={handleChange} className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-blue-500" />
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">On Offer</span>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelClasses}>Description</label>
                  <textarea name="Description" value={formData.Description} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} placeholder="Detailed description..." required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Ingredients</label>
                    <textarea name="Ingredients" value={formData.Ingredients} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} placeholder="List of ingredients..." required />
                  </div>
                  <div>
                    <label className={labelClasses}>Nutritional Info</label>
                    <textarea name="NutritionalValue" value={formData.NutritionalValue} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} placeholder="25g Protein, 5g BCAA..." required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Benefits</label>
                    <textarea name="Benefits" value={formData.Benefits} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} placeholder="Key benefits..." required />
                  </div>
                  <div>
                    <label className={labelClasses}>Usage</label>
                    <textarea name="Usage" value={formData.Usage} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} placeholder="How to use..." required />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Visual Assets</label>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {formData.ProductImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                        <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity">Delete</button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <span className="text-2xl text-gray-500 group-hover:text-blue-500 font-light">+</span>
                      <input type="file" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-8 flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 btn-premium py-5 bg-blue-600 rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)] disabled:opacity-50">
                  {loading ? 'Processing Transaction...' : editingProduct ? 'Synchronize Changes' : 'Initialize Product'}
                </button>
                {editingProduct && (
                  <button type="button" onClick={resetForm} className="px-10 py-5 bg-white/5 rounded-2xl font-bold hover:bg-white/10 transition-all">Cancel</button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {products.map(product => (
                <motion.div 
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-5 rounded-3xl group"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                    <img src={product.ProductImages[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.isFeatured && <span className="px-2 py-1 bg-blue-600 text-[10px] font-black uppercase rounded-lg">Featured</span>}
                      {product.isOnOffer && <span className="px-2 py-1 bg-orange-600 text-[10px] font-black uppercase rounded-lg">Offer</span>}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{product.ProductName}</h3>
                  <p className="text-xs text-gray-500 mb-4 font-semibold tracking-wider uppercase">{product.Brand}</p>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-black text-white">₹{product.Price}</span>
                      {product.OfferPrice && <span className="ml-2 text-sm text-gray-500 line-through">₹{product.OfferPrice}</span>}
                    </div>
                    <span className="text-xs px-3 py-1 bg-white/5 rounded-full text-gray-400 font-bold">Qty: {product.Stock}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => startEdit(product)} className="py-3 bg-white/5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all border border-white/5">Modify</button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, productId: product._id })} className="py-3 bg-red-500/10 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/20 transition-all border border-red-500/10">Archive</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <ConfirmModal
          isOpen={confirmDelete.isOpen}
          onClose={() => setConfirmDelete({ isOpen: false, productId: null })}
          onConfirm={() => handleDelete(confirmDelete.productId)}
          title="Delete Product?"
          message="Are you sure you want to permanently delete this product? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AdminProducts;
