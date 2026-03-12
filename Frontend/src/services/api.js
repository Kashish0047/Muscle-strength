import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    console.log('Current user in API:', currentUser);
    console.log('User email:', currentUser?.email);
    
    if (currentUser) {
      const token = await currentUser.getIdToken();
      console.log('Token generated:', token ? 'Yes' : 'No');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No current user found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Response:', error.response?.data);
    console.error('API Error Status:', error.response?.status);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  // Products
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  getOfferProducts: async () => {
    const response = await api.get('/products/offers');
    return response.data;
  },

  getBestSellingProducts: async () => {
    const response = await api.get('/products/bestsellers');
    return response.data;
  },

  getProductsByCategory: async (categoryType) => {
    const response = await api.get(`/products/category/${categoryType}`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Admin Products
  createProduct: async (productData) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key === 'ProductImages') {
        // Handle file uploads
        productData[key].forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`ProductImages`, file);
          } else if (typeof file === 'string' && file) {
            formData.append(`imageUrls`, file);
          }
        });
      } else if (key !== '_id' && key !== '__v') {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key === 'ProductImages') {
        // Handle file uploads
        productData[key].forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`ProductImages`, file);
          } else if (typeof file === 'string' && file) {
            formData.append(`imageUrls`, file);
          }
        });
      } else if (key !== '_id' && key !== '__v') {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryTypes: async () => {
    const response = await api.get('/categories/types');
    return response.data;
  },

  getCategoryByType: async (type) => {
    const response = await api.get(`/categories/type/${type}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const formData = new FormData();
    Object.keys(categoryData).forEach(key => {
      if (key === 'CategoryImage' && categoryData[key] instanceof File) {
        formData.append('CategoryImage', categoryData[key]);
      } else if (key !== '_id' && key !== '__v') {
        formData.append(key, categoryData[key]);
      }
    });

    const response = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const formData = new FormData();
    Object.keys(categoryData).forEach(key => {
      if (key === 'CategoryImage' && categoryData[key] instanceof File) {
        formData.append('CategoryImage', categoryData[key]);
      } else if (key !== '_id' && key !== '__v') {
        formData.append(key, categoryData[key]);
      }
    });

    const response = await api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  getCartSummary: async () => {
    const response = await api.get('/cart/summary');
    return response.data;
  },

  // Wishlist
  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post('/users/wishlist', { productId });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/users/wishlist/${productId}`);
    return response.data;
  },

  // Orders
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  trackOrder: async (orderId) => {
    const response = await api.get(`/orders/track/${orderId}`);
    return response.data;
  },

  // User
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Payment
  createPaymentOrder: async (paymentData) => {
    const response = await api.post('/payment/create-order', paymentData);
    return response.data;
  },

  verifyPayment: async (verificationData) => {
    const response = await api.post('/payment/verify', verificationData);
    return response.data;
  },

  // Contact
  submitContactForm: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  getContactInquiries: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  updateInquiryStatus: async (id, status) => {
    const response = await api.put(`/contact/${id}`, { status });
    return response.data;
  },

  deleteInquiry: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  // Health Check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default apiService;
