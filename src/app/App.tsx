import { useEffect, useState } from "react";
import { Login } from "./components/login";
import { AdminDashboard } from "./components/admin-dashboard";
import { QuickSales } from "./components/quick-sales";
import { LiveSalesFeed } from "./components/live-sales-feed";
import { Leaderboard } from "./components/leaderboard";
import { Messaging } from "./components/messaging";
import { StaffProfile } from "./components/staff-profile";
import { Settings } from "./components/settings";
import { NewBottomNav } from "./components/new-bottom-nav";
import { ShiftSetup, ShiftSetupData } from "./components/shift-setup";
import { ShiftChoice } from "./components/shift-choice";
import { ShiftEnd } from "./components/shift-end";
import { CurrentStock } from "./components/current-stock";
import { HamburgerMenu } from "./components/hamburger-menu";
import { Rotation } from "./components/rotation";
import { AspectAcademy } from "./components/aspect-academy";
import { AIAssistant } from "./components/ai-assistant";
import { StaffPersonalDashboard } from "./components/staff-personal-dashboard";
import { Bell, ArrowLeft } from "lucide-react";

// ✅ auth session (localStorage) — BURASI ÖNEMLİ
import { getSession, logout as authLogout } from "./auth/auth";

const logoImage = "/logo.png";

