import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Error states
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  // ✅ Same validation logic as your Login component
  const validateRules = (name, value) => {
    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Minimum 8 characters required";
      if (!/[A-Z]/.test(value)) return "At least one uppercase letter";
      if (!/[a-z]/.test(value)) return "At least one lowercase letter";
      if (!/[0-9]/.test(value)) return "At least one number";
      if (!/[!@#$%^&*]/.test(value))
        return "At least one special character required";
      if (/\s/.test(value)) return "No spaces allowed";
    } else if (name === "confirmPassword") {
      if (!value) return "Confirm password is required";
      if (value !== password) return "Passwords do not match";
    }
    return "";
  };

  const handleChange = (field, value) => {
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    // validate live
    setErrors((prev) => ({ ...prev, [field]: validateRules(field, value) }));

    // revalidate confirm password if password changes
    if (field === "password" && confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateRules("confirmPassword", confirmPassword),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    const newErrors = {
      password: validateRules("password", password),
      confirmPassword: validateRules("confirmPassword", confirmPassword),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/reset-password/${token}`, {
        password,
      });

      if (data.success) {
        toast.success("Password reset successful!");
        navigate("/");
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-center">Reset Password</h2>

        <div className="w-full">
          <input
            type="password"
            placeholder="New password"
            className="border p-2 rounded w-full outline-primary"
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div className="w-full">
          <input
            type="password"
            placeholder="Confirm password"
            className="border p-2 rounded w-full outline-primary"
            value={confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          disabled={loading}
          className="bg-primary text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
