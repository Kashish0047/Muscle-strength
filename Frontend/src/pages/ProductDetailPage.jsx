import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import { useToast } from '../contexts/ToastContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiService.getProductById(id);
                setProduct(response.data);
            } catch (err) {
                setError('Product not found.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || product.Stock === 0) return;
        setIsAddingToCart(true);
        try {
            await apiService.addToCart(product._id, quantity);
            window.dispatchEvent(new Event('cartUpdated'));
            setAddedToCart(true);
            showToast('Product added to cart! 🛒', 'success');
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || 'Failed to add to cart. Please ensure you are logged in.', 'error');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleAddToWishlist = async () => {
        if (!product) return;
        setIsAddingToWishlist(true);
        try {
            await apiService.addToWishlist(product._id);
        } finally {
            setIsAddingToWishlist(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-20 h-20 border-t-4 border-blue-500 rounded-full animate-spin" />
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-black text-white mb-8">PRODUCT NOT FOUND</h1>
            <Link to="/products" className="text-blue-500 font-bold border-b border-blue-500 uppercase tracking-widest">Return to Shop</Link>
        </div>
    );

    const images = product.ProductImages || [];
    const discount = product.OfferPrice ? Math.round(((product.Price - product.OfferPrice)/product.Price)*100) : 0;

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
                    {/* Product Images */}
                    <div className="space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square glass-panel rounded-[3rem] overflow-hidden relative border-white/5"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={selectedImage}
                                    src={images[selectedImage]} 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                            
                            <div className="absolute top-8 left-8 flex flex-col gap-3">
                                {product.isFeatured && (
                                    <span className="px-6 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">Recommended</span>
                                )}
                                {discount > 0 && (
                                    <span className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full">{discount}% Off</span>
                                )}
                            </div>
                        </motion.div>

                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {images.map((img, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden glass-panel border-2 transition-all ${selectedImage === i ? 'border-blue-500' : 'border-white/5'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs">
                                    {product.Brand || 'Premium Quality'}
                                </span>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">
                                {product.ProductName}
                            </h1>

                            <div className="flex items-baseline gap-6 mb-12">
                                {product.OfferPrice ? (
                                    <>
                                        <span className="text-5xl font-black text-white tracking-tighter">₹{product.OfferPrice}</span>
                                        <span className="text-2xl text-white/30 line-through font-bold">₹{product.Price}</span>
                                    </>
                                ) : (
                                    <span className="text-5xl font-black text-white tracking-tighter">₹{product.Price}</span>
                                )}
                            </div>

                            <div className="space-y-12">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="glass-panel p-6 rounded-3xl border-white/5">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Availability</p>
                                        <p className={`text-xl font-bold ${product.Stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {product.Stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </p>
                                    </div>
                                    <div className="glass-panel p-6 rounded-3xl border-white/5">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</p>
                                        <p className="text-xl font-bold text-white uppercase">{typeof product.Category === 'string' ? product.Category : product.Category?.CategoryName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center glass-panel rounded-2xl border-white/5 p-1">
                                        <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-14 h-14 flex items-center justify-center text-white text-2xl font-black">-</button>
                                        <span className="w-14 text-center font-black text-xl text-white">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity+1)} className="w-14 h-14 flex items-center justify-center text-white text-2xl font-black">+</button>
                                    </div>

                                    <button 
                                        onClick={handleAddToCart}
                                        disabled={product.Stock === 0 || isAddingToCart}
                                        className={`flex-1 h-16 rounded-2xl font-black uppercase tracking-widest transition-all ${addedToCart ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20'} text-white`}
                                    >
                                        {isAddingToCart ? 'Adding...' : addedToCart ? 'Added to Cart' : 'Add to Cart'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => {
                                            const message = `Hello! I'm interested in the ${product.ProductName} (Price: ₹${product.OfferPrice || product.Price}). Can you provide more details?`;
                                            const whatsappUrl = `https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                                            window.open(whatsappUrl, '_blank');
                                        }}
                                        className="h-16 flex items-center justify-center gap-3 bg-[#25D366] text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        WhatsApp Query
                                    </button>

                                    <button 
                                        onClick={handleAddToWishlist}
                                        className="h-16 glass-panel border border-white/5 rounded-2xl text-gray-400 font-bold uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all text-xs"
                                    >
                                        Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Information Tabs */}
                <div className="mt-32">
                    <div className="flex gap-8 border-b border-white/5 mb-12 overflow-x-auto scrollbar-hide">
                        {['description', 'ingredients', 'nutrition', 'benefits'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-6 text-xs font-bold uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-blue-500' : 'text-gray-500 hover:text-white'}`}
                            >
                                {tab}
                                {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-panel p-12 rounded-[3rem] border-white/5"
                        >
                            {activeTab === 'description' && (
                                <p className="text-gray-400 text-lg leading-loose max-w-4xl">{product.Description}</p>
                            )}
                            {activeTab === 'ingredients' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(product.Ingredients ? product.Ingredients.split(',').map(i => i.trim()) : []).map((ing, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            <span className="text-white font-bold">{ing}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'nutrition' && (
                                <div className="space-y-4 max-w-2xl">
                                    {typeof product.NutritionalValue === 'string' ? (
                                        <p className="text-gray-400 text-lg leading-loose">{product.NutritionalValue}</p>
                                    ) : (
                                        Object.entries(product.NutritionalValue || {}).map(([key, val], i) => (
                                            <div key={i} className="flex justify-between items-center py-4 border-b border-white/5">
                                                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{key}</span>
                                                <span className="text-white font-bold">{val}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            {activeTab === 'benefits' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {(product.Benefits ? product.Benefits.split('\n').filter(b => b.trim()) : []).map((benefit, i) => (
                                        <div key={i} className="flex gap-6 items-start">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-500 font-bold">0{i+1}</div>
                                            <p className="text-gray-300 font-medium leading-relaxed mt-2">{benefit}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
