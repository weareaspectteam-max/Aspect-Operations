import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, AlertCircle, Eye, Settings as SettingsIcon, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { NewBottomNav } from './new-bottom-nav';
import { HamburgerMenu } from './hamburger-menu';
import { StaffPerformanceList } from './staff-performance-list';

interface AdminDashboardProps {
  userName: string;
  userRole: 'admin' | 'staff';
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color?: 'green' | 'red' | 'blue' | 'orange' | 'purple';
  onClick?: () => void;
}

function StatCard({ title, value, change, icon, color = 'blue', onClick }: StatCardProps) {
  const bgGradient = {
    green: 'from-[#a8e6cf] to-[#8dd9b8]',
    red: 'from-[#ffb3ba] to-[#ffa0a8]',
    blue: 'from-[#9dd9ea] to-[#7ec8dd]',
    orange: 'from-[#ffd4a3] to-[#ffc78f]',
    purple: 'from-[#d4a5ff] to-[#c78fff]',
  };

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5 transition-all ${
        onClick ? 'hover:shadow-lg hover:scale-[1.02] active:scale-95' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgGradient[color]} flex items-center justify-center shadow-lg`}>
          <div className="text-[#2d3748]">{icon}</div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${change >= 0 ? 'text-[#a8e6cf] bg-[#a8e6cf]/20' : 'text-[#ffb3ba] bg-[#ffb3ba]/20'}`}>
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="text-gray-400 text-xs mb-1 font-medium text-left">{title}</div>
      <div className="text-2xl font-bold text-white text-left">{value}</div>
    </button>
  );
}

