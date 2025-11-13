// src/components/ForgotPassword.jsx
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function ForgotPassword({ onClose }) {
  const { axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/forgot-password", { email });
      if (data.success) {
        toast.success("Reset link sent to your email!");
        onClose(); // close popup
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center z-50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-80 flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-center">Forgot Password</h2>
        <p className="text-sm text-gray-600 text-center">
          Enter your email address, and we’ll send you a reset link.
        </p>
        <input
          type="email"
          className="border p-2 rounded outline-primary"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-primary text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
