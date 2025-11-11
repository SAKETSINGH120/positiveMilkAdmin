import React from 'react'
import { motion } from 'motion/react'

const steps = [
    { title: 'Register', desc: 'Sign up and verify your shop.' },
    { title: 'Add Products', desc: 'List your products with images.' },
    { title: 'Start Selling', desc: 'Receive orders and manage them effortlessly.' },
]

function HowItWorks() {
    return (
        <section className="py-20 bg-green-50" id="how-it-works">
            <div className="max-w-5xl mx-auto px-6">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    How It Works
                </motion.h2>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-1 bg-green-200 rounded-lg hidden sm:block" />

                    {/* Steps */}
                    <div className="space-y-12 pl-0 sm:pl-16">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="relative bg-white shadow-md rounded-xl p-6 border-l-4 border-green-600 sm:ml-0"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                {/* Circle Indicator */}
                                <div className="absolute -left-[36px] top-6 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold shadow">
                                    {index + 1}
                                </div>

                                <h3 className="text-xl font-semibold text-green-800 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
