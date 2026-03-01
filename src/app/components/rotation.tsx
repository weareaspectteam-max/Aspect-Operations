import { useState } from 'react';
import { Users, MapPin, Send, Calendar, Clock, Plus, X, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewBottomNav } from './new-bottom-nav';

interface StaffMember {
  id: string;
  name: string;
  avatar: string;
  currentLocation?: string;
  status: 'active' | 'inactive' | 'assigned';
}

interface Location {
  id: string;
  name: string;
  color: string;
  icon: string;
  assignedStaff: string[];
  capacity: number;
}

interface RotationProps {
  userName: string;
  userRole: 'admin' | 'staff';
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export function Rotation({ userName, userRole, onLogout, onNavigate }: RotationProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const staffMembers: StaffMember[] = [
    { id: '1', name: 'Ahmet Yılmaz', avatar: '👨', currentLocation: 'Zoka', status: 'assigned' },
    { id: '2', name: 'Ayşe Demir', avatar: '👩', currentLocation: 'Müjgan', status: 'assigned' },
    { id: '3', name: 'Mehmet Kaya', avatar: '👨‍🦱', currentLocation: 'Balıkhali', status: 'assigned' },
    { id: '4', name: 'Zeynep Şahin', avatar: '👩‍🦰', status: 'active' },
    { id: '5', name: 'Ali Çelik', avatar: '👨‍🦲', status: 'active' },
    { id: '6', name: 'Fatma Yıldız', avatar: '👩‍🦱', status: 'active' },
  ];

  const [locations, setLocations] = useState<Location[]>([
    { id: '1', name: 'Zoka Beach Club', color: '#9dd9ea', icon: '🏖️', assignedStaff: ['1'], capacity: 99 },
    { id: '2', name: 'Müjgan Restaurant', color: '#ffd4a3', icon: '🍽️', assignedStaff: ['2'], capacity: 99 },
    { id: '3', name: 'Balıkhali', color: '#a8e6cf', icon: '🐟', assignedStaff: ['3'], capacity: 99 },
    { id: '4', name: 'Hayal Kahvesi', color: '#d4b5f7', icon: '☕', assignedStaff: [], capacity: 99 },
    { id: '5', name: 'İzinli Personel', color: '#ffb3ba', icon: '🏖️', assignedStaff: [], capacity: 99 },
  ]);

  const handleOpenAssignModal = (location: Location) => {
    setSelectedLocation(location);
    setSelectedStaff(location.assignedStaff);
    setShowAssignModal(true);
  };

  const handleToggleStaff = (staffId: string) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const handleSaveAssignment = () => {
    if (selectedLocation) {
      setLocations(locations.map(loc => 
        loc.id === selectedLocation.id 
          ? { ...loc, assignedStaff: selectedStaff }
          : loc
      ));
      setShowAssignModal(false);
      setSelectedLocation(null);
      setSelectedStaff([]);
      // Rotasyon kaydedildi bildirimi kaldırıldı - sadece "Bildir" butonunda gösterilecek
    }
  };

  const handleSendNotifications = () => {
    const rotationMessage = formatRotationMessage();
    
    // localStorage'dan mevcut mesajları al
    const existingMessages = JSON.parse(localStorage.getItem('messages') || '{}');
    
    // #rotasyon kanalı yoksa oluştur
    if (!existingMessages['rotasyon']) {
      existingMessages['rotasyon'] = [];
    }
    
    // Yeni rotasyon mesajını ekle
    const newMessage = {
      id: Date.now().toString(),
      sender: 'Sistem',
      text: rotationMessage,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true,
      type: 'rotation'
    };
    
    existingMessages['rotasyon'].push(newMessage);
    
    // localStorage'a kaydet
    localStorage.setItem('messages', JSON.stringify(existingMessages));
    
    // Başarı bildirimi
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);
  };

  const formatRotationMessage = () => {
    const dateStr = new Date(selectedDate).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    let message = `📋 **GÜNLÜK ROTASYON** - ${dateStr}\n\n`;
    
    locations.forEach(location => {
      if (location.assignedStaff.length > 0) {
        message += `${location.icon} **${location.name}:**\n`;
        location.assignedStaff.forEach(staffId => {
          const staff = getStaffById(staffId);
          if (staff) {
            message += `  • ${staff.name}\n`;
          }
        });
        message += '\n';
      }
    });
    
    message += '✅ Rotasyon planı hazırlandı. İyi çalışmalar!';
    
    return message;
  };

  const handleRemoveStaff = (locationId: string, staffId: string) => {
    setLocations(locations.map(loc => 
      loc.id === locationId 
        ? { ...loc, assignedStaff: loc.assignedStaff.filter(id => id !== staffId) }
        : loc
    ));
  };

  const getStaffById = (id: string) => staffMembers.find(s => s.id === id);

  // Personelin atandığı lokasyonu bul
  const getStaffAssignedLocation = (staffId: string): string | null => {
    const assignedLocation = locations.find(loc => loc.assignedStaff.includes(staffId));
    return assignedLocation ? assignedLocation.name : null;
  };

