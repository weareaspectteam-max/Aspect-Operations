import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Camera } from "lucide-react";
import { motion } from "motion/react";

// ✅ DOĞRU PATH: components -> app -> auth/auth.ts
import { login } from "../auth/auth";

const logoImage = "/logo.png";

interface LoginProps {
  onLogin: (role: "admin" | "staff", name: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password) {
      alert("Lütfen kullanıcı adı ve şifre girin");
      return;
    }

    const session = login(username.trim(), password);

    if (!session) {
      alert("Kullanıcı adı veya şifre hatalı");
      return;
    }

    onLogin(session.role, session.username);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] flex items-center justify-center p-6">
      {/* Animated Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#9dd9ea] rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#9dd9ea]/30 to-transparent blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#ffd4a3]/30 to-transparent blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Camera Lens Decorations */}
      <motion.div
        className="absolute bottom-10 left-10 opacity-20"
        animate={{ rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Camera className="w-24 h-24 text-[#9dd9ea]" strokeWidth={1} />
      </motion.div>

      <motion.div
        className="absolute top-20 right-10 opacity-10"
        animate={{ rotate: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Camera className="w-32 h-32 text-[#ffd4a3]" strokeWidth={1} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="relative inline-block mb-8"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#9dd9ea]/50 via-transparent to-[#ffd4a3]/50 scale-150" />

            <img
              src={logoImage}
              alt="Aspect Logo"
              className="relative w-72 h-auto drop-shadow-2xl scale-[2.8] translate-y-12"
            />

            <motion.div
              className="absolute inset-0 border-2 border-[#9dd9ea]/30 rounded-full"
              style={{ width: "120%", height: "120%", top: "-10%", left: "-10%" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#9dd9ea] rounded-full -translate-x-1/2" />
            </motion.div>

            <motion.div
              className="absolute inset-0 border border-[#ffd4a3]/20 rounded-full"
              style={{ width: "140%", height: "140%", top: "-20%", left: "-20%" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-[#ffd4a3] rounded-full" />
            </motion.div>
          </motion.div>

          <p className="text-sm text-gray-400 font-medium tracking-wide">
            Operasyon ve Satış Platformu
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#9dd9ea]/5 to-[#ffd4a3]/5" />

          <div className="relative space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
                Kullanıcı Adı
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9dd9ea] to-[#ffd4a3] rounded-2xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity" />
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400 group-focus-within:text-[#9dd9ea] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="yonetici / personel"
                    className="w-full pl-12 pr-4 py-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#9dd9ea]/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
                Şifre
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9dd9ea] to-[#ffd4a3] rounded-2xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity" />
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400 group-focus-within:text-[#ffd4a3] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ffd4a3]/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              onClick={handleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-4 rounded-2xl font-bold text-white overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#9dd9ea] via-[#b8d4f1] to-[#ffd4a3] opacity-100" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#ffd4a3] via-[#9dd9ea] to-[#b8d4f1]"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Giriş Yap
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <Camera className="w-4 h-4 text-[#ffd4a3]" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9dd9ea] to-[#ffd4a3] font-bold">
              Profesyonel Fotoğrafçılık Yönetimi
            </span>
          </div>

          <p className="text-xs text-gray-500">
            © 2025 <span className="text-[#9dd9ea] font-semibold">Aspect</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}