import { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

export default function Navbar() {
    const { setShowLogin, user, logout, isOwner, setIsOwner, axios } = useAppContext();
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const changeRole = async () => {
        try {
            const { data } = await axios.post('/api/owner/change-role');
            if (data.success) {
                setIsOwner(true);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleAboutClick = (e) => {
        e.preventDefault();
        setOpen(false); // close mobile menu
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const section = document.getElementById('about');
                section?.scrollIntoView({ behavior: 'smooth' });
            }, 600);
        } else {
            const section = document.getElementById('about');
            section?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === '/' && 'bg-light'
                }`}
        >
            {/* Logo */}
            <Link to="/">
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={assets.logo}
                    alt="logo"
                    className="h-8"
                />
            </Link>

            {/* Menu Links */}
            <div
                className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row sm:iteams-center sm:justify-end gap-6 sm:gap-8 max-sm:p-6 transition-all duration-300 z-50 ${location.pathname === '/' ? 'bg-light' : 'bg-white'} ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}`}
            >
                {menuLinks.map((link, index) =>
                    link.name === 'About Us' ? (
                        <a
                            key={index}
                            href="#about"
                            onClick={handleAboutClick}
                            className="mt-1.5 cursor-pointer hover:text-primary transition"
                        >
                            {link.name}
                        </a>
                    ) : (
                        <Link
                            key={index}
                            className="mt-1.5 hover:text-primary transition"
                            to={link.path}
                            onClick={() => setOpen(false)} // close mobile menu on click
                        >
                            {link.name}
                        </Link>
                    )
                )}

                {/* Right-side buttons */}
                <div className="flex max-sm:flex-col sm:flex-row items-start sm:items-center gap-6">
                    {isOwner && <button
                        onClick={() => navigate('/owner')}
                        className="cursor-pointer pb-1 hover:text-primary transition"
                    >
                        Dashboard
                    </button>}


                    <button
                        onClick={() => {
                            user ? logout() : setShowLogin(true);
                        }}
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
                    >
                        {user ? 'Logout' : 'Login'}
                    </button>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
                <button
                    className="cursor-pointer"
                    aria-label="Menu"
                    onClick={() => setOpen(!open)}
                >
                    <img
                        src={open ? assets.close_icon : assets.menu_icon}
                        alt="menu"
                    />
                </button>
            </div>
        </motion.div>
    );
}
