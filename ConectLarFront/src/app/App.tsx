import { useState } from "react";
import { Search, MapPin, Bell, Home, History, User, MessageCircle, Settings, Plus, FileText } from "lucide-react";
import logoConectLar from "../assets/conectlar.png";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider, useNotifications } from "./contexts/NotificationContext";
import { LoginScreen } from "./components/auth/LoginScreen";
import { RegisterScreen } from "./components/auth/RegisterScreen";
import { ServiceCategories } from "./components/ServiceCategories";
import { Trabalho, Proposta } from "./types";
import { Profile } from "./components/Profile";
import { HistoryScreen } from "./components/HistoryScreen";
import { DisputesScreen } from "./components/DisputesScreen";
import { ChatList } from "./components/chat/ChatList";
import { ChatWindow } from "./components/chat/ChatWindow";
import { SettingsScreen } from "./components/SettingsScreen";
import { NotificationScreen } from "./components/NotificationScreen";
import { Input } from "./components/ui/input";
import { CreateServiceRequest, ServiceRequestData } from "./components/CreateServiceRequest";
import { ServiceRequestList } from "./components/ServiceRequestList";
import { ServiceRequestDetail } from "./components/ServiceRequestDetail";
import { ProfessionalProfile } from "./components/ProfessionalProfile";
import { SendProposalModal } from "./components/SendProposalModal";
import { MyProposalsScreen } from "./components/MyProposalsScreen";
import { Button } from "./components/ui/button";
import { toast, Toaster } from "sonner";

const categorias = [
  { id: "1", nome: "Encanador" },
  { id: "2", nome: "Eletricista" },
  { id: "3", nome: "Limpeza" },
  { id: "4", nome: "Pintor" },
  { id: "5", nome: "Marceneiro" },
  { id: "6", nome: "Jardineiro" },
  { id: "7", nome: "Mecânico" }
];

