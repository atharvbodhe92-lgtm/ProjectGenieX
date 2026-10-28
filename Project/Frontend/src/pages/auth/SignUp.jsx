import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { signUpWithEmail, signInWithGoogle } from "@/services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email format";
    if (!formData.phone.match(/^[0-9]{10}$/))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      const createdUser = await signUpWithEmail(userData, formData.password);
      dispatch(setUser(createdUser));
      navigate("/dashboard");
    } catch (err) {
      console.error("Error signing up", err);
      alert("Signup failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const userData = await signInWithGoogle();
      dispatch(setUser(userData));
      navigate("/dashboard");
    } catch (err) {
      console.error("Error signing up with Google:", err);
      alert("Failed to sign up with Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl shadow-lg bg-white rounded-xl p-8 md:p-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-2">
            Join us and get started with your project journey!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "Enter name" },
              { label: "Email Id", name: "email", type: "email", placeholder: "Enter email" },
              { label: "Password", name: "password", type: "password", placeholder: "Enter password" },
              { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Confirm password" },
              { label: "Mobile No.", name: "phone", type: "text", placeholder: "Enter 10-digit number" },
            ].map((input, i) => (
              <motion.div
                key={i}
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <label className="block text-sm text-gray-700 mb-1 font-medium">
                  {input.label}
                </label>
                <input
                  name={input.name}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm text-gray-800"
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[input.name]}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3 rounded-md transition duration-200"
            >
              Sign Up
            </motion.button>
          </div>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </motion.button>
        </div>

        <p className="text-sm mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
