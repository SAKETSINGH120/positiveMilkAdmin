// import React from 'react';
// import { motion } from 'framer-motion';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import { EffectCoverflow, Autoplay } from 'swiper/modules';

// const slides = [
//     '/images/img1.jpg',
//     '/images/img2.jpg',
//     '/images/img3.jpg',
//     '/images/img4.jpg',
//     '/images/img5.jpg',
//     '/images/img6.jpg'
// ];

// function Hero() {
//     return (
//         <section id="home" className="relative overflow-hidden">
//             {/* Animated Background Elements */}
//             <div className="absolute inset-0 z-0">
//                 <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-green-900/80"></div>
//                 <div className="absolute bottom-0 left-0 right-0 h-24 bg-green-50/10 backdrop-blur-sm"></div>
//                 {/* Animated SVG Pattern */}
//                 <motion.svg
//                     viewBox="0 0 100 100"
//                     className="absolute top-0 left-0 w-full opacity-10"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
//                 >
//                     <circle cx="50" cy="50" r="45" stroke="#fff" strokeWidth="2" fill="none" />
//                     <path
//                         d="M50 5 L55 45 L95 50 L55 55 L50 95 L45 55 L5 50 L45 45 Z"
//                         fill="none"
//                         stroke="#fff"
//                         strokeWidth="1"
//                     />
//                 </motion.svg>
//             </div>

//             <div className="max-w-7xl mx-auto px-4 py-28 relative z-10">
//                 <div className="grid lg:grid-cols-2 gap-12 items-center">
//                     {/* Text Content */}
//                     <motion.div
//                         initial={{ opacity: 0, x: -50 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.8 }}
//                     >
//                         <div className="text-center lg:text-left">
//                             <motion.h1
//                                 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
//                                 initial={{ y: 30, opacity: 0 }}
//                                 animate={{ y: 0, opacity: 1 }}
//                                 transition={{ delay: 0.2 }}
//                             >
//                                 Craving Something?
//                                 <span className="block bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">
//                                     Get It Delivered Hot!
//                                 </span>
//                             </motion.h1>
//                             <motion.p
//                                 className="text-xl text-green-100 mb-8 max-w-xl mx-auto lg:mx-0"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ delay: 0.4 }}
//                             >
//                                 Order from top restaurants near you. Fast delivery, exciting deals, and food that hits the spot—every single time!
//                             </motion.p>
//                             <motion.div
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{ type: 'spring', delay: 0.6 }}
//                             >
//                                 <a
//                                     href="https://play.google.com/store/apps/details?id=positiveMilk.com.users&pcampaignid=web_share"
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className='cursor-pointer'
//                                 >
//                                     <button className="bg-green-400 hover:bg-green-300 text-green-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//                                         Order Now
//                                         <span className="ml-3">🍔</span>
//                                     </button>
//                                 </a>
//                             </motion.div>
//                         </div>
//                     </motion.div>

//                     {/* Image Carousel */}
//                     <motion.div
//                         className="relative"
//                         initial={{ opacity: 0, x: 50 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.8 }}
//                     >
//                         <div className="absolute inset-0 bg-green-400/20 rounded-3xl shadow-2xl -rotate-3"></div>
//                         <div className="relative rotate-3">
//                             <Swiper
//                                 effect="coverflow"
//                                 grabCursor={true}
//                                 centeredSlides={true}
//                                 slidesPerView="auto"
//                                 coverflowEffect={{
//                                     rotate: 0,
//                                     stretch: 0,
//                                     depth: 100,
//                                     modifier: 2.5,
//                                     slideShadows: true,
//                                 }}
//                                 autoplay={{ delay: 3000 }}
//                                 loop={true}
//                                 modules={[EffectCoverflow, Autoplay]}
//                                 className="swiper-container"
//                             >
//                                 {slides.map((src, index) => (
//                                     <SwiperSlide key={index} className="max-w-md rounded-2xl overflow-hidden">
//                                         <div className="relative group">
//                                             <img
//                                                 src={src}
//                                                 alt={`Slide ${index}`}
//                                                 className="w-full h-96 object-cover transform group-hover:scale-105 transition duration-500"
//                                             />
//                                             <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
//                                         </div>
//                                     </SwiperSlide>
//                                 ))}
//                             </Swiper>
//                         </div>
//                     </motion.div>
//                 </div>
//             </div>

//             {/* Animated Scroll Indicator */}
//             <motion.div
//                 className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
//                 animate={{ y: [0, 20, 0] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//             >
//                 <div className="w-8 h-14 rounded-3xl border-2 border-green-300 flex justify-center p-1">
//                     <div className="w-2 h-2 bg-green-300 rounded-full"></div>
//                 </div>
//             </motion.div>
//         </section>
//     );
// }

// export default Hero;

import React from "react";

const Hero = () => {
  return <div>logout</div>;
};

export default Hero;
