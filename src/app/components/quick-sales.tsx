import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

import {
  Send,
  Clock,
  ShoppingCart,
  X,
  Plus,
  Trash2,
  Tag,
  XCircle,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { ProjectSelector } from "./project-selector";
import { ClosingView } from "./closing-view";
import { StaffTopBar } from "./staff-top-bar";
import { NewBottomNav } from "./new-bottom-nav";
  

  interface Project {
    id: string;
    name: string;
    location: string;
    shift: string;
    color: string;
    icon: string;
  }

interface Sale {
  id: string;
  product: string;
  price: number;
  originalPrice: number;
  discount: number;
  time: string;
  project: string;
  status?: string;
  }

  interface CartItem {
    product: string;
    quantity: number;
    color: string;
    unitPrice: number;
  }

  interface QuickSalesProps {
    userName: string;
    userRole: 'admin' | 'staff';
    onProjectSelect?: (projectName: string) => void;
    preSelectedProject?: string;
    onBack?: () => void;
    onLogout: () => void;
    onNavigate: (tab: string) => void;
  }

  export function QuickSales({ userName, userRole, onProjectSelect, preSelectedProject, onBack, onLogout, onNavigate }: QuickSalesProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(() => {
      // Eğer preSelectedProject varsa (personel için), mock project oluştur
      if (preSelectedProject) {
        return {
          id: '1',
          name: preSelectedProject,
          location: 'Antalya',
          shift: 'Gündüz',
          color: 'from-[#9dd9ea] to-[#7ec8dd]',
          icon: '🏖️'
        };
      }
      return null;
    });
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showDiscount, setShowDiscount] = useState(false);
    const [discountAmount, setDiscountAmount] = useState('');
    const [showClosing, setShowClosing] = useState(false);
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'iban' | 'card' | null>(null);
const [recentSales, setRecentSales] = useState<Sale[]>([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelSaleId, setCancelSaleId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [showShiftEndSuccess, setShowShiftEndSuccess] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | null>(null);
    useEffect(() => {

  const q = query(
    collection(db, "sales"),
    orderBy("createdAt", "desc"),
    limit(5)
  );

  const unsub = onSnapshot(q, (snap) => {

    const live = snap.docs.map((d) => {
      const data: any = d.data();

      return {
        id: d.id,
        product: data.cartSummary,
        price: data.finalPrice,
        originalPrice: data.originalPrice,
        discount: data.discount,
        time: "canlı",
        project: data.project,
        status: data.status
      };
    });

    setRecentSales(live);

  });

  return () => unsub();

}, []);
    

    // Exchange rates
    const exchangeRates = {
      USD: 34.52,
      EUR: 37.89,
      GBP: 43.26,
    };

    // Calculate foreign currency amount based on cart total
    const calculateForeignCurrency = () => {
      if (!selectedCurrency) return '0.00';
      const totalAmount = calculateTotal();
      const discount = Number(discountAmount) || 0;
      const finalAmount = totalAmount - discount;
      const rate = exchangeRates[selectedCurrency];
      return (finalAmount / rate).toFixed(2);
    };

    const products = [
      { name: "1 Fotoğraf", price: 200, color: 'from-[#9dd9ea] to-[#7ec8dd]', icon: '📸' },
      { name: "3'lü", price: 600, color: 'from-[#b8d4f1] to-[#9cc0e8]', icon: '🎨' },
      { name: "5'li", price: 1000, color: 'from-[#d4b5f7] to-[#c79ff0]', icon: '🖼️' },
      { name: "7'li", price: 1400, color: 'from-[#ffb3d9] to-[#ff99cc]', icon: '✨' },
      { name: "9'lu", price: 1800, color: 'from-[#ffe5b4] to-[#ffd89b]', icon: '🌟' },
      { name: "11'li", price: 2200, color: 'from-[#a8e6cf] to-[#8dd9b8]', icon: '💎' },
      { name: "15'li", price: 3000, color: 'from-[#ffd4a3] to-[#ffc78f]', icon: '🎯' },
      { name: 'Paspartu', price: 200, color: 'from-[#a8e6e1] to-[#8fd9d1]', icon: '🖼️' },
    ];

    const addToCart = (productName: string, unitPrice: number) => {
      const existingItem = cart.find((item) => item.product === productName);
      const product = products.find((p) => p.name === productName);
      
      if (existingItem) {
        setCart(
          cart.map((item) =>
            item.product === productName ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        setCart([...cart, { product: productName, quantity: 1, color: product?.color || '', unitPrice }]);
      }
    };

    const removeFromCart = (productName: string) => {
      const existingItem = cart.find((item) => item.product === productName);
      
      if (existingItem && existingItem.quantity > 1) {
        setCart(
          cart.map((item) =>
            item.product === productName ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
      } else {
        setCart(cart.filter((item) => item.product !== productName));
      }
    };

    const clearCart = () => {
      setCart([]);
    };

    const openCancelModal = (saleId: string) => {
      setCancelSaleId(saleId);
      setShowCancelModal(true);
    };

  const confirmCancelSale = async () => {
  if (!cancelReason.trim()) {
    alert('Lütfen iptal sebebini yazın');
    return;
  }

  if (!cancelSaleId) return;

  const ok = confirm(
    `Bu satışı iptal etmek istediğinize emin misiniz?\n\nSebep: ${cancelReason}\n\nBu işlem geri alınamaz!`
  );

  if (!ok) return;

try {
  await updateDoc(doc(db, "sales", cancelSaleId), {
    status: "cancel_requested",
    cancel: {
      reason: cancelReason,
      requestedBy: userName,
      requestedAt: serverTimestamp(),
    },
  });

  setRecentSales((prev) =>
    prev.map((sale) =>
      sale.id === cancelSaleId
        ? { ...sale, status: "cancel_requested" }
        : sale
    )
  );

  // modal temizle
  setShowCancelModal(false);
  setCancelSaleId(null);
  setCancelReason("");
  alert("İptal talebi yöneticilere gönderildi.");

} catch (err) {
  console.error("İptal talebi gönderilemedi:", err);
  alert("İptal talebi gönderilemedi.");
}
};

    const closeCancelModal = () => {
      setShowCancelModal(false);
      setCancelSaleId(null);
      setCancelReason('');
    };

    const calculateTotal = () => {
      return cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleNumberClick = (num: string) => {
      if (discountAmount.length < 6) {
        setDiscountAmount(discountAmount + num);
      }
    };

    const handleBackspace = () => {
      setDiscountAmount(discountAmount.slice(0, -1));
    };

    const handleClear = () => {
      setDiscountAmount('');
    };

    const handleProceed = () => {
      if (!selectedProject) {
        alert('Lütfen önce proje seçin!');
        return;
      }

      if (cart.length === 0) {
        alert('Lütfen ürün seçin');
        return;
      }

      const originalPrice = calculateTotal();
      const discount = Number(discountAmount) || 0;
      const finalPrice = originalPrice - discount;

      if (discount > 0 && finalPrice < 0) {
        alert('İskonto tutarı toplam fiyattan fazla olamaz!');
        return;
      }

      setShowPaymentMethod(true);
    };

    const handleCompleteSale = async () => {

    if (!paymentMethod) {
      alert('Lütfen ödeme yöntemi seçin');
      return;
    }

    if (!selectedProject) {
      alert('Proje seçimi bulunamadı!');
      setShowPaymentMethod(false);
      return;
    }

    if (cart.length === 0) {
      alert('Sepet boş. Ürün seçin.');
      return;
    }

    const cartSummary = cart
      .map((item) => `${item.quantity}× ${item.product}`)
      .join(', ');

    const originalPrice = calculateTotal();
    const discount = Number(discountAmount) || 0;
    const finalPrice = originalPrice - discount;

    if (discount > 0 && finalPrice < 0) {
      alert('İskonto tutarı toplam fiyattan fazla olamaz!');
      return;
    }

    try {

      // Firestore satış kaydı
      const docRef = await addDoc(collection(db, "sales"), {
        createdAt: serverTimestamp(),
        userName,
        userRole,
        project: selectedProject.name,
        paymentMethod,
        cart: cart.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        cartSummary,
        originalPrice,
        discount,
        finalPrice,
        status: "completed",
      });

      // UI son satış listesi
const newSale: Sale = {
  id: docRef.id,
  product: cartSummary,
  price: finalPrice,
  originalPrice,
  discount,
  time: "şimdi",
  project: selectedProject.name,
  status: "completed"
      };

      setRecentSales(prev => [newSale, ...prev.slice(0, 4)]);

      // reset
      setCart([]);
      setDiscountAmount('');
      setShowDiscount(false);
      setShowPaymentMethod(false);
      setPaymentMethod(null);

    } catch (err) {

      console.error("Satış kaydedilemedi:", err);
      alert("Satış kaydedilemedi.");

    }

  };


    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = calculateTotal();

    return (
      <div className="pb-32 bg-gradient-to-b from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] min-h-screen">
        {/* Sticky Top Bar - Always show for staff */}
        {userRole === 'staff' && (
          <StaffTopBar
            userName={userName}
            userRole={userRole}
            onBack={() => onNavigate('home')}
            onLogout={onLogout}
            onNavigate={onNavigate}
            showBackButton={true}
          />
        )}

        {/* Project Selector - Sadece admin için veya personel proje seçmemişse */}
        {(userRole === 'admin' || !preSelectedProject) && (
          <ProjectSelector 
            onProjectSelect={(project) => {
              setSelectedProject(project);
              if (onProjectSelect) {
                onProjectSelect(project.name);
              }
            }}
            selectedProject={selectedProject}
          />
        )}

        {!selectedProject ? (
          <div className="px-6 py-12 text-center">
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-white mb-2">Lütfen Proje Seçin</h3>
            <p className="text-sm text-gray-400">Satış yapmaya başlamak için yukarıdan projenizi seçin</p>
          </div>
        ) : (
          <>
            {/* Header - Only show when StaffTopBar is not shown */}
            {!(userRole === 'staff' && preSelectedProject) && (
              <div className="px-6 pb-4 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {onBack && (
                      <button
                        onClick={onBack}
                        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all mr-2"
                      >
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </button>
                    )}
                    <h1 className="text-2xl font-bold text-white">Hızlı Satış</h1>
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowClosing(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#ffd4a3] to-[#ffc78f] text-[#744210] shadow-lg hover:shadow-xl transition-all active:scale-95 rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold text-sm">Kapanış</span>
                  </button>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#a8e6cf] to-[#8dd9b8] rounded-xl text-[#2d3748] shadow-lg">
                    <span className="font-bold">Bugün: 12</span>
                    <span className="text-lg">🔥</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400">Albüm seç → Fiyat otomatik → İskonto/Satış yap!</p>
            </div>
            )}

            <div className="px-6 space-y-4 pb-8">
          {/* Product Grid */}
          <div>
            <label className="text-sm font-semibold text-white mb-3 block flex items-center gap-2">
              <span>Albüm Seç</span>
              <span className="text-lg">📚</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {products.map((product) => (
                <button
                  key={product.name}
                  onClick={() => addToCart(product.name, product.price)}
                  className={`relative p-2.5 rounded-xl bg-gradient-to-br ${product.color} text-[#2d3748] transition-all active:scale-95 shadow-lg hover:shadow-xl group`}
                >
                  <div className="text-lg mb-1">{product.icon}</div>
                  <div className="text-xs font-bold mb-0.5 leading-tight">{product.name}</div>
                  <div className="text-xs opacity-90 font-semibold">₺{product.price}</div>
                  <div className="absolute top-1 right-1 w-5 h-5 bg-white/20 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-3 h-3 text-[#2d3748]" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-[#9dd9ea]/50 rounded-2xl p-5 shadow-xl animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#9dd9ea]" />
                  <h3 className="font-bold text-white">Sepet</h3>
                  <span className="px-2 py-1 bg-[#9dd9ea] text-[#2d3748] rounded-full text-xs font-bold">
                    {totalItems}
                  </span>
                </div>
                <button
                  onClick={clearCart}
                  className="text-[#ffb3ba] hover:bg-[#ffb3ba]/10 p-2 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-[#2d3748] font-bold shadow-md`}
                      >
                        {item.quantity}
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{item.product}</span>
                        <span className="text-xs text-gray-400">
                          {item.quantity} × ₺{item.unitPrice} = ₺{item.quantity * item.unitPrice}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="w-8 h-8 rounded-lg bg-[#ffb3ba]/20 text-[#ffb3ba] hover:bg-[#ffb3ba]/30 flex items-center justify-center transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToCart(item.product, item.unitPrice)}
                        className="w-8 h-8 rounded-lg bg-[#9dd9ea] text-[#2d3748] hover:bg-[#7ec8dd] flex items-center justify-center transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Price Display */}
              <div className="bg-gradient-to-br from-[#b8d4f1] to-[#9dd9ea] rounded-2xl p-5 mb-4 shadow-lg">
                <div className="text-[#2d3748]/70 text-sm mb-1">Toplam Tutar</div>
                <div className="text-[#2d3748] text-4xl font-bold">₺{totalPrice}</div>
              </div>

              {/* Action Buttons */}
              {!showDiscount ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowDiscount(true)}
                    className="bg-gradient-to-r from-[#ffd4a3] to-[#ffc78f] text-[#744210] py-4 rounded-2xl font-bold text-base hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Tag className="w-5 h-5" />
                    İskonto
                  </button>
                  <button
                    onClick={handleProceed}
                    className="bg-gradient-to-r from-[#9dd9ea] via-[#7ec8dd] to-[#9dd9ea] text-[#2d3748] py-4 rounded-2xl font-bold text-base hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    İlerle
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Discount Calculator */}
                  <div className="bg-gradient-to-br from-[#ffd4a3]/20 to-[#ffc78f]/10 rounded-2xl p-4 border-2 border-[#ffd4a3]/30">
                    <label className="text-sm font-semibold text-white mb-2 block flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#ffd4a3]" />
                      <span>İskonto Tutarı</span>
                    </label>
                    
                    {/* Discount Display */}
                    <div className="bg-gradient-to-br from-[#ffd4a3] to-[#ffc78f] rounded-xl p-4 mb-3 text-right shadow-md">
                      <div className="text-[#744210]/60 text-xs mb-1">TL</div>
                      <div className="text-[#744210] text-3xl font-bold min-h-[40px] flex items-center justify-end">
                        {discountAmount || '0'}
                      </div>
                    </div>

                    {/* Number Pad */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleNumberClick(num)}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xl font-bold py-3 rounded-xl transition-all active:scale-95 shadow-sm"
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button
                        onClick={handleClear}
                        className="bg-[#ffb3ba]/20 hover:bg-[#ffb3ba]/30 text-[#ffb3ba] text-sm font-bold py-3 rounded-xl transition-all active:scale-95"
                      >
                        C
                      </button>
                      <button
                        onClick={() => handleNumberClick('0')}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xl font-bold py-3 rounded-xl transition-all active:scale-95 shadow-sm"
                      >
                        0
                      </button>
                      <button
                        onClick={handleBackspace}
                        className="bg-[#ffd4a3]/20 hover:bg-[#ffd4a3]/30 text-[#ffd4a3] text-sm font-bold py-3 rounded-xl transition-all active:scale-95"
                      >
                        ⌫
                      </button>
                    </div>

                    {/* Final Price Preview */}
                    {discountAmount && Number(discountAmount) > 0 && (
                      <div className="bg-white/5 rounded-xl p-3 border-2 border-[#a8e6cf]/30 mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Orijinal Fiyat:</span>
                          <span className="font-semibold text-white">₺{totalPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-[#ffd4a3] font-semibold">İskonto:</span>
                          <span className="font-semibold text-[#ffd4a3]">-₺{discountAmount}</span>
                        </div>
                        <div className="border-t border-white/20 my-2"></div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">Ödenecek:</span>
                          <span className="font-bold text-2xl text-success">₺{totalPrice - Number(discountAmount)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Discount Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setShowDiscount(false);
                        setDiscountAmount('');
                      }}
                      className="bg-muted text-foreground py-4 rounded-2xl font-bold text-base hover:bg-muted/80 transition-all active:scale-[0.98]"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleProceed}
                      className="bg-gradient-to-r from-primary via-[#9dd9ea] to-primary text-primary-foreground py-4 rounded-2xl font-bold text-base hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                      İlerle
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Sales */}
          <div>
            {/* Exchange Rates & Currency Converter - Combined */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 mb-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💱</span>
                  <h3 className="text-sm font-bold text-white">Güncel Kurlar & Çevirici</h3>
                </div>
                <div className="text-xs text-gray-400">Canlı</div>
              </div>
              
              {/* Currency Rates - Clickable */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Dollar */}
                <button
                  onClick={() => setSelectedCurrency('USD')}
                  className={`bg-white/5 rounded-lg p-3 text-center transition-all active:scale-95 ${
                    selectedCurrency === 'USD' ? 'ring-2 ring-[#a8e6cf] bg-[#a8e6cf]/10' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                    <span>🇺🇸</span>
                    <span>USD</span>
                  </div>
                  <div className="text-base font-bold text-[#a8e6cf]">₺34.52</div>
                  <div className="text-xs text-[#a8e6cf] flex items-center justify-center gap-1 mt-1">
                    <span>↑</span>
                    <span>0.12%</span>
                  </div>
                </button>
                
                {/* Euro */}
                <button
                  onClick={() => setSelectedCurrency('EUR')}
                  className={`bg-white/5 rounded-lg p-3 text-center transition-all active:scale-95 ${
                    selectedCurrency === 'EUR' ? 'ring-2 ring-[#9dd9ea] bg-[#9dd9ea]/10' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                    <span>🇪🇺</span>
                    <span>EUR</span>
                  </div>
                  <div className="text-base font-bold text-[#9dd9ea]">₺37.89</div>
                  <div className="text-xs text-[#a8e6cf] flex items-center justify-center gap-1 mt-1">
                    <span>↑</span>
                    <span>0.08%</span>
                  </div>
                </button>
                
                {/* Sterling */}
                <button
                  onClick={() => setSelectedCurrency('GBP')}
                  className={`bg-white/5 rounded-lg p-3 text-center transition-all active:scale-95 ${
                    selectedCurrency === 'GBP' ? 'ring-2 ring-[#ffd4a3] bg-[#ffd4a3]/10' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                    <span>🇬🇧</span>
                    <span>GBP</span>
                  </div>
                  <div className="text-base font-bold text-[#ffd4a3]">₺43.26</div>
                  <div className="text-xs text-[#ffb3ba] flex items-center justify-center gap-1 mt-1">
                    <span>↓</span>
                    <span>0.05%</span>
                  </div>
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gradient-to-br from-white/10 to-white/5 px-2 py-0.5 text-xs text-gray-400 rounded-full">
                    🔄
                  </span>
                </div>
              </div>

              {/* Compact Converter */}
              <div className="space-y-2">
                {/* Show cart total or message */}
                {cart.length > 0 ? (
                  <>
                    {/* Current Amount Display */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/20">
                      <div className="text-xs text-gray-400 mb-1">
                        {discountAmount && Number(discountAmount) > 0 ? 'Ödenecek Tutar' : 'Sepet Toplamı'}
                      </div>
                      <div className="text-2xl font-black text-white">
                        ₺{discountAmount && Number(discountAmount) > 0 ? totalPrice - Number(discountAmount) : totalPrice}
                      </div>
                    </div>

                    {/* Result Display - Compact */}
                    {selectedCurrency && (
                      <div className={`p-3 rounded-lg border-2 ${
                        selectedCurrency === 'USD' 
                          ? 'bg-[#a8e6cf]/20 border-[#a8e6cf]/50'
                          : selectedCurrency === 'EUR'
                          ? 'bg-[#9dd9ea]/20 border-[#9dd9ea]/50'
                          : 'bg-[#ffd4a3]/20 border-[#ffd4a3]/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            {selectedCurrency === 'USD' && <span>🇺🇸 USD</span>}
                            {selectedCurrency === 'EUR' && <span>🇪🇺 EUR</span>}
                            {selectedCurrency === 'GBP' && <span>🇬🇧 GBP</span>}
                          </div>
                          <div className={`text-3xl font-black ${
                            selectedCurrency === 'USD' 
                              ? 'text-[#a8e6cf]'
                              : selectedCurrency === 'EUR'
                              ? 'text-[#9dd9ea]'
                              : 'text-[#ffd4a3]'
                          }`}>
                            {calculateForeignCurrency()}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/20 text-center">
                    <div className="text-3xl mb-2">🛒</div>
                    <div className="text-sm text-gray-400">Sepete ürün ekleyin</div>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              Son Satışlar
              <span className="text-lg">📊</span>
            </h3>
            <div className="space-y-2">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className={`backdrop-blur-xl rounded-xl p-4 border transition-all
${sale.status === "cancel_requested"
  ? "bg-yellow-500/10 border-yellow-400/40 opacity-60"
  : "bg-gradient-to-br from-white/10 to-white/5 border-white/20"
}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-md
${sale.status === "cancel_requested"
  ? "bg-yellow-400/40 text-yellow-900"
  : "bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8] text-[#2d3748]"
}`}>
{sale.status === "cancel_requested" ? "⏳" : "✓"}
</div>
                      <div>
                        <div className="font-semibold text-white">{sale.product}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {sale.time}
                          </span>
                          <span className="text-[#9dd9ea]">• {sale.project}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-bold bg-gradient-to-r from-[#9dd9ea] to-[#7ec8dd] bg-clip-text text-transparent">
                          ₺{sale.price}
                        </div>
                        {sale.discount > 0 && (
                          <div className="text-xs text-orange font-semibold flex items-center gap-1 justify-end">
                            <Tag className="w-3 h-3" />
                            ₺{sale.discount} iskonto
                          </div>
                        )}
                      </div>
                      {/* Satış kapalıyken (sepet boş) iptal butonu göster */}
                      {cart.length === 0 && (
                        <button
                          onClick={() => openCancelModal(sale.id)}
                          className="w-9 h-9 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-all active:scale-95"
                          title="İptal Et"
                        >
                          <XCircle className="w-5 h-5 text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shift End Button */}
          {userRole === 'staff' && (
            <div className="mt-6">
              <button
                onClick={() => {
                  if (confirm('Vardiyayı hızlıca bitirmek istediğinize emin misiniz?\n\nBu işlem stok sayımı yapmadan vardiyayı kapatacaktır.')) {
                    setShowShiftEndSuccess(true);
                    setTimeout(() => {
                      setShowShiftEndSuccess(false);
                      onNavigate('profile');
                    }, 3000);
                  }
                }}
                className="w-full backdrop-blur-xl bg-gradient-to-br from-[#ffb3ba]/20 to-[#ff9ea5]/10 border-2 border-[#ffb3ba]/30 hover:border-[#ffb3ba]/50 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffb3ba] to-[#ff9ea5] flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🏁</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white">Vardiyayı Bitir</h3>
                      <p className="text-xs text-gray-400">Hızlı vardiya kapanışı</p>
                    </div>
                  </div>
                  <div className="text-[#ffb3ba]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
          </>
        )}

        {/* Closing View Modal */}
        {showClosing && selectedProject && (
          <ClosingView
            projectName={selectedProject.name}
            onClose={() => setShowClosing(false)}
            userName={userName}
            userRole={userRole}
          />
        )}

        {/* Payment Method Modal */}
        {showPaymentMethod && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-gradient-to-b from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] rounded-3xl shadow-2xl border-2 border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
              {/* Header */}
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-b border-white/10 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd] flex items-center justify-center text-2xl shadow-lg">
                    💳
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Ödeme Yöntemi</h3>
                    <p className="text-gray-400 text-sm">Nasıl ödeme alacaksınız?</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Payment Summary */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 font-medium">Toplam Tutar:</span>
                    <span className="text-3xl font-black text-white">₺{totalPrice}</span>
                  </div>
                  {discountAmount && Number(discountAmount) > 0 && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[#ffd4a3] font-bold flex items-center gap-2">
                          <span className="text-xl">🏷️</span>
                          İskonto:
                        </span>
                        <span className="text-[#ffd4a3] font-black text-xl">-₺{discountAmount}</span>
                      </div>
                      <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">Ödenecek:</span>
                          <span className="text-4xl font-black bg-gradient-to-r from-[#a8e6cf] to-[#8dd9b8] bg-clip-text text-transparent">
                            ₺{totalPrice - Number(discountAmount)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Payment Method Options */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      paymentMethod === 'cash'
                        ? 'border-[#a8e6cf] bg-gradient-to-br from-[#a8e6cf]/20 to-[#8dd9b8]/10 shadow-lg shadow-[#a8e6cf]/20'
                        : 'border-white/20 bg-white/5 hover:border-[#a8e6cf]/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                        paymentMethod === 'cash'
                          ? 'bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8] scale-110'
                          : 'bg-gradient-to-br from-white/10 to-white/5'
                      }`}>
                        💵
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-black text-xl ${
                          paymentMethod === 'cash' ? 'text-[#a8e6cf]' : 'text-white'
                        }`}>
                          Nakit
                        </div>
                        <div className="text-sm text-gray-400">Peşin ödeme</div>
                      </div>
                      {paymentMethod === 'cash' && (
                        <div className="w-8 h-8 rounded-full bg-[#a8e6cf] flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                          <CheckCircle className="w-6 h-6 text-[#2d3748]" />
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      paymentMethod === 'card'
                        ? 'border-[#9dd9ea] bg-gradient-to-br from-[#9dd9ea]/20 to-[#7ec8dd]/10 shadow-lg shadow-[#9dd9ea]/20'
                        : 'border-white/20 bg-white/5 hover:border-[#9dd9ea]/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                        paymentMethod === 'card'
                          ? 'bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd] scale-110'
                          : 'bg-gradient-to-br from-white/10 to-white/5'
                      }`}>
                        💳
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-black text-xl ${
                          paymentMethod === 'card' ? 'text-[#9dd9ea]' : 'text-white'
                        }`}>
                          Kredi Kartı
                        </div>
                        <div className="text-sm text-gray-400">Kart ile ödeme</div>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="w-8 h-8 rounded-full bg-[#9dd9ea] flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                          <CheckCircle className="w-6 h-6 text-[#2d3748]" />
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('iban')}
                    className={`w-full p-5 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      paymentMethod === 'iban'
                        ? 'border-[#ffd4a3] bg-gradient-to-br from-[#ffd4a3]/20 to-[#ffc78f]/10 shadow-lg shadow-[#ffd4a3]/20'
                        : 'border-white/20 bg-white/5 hover:border-[#ffd4a3]/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                        paymentMethod === 'iban'
                          ? 'bg-gradient-to-br from-[#ffd4a3] to-[#ffc78f] scale-110'
                          : 'bg-gradient-to-br from-white/10 to-white/5'
                      }`}>
                        🏦
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-black text-xl ${
                          paymentMethod === 'iban' ? 'text-[#ffd4a3]' : 'text-white'
                        }`}>
                          İban / Havale
                        </div>
                        <div className="text-sm text-gray-400">Banka havalesi</div>
                      </div>
                      {paymentMethod === 'iban' && (
                        <div className="w-8 h-8 rounded-full bg-[#ffd4a3] flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                          <CheckCircle className="w-6 h-6 text-[#744210]" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentMethod(false);
                      setPaymentMethod(null);
                    }}
                    className="backdrop-blur-xl bg-white/10 border-2 border-white/20 text-white py-4 rounded-2xl font-bold text-base hover:bg-white/20 transition-all active:scale-[0.98]"
                  >
                    Geri
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Payment Method:', paymentMethod);
                      handleCompleteSale();
                    }}
                    disabled={!paymentMethod}
                    className={`py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg ${
                      paymentMethod 
                        ? 'bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8] text-[#2d3748] hover:shadow-xl hover:shadow-[#a8e6cf]/30 cursor-pointer'
                        : 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50 border-2 border-white/10'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Satışı Yap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Sale Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-gradient-to-b from-white to-[#ffe5e5] rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-destructive to-[#ff6b6b] p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Satış İptali</h3>
                </div>
                <p className="text-white/90 text-sm">Bu satış neden iptal ediliyor?</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Reason Input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    İptal Sebebi <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Örn: Müşteri vazgeçti, fotoğraf kalitesi uygun değil, yanlış ürün seçildi..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive/50 transition-all resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Bu bilgi raporlama için kaydedilecektir
                  </p>
                </div>

                {/* Warning Box */}
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="text-xs text-foreground">
                      <p className="font-semibold mb-1">Dikkat!</p>
                      İptal edilen satışlar geri alınamaz. Satış kaydı silinecek ve 
                      bu işlem performans raporlarınıza yansıyacaktır.
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={closeCancelModal}
                    className="bg-muted text-foreground py-4 rounded-2xl font-bold text-base hover:bg-muted/80 transition-all active:scale-[0.98]"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={confirmCancelSale}
                    disabled={!cancelReason.trim()}
                    className={`py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg ${
                      cancelReason.trim()
                        ? 'bg-gradient-to-r from-destructive to-[#ff6b6b] text-white hover:shadow-xl cursor-pointer'
                        : 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50'
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                    İptal Et
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shift End Success Modal */}
        {showShiftEndSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md bg-gradient-to-br from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] rounded-3xl shadow-2xl border-2 border-[#a8e6cf]/30 overflow-hidden"
            >
              {/* Success Icon */}
              <div className="relative p-12 text-center">
                {/* Background Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-[#a8e6cf]/40 to-[#9dd9ea]/40 blur-3xl"
                />

                {/* Success Check Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8] rounded-full flex items-center justify-center shadow-2xl"
                >
                  <CheckCircle className="w-20 h-20 text-[#2d3748]" strokeWidth={2.5} />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-black text-white mb-3"
                >
                  Harika İş! 🎉
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-300 text-lg mb-2"
                >
                  Vardiya başarıyla tamamlandı
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-400 text-sm"
                >
                  Bugünkü çalışmanız için teşekkürler! 🌟
                </motion.p>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 text-4xl animate-bounce">
                  ✨
                </div>
                <div className="absolute top-16 right-12 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                  🎊
                </div>
                <div className="absolute bottom-16 left-16 text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>
                  🏆
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bottom Navigation - Only for staff with preselected project */}
        {userRole === 'staff' && preSelectedProject && (
          <NewBottomNav
            activeTab="quick-sales"
            onTabChange={onNavigate}
            userRole={userRole}
          />
        )}
      </div>
    );
  }