// import dotenv from "dotenv";
// dotenv.config();
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Images
import img1 from "../assets/img1.png";
import img3 from "../assets/img3.png";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL,'_________>api url')

/* ---------------- Image Slideshow ---------------- */
function ImageSlideshow({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 3500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
          }`}
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-8" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Login Component ---------------- */
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ✅ BACKEND LOGIC (UNCHANGED) */
  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: email.toLowerCase().trim(), // ✅ keep normalization
        password,
      });

      // ✅ KEEP THIS LOGIC
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user_type", user.user_type);

      toast.success("Welcome back 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed-");
    } finally {
      setLoading(false);
    }
  };

  const images = [img1, img3];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="diagonalGrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="60" stroke="#e5e7eb" />
              <line x1="0" y1="0" x2="60" y2="0" stroke="#e5e7eb" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalGrid)" />
        </svg>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left */}
          <div className="lg:w-1/2 bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 m-6 rounded-3xl p-8 flex items-center justify-center">
            <div className="w-full max-w-md">
              <ImageSlideshow images={images} />
            </div>
          </div>

          {/* Right */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto space-y-6">
              <h1 className="text-3xl font-bold">Sign In</h1>
              <p className="text-gray-600">Welcome back! Please enter your details.</p>

              <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div>
                  <Label>Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      className="h-12 pl-11"
                      required
                    />

                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label>Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="h-12 pl-11 pr-11"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-blue-600">
                    Forgot password?
                  </Link>
                </div>

                <Button disabled={loading} className="w-full h-12">
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <p className="text-sm text-center">
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-blue-600 font-semibold">
                    Create account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
