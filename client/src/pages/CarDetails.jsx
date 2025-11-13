import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";

export default function CarDetails() {

    const { id } = useParams();

    const { cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, user } = useAppContext();
    
    const navigate = useNavigate();
    const [car, setCar] = useState(null);


    // inside CarDetails component
    const loadRazorpay = (src = 'https://checkout.razorpay.com/v1/checkout.js') => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // helper: compute days between dates inclusive/exclusive as you want
    const getDaysDifference = (start, end) => {
        const msPerDay = 1000 * 60 * 60 * 24;
        const s = new Date(start);
        const e = new Date(end);
        const diff = Math.ceil((e - s) / msPerDay); // number of nights/days
        return diff > 0 ? diff : 0;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pickupDate || !returnDate) {
            toast.error('Please select pickup and return dates');
            return;
        }
        const days = getDaysDifference(pickupDate, returnDate);
        if (days <= 0) {
            toast.error('Return date must be after pickup date');
            return;
        }

        // total amount calculation (example: pricePerDay * days)
        const amount = car.pricePerDay * days;

        try {
            const ok = await loadRazorpay();
            if (!ok) {
                toast.error('Failed to load payment SDK. Try again.');
                return;
            }

            // create order on backend
            const { data } = await axios.post('/api/payment/create-order', { amount });
            if (!data.success) {
                toast.error('Could not initialize payment');
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                order_id: data.order.id,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'CarRental App',
                description: `${car.brand} ${car.model} - Booking`,
                image: car.image,
                handler: async function (response) {
                    // response => { razorpay_payment_id, razorpay_order_id, razorpay_signature }
                    try {
                        // send verification + booking details to backend
                        const bookingData = {
                            car: id,
                            pickupDate,
                            returnDate,
                            price: amount,
                        };
                        const verifyRes = await axios.post('/api/payment/verify-payment', {
                            ...response,
                            bookingData,
                        });

                        if (verifyRes.data.success) {
                            toast.success('Payment successful and booking confirmed');
                            navigate('/my-bookings');
                        } else {
                            toast.error(verifyRes.data.message || 'Payment verification failed');
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error('Payment verification error');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },
                theme: {
                    color: '#0d6efd',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                // optional: handle failure
                toast.error('Payment failed. Please try again.');
                console.error(response.error);
            });

            rzp.open();
        } catch (error) {
            console.error(error);
            toast.error('Payment error: ' + error.message);
        }
    };



    const currency = import.meta.env.VITE_CURRENCY;
    useEffect(() => {
        setCar(cars.find(car => car._id === id))
    }, [cars, id])

    return car ? (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer">
                <img src={assets.arrow_icon} alt="arrow" className="rotate-180 opacity-65" />
                Back to all Cars
            </button>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }} className="lg:col-span-2">
                    <motion.img
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }} src={car.image} alt="car" className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md" />
                    <motion.div className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div>
                            <h1 className="text-3xl font-bold">{car.brand} {car.model}</h1>
                            <p className="text-gray-500 text-lg">{car.category} &bull; {car.year}</p>
                        </div>
                        <hr className="border-borderColor my-6" />

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                                { icon: assets.fuel_icon, text: car.fuel_type },
                                { icon: assets.car_icon, text: car.transmission },
                                { icon: assets.location_icon, text: car.location },

                            ].map(({ icon, text }, index) => (
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.4 }} key={index} className="flex flex-col items-center bg-light p-4 rounded-lg">
                                    <img src={icon} alt="" className="h-5 mb-2" />
                                    <p>{text}</p>
                                </motion.div>

                            ))}
                        </div>

                        <div>
                            <h1 className="text-xl font-medium mb-3">Description</h1>
                            <p className="text-gray-500">{car.description}</p>
                        </div>

                        <div>
                            <h1 className="text-xl font-medium mb-3">Features</h1>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {
                                    ["360 camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                                        <li key={item} className="flex items-center text-gray-500">
                                            <img src={assets.check_icon} alt="" className="h-4 mr-2" />
                                            {item}
                                        </li>
                                    ))
                                }

                            </ul>
                        </div>

                    </motion.div>
                </motion.div>

                <motion.form
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }} onSubmit={handleSubmit} className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500">

                    <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">{currency} {car.pricePerDay} <span className="text-base text-gray-400">per day</span></p>

                    <hr className="border-borderColor my-6" />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="pickup-date">Pickup Date</label>
                        <input type="date" className="border border-borderColor px-3 py-2 rounded-lg" required id="pickup-date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />

                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="return-date">Return Date</label>
                        <input type="date" className="border border-borderColor px-3 py-2 rounded-lg" required id="return-date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={pickupDate || new Date().toISOString().split('T')[0]} />
                    </div>

                    <button className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer">Book Now</button>

                    <p className="text-center text-sm">No credit card required to reserve</p>


                </motion.form>
            </div>


        </div>
    ) : <Loader />
}