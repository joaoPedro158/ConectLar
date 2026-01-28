import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Bell,
  Home,
  History,
  User,
  MessageCircle,
  Settings,
  Plus,
} from "lucide-react";
import logoConectLar from "../assets/conectlar.png";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  NotificationProvider,
  useNotifications,
} from "./contexts/NotificationContext";

import { LoginScreen } from "./components/auth/LoginScreen";
import { RegisterScreen } from "./components/auth/RegisterScreen";
import { ServiceCategories } from "./components/ServiceCategories";

import type { Trabalho } from "./types";
import {
  criarTrabalho,
  listarTrabalhosAbertos,
  solicitarTrabalho,
  buscarTrabalhos,
  historicoTrabalhos,
} from "./services/trabalhos";

import { Profile } from "./components/Profile";
import { HistoryScreen } from "./components/HistoryScreen";
import { DisputesScreen } from "./components/DisputesScreen";
import { ChatList } from "./components/chat/ChatList";
import { ChatWindow } from "./components/chat/ChatWindow";
import { SettingsScreen } from "./components/SettingsScreen";
import { NotificationScreen } from "./components/NotificationScreen";

import { Input } from "./components/ui/input";
import {
  CreateServiceRequest,
  ServiceRequestData,
} from "./components/CreateServiceRequest";
import { ServiceRequestList } from "./components/ServiceRequestList";
import { ServiceRequestDetail } from "./components/ServiceRequestDetail";

import { toast, Toaster } from "sonner";

type CategoriaEnum =
  | "ENCANADOR"
  | "ELETRICISTA"
  | "LIMPEZA"
  | "PINTOR"
  | "MARCENEIRO"
  | "JARDINEIRO"
  | "MECANICO"
  | "GERAL";

const categoriaMap: Record<string, CategoriaEnum> = {
  "1": "ENCANADOR",
  "2": "ELETRICISTA",
  "3": "LIMPEZA",
  "4": "PINTOR",
  "5": "MARCENEIRO",
  "6": "JARDINEIRO",
  "7": "MECANICO",
  "8": "GERAL",
};

type Screen =
  | "home"
  | "requestDetail"
  | "profile"
  | "history"
  | "disputes"
  | "chatList"
  | "chatWindow";

