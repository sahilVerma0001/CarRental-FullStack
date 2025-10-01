import { assets } from "../assets/assets";
import { motion } from "motion/react";

export default function Footer() {
    return (
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }} className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>

                <motion.div initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }} >

                    <motion.img initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }} src={assets.logo} alt="logo" className='h-8 md:h-9' />

                    <motion.p initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }} className='max-w-80 mt-3'>
                        Premium car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }} className='flex items-center gap-3 mt-6'>
                        <a href="#"><img src={assets.facebook_logo} alt="" className="w-5 h-5" /></a>
                        <a href="#"><img src={assets.instagram_logo} alt="" className="w-5 h-5" /></a>
                        <a href="#"><img src={assets.twitter_logo} alt="" className="w-5 h-5" /></a>
                        <a href="#"><img src={assets.gmail_logo} alt="" className="w-5 h-5" /></a>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap justify-between w-1/2 gap-8">
                    <div>
                        <h2 className='text-base font-medium uppercase text-gray-800'>Quick Links</h2>
                        <ul className='mt-3 flex flex-col gap-1.5'>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Browse Cars</a></li>
                            <li><a href="#">List Your Car</a></li>
                            <li><a href="#">About</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className='text-base font-medium uppercase text-gray-800'>Resources</h2>
                        <ul className='mt-3 flex flex-col gap-1.5'>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Insurance</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className='text-base font-medium uppercase text-gray-800'>Contact</h2>
                        <ul className='mt-3 flex flex-col gap-1.5'>
                            <li><a href="#">1234 luxury drive </a></li>
                            <li><a href="#">los wegas ca 23982</a></li>
                            <li><a href="#">+1 2389283892</a></li>
                            <li><a href="#">info11@gmail.com</a></li>
                        </ul>
                    </div>

                </motion.div>

            </div>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }} className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} CarRental. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li>|</li>
                    <li><a href="#">Terms</a></li>
                    <li>|</li>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </motion.div>
        </motion.div>
    )
}