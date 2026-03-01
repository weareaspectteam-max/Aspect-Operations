import { ChevronRight, MapPin, Users, TrendingUp, Calendar } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  revenue: string;
  cost: string;
  profit: string;
  profitMargin: number;
  staff: number;
  status: 'active' | 'inactive';
}

export function Projects() {
  const projects: Project[] = [
    {
      id: '1',
      name: 'ZOKA',
      location: 'Beach Club',
      revenue: '₺112,000',
      cost: '₺33,600',
      profit: '₺78,400',
      profitMargin: 70,
      staff: 3,
      status: 'active',
    },
    {
      id: '2',
      name: 'Hayal Kahvesi',
      location: 'Restoran',
      revenue: '₺98,400',
      cost: '₺29,520',
      profit: '₺68,880',
      profitMargin: 70,
      staff: 2,
      status: 'active',
    },
    {
      id: '3',
      name: 'Balık Hali',
      location: 'Restoran',
      revenue: '₺76,100',
      cost: '₺26,635',
      profit: '₺49,465',
      profitMargin: 65,
      staff: 2,
      status: 'active',
    },
    {
      id: '4',
      name: 'Tekne Projesi',
      location: 'Tekne Turu',
      revenue: '₺38,000',
      cost: '₺15,960',
      profit: '₺22,040',
      profitMargin: 58,
      staff: 1,
      status: 'active',
    },
  ];

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10b981' : '#94a3b8';
  };

  const getProfitColor = (margin: number) => {
    if (margin >= 70) return '#10b981';
    if (margin >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">Projeler</h1>
        <p className="text-muted-foreground text-sm">Tüm lokasyon ve proje yönetimi</p>
      </div>

      <div className="px-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Aktif Proje</div>
            <div className="text-2xl font-bold text-foreground">{projects.filter(p => p.status === 'active').length}</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Toplam Personel</div>
            <div className="text-2xl font-bold text-foreground">{projects.reduce((sum, p) => sum + p.staff, 0)}</div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-2xl p-5 border border-border hover:border-primary transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-foreground">{project.name}</h3>
                    <div
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(project.status)}20`,
                        color: getStatusColor(project.status),
                      }}
                    >
                      Aktif
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{project.staff} Personel</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Ciro</div>
                  <div className="text-sm font-semibold text-foreground">{project.revenue}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Maliyet</div>
                  <div className="text-sm font-semibold text-foreground">{project.cost}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Kâr</div>
                  <div className="text-sm font-semibold text-[#10b981]">{project.profit}</div>
                </div>
              </div>

              {/* Profit Margin */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>Kâr Marjı</span>
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: getProfitColor(project.profitMargin) }}
                  >
                    {project.profitMargin}%
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${project.profitMargin}%`,
                      backgroundColor: getProfitColor(project.profitMargin),
                    }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <button className="flex-1 py-2 px-3 bg-background rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-all flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Raporlar
                </button>
                <button className="flex-1 py-2 px-3 bg-background rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-all flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Personel
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Button */}
        <button className="w-full mt-4 py-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-all">
          + Yeni Proje Ekle
        </button>
      </div>
    </div>
  );
}
