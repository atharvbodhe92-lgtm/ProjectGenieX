import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { loginWithEmail, signInWithGoogle } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Email validation regex
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      const userData = await loginWithEmail(email, password);
      dispatch(setUser(userData));
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const userData = await signInWithGoogle();
      dispatch(setUser(userData));
      navigate("/dashboard");
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="font-[sans-serif]">
      <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">

        {
          !isAuthenticated && (
            <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
              <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="mb-8">
                    <h3 className="text-gray-800 text-3xl font-bold">Sign in</h3>
                    <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                      Sign in to your account and explore a world of possibilities. Your journey begins here.
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-sm text-gray-800 border border-gray-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Password</label>
                    <input
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full text-sm text-gray-800 border border-gray-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                      placeholder="Enter password"
                    />
                  </div>

                  {/* Display Error Message */}
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link to={"/forgot-password"} className="text-blue-600 hover:underline font-semibold">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div className="!mt-8">
                    <button
                      type="submit"
                      className="w-full block text-center shadow-xl py-2.5 px-4 text-md tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Sign in
                    </button>
                  </div>

                  <div className="relative !mt-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="!mt-6">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
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
                    </button>
                  </div>

                  <p className="text-sm !mt-8 text-center text-gray-500">
                    Don't have an account?{" "}
                      <Link to={"/sign-up"} className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">
                      Register here
                    </Link>
                  </p>
                </form>
              </div>

              <div className="max-md:mt-8">
                <img
                  src="https://readymadeui.com/login-image.webp"
                  className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
                  alt="Dining Experience"
                />
              </div>
            </div>
          )
        }
        {
          isAuthenticated && (
            <div className="font-bold text-5xl">Already Logged In, Go to Dashboard</div>

          )
        }

      </div>
    </div>
  );
};

export default Login;
