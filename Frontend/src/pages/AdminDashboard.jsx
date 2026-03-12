import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });

  useEffect(() => {
    if (!isAdmin) navigate('/');
    fetchStats();
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, products: prodRes.total || prodRes.data?.length || 0 }));
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const adminCards = [
    {
      title: 'Product Catalog',
      desc: 'Architect your inventory and inventory levels',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      link: '/admin/products',
      color: 'blue',
    },
    {
      title: 'Order Logistics',
      desc: 'Track and fulfill customer commitments',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      link: '/admin/orders',
      color: 'green',
    },
    {
      title: 'User Entities',
      desc: 'Govern access and user configurations',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      link: '/admin/users',
      color: 'purple',
    },
    {
      title: 'Taxonomy',
      desc: 'Manage product categorization and structure',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
      link: '/admin/categories',
      color: 'orange',
    },
    {
      title: 'Performance',
      desc: 'Analyze throughput and conversion metrics',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      link: '/admin/analytics',
      color: 'red',
    },
    {
      title: 'Customer Inquiries',
      desc: 'Respond to messages and handle customer support',
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
      link: '/admin/queries',
      color: 'emerald',
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Central Command</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Control <br/><span className="text-white/20">Panel</span>
            </h1>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-5 glass-panel px-8 py-5 rounded-[2rem]">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              {user?.displayName?.[0] || 'A'}
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">{user?.displayName || 'Administrator'}</p>
              <p className="text-gray-500 text-sm mt-1">System Status: <span className="text-green-500 font-bold">Operational</span></p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Active Inventory', val: stats.products, color: 'blue' },
            { label: 'Total Shipments', val: stats.orders, color: 'emerald' },
            { label: 'User Index', val: stats.users, color: 'purple' },
            { label: 'Gross Revenue', val: `₹${stats.revenue}`, color: 'orange' },
          ].map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-8 rounded-[2rem] border-white/5 group hover:border-white/10 transition-all"
            >
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">{s.label}</p>
              <p className="text-4xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform origin-left">{s.val}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminCards.map((c, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.4 + (i * 0.05) }}
            >
              <Link to={c.link} className="group block glass-panel p-10 rounded-[3rem] h-full border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden relative">
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${c.color}-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-${c.color}-600 group-hover:border-${c.color}-600 group-hover:text-white transition-all duration-500`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:translate-x-1 transition-transform">{c.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed group-hover:text-gray-400 transition-colors">{c.desc}</p>
                
                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Module
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-20 pt-10 border-t border-white/5 flex justify-center">
          <Link to="/" className="text-gray-500 hover:text-white font-bold tracking-widest uppercase text-xs transition-colors flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Storefront
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
