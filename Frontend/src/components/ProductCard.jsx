import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      await onAddToCart(product._id, 1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onAddToWishlist(product._id);
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  const discountPercentage = product.OfferPrice 
    ? Math.round(((product.Price - product.OfferPrice) / product.Price) * 100)
    : 0;

  return (
    <motion.div
      layout
      className="group relative h-full flex flex-col glass-panel rounded-[2rem] overflow-hidden border-white/5 hover:border-blue-500/30 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <Link to={`/products/${product._id}`} className="block h-full">
          {product.ProductImages && product.ProductImages.length > 0 ? (
            <motion.img
              src={product.ProductImages[0]}
              alt={product.ProductName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-white/10 uppercase tracking-widest">
              No Visual
            </div>
          )}
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">
              Featured
            </span>
          )}
          {product.isOnOffer && discountPercentage > 0 && (
            <span className="px-4 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Direct Actions Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
            >
              <div className="flex gap-4 pointer-events-auto">
                <button
                  onClick={handleWishlist}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isInWishlist ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white text-black hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const message = `Hello! I'm interested in the ${product.ProductName} (Price: ₹${product.OfferPrice || product.Price}). Can you provide more details?`;
                    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </button>
                <Link
                  to={`/products/${product._id}`}
                  className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <div className="p-8 flex flex-col flex-1">
        <div className="mb-4">
          <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
            {product.Brand || 'Premium Nutrition'}
          </p>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-xl font-black text-white leading-tight tracking-tighter group-hover:text-blue-400 transition-colors">
              {product.ProductName}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">
            {typeof product.Category === 'string' ? product.Category : product.Category?.CategoryName || 'General'}
          </span>
          {product.Stock > 0 ? (
            <span className="text-[10px] font-black uppercase tracking-widest text-green-500">In Stock</span>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Out of Stock</span>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            {product.OfferPrice && product.OfferPrice < product.Price ? (
              <>
                <span className="text-2xl font-black text-white tracking-tighter">₹{product.OfferPrice}</span>
                <span className="text-sm text-gray-500 line-through font-bold">₹{product.Price}</span>
              </>
            ) : (
              <span className="text-2xl font-black text-white tracking-tighter">₹{product.Price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.Stock === 0}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              product.Stock === 0 
                ? 'bg-white/5 text-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 shadow-lg shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isAddingToCart ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C0 5.79 2.23 4 5 4h14" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