function AppContent() {
  const { isAuthenticated, user, isBootstrapping } = useAuth();
  const { unreadCount, syncFromTrabalhos } = useNotifications();

  const [authScreen, setAuthScreen] = useState<"login" | "register">("login");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState("home");

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);
  const [showNotificationScreen, setShowNotificationScreen] = useState(false);

  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Trabalho | null>(null);

  const [serviceRequests, setServiceRequests] = useState<
    (Trabalho & { nomeUsuario?: string; categoria_nome?: string })[]
  >([]);

  const cidade = user?.localizacao?.cidade;
  const estado = user?.localizacao?.estado;

  const isCliente = user?.role === "usuario";
  const isProfissional = user?.role === "profissional";

  const selectedEnum = selectedCategory ? categoriaMap[selectedCategory] : null;

  const loadAbertos = async () => {
    const abertos = await listarTrabalhosAbertos();
    const list = Array.isArray(abertos) ? abertos : [];
    setServiceRequests(list);
    syncFromTrabalhos(list);
  };


  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentScreen("home");
      setActiveTab("home");
      setSelectedChat(null);
      setSelectedRequest(null);
      setShowCreateRequest(false);
      setShowSettingsScreen(false);
      setShowNotificationScreen(false);
      setSearchQuery("");
      setSelectedCategory(null);
      setServiceRequests([]);
      return;
    }

    loadAbertos().catch((e) => {
      console.error(e);
      toast.error("Erro ao carregar serviços.");
    });

  }, [isAuthenticated]);


  useEffect(() => {
    if (!isAuthenticated) return;
    if (currentScreen !== "history") return;

    historicoTrabalhos()
      .then((hist) => {
        const list = Array.isArray(hist) ? hist : [];
        syncFromTrabalhos(list);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Erro ao carregar histórico.");
      });
  }, [isAuthenticated, currentScreen, syncFromTrabalhos]);


  useEffect(() => {
    if (!isAuthenticated) return;
    if (currentScreen !== "home") return;

    const q = searchQuery.trim();
    const isSearching = q.length >= 3;

    if (!isSearching) {
      loadAbertos().catch((e) => {
        console.error(e);
        toast.error("Erro ao carregar serviços.");
      });
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const result = await buscarTrabalhos(q);
        setServiceRequests(Array.isArray(result) ? result : []);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao buscar serviços");
      }
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, isAuthenticated, currentScreen]);


  const filteredRequests = useMemo(() => {
    if (!isAuthenticated) return [];

    const q = searchQuery.trim();
    const isSearching = q.length >= 3;

    return serviceRequests.filter((request) => {
      const matchesSearch = isSearching
        ? true
        : request.problema.toLowerCase().includes(q.toLowerCase()) ||
          request.descricao.toLowerCase().includes(q.toLowerCase());

      const matchesCategory =
        !selectedEnum ||
        selectedEnum === "GERAL" ||
        (request as any).categoria === selectedEnum;

      if (isCliente) {
        return (
          matchesSearch &&
          matchesCategory &&
          (request as any).idUsuario === user?.id
        );
      }

      if (isProfissional) {
        return matchesSearch && matchesCategory && request.status === "ABERTO";
      }

      return matchesSearch && matchesCategory;
    });
  }, [
    isAuthenticated,
    serviceRequests,
    searchQuery,
    selectedEnum,
    isCliente,
    isProfissional,
    user?.id,
  ]);

  if (isBootstrapping) return null;

  if (!isAuthenticated) {
    if (authScreen === "login") {
      return (
        <LoginScreen onSwitchToRegister={() => setAuthScreen("register")} />
      );
    }
    return <RegisterScreen onSwitchToLogin={() => setAuthScreen("login")} />;
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") setCurrentScreen("home");
    if (tab === "history") setCurrentScreen("history");
    if (tab === "chat") setCurrentScreen("chatList");
    if (tab === "profile") setCurrentScreen("profile");
  };

  const handleCreateServiceRequest = async (data: ServiceRequestData, images: File[]) => {
    const categoria: CategoriaEnum = categoriaMap[selectedCategory ?? "8"] ?? "GERAL";

    const payload = {
      categoria,
      localizacao: {
        rua: data.rua,
        bairro: data.bairro,
        numero: data.numero,
        cidade: data.cidade,
        cep: data.cep,
        estado: data.estado,
        complemento: data.complemento,
      },
      problema: data.problema,
      pagamento: data.pagamento,
      descricao: data.descricao,
    };

    await criarTrabalho(payload, images);

    await loadAbertos();
    setShowCreateRequest(false);
    toast.success("Serviço publicado com sucesso!");
  };

  const handleAcceptRequest = async (requestId: string | number) => {
    if (!isProfissional) return;

    try {
      await solicitarTrabalho(Number(requestId));
      await loadAbertos();
      setCurrentScreen("home");
      setSelectedRequest(null);
      toast.success("Serviço reservado! (EM_ESPERA)");
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao reservar serviço.");
    }
  };

  const handleSelectRequest = (request: Trabalho) => {
    setSelectedRequest(request);
    setCurrentScreen("requestDetail");
  };

  if (currentScreen === "requestDetail" && selectedRequest) {
    return (
      <ServiceRequestDetail
        request={selectedRequest as any}
        onBack={() => setCurrentScreen("home")}
        userRole={user?.role}
        userId={user?.id}
        onUpdated={loadAbertos}
        onReserve={(id) => handleAcceptRequest(String(id))}
      />
    );
  }


  if (currentScreen === "chatWindow" && selectedChat) {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex flex-col max-w-md mx-auto overflow-hidden">
        <ChatWindow
          chatId={selectedChat}
          onBack={() => setCurrentScreen("chatList")}
        />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-md mx-auto relative">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowSettingsScreen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>

              <img src={logoConectLar} alt="ConectLar" className="h-12" />

              <button
                onClick={() => setShowNotificationScreen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative transition-colors"
              >
                <Bell className="w-6 h-6 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {currentScreen === "home" && (
              <>
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Sua Localização
                  </span>
                  <span className="font-medium dark:text-white">
                    {cidade && estado ? `${cidade}, ${estado}` : "Não definida"}
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder={
                      isProfissional
                        ? "Buscar serviços disponíveis..."
                        : "Buscar meus pedidos..."
                    }
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {currentScreen === "home" && (
            <div className="p-4 space-y-4">
              <ServiceCategories
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              <ServiceRequestList
                requests={filteredRequests}
                onAccept={handleAcceptRequest}
                onSelectRequest={handleSelectRequest}
                userRole={user?.role}
                showAcceptButton={isProfissional}
              />
            </div>
          )}

          {currentScreen === "profile" && (
            <div className="p-4">
              <Profile />
            </div>
          )}

          {currentScreen === "history" && (
            <div className="p-4">
              <HistoryScreen onSelectRequest={handleSelectRequest} />
            </div>
          )}


          {currentScreen === "disputes" && (
            <div className="p-4">
              <DisputesScreen />
            </div>
          )}

          {currentScreen === "chatList" && (
            <ChatList
              onSelectChat={(chatId) => {
                setSelectedChat(chatId);
                setCurrentScreen("chatWindow");
              }}
            />
          )}
        </div>

        {isCliente && currentScreen === "home" && (
          <button
            onClick={() => setShowCreateRequest(true)}
            className="fixed bottom-28 right-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-20 max-w-md"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <Plus className="w-7 h-7" />
          </button>
        )}

        {/* Bottom Navigation */}
        <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-1 p-2">
            <button
              onClick={() => handleTabChange("home")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "home"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>

            <button
              onClick={() => handleTabChange("history")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "history"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <History className="w-6 h-6" />
              <span className="text-xs font-medium">Histórico</span>
            </button>

            <button
              onClick={() => handleTabChange("chat")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "chat"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Chat</span>
            </button>

            <button
              onClick={() => handleTabChange("profile")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </div>
        </div>

        {/* Modal criar serviço */}
        {showCreateRequest && isCliente && (
          <CreateServiceRequest
            onClose={() => setShowCreateRequest(false)}
            onSubmit={handleCreateServiceRequest}
            selectedCategory={selectedCategory}
          />
        )}

        {showSettingsScreen && (
          <SettingsScreen onClose={() => setShowSettingsScreen(false)} />
        )}

        {showNotificationScreen && (
          <NotificationScreen onClose={() => setShowNotificationScreen(false)} />
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
