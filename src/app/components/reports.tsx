import { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

type FilterType = 'today' | 'week' | 'month' | 'custom';

export function Reports() {
  const [filter, setFilter] = useState<FilterType>('today');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const revenueByProject = [
    { name: 'ZOKA', value: 5600, color: '#1e40af' },
    { name: 'Hayal Kahvesi', value: 4200, color: '#10b981' },
    { name: 'Balık Hali', value: 3800, color: '#f59e0b' },
    { name: 'Tekne', value: 2000, color: '#8b5cf6' },
  ];

  const dailyRevenue = [
    { day: 'Pzt', revenue: 12400, profit: 8600 },
    { day: 'Sal', revenue: 14200, profit: 9800 },
    { day: 'Çar', revenue: 13100, profit: 9100 },
    { day: 'Per', revenue: 15800, profit: 11000 },
    { day: 'Cum', revenue: 16900, profit: 11800 },
    { day: 'Cmt', revenue: 18200, profit: 12700 },
    { day: 'Paz', revenue: 15600, profit: 10800 },
  ];

  const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
  const totalCost = dailyRevenue.reduce((sum, day) => sum + (day.revenue - day.profit), 0);
  const totalProfit = dailyRevenue.reduce((sum, day) => sum + day.profit, 0);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">Raporlar</h1>
        <p className="text-muted-foreground text-sm">Finansal performans ve istatistikler</p>
      </div>

      <div className="px-6 space-y-5">
        {/* Filters */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Filtre</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { id: 'today', label: 'Bugün' },
              { id: 'week', label: '7 Gün' },
              { id: 'month', label: '30 Gün' },
              { id: 'custom', label: 'Özel' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as FilterType)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filter === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {filter === 'custom' && (
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Başlangıç</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bitiş</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-primary bg-opacity-10">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-1">Toplam Ciro</div>
            <div className="text-xl font-bold text-foreground">₺{totalRevenue.toLocaleString()}</div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <TrendingDown className="w-4 h-4 text-[#ef4444]" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-1">Toplam Maliyet</div>
            <div className="text-xl font-bold text-foreground">₺{totalCost.toLocaleString()}</div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <TrendingUp className="w-4 h-4 text-[#10b981]" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-1">Net Kâr</div>
            <div className="text-xl font-bold text-[#10b981]">₺{totalProfit.toLocaleString()}</div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <Percent className="w-4 h-4 text-[#f59e0b]" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-1">Kâr Marjı</div>
            <div className="text-xl font-bold text-foreground">{profitMargin}%</div>
          </div>
        </div>

        {/* Revenue & Profit Chart */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Günlük Performans</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="#94a3b8" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11}
                tickLine={false}
                tickFormatter={(value) => `₺${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => `₺${value}`}
              />
              <Bar dataKey="revenue" fill="#1e40af" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs text-muted-foreground">Ciro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-xs text-muted-foreground">Kâr</span>
            </div>
          </div>
        </div>

        {/* Revenue by Project */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Projelere Göre Ciro</h3>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={revenueByProject}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueByProject.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => `₺${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {revenueByProject.map((project) => (
              <div key={project.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                  <span className="text-sm text-foreground">{project.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">₺{project.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
