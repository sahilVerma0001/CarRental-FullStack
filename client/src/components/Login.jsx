import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ForgotPassword from "./ForgotPassword";


export default function Login() {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);


  // Error states
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation function
  const validateRules = (name, value) => {
    if (name === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value))
        return "Invalid email format";
      if ((value.match(/@/g) || []).length !== 1)
        return "Only one @ allowed";
      if (/\s/.test(value)) return "No spaces allowed";
      if (/[@.]{2,}/.test(value)) return "Invalid characters";
    } else if (name === "password") {
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

  // Handle input change + validation
  const handleChange = (field, value) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    // live validation
    setErrors((prev) => ({ ...prev, [field]: validateRules(field, value) }));

    // revalidate confirmPassword if password changes
    if (field === "password" && confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateRules("confirmPassword", confirmPassword),
      }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Final validation before submit
    const newErrors = {
      name: state === "register" ? (name.trim() ? "" : "Name is required") : "",
      email: validateRules("email", email),
      password: validateRules("password", password),
      confirmPassword:
        state === "register" ? validateRules("confirmPassword", confirmPassword) : "",
    };

    setErrors(newErrors);

    // Stop if any validation error exists
    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (state === "register") {
        if (data.success) {
          setShowLogin(false);
          navigate("/verify-otp"); // or navigate("/verify-otp") if you want
          localStorage.setItem("verifyEmail", email);
          toast.success("Please verify your email.");
        } else {
          toast.error(data.message);
        }
        return;
      }


      // ✅ REGISTER FLOW
      // if (state === "register") {
      //   if (data.success) {
      //     toast.success("OTP sent to your email. Please verify.");
      //     setShowLogin(false); // close login modal
      //     localStorage.setItem("verifyEmail", email);
      //     navigate("/verify-otp");

      //   } else {
      //     toast.error(data.message);
      //   }
      //   return;
      // }

      // ✅ LOGIN FLOW
      if (state === "login") {
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
          toast.success("Logged in successfully!");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => handleChange("name", e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => handleChange("email", e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => handleChange("password", e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {state === "register" && (
          <div className="w-full">
            <p>Confirm Password</p>
            <input
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              value={confirmPassword}
              placeholder="re-enter password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="password"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        {state === "login" && (
          <div>
            <p
              onClick={() => setShowForgot(true)}
              className="text-primary text-sm cursor-pointer ml-auto hover:underline"
            >
              Forgot Password?
            </p>
          </div>
        )}


        <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>

      {showForgot && <ForgotPassword onClose={() => setShowForgot(false)} />}

    </div>
  );
}
