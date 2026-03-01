import { X, LogOut, MessageSquare, User, Home, Sparkles, Settings, GraduationCap, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface StaffMenuDropdownProps {
  userName: string;
  userRole: 'admin' | 'staff';
  onLogout: () => void;
  onNavigate: (tab: string) => void;
  onClose: () => void;
}

export function StaffMenuDropdown({ userName, userRole, onLogout, onNavigate, onClose }: StaffMenuDropdownProps) {
  const menuItems = [
    {
      icon: Home,
      label: 'Başlangıç',
      action: () => {
        onNavigate('home');
        onClose();
      },
      gradient: 'from-[#a8e6cf] to-[#8dd9b8]',
      emoji: '🏠',
    },
    {
      icon: User,
      label: 'Personel Profili',
      action: () => {
        onNavigate('profile');
        onClose();
      },
      gradient: 'from-[#9dd9ea] to-[#7ec8dd]',
      emoji: '👤',
    },
    {
      icon: GraduationCap,
      label: 'Aspect Akademi',
      action: () => {
        onNavigate('academy');
        onClose();
      },
      gradient: 'from-[#9dd9ea] to-[#7ec8dd]',
      emoji: '🎓',
    },
    {
      icon: MessageSquare,
      label: 'Mesajlar',
      action: () => {
        onNavigate('messaging');
        onClose();
      },
      gradient: 'from-[#ffd4a3] to-[#ffc78f]',
      badge: 3,
      emoji: '💬',
    },
    {
      icon: Settings,
      label: 'Hesap Ayarları',
      action: () => {
        onNavigate('settings');
        onClose();
      },
      gradient: 'from-[#d4b5f7] to-[#c79ff0]',
      emoji: '⚙️',
    },
    {
      icon: LogOut,
      label: 'Çıkış Yap',
      action: () => {
        onClose();
        onLogout();
      },
      gradient: 'from-[#ffb3ba] to-[#ffa0a8]',
      danger: true,
      emoji: '👋',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full right-0 mt-3 w-80 bg-gradient-to-b from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-[110]"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#9dd9ea]/10 to-transparent blur-3xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-[#ffd4a3]/10 to-transparent blur-3xl" />

      {/* Header */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 border-b border-white/10 p-5 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#9dd9ea]" />
            <h2 className="text-xl font-black text-white">Menü</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all active:scale-95"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd] flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">
                {userRole === 'admin' ? '👨‍💼' : '😊'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#a8e6cf] rounded-full border-2 border-[#2a2a3a]"></div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-base leading-tight">{userName}</div>
              <div className="text-xs text-gray-400 capitalize mt-1 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-[#a8e6cf] rounded-full"></div>
                {userRole === 'admin' ? 'Yönetici' : 'Personel'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="relative px-3 pt-3 pb-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="space-y-2 pb-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
              onClick={item.action}
              className={`group w-full backdrop-blur-xl rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
                item.danger
                  ? 'bg-gradient-to-br from-[#ffb3ba]/20 to-[#ffa0a8]/10 hover:from-[#ffb3ba]/30 hover:to-[#ffa0a8]/20 border-2 border-[#ffb3ba]/30 hover:border-[#ffb3ba]/50 shadow-lg hover:shadow-[#ffb3ba]/20'
                  : 'bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border-2 border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-center p-3">
                {/* Icon with Gradient Background */}
                <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg mr-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-lg">{item.emoji}</span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Label & Badge */}
                <div className="flex-1 text-left">
                  <span className={`font-bold text-sm ${item.danger ? 'text-[#ffb3ba]' : 'text-white'} group-hover:text-white transition-colors`}>
                    {item.label}
                  </span>
                </div>

                {/* Badge */}
                {item.badge && (
                  <div className="w-6 h-6 bg-[#ffb3ba] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{item.badge}</span>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}