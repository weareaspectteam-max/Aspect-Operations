import { Package, Printer, ArrowLeft, Plus, Minus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { StaffTopBar } from './staff-top-bar';
import { NewBottomNav } from './new-bottom-nav';
import { useState } from 'react';

interface CurrentStockProps {
  userName: string;
  userRole: 'admin' | 'staff';
  projectName: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
  onRequestStockRemoval: (items: Array<{ key: string; label: string; amount: number }>) => string;
  onRequestPrinterRemoval: (amount: number) => string;
  onCancelStockRequest?: (requestId: string) => void;
  onCancelPrinterRequest?: (requestId: string) => void;
  pendingStockRequests: Array<{
    id: string;
    items: Array<{ key: string; label: string; amount: number }>;
    timestamp: Date;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  pendingPrinterRequests: Array<{
    id: string;
    amount: number;
    timestamp: Date;
    status: 'pending' | 'approved' | 'rejected';
  }>;
}

// Mock data - gerçek uygulamada API'den gelecek
const mockStockData = {
  stock: {
    album3: 45,
    album5: 32,
    album7: 28,
    album9: 15,
    album11: 12,
    album13: 8,
    album15: 20,
    passepartout: 50,
  },
  printer: {
    currentCounter: '1450',
  },
};

export function CurrentStock({ userName, userRole, projectName, onBack, onLogout, onNavigate, onRequestStockRemoval, onRequestPrinterRemoval, onCancelStockRequest, onCancelPrinterRequest, pendingStockRequests, pendingPrinterRequests }: CurrentStockProps) {
  const [stockData, setStockData] = useState(mockStockData.stock);
  const [printerCounter, setPrinterCounter] = useState(parseInt(mockStockData.printer.currentCounter));
  const [printerAmount, setPrinterAmount] = useState('');
  const [addAmounts, setAddAmounts] = useState<Record<string, string>>({
    album3: '',
    album5: '',
    album7: '',
    album9: '',
    album11: '',
    album13: '',
    album15: '',
    passepartout: '',
  });

  const albumItems = [
    { key: 'album3', label: '3 Kare Albüm', emoji: '📘' },
    { key: 'album5', label: '5 Kare Albüm', emoji: '📗' },
    { key: 'album7', label: '7 Kare Albüm', emoji: '📙' },
    { key: 'album9', label: '9 Kare Albüm', emoji: '📕' },
    { key: 'album11', label: '11 Kare Albüm', emoji: '📔' },
    { key: 'album13', label: '13 Kare Albüm', emoji: '📒' },
    { key: 'album15', label: '15 Kare Albüm', emoji: '📓' },
    { key: 'passepartout', label: 'Paspartu', emoji: '🖼️' },
  ];

  const handleAddStock = () => {
    const newStock = { ...stockData };
    let hasChanges = false;

    Object.keys(addAmounts).forEach((key) => {
      const amount = parseInt(addAmounts[key]);
      if (!isNaN(amount) && amount > 0) {
        newStock[key as keyof typeof stockData] += amount;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setStockData(newStock);
      // Reset input fields
      setAddAmounts({
        album3: '',
        album5: '',
        album7: '',
        album9: '',
        album11: '',
        album13: '',
        album15: '',
        passepartout: '',
      });
      
      // Show success feedback
      alert('✅ Stok başarıyla eklendi!');
    }
  };

  const handleRemoveStock = () => {
    // Prepare items to remove
    const itemsToRemove: Array<{ key: string; label: string; amount: number }> = [];
    let hasError = false;

    Object.keys(addAmounts).forEach((key) => {
      const amount = parseInt(addAmounts[key]);
      if (!isNaN(amount) && amount > 0) {
        const currentStock = stockData[key as keyof typeof stockData];
        const itemLabel = albumItems.find(item => item.key === key)?.label || key;
        
        if (currentStock >= amount) {
          itemsToRemove.push({ key, label: itemLabel, amount });
        } else {
          hasError = true;
          alert(`❌ ${itemLabel}: Yeterli stok yok! (Mevcut: ${currentStock})`);
        }
      }
    });

    if (itemsToRemove.length > 0 && !hasError) {
      // Request approval
      onRequestStockRemoval(itemsToRemove);
      
      // Reset input fields
      setAddAmounts({
        album3: '',
        album5: '',
        album7: '',
        album9: '',
        album11: '',
        album13: '',
        album15: '',
        passepartout: '',
      });
      
      // Show telegram notification
      alert('📱 Telegram: Yöneticiye onay talebi iletildi!\n\n' + 
            itemsToRemove.map(item => `${item.label}: ${item.amount} adet`).join('\n'));
    }
  };

  const handleInputChange = (key: string, value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setAddAmounts(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handlePrinterAmountChange = (value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setPrinterAmount(value);
    }
  };

  const handleRemovePrinterStock = () => {
    const amount = parseInt(printerAmount);
    if (!isNaN(amount) && amount > 0) {
      if (printerCounter >= amount) {
        // Request approval
        onRequestPrinterRemoval(amount);
        
        // Reset input field
        setPrinterAmount('');
        
        // Show telegram notification
        alert('📱 Telegram: Yöneticiye onay talebi iletildi!\n\n' + 
              `Baskı Cihazı: ${amount} adet`);
      } else {
        alert(`❌ Baskı Cihazı: Yeterli stok yok! (Mevcut: ${printerCounter})`);
      }
    }
  };

  const handleAddPrinterPackage = () => {
    // Her paket 400 baskı ekler - onay gerektirmez
    const packagesAmount = parseInt(printerAmount);
    if (!isNaN(packagesAmount) && packagesAmount > 0) {
      const totalPrints = packagesAmount * 400;
      setPrinterCounter(prev => prev + totalPrints);
      setPrinterAmount('');
      alert(`✅ ${packagesAmount} paket (${totalPrints} baskı) başarıyla eklendi!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] relative pb-20">
      {/* Sticky Top Bar - Only for staff */}
      {userRole === 'staff' && (
        <StaffTopBar
          userName={userName}
          userRole={userRole}
          onLogout={onLogout}
          onNavigate={onNavigate}
          onBack={onBack}
          showBackButton={true}
        />
      )}

      {/* Background Effects */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#9dd9ea]/20 to-transparent blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#ffd4a3]/20 to-transparent blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-6 pt-20">
        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9dd9ea]/20 to-[#ffd4a3]/20 border border-white/10 rounded-full mb-4 backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#9dd9ea] rounded-full"></div>
              <span className="text-sm font-semibold text-white">Bilgi Ekranı</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">
              Mevcut Stok Durumu
            </h1>
            <p className="text-gray-400 text-sm">
              {projectName} • Güncel Stok
            </p>
          </motion.div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            {/* Albüm Stoğu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd] flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-[#2d3748]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Albüm Stoğu</h3>
                  <p className="text-xs text-gray-400">Depodaki mevcut stok</p>
                </div>
              </div>

              <div className="space-y-2">
                {albumItems.map(({ key, label, emoji }) => (
                  <div key={key} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3">
                      {/* Left: Product Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-xl">{emoji}</span>
                        <span className="font-medium text-white text-sm">{label}</span>
                      </div>
                      
                      {/* Middle: Current Stock Badge */}
                      <div className="px-3 py-1.5 bg-[#9dd9ea]/20 border border-[#9dd9ea]/30 rounded-lg">
                        <span className="font-bold text-white text-sm">{stockData[key as keyof typeof stockData]}</span>
                      </div>

                      {/* Right: Add Stock Input */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={addAmounts[key]}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-14 bg-white/5 border border-white/20 rounded-lg px-2 py-1.5 text-white text-sm text-center placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#a8e6cf] focus:border-[#a8e6cf] transition-all"
                        />
                        <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">+ / -</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Stock Button */}
              <button
                onClick={handleAddStock}
                className="w-full mt-4 bg-gradient-to-r from-[#a8e6cf] to-[#8dd9b8] hover:from-[#8dd9b8] hover:to-[#a8e6cf] text-[#2d3748] font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Stok Ekle
              </button>

              {/* Remove Stock Button */}
              <button
                onClick={handleRemoveStock}
                className="w-full mt-4 bg-gradient-to-r from-[#ff6b6b] to-[#ff4d4d] hover:from-[#ff4d4d] hover:to-[#ff6b6b] text-[#2d3748] font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Minus className="w-5 h-5" />
                Stok Azalt
              </button>
            </motion.div>

            {/* Baskı Cihazı */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffd4a3] to-[#ffc78f] flex items-center justify-center shadow-lg">
                  <Printer className="w-6 h-6 text-[#744210]" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Baskı Cihazı</h3>
                  <p className="text-xs text-gray-400">Mevcut sayaç değeri</p>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-400 mb-1">Toplam Baskı</div>
                  <div className="text-3xl font-bold text-white">{printerCounter}</div>
                </div>

                {/* Compact Input and Buttons */}
                <div className="space-y-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Miktar girin"
                    value={printerAmount}
                    onChange={(e) => handlePrinterAmountChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#a8e6cf] focus:border-[#a8e6cf] transition-all"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleAddPrinterPackage}
                      className="bg-gradient-to-r from-[#a8e6cf] to-[#8dd9b8] hover:from-[#8dd9b8] hover:to-[#a8e6cf] text-[#2d3748] font-bold py-2 px-3 rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Paket</span>
                    </button>
                    <button
                      onClick={handleRemovePrinterStock}
                      className="bg-gradient-to-r from-[#ff6b6b] to-[#ff4d4d] hover:from-[#ff4d4d] hover:to-[#ff6b6b] text-white font-bold py-2 px-3 rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                      <span className="text-sm">Azalt</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 text-center">
                  💡 Her paket 400 baskı ekler
                </div>
              </div>
            </motion.div>


          </div>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="text-xs text-gray-400">
                <p className="font-semibold text-white mb-1">Dikkat:</p>
                Stok eklemeleri anlık gerçekleşir. Azaltma işlemleri yönetici onayı gerektirir. <span className="text-[#ff6b6b] font-bold">Onay almadan ürün alınmamalıdır.</span>
              </div>
            </div>
          </motion.div>

          {/* Pending Stock Requests */}
          {pendingStockRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5"
            >
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#ffd4a3]" />
                Bekleyen Stok Talepleri
              </h3>
              <div className="space-y-3">
                {pendingStockRequests.map((request) => (
                  <div key={request.id} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Clock className="w-4 h-4 text-[#ffd4a3]" />
                            <span className="text-xs text-[#ffd4a3] font-semibold">Onay Bekleniyor</span>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-[#a8e6cf]" />
                            <span className="text-xs text-[#a8e6cf] font-semibold">Onaylandı</span>
                          </>
                        )}
                        {request.status === 'rejected' && (
                          <>
                            <XCircle className="w-4 h-4 text-[#ff6b6b]" />
                            <span className="text-xs text-[#ff6b6b] font-semibold">Reddedildi</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(request.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {request.items.map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                          {item.label}: <span className="font-bold text-white">{item.amount} adet</span>
                        </div>
                      ))}
                    </div>
                    {request.status === 'pending' && onCancelStockRequest && (
                      <button
                        onClick={() => onCancelStockRequest(request.id)}
                        className="w-full bg-gradient-to-r from-[#ff6b6b]/20 to-[#ff4d4d]/20 hover:from-[#ff6b6b]/30 hover:to-[#ff4d4d]/30 border border-[#ff6b6b]/30 text-[#ff6b6b] font-semibold py-1.5 px-3 rounded-lg text-xs transition-all active:scale-95"
                      >
                        İptal Et
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pending Printer Requests */}
          {pendingPrinterRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5"
            >
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#ffd4a3]" />
                Bekleyen Baskı Talepleri
              </h3>
              <div className="space-y-3">
                {pendingPrinterRequests.map((request) => (
                  <div key={request.id} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Clock className="w-4 h-4 text-[#ffd4a3]" />
                            <span className="text-xs text-[#ffd4a3] font-semibold">Onay Bekleniyor</span>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-[#a8e6cf]" />
                            <span className="text-xs text-[#a8e6cf] font-semibold">Onaylandı</span>
                          </>
                        )}
                        {request.status === 'rejected' && (
                          <>
                            <XCircle className="w-4 h-4 text-[#ff6b6b]" />
                            <span className="text-xs text-[#ff6b6b] font-semibold">Reddedildi</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(request.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 flex items-center gap-2 mb-3">
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      Baskı Azaltma: <span className="font-bold text-white">{request.amount} adet</span>
                    </div>
                    {request.status === 'pending' && onCancelPrinterRequest && (
                      <button
                        onClick={() => onCancelPrinterRequest(request.id)}
                        className="w-full bg-gradient-to-r from-[#ff6b6b]/20 to-[#ff4d4d]/20 hover:from-[#ff6b6b]/30 hover:to-[#ff4d4d]/30 border border-[#ff6b6b]/30 text-[#ff6b6b] font-semibold py-1.5 px-3 rounded-lg text-xs transition-all active:scale-95"
                      >
                        İptal Et
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Only for staff */}
      {userRole === 'staff' && (
        <NewBottomNav
          activeTab="stock"
          onTabChange={onNavigate}
          userRole={userRole}
        />
      )}
    </div>
  );
}