  // Personelin başka bir lokasyona atanıp atanmadığını kontrol et
  const isStaffAssignedElsewhere = (staffId: string): boolean => {
    if (!selectedLocation) return false;
    return locations.some(loc => 
      loc.id !== selectedLocation.id && loc.assignedStaff.includes(staffId)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd] flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-[#2d3748]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Rotasyon Yönetimi</h1>
                <p className="text-xs text-gray-400">Personel yerleştirme ve bildirim</p>
              </div>
            </div>
            <button
              onClick={handleSendNotifications}
              className="flex items-center gap-2 bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8] text-[#2d3748] px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              Bildir
            </button>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-white/10 rounded-xl p-3 border border-white/20">
            <Calendar className="w-5 h-5 text-[#9dd9ea]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm font-semibold outline-none"
            />
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Locations Grid */}
        {locations.map((location) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl border-2 border-white/20 overflow-hidden shadow-xl"
          >
            {/* Location Header */}
            <div className="p-4 border-b border-white/20" style={{ backgroundColor: `${location.color}20` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: location.color }}>
                    {location.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{location.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        {location.assignedStaff.length}/{location.capacity} Personel
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenAssignModal(location)}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Assigned Staff */}
            <div className="p-4">
              {location.assignedStaff.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                  <p className="text-sm text-gray-400">Henüz personel atanmadı</p>
                  <button
                    onClick={() => handleOpenAssignModal(location)}
                    className="mt-3 text-xs text-[#9dd9ea] font-semibold hover:underline"
                  >
                    Personel Ata
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {location.assignedStaff.map((staffId) => {
                    const staff = getStaffById(staffId);
                    if (!staff) return null;
                    return (
                      <div
                        key={staffId}
                        className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/20 group hover:bg-white/15 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd] flex items-center justify-center text-xl shadow-lg">
                            {staff.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{staff.name}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-[#a8e6cf] rounded-full"></div>
                              Atandı
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStaff(location.id, staffId)}
                          className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 flex items-center justify-center transition-all active:scale-95"
                          title="Çıkar"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Info Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-[#9dd9ea]/20 to-transparent rounded-2xl p-5 border-2 border-[#9dd9ea]/30 mt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd] flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Rotasyon İpuçları</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                • Günlük rotasyonu sabah vardiyası başlamadan önce oluşturun<br />
                • Her mekana yeterli sayıda personel atandığından emin olun<br />
                • "Bildir" butonuna tıklayarak rotasyonu #rotasyon kanalına gönderin<br />
                • Sadece yöneticiler #rotasyon kanalına erişebilir
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {showAssignModal && selectedLocation && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAssignModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-gradient-to-br from-[#2a2a3a] to-[#3a3a4e] rounded-3xl shadow-2xl z-50 border-2 border-white/20 overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/20 flex-shrink-0" style={{ backgroundColor: `${selectedLocation.color}20` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: selectedLocation.color }}>
                      {selectedLocation.icon}
                    </div>
                    <div>
                      <h2 className="font-black text-white text-lg">{selectedLocation.name}</h2>
                      <p className="text-xs text-gray-400">Personel Seçin</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  Kapasite: {selectedStaff.length}/{selectedLocation.capacity}
                </div>
              </div>

              {/* Staff List */}
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-2">
                  {staffMembers.map((staff) => {
                    const isSelected = selectedStaff.includes(staff.id);
                    const isFull = selectedStaff.length >= selectedLocation.capacity && !isSelected;
                    const assignedElsewhere = isStaffAssignedElsewhere(staff.id);
                    const assignedLocationName = getStaffAssignedLocation(staff.id);
                    const isDisabled = isFull || assignedElsewhere;
                    
                    return (
                      <button
                        key={staff.id}
                        onClick={() => !isDisabled && handleToggleStaff(staff.id)}
                        disabled={isDisabled}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#a8e6cf]/30 to-transparent border-[#a8e6cf] shadow-lg'
                            : assignedElsewhere
                            ? 'bg-red-500/10 border-red-500/30 opacity-60 cursor-not-allowed'
                            : isFull
                            ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg ${
                            isSelected 
                              ? 'bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8]' 
                              : assignedElsewhere
                              ? 'bg-gradient-to-br from-red-400 to-red-500'
                              : 'bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd]'
                          }`}>
                            {staff.avatar}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-white text-sm">{staff.name}</div>
                            <div className={`text-xs flex items-center gap-1 ${assignedElsewhere ? 'text-red-400' : 'text-gray-400'}`}>
                              {assignedElsewhere ? (
                                <>
                                  <span>🔒</span>
                                  <span>{assignedLocationName}'ya atandı</span>
                                </>
                              ) : assignedLocationName ? (
                                `${assignedLocationName}'ya atandı`
                              ) : (
                                'Atama bekliyor'
                              )}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-7 h-7 rounded-full bg-[#a8e6cf] flex items-center justify-center">
                            <Check className="w-4 h-4 text-[#2d3748]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/20 bg-white/5 flex-shrink-0">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all active:scale-95"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSaveAssignment}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8] text-[#2d3748] font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8] text-[#2d3748] px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border-2 border-white/30 max-w-[90%]"
          >
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
              <Check className="w-5 h-5 text-[#2d3748]" />
            </div>
            <div>
              <div className="font-bold text-sm">Rotasyon Bildirildi! 📱</div>
              <div className="text-xs opacity-80">#rotasyon kanalına gönderildi</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <NewBottomNav
        activeTab="rotation"
        onTabChange={onNavigate}
        userRole={userRole}
      />
    </div>
  );
}