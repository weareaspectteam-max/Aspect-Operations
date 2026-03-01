import { MapPin, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  location: string;
  shift: string;
  color: string;
  icon: string;
  distance?: number;
}

interface ProjectSelectorProps {
  onProjectSelect: (project: Project) => void;
  selectedProject: Project | null;
}

export function ProjectSelector({ onProjectSelect, selectedProject }: ProjectSelectorProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSelector, setShowSelector] = useState(!selectedProject);

  const projects: Project[] = [
    {
      id: '1',
      name: 'ZOKA Restaurant',
      location: 'Çeşme',
      shift: '10:00 - 18:00',
      color: 'from-[#9dd9ea] to-[#7ec8dd]',
      icon: '🍽️',
    },
    {
      id: '2',
      name: 'Balık Hali',
      location: 'Alaçatı',
      shift: '12:00 - 20:00',
      color: 'from-[#d4b5f7] to-[#c79ff0]',
      icon: '🐟',
    },
    {
      id: '3',
      name: 'Hayal Kahvesi',
      location: 'Çeşme Marina',
      shift: '14:00 - 22:00',
      color: 'from-[#ec4899] to-[#db2777]',
      icon: '☕',
    },
    {
      id: '4',
      name: 'Müjgan Restaurant',
      location: 'Alaçatı',
      shift: '11:00 - 19:00',
      color: 'from-[#ffd4a3] to-[#ffc78f]',
      icon: '🍷',
    },
    {
      id: '5',
      name: 'İki Duble Restaurant',
      location: 'Çeşme Merkez',
      shift: '13:00 - 21:00',
      color: 'from-[#a8e6cf] to-[#8edec0]',
      icon: '🍴',
    },
    {
      id: '6',
      name: 'Tekne Turu',
      location: 'Çeşme Liman',
      shift: '09:00 - 17:00',
      color: 'from-[#f59e0b] to-[#d97706]',
      icon: '⛵',
    },
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location permission denied or unavailable');
        }
      );
    }
  }, []);

  const handleProjectSelect = (project: Project) => {
    onProjectSelect(project);
    setShowSelector(false);
  };

  if (!showSelector && selectedProject) {
    // Show compact header when project is selected
    return (
      <div className="px-6 pt-6 pb-3">
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/10 rounded-2xl p-4 border-2 border-[#9dd9ea]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedProject.color} flex items-center justify-center text-2xl shadow-md`}>
                {selectedProject.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{selectedProject.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#a8e6cf]" />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedProject.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedProject.shift}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSelector(true)}
              className="text-xs font-semibold text-[#9dd9ea] hover:bg-[#9dd9ea]/10 px-3 py-2 rounded-lg transition-all"
            >
              Değiştir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          Bugünkü Göreviniz
          <span className="text-2xl">📍</span>
        </h2>
        <p className="text-sm text-gray-400">Hangi projede çalışıyorsunuz?</p>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectSelect(project)}
            className={`w-full bg-gradient-to-br ${project.color} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98] text-left`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">
                {project.icon}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg mb-1">{project.name}</div>
                <div className="flex items-center gap-3 text-sm opacity-90">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.shift}
                  </span>
                </div>
              </div>
              {userLocation && (
                <div className="text-center">
                  <Navigation className="w-5 h-5 mx-auto mb-1 opacity-80" />
                  <div className="text-xs opacity-80">Yakın</div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {userLocation && (
        <div className="mt-4 bg-[#a8e6cf]/20 rounded-xl p-3 border border-[#a8e6cf]/30">
          <div className="flex items-center gap-2 text-sm text-[#a8e6cf] font-semibold">
            <Navigation className="w-4 h-4" />
            <span>Konum algılandı - En yakın projeler gösteriliyor</span>
          </div>
        </div>
      )}
    </div>
  );
}