type Screen = "home" | "requestDetail" | "professionalProfile" | "profile" | "history" | "disputes" | "chatList" | "chatWindow" | "myProposals";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const { unreadCount, addNotification } = useNotifications();
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
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalRequestData, setProposalRequestData] = useState<Trabalho | null>(null);
  
  // Lista de pedidos
  const [serviceRequests, setServiceRequests] = useState<(Trabalho & { 
    nomeUsuario?: string;
    categoria_nome?: string;
  })[]>([]);

  const [allPropostas, setAllPropostas] = useState<{ [key: string]: Proposta[] }>({});

 
  const mockProfessionals: { [key: string]: any } = {};


  if (!isAuthenticated) {
    if (authScreen === "login") {
      return <LoginScreen onSwitchToRegister={() => setAuthScreen("register")} />;
    }
    return <RegisterScreen onSwitchToLogin={() => setAuthScreen("login")} />;
  }

  const isCliente = user?.role === "usuario";
  const isProfissional = user?.role === "profissional";


  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.problema.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || 
                           selectedCategory === "8" || 
                           (request.categoria_nome && categorias.find(c => c.id === selectedCategory)?.nome === request.categoria_nome);
    
 
    if (isCliente) {
      return matchesSearch && matchesCategory && request.id_usuario === user?.id;
    }
    
   
    if (isProfissional) {
      return matchesSearch && matchesCategory && request.status === "pendente";
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        setCurrentScreen("home");
        break;
      case "history":
        setCurrentScreen("history");
        break;
      case "chat":
        setCurrentScreen("chatList");
        break;
      case "profile":
        setCurrentScreen("profile");
        break;
    }
  };

  const handleCreateServiceRequest = (data: ServiceRequestData) => {
    if (!user) return;
    
    const newRequest: Trabalho & { 
      nomeUsuario?: string;
      categoria_nome?: string;
    } = {
      id: Date.now().toString(),
      problema: data.problema,
      descricao: data.descricao,
      pagamento: data.pagamento,
      data_abertura: new Date().toISOString(),
      id_usuario: user.id,
      rua: data.rua,
      bairro: data.bairro,
      numero: data.numero,
      cidade: data.cidade,
      cep: data.cep,
      estado: data.estado,
      complemento: data.complemento,
      status: "pendente",
      nomeUsuario: user.nome,
      categoria_nome: categorias.find(c => c.id === data.categoria)?.nome
    };

    setServiceRequests([newRequest, ...serviceRequests]);
    setShowCreateRequest(false);
    toast.success("Serviço publicado com sucesso! Aguarde as propostas dos profissionais.");
  };

  const handleAcceptRequest = (requestId: string) => {
    if (!user || user.role !== "profissional") return;
    
    setServiceRequests(serviceRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: "aceito" as const, id_profissional: user.id }
        : req
    ));
    
    toast.success("Serviço aceito! Entre em contato com o cliente.");
  };

  const handleSelectRequest = (request: Trabalho) => {
    setSelectedRequest(request);
    setCurrentScreen("requestDetail");
  };

  const handleSelectProfessional = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setCurrentScreen("professionalProfile");
  };

  const handleAcceptProposal = (propostaId: string) => {
    toast.success("Proposta aceita! O profissional será notificado.");
  };

  const handleContactProfessional = () => {
    toast.info("Funcionalidade de chat em desenvolvimento");
  };

  const handleSendProposal = (request: Trabalho) => {
    setProposalRequestData(request);
    setShowProposalModal(true);
  };

  const handleSubmitProposal = (data: { mensagem: string; valor_proposto: number }) => {
    if (!user || !proposalRequestData) return;

    const newProposta: Proposta = {
      id: `prop_${Date.now()}`,
      id_profissional: user.id,
      id_trabalho: proposalRequestData.id,
      mensagem: data.mensagem,
      valor_proposto: data.valor_proposto,
      data_proposta: new Date().toISOString(),
      profissional_nome: user.nome,
      profissional_foto: mockProfessionals[user.id]?.foto,
      profissional_rating: mockProfessionals[user.id]?.rating,
      profissional_reviews: mockProfessionals[user.id]?.reviews,
      status: "pendente"
    };

    // Adicionar proposta à lista
    setAllPropostas(prev => ({
      ...prev,
      [proposalRequestData.id]: [...(prev[proposalRequestData.id] || []), newProposta]
    }));

    // Enviar notificação para o cliente (dono do pedido)
    addNotification({
      tipo: "nova_proposta",
      titulo: "Nova proposta recebida!",
      mensagem: `${user.nome} enviou uma proposta de R$ ${data.valor_proposto.toFixed(2)} para "${proposalRequestData.problema}"`,
      id_relacionado: proposalRequestData.id
    });

    setShowProposalModal(false);
    setProposalRequestData(null);
    toast.success("Proposta enviada com sucesso! O cliente será notificado.");
  };

  // Tela de detalhes do pedido
  if (currentScreen === "requestDetail" && selectedRequest) {
    const propostas = allPropostas[selectedRequest.id] || [];
    const userHasSentProposal = isProfissional && user ? propostas.some(p => p.id_profissional === user.id) : false;
    
    return (
      <ServiceRequestDetail
        request={selectedRequest}
        propostas={propostas}
        onBack={() => setCurrentScreen("home")}
        onSelectProfessional={handleSelectProfessional}
        onAcceptProposal={handleAcceptProposal}
        onSendProposal={() => handleSendProposal(selectedRequest)}
        userRole={user?.role}
        userHasSentProposal={userHasSentProposal}
      />
    );
  }


  if (currentScreen === "professionalProfile" && selectedProfessional) {
    const professional = mockProfessionals[selectedProfessional];
    if (!professional) {
      setCurrentScreen("home");
      return null;
    }
    return (
      <ProfessionalProfile
        professional={professional}
        onBack={() => setCurrentScreen("requestDetail")}
        onContact={handleContactProfessional}
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
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {currentScreen === "home" && (
              <>
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Sua Localização</span>
                  <span className="font-medium dark:text-white">
                    {user?.cidade && user?.estado 
                      ? `${user.cidade}, ${user.estado}` 
                      : "Não definida"}
                  </span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder={isProfissional ? "Buscar serviços disponíveis..." : "Buscar meus pedidos..."}
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
              <HistoryScreen serviceRequests={serviceRequests} />
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

        {/* Floating Action Button (apenas para clientes) - Posição fixa no canto direito */}
        {isCliente && currentScreen === "home" && (
          <button
            onClick={() => setShowCreateRequest(true)}
            className="fixed bottom-28 right-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-20 max-w-md"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
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
                activeTab === "home" ? "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Início</span>
            </button>

            <button
              onClick={() => handleTabChange("history")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "history" ? "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <History className="w-6 h-6" />
              <span className="text-xs font-medium">Histórico</span>
            </button>

            <button
              onClick={() => handleTabChange("chat")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${
                activeTab === "chat" ? "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xs font-medium">Chat</span>
            </button>

            <button
              onClick={() => handleTabChange("profile")}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "profile" ? "bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </div>
        </div>

        {/* Create Service Request Modal (apenas para clientes) */}
        {showCreateRequest && isCliente && (
          <CreateServiceRequest
            onClose={() => setShowCreateRequest(false)}
            onSubmit={handleCreateServiceRequest}
            selectedCategory={selectedCategory}
          />
        )}

        {/* Settings Screen */}
        {showSettingsScreen && (
          <SettingsScreen
            onClose={() => setShowSettingsScreen(false)}
          />
        )}

        {/* Send Proposal Modal (apenas para profissionais) */}
        {showProposalModal && isProfissional && proposalRequestData && (
          <SendProposalModal
            request={proposalRequestData}
            onClose={() => {
              setShowProposalModal(false);
              setProposalRequestData(null);
            }}
            onSubmit={handleSubmitProposal}
          />
        )}

        {/* Notification Screen */}
        {showNotificationScreen && (
          <NotificationScreen
            onClose={() => setShowNotificationScreen(false)}
          />
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