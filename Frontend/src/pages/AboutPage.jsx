import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15 } }),
};

const AboutPage = () => {
  const stats = [
    { value: '500+', label: 'Premium Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { value: '50K+', label: 'Happy Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { value: '100+', label: 'Trusted Brands', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { value: '4.9★', label: 'Average Rating', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'Every product on Muscle Strength undergoes rigorous quality checks and is sourced from certified manufacturers to ensure you get nothing but the best.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: 'blue',
    },
    {
      title: 'Transparency',
      description: 'We believe in complete transparency — from ingredient lists and lab reports to honest pricing. No hidden charges, no compromises.',
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      color: 'green',
    },
    {
      title: 'Customer Obsession',
      description: 'Your fitness journey is our mission. From personalised recommendations to lightning-fast support, we put you at the centre of everything.',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: 'red',
    },
    {
      title: 'Innovation',
      description: 'We continuously explore new formulations, trending ingredients, and the latest sports nutrition science to bring you cutting-edge products.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'yellow',
    },
  ];

  const reasons = [
    { title: '100% Authentic', desc: 'Every product is genuine and verified. We source directly from brands and authorised distributors.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Lab Tested', desc: 'Products undergo third-party lab testing for purity, potency, and safety — no banned substances, ever.', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { title: 'Best Prices', desc: 'Competitive pricing with regular offers. Our direct brand partnerships let us pass the savings to you.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Free Shipping', desc: 'Enjoy free, fast delivery on every single order — no minimum spend required.', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { title: 'Expert Guidance', desc: 'Our in-house nutritionists and fitness experts curate product selections and create helpful guides.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { title: 'Easy Returns', desc: '30-day hassle-free return policy. Not satisfied? We Will make it right, no questions asked.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/10 text-green-400 border-green-500/30',
      red: 'bg-red-500/10 text-red-400 border-red-500/30',
      yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10 text-center py-32">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Our Story
            </span>
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
            Fuel Your Body. <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Elevate</span> Your Game.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-400"
          >
            Muscle Strength Nutrition is India's trusted destination for premium sports nutrition, wellness supplements, and fitness essentials — delivered right to your door.
          </motion.p>
          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/products" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-2xl shadow-blue-500/30">
              Shop Now
            </Link>
            <a href="#story" className="px-8 py-4 bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl font-bold transition-all duration-300">
              Our Journey
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                variants={fadeUp}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-blue-500/12">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-gray-800 bg-gray-900">
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 rounded-3xl mb-6 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">Muscle Strength</p>
                  <p className="text-sm text-gray-500">Premium Nutrition Since 2020</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl -z-10 bg-blue-500/10" />
            </motion.div>

            <div>
              <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-orange-500/15 text-orange-400 border border-orange-500/30"
              >
                Who We Are
              </motion.span>
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                variants={fadeUp}
                className="text-3xl md:text-4xl font-extrabold text-white mb-6"
              >
                Born From Passion, <br />Built for Performance
              </motion.h2>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp} className="space-y-4 text-base leading-relaxed text-gray-400">
                <p>
                  Muscle Strength was founded in 2020 by a team of fitness enthusiasts and nutritionists who were tired of the misinformation, overpriced products, and lack of authenticity in India's supplement market.
                </p>
                <p>
                  What started as a small curated store has grown into one of India's most trusted nutrition e-commerce platforms — serving over 50,000 customers across the country with 500+ premium, lab-tested products.
                </p>
                <p>
                  Our mission is simple: <strong className="text-white">make world-class nutrition accessible, affordable, and trustworthy for every Indian fitness enthusiast.</strong>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">What Drives Us</h2>
            <p className="max-w-xl mx-auto text-gray-500">Our core values shape every decision we make — from the products we stock to how we serve you.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
                variants={fadeUp}
                className="rounded-2xl p-6 border border-gray-800 bg-black transition-all duration-300 hover:-translate-y-2 hover:border-gray-700"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${getColorClasses(v.color)}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-orange-500/15 text-orange-400 border border-orange-500/30">
              Why Muscle Strength
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Why Customers Choose Us</h2>
            <p className="max-w-xl mx-auto text-gray-500">We go above and beyond to ensure you have the best experience — here's what sets us apart.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
                variants={fadeUp}
                className="flex gap-4 rounded-2xl p-6 border border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-gray-700"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/12">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={r.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center rounded-3xl p-10 md:p-16 border border-gray-800 bg-gray-900/50"
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Transform Your Fitness?</h2>
            <p className="text-lg mb-10 max-w-xl mx-auto text-gray-500">
              Join 50,000+ customers who trust Muscle Strength for their nutrition needs. Start your journey today with premium, lab-tested supplements.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/products" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-2xl shadow-blue-500/30 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Shop Products
              </Link>
              <Link to="/track-order" className="px-8 py-4 bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl font-bold transition-all duration-300">
                Track an Order
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