export function AdminDashboard({ userName, userRole, onLogout, onNavigate }: AdminDashboardProps) {
  const [showPerformanceList, setShowPerformanceList] = useState(false);

  // Genel istatistikler - Tüm projeler
  const totalRevenue = 45200;
  const totalSales = 98;
  const activeStaff = 12;
  const averageSale = 461;

  // Saatlik satış trendi - Tüm projeler
  const salesTrendData = [
    { time: '09:00', sales: 12, revenue: 5400 },
    { time: '10:00', sales: 18, revenue: 8200 },
    { time: '11:00', sales: 24, revenue: 11400 },
    { time: '12:00', sales: 32, revenue: 14800 },
    { time: '13:00', sales: 28, revenue: 12600 },
    { time: '14:00', sales: 35, revenue: 16200 },
    { time: '15:00', sales: 42, revenue: 19400 },
  ];

  // Proje bazlı performans
  const projectPerformance = [
    { name: 'ZOKA Beach', sales: 32, revenue: 15600, staff: 4, efficiency: 96 },
    { name: 'Balık Hali', sales: 24, revenue: 11200, staff: 3, efficiency: 88 },
    { name: 'Hamdi Kahvesi', sales: 28, revenue: 13200, staff: 3, efficiency: 92 },
    { name: 'Tekne Turları', sales: 14, revenue: 5200, staff: 2, efficiency: 84 },
  ];

  // Top performers - Personel sıralaması
  const topPerformers = [
    { name: 'Ahmet Yılmaz', sales: 18, revenue: 8400, project: 'ZOKA', discount: '10%' },
    { name: 'Ayşe Demir', sales: 15, revenue: 7200, project: 'ZOKA', discount: '9%' },
    { name: 'Mehmet Kaya', sales: 14, revenue: 6800, project: 'Balık Hali', discount: '12%' },
    { name: 'Zeynep Şahin', sales: 12, revenue: 5600, project: 'Hamdi', discount: '15%' },
    { name: 'Can Yücel', sales: 11, revenue: 4800, project: 'Tekne', discount: '11%' },
  ];

  // Album dağılımı
  const albumDistribution = [
    { name: '3 Kare', value: 12, color: '#9dd9ea' },
    { name: '5 Kare', value: 18, color: '#a8e6cf' },
    { name: '7 Kare', value: 24, color: '#ffd4a3' },
    { name: '9 Kare', value: 20, color: '#ffb3ba' },
    { name: '11 Kare', value: 14, color: '#d4a5ff' },
    { name: '15 Kare', value: 10, color: '#ffc78f' },
  ];

  const handleSendMessage = (selectedStaffIds: string[]) => {
    // Seçilen personellere mesaj gönderme işlemi
    console.log('Mesaj gönderilecek personeller:', selectedStaffIds);
    setShowPerformanceList(false);
    onNavigate('messaging');
  };

  return (
    <div className="pb-20 bg-gradient-to-b from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] min-h-screen">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-white">Genel Durum</h1>
          <span className="text-3xl">📊</span>
        </div>
        <p className="text-sm text-gray-400">Tüm projelerin canlı özeti • {new Date().toLocaleDateString('tr-TR')}</p>
      </div>

      {/* Key Metrics */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Toplam Günlük Ciro"
            value={`₺${totalRevenue.toLocaleString('tr-TR')}`}
            change={15}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Toplam Satış"
            value={totalSales.toString()}
            change={12}
            icon={<Package className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Aktif Personel"
            value={activeStaff.toString()}
            icon={<Users className="w-6 h-6" />}
            color="orange"
            onClick={() => onNavigate('rotation')}
          />
          <StatCard
            title="Ortalama Satış"
            value={`₺${averageSale}`}
            change={-2}
            icon={<BarChart3 className="w-6 h-6" />}
            color="purple"
          />
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="px-6 mb-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Saatlik Satış & Ciro Trendi</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#9dd9ea]"></div>
                <span className="text-xs text-gray-400">Satış</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#a8e6cf]"></div>
                <span className="text-xs text-gray-400">Ciro</span>
              </div>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    color: '#fff',
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#9dd9ea"
                  strokeWidth={3}
                  dot={{ fill: '#9dd9ea', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#a8e6cf"
                  strokeWidth={3}
                  dot={{ fill: '#a8e6cf', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Project Performance Table */}
      <div className="px-6 mb-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Proje Performansı</h3>
            <button
              onClick={() => onNavigate('live-sales')}
              className="flex items-center gap-1 px-3 py-1 bg-[#9dd9ea]/20 border border-[#9dd9ea]/30 rounded-lg text-xs text-[#9dd9ea] font-semibold hover:bg-[#9dd9ea]/30 transition-all"
            >
              <Eye className="w-3 h-3" />
              Canlı İzle
            </button>
          </div>
          <div className="space-y-3">
            {projectPerformance.map((project) => (
              <div
                key={project.name}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-[#9dd9ea]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white">{project.name}</h4>
                    <p className="text-xs text-gray-400">{project.staff} personel</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#a8e6cf]">₺{project.revenue.toLocaleString('tr-TR')}</div>
                    <div className="text-xs text-gray-400">{project.sales} satış</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Verimlilik</span>
                    <span className="text-white font-semibold">{project.efficiency}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#9dd9ea] to-[#a8e6cf] rounded-full transition-all"
                      style={{ width: `${project.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="px-6 mb-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">🏆 En İyi Performans</h3>
            <button
              onClick={() => setShowPerformanceList(true)}
              className="text-xs text-[#ffd4a3] font-semibold hover:underline"
            >
              Tümünü Gör
            </button>
          </div>
          <div className="space-y-2">
            {topPerformers.map((performer, index) => (
              <div
                key={performer.name}
                className="flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:border-[#ffd4a3]/30 transition-all"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd4a3] to-[#ffc78f] text-[#744210] font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{performer.name}</div>
                  <div className="text-xs text-[#ffd4a3]">İskonto: {performer.discount}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#a8e6cf] text-sm">₺{performer.revenue.toLocaleString('tr-TR')}</div>
                  <div className="text-xs text-gray-400">{performer.sales} satış</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Album Distribution Pie Chart */}
      <div className="px-6 mb-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-4">Albüm Dağılımı</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={albumDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {albumDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {albumDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <h3 className="font-semibold text-white mb-3">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('live-feed')}
            className="bg-gradient-to-br from-[#9dd9ea] to-[#7ec8dd] text-[#2d3748] rounded-2xl p-4 font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Canlı Satışlar
          </button>
          <button
            onClick={() => onNavigate('rotation')}
            className="bg-gradient-to-br from-[#ffd4a3] to-[#ffc78f] text-[#744210] rounded-2xl p-4 font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Rotasyon
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="bg-gradient-to-br from-[#a8e6cf] to-[#8dd9b8] text-[#2d3748] rounded-2xl p-4 font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <SettingsIcon className="w-5 h-5" />
            Ayarlar
          </button>
          <button
            onClick={() => onNavigate('messaging')}
            className="bg-gradient-to-br from-[#ffb3ba] to-[#ffa0a8] text-[#744210] rounded-2xl p-4 font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            Mesajlar
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <NewBottomNav
        activeTab="dashboard"
        onTabChange={onNavigate}
        userRole={userRole}
      />

      {/* Staff Performance List Modal */}
      <StaffPerformanceList
        isOpen={showPerformanceList}
        onClose={() => setShowPerformanceList(false)}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}