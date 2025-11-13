import { motion } from "motion/react";



export default function About() {
  return (
    <div id="about" className="max-w-6xl mx-auto px-6 py-16 overflow-hidden">

      {/* Header Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          About <span className="text-primary">CarRental</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Drive your dream car with ease. CarRental makes it simple, fast, and affordable
          to rent premium cars anywhere, anytime.
        </p>
      </motion.div>

      {/* Image Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="rounded-2xl overflow-hidden mb-16 flex justify-center"
      >
        <img
          src="https://t3.ftcdn.net/jpg/02/94/68/86/360_F_294688686_eBbqaZUVeRr8BoCDuhxsWl4fjwV51FcV.jpg"
          alt="About CarRental"
          className="rounded-lg shadow-lg"
        />
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid md:grid-cols-2 gap-12 mb-16"
      >
        <div className="ml-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At CarRental, our mission is to redefine the car rental experience by offering
            flexibility, transparency, and trust. Whether you're planning a weekend getaway,
            a business trip, or a city ride, we help you find the perfect car at the best price.
          </p>
        </div>
        <div className="ml-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Why Choose Us?</h2>
          <ul className="space-y-3 text-gray-600">
            <li>✅ Easy booking process with instant confirmation</li>
            <li>✅ Wide range of cars — from economy to luxury</li>
            <li>✅ Transparent pricing — no hidden charges</li>
            <li>✅ 24/7 customer support</li>
          </ul>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid sm:grid-cols-3 gap-8 text-center mb-20"
      >
        <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-lg transition">
          <h3 className="text-3xl font-bold text-primary mb-2">10+</h3>
          <p className="text-gray-600">Cars Available</p>
        </div>
        <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-lg transition">
          <h3 className="text-3xl font-bold text-primary mb-2">5+</h3>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-lg transition">
          <h3 className="text-3xl font-bold text-primary mb-2">4+</h3>
          <p className="text-gray-600">Cities Covered</p>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-center bg-primary text-white py-12 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Ready to Hit the Road?</h2>
        <p className="mb-6 text-white/90">
          Choose from our wide range of vehicles and book your ride today.
        </p>
        <a
          href="/cars"
          className="bg-white text-primary px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition"
        >
          Explore Cars
        </a>
      </motion.div>
    </div>
  );
}