export default function App() {
  // ✅ İlk açılışta localStorage'dan session oku
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getSession());
  const [userRole, setUserRole] = useState<"admin" | "staff">(
    () => getSession()?.role ?? "staff"
  );
  const [userName, setUserName] = useState(() => getSession()?.username ?? "");

  const [activeTab, setActiveTab] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [shiftSetupCompleted, setShiftSetupCompleted] = useState(false);
  const [shiftSetupData, setShiftSetupData] = useState<ShiftSetupData | null>(null);
  const [showShiftChoice, setShowShiftChoice] = useState(false);
  const [showShiftSetup, setShowShiftSetup] = useState(false);
  const [showShiftEnd, setShowShiftEnd] = useState(false);
  const [showCurrentStock, setShowCurrentStock] = useState(false);

  // ✅ Sayfa yenilenince de session'ı state'e bas (garanti)
  useEffect(() => {
    const s = getSession();
    if (s) {
      setIsLoggedIn(true);
      setUserRole(s.role);
      setUserName(s.username);
      setActiveTab("dashboard");
    }
  }, []);

  const handleLogin = (role: "admin" | "staff", name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    // ✅ localStorage temizle
    authLogout();

    // ✅ state temizle
    setIsLoggedIn(false);
    setUserRole("staff");
    setUserName("");
    setActiveTab("");
    setSelectedProject("");
    setShiftSetupCompleted(false);
    setShiftSetupData(null);
    setShowShiftChoice(false);
    setShowShiftSetup(false);
    setShowShiftEnd(false);
    setShowCurrentStock(false);
  };

  const handleShiftSetupComplete = (setupData: ShiftSetupData) => {
    setShiftSetupData(setupData);
    setShiftSetupCompleted(true);
    setShowShiftSetup(false);
    setShowShiftChoice(false);
  };

  const handleProjectSelect = (projectName: string) => {
    setSelectedProject(projectName);
    if (userRole === "staff") {
      setShowShiftChoice(true);
    }
  };

  const handleStartShiftSetup = () => {
    setShowShiftChoice(false);
    setShowShiftSetup(true);
  };

  const handleStartSales = () => {
    setShowShiftChoice(false);
    setShowCurrentStock(false);
    setShiftSetupCompleted(true);
    setActiveTab("quick-sales");
  };

  const handleViewStock = () => {
    setShowShiftChoice(false);
    setShowCurrentStock(true);
  };

  const handleEndShift = () => {
    setShowShiftChoice(false);
    setShowShiftEnd(true);
  };

  const handleBackFromStock = () => {
    setShowCurrentStock(false);
    setShowShiftChoice(true);
  };

  const handleBackFromShiftEnd = () => {
    setShowShiftEnd(false);
    setShowShiftChoice(true);
  };

  const handleBackFromChoice = () => {
    setShowShiftChoice(false);
    setSelectedProject("");
  };

    const handleNavigate = (tab: string) => {
    setShowCurrentStock(false);
    setShowShiftSetup(false);
    setShowShiftEnd(false);

    if (tab === "home" && userRole === "staff" && selectedProject) {
      setShowShiftChoice(true);
      setActiveTab("");
    } else {
      setShowShiftChoice(false);
      setActiveTab(tab);
    }
  };

  // ✅ Types
  type StockRequestStatus = "pending" | "approved" | "rejected";
  type StockRemovalItem = { key: string; label: string; amount: number };

  type PendingStockRequest = {
    id: string;
    items: StockRemovalItem[];
    timestamp: Date;
    status: StockRequestStatus;
  };

  type PendingPrinterRequest = {
    id: string;
    amount: number;
    timestamp: Date;
    status: StockRequestStatus;
  };

  // ✅ State (typed)
  const [pendingStockRequests, setPendingStockRequests] = useState<PendingStockRequest[]>([]);
  const [pendingPrinterRequests, setPendingPrinterRequests] = useState<PendingPrinterRequest[]>([]);

  // ✅ Basit ID generator (crypto bazen kırıyor)
  const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const onRequestStockRemoval = (items: StockRemovalItem[]) => {
    const id = makeId();

    setPendingStockRequests((prev) => [
      {
        id,
        items,
        timestamp: new Date(),
        status: "pending",
      },
      ...prev,
    ]);

    return id;
  };

  const onRequestPrinterRemoval = (amount: number) => {
    const id = makeId();

    setPendingPrinterRequests((prev) => [
      {
        id,
        amount,
        timestamp: new Date(),
        status: "pending",
      },
      ...prev,
    ]);

    return id;
  };

  const onCancelStockRequest = (requestId: string) => {
    setPendingStockRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const onCancelPrinterRequest = (requestId: string) => {
    setPendingPrinterRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const renderContent = () => {
    if (userRole === "staff" && selectedProject && showCurrentStock) {
      return (
<CurrentStock
  userName={userName}
  userRole={userRole}
  projectName={selectedProject}
  onBack={handleBackFromStock}
  onLogout={handleLogout}
  onNavigate={handleNavigate}
  onRequestStockRemoval={onRequestStockRemoval}
  onRequestPrinterRemoval={onRequestPrinterRemoval}
  onCancelStockRequest={onCancelStockRequest}
  onCancelPrinterRequest={onCancelPrinterRequest}
  pendingStockRequests={pendingStockRequests}
  pendingPrinterRequests={pendingPrinterRequests}
/>
      );
    }

    if (userRole === "staff" && selectedProject && showShiftEnd) {
      return (
        <ShiftEnd
          userName={userName}
          userRole={userRole}
          projectName={selectedProject}
          onBack={handleBackFromShiftEnd}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    }

    if (userRole === "staff" && selectedProject && showShiftChoice) {
      return (
        <ShiftChoice
          userName={userName}
          userRole={userRole}
          projectName={selectedProject}
          onStartShiftSetup={handleStartShiftSetup}
          onStartSales={handleStartSales}
          onViewStock={handleViewStock}
          onEndShift={handleEndShift}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onBack={handleBackFromChoice}
        />
      );
    }

    if (userRole === "staff" && selectedProject && showShiftSetup) {
      return (
        <ShiftSetup
          userName={userName}
          userRole={userRole}
          projectName={selectedProject}
          onComplete={handleShiftSetupComplete}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onBack={() => {
            setShowShiftSetup(false);
            setShowShiftChoice(true);
          }}
        />
      );
    }

    switch (activeTab) {
      case "home":
        if (userRole === "staff" && selectedProject) {
          return (
            <ShiftChoice
              userName={userName}
              userRole={userRole}
              projectName={selectedProject}
              onStartShiftSetup={handleStartShiftSetup}
              onStartSales={handleStartSales}
              onViewStock={handleViewStock}
              onEndShift={handleEndShift}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          );
        }
        return (
          <AdminDashboard
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "dashboard":
        return userRole === "staff" ? (
          <StaffPersonalDashboard
            userName={userName}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        ) : (
          <AdminDashboard
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "quick-sales":
        return (
          <QuickSales
            userName={userName}
            userRole={userRole}
            onProjectSelect={handleProjectSelect}
            preSelectedProject={userRole === "staff" && shiftSetupCompleted ? selectedProject : undefined}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "live-feed":
        return (
          <LiveSalesFeed
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "leaderboard":
        return (
          <Leaderboard
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "messaging":
        return (
          <Messaging
            currentUser={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "rotation":
        return (
          <Rotation
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "profile":
        return (
          <StaffProfile
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "settings":
        return (
          <Settings
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "academy":
        return (
          <AspectAcademy
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );

      case "aspect-ai":
        return <AIAssistant userRole={userRole} />;

      default:
        return userRole === "admin" ? (
          <AdminDashboard
            userName={userName}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        ) : (
          <QuickSales
            userName={userName}
            userRole={userRole}
            onProjectSelect={handleProjectSelect}
            preSelectedProject={userRole === "staff" && shiftSetupCompleted ? selectedProject : undefined}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439]">
      <div className="max-w-[480px] mx-auto min-h-screen relative">
        {userRole === "admin" && !(showShiftChoice || showShiftSetup || showShiftEnd || showCurrentStock) && (
          <div className="fixed top-0 left-0 right-0 backdrop-blur-xl bg-gradient-to-br from-[#2a2a3a] via-[#3a3a4e] to-[#2f3439] border-b border-white/10 z-10 max-w-[480px] mx-auto">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#b8d4f1] to-[#9dd9ea] flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">
                    👨‍💼
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#a8e6cf] rounded-full border-2 border-[#2a2a3a]"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">{userName}</h3>
                  <p className="text-xs text-gray-400">Yönetici</p>
                </div>
              </div>

              <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
                <img src={logoImage} alt="Aspect Operations" className="h-44 w-auto object-contain" />
              </div>

              <div className="flex items-center gap-3">
                {activeTab !== "dashboard" && (
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                )}

                <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all active:scale-95">
                  <Bell className="w-5 h-5 text-white" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-[#ffd4a3] rounded-full border border-[#2a2a3a]"></div>
                </button>

                <HamburgerMenu
                  userName={userName}
                  userRole={userRole}
                  onLogout={handleLogout}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          </div>
        )}

        <main
          className={
            userRole === "admin" && !(showShiftChoice || showShiftSetup || showShiftEnd || showCurrentStock)
              ? "pt-20 pb-20"
              : userRole === "staff" && !(showShiftChoice || showShiftSetup || showShiftEnd || showCurrentStock)
              ? "pb-20"
              : ""
          }
        >
          {renderContent()}
        </main>

        {!(showShiftChoice || showShiftSetup || showShiftEnd || showCurrentStock) && (
          <NewBottomNav activeTab={activeTab} onTabChange={handleNavigate} userRole={userRole} />
        )}
      </div>
    </div>
  );
}