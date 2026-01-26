import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Proposta, Trabalho } from "../types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Calendar,
  MapPin,
  Filter,
  TrendingUp,
  Package,
  Send,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MyProposalsScreenProps {
  onBack?: () => void;
  onSelectRequest?: (requestId: string) => void;
}

// Mock data - Propostas do profissional
const mockMinhasPropostas: (Proposta & {
  trabalho?: Trabalho & { 
    nomeUsuario?: string;
    categoria_nome?: string;
  };
})[] = [
  {
    id: "mp1",
    id_profissional: "prof1",
    id_trabalho: "1",
    mensagem: "Olá! Sou especialista em reparos hidráulicos há 8 anos. Posso resolver seu problema hoje mesmo. Tenho todas as ferramentas necessárias.",
    valor_proposto: 140,
    data_proposta: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    profissional_nome: "João Silva",
    profissional_rating: 4.8,
    profissional_reviews: 127,
    status: "pendente",
    trabalho: {
      id: "1",
      problema: "Vazamento de água na torneira da cozinha",
      descricao: "A torneira está vazando continuamente, preciso de um profissional para fazer o reparo.",
      pagamento: 150,
      data_abertura: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      id_usuario: "user1",
      rua: "Rua das Flores",
      bairro: "Jardim Paulista",
      numero: "123",
      cidade: "São Paulo",
      cep: "01415-000",
      estado: "SP",
      status: "pendente",
      nomeUsuario: "Carlos Silva",
      categoria_nome: "Encanador"
    }
  },
  {
    id: "mp2",
    id_profissional: "prof1",
    id_trabalho: "9",
    mensagem: "Boa tarde! Tenho experiência com instalação de aquecedores a gás. Posso fazer amanhã de manhã com garantia de 1 ano.",
    valor_proposto: 380,
    data_proposta: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    profissional_nome: "João Silva",
    profissional_rating: 4.8,
    profissional_reviews: 127,
    status: "aceita",
    trabalho: {
      id: "9",
      problema: "Instalação de aquecedor a gás",
      descricao: "Preciso instalar aquecedor a gás no banheiro. Já comprei o equipamento.",
      pagamento: 400,
      data_abertura: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      id_usuario: "user9",
      rua: "Av. Brigadeiro Faria Lima",
      bairro: "Pinheiros",
      numero: "2500",
      cidade: "São Paulo",
      cep: "05426-000",
      estado: "SP",
      status: "aceito",
      nomeUsuario: "Fernanda Lima",
      categoria_nome: "Encanador"
    }
  },
  {
    id: "mp3",
    id_profissional: "prof1",
    id_trabalho: "10",
    mensagem: "Olá! Trabalho com manutenção de piscinas há 10 anos. Posso fazer uma inspeção gratuita primeiro.",
    valor_proposto: 500,
    data_proposta: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    profissional_nome: "João Silva",
    profissional_rating: 4.8,
    profissional_reviews: 127,
    status: "recusada",
    trabalho: {
      id: "10",
      problema: "Manutenção de piscina",
      descricao: "Piscina com vazamento e sistema de filtragem com problemas.",
      pagamento: 450,
      data_abertura: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      id_usuario: "user10",
      rua: "Rua dos Jardins",
      bairro: "Jardim Europa",
      numero: "890",
      cidade: "São Paulo",
      cep: "01453-000",
      estado: "SP",
      status: "aceito",
      nomeUsuario: "Ricardo Santos",
      categoria_nome: "Encanador"
    }
  },
  {
    id: "mp4",
    id_profissional: "prof1",
    id_trabalho: "11",
    mensagem: "Bom dia! Posso fazer o serviço hoje à tarde. Especialista em desentupimentos com garantia.",
    valor_proposto: 120,
    data_proposta: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    profissional_nome: "João Silva",
    profissional_rating: 4.8,
    profissional_reviews: 127,
    status: "pendente",
    trabalho: {
      id: "11",
      problema: "Desentupimento de pia da cozinha",
      descricao: "Pia entupida, água não está descendo.",
      pagamento: 100,
      data_abertura: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
      id_usuario: "user11",
      rua: "Rua da Consolação",
      bairro: "Consolação",
      numero: "1200",
      cidade: "São Paulo",
      cep: "01302-000",
      estado: "SP",
      status: "pendente",
      nomeUsuario: "Paula Costa",
      categoria_nome: "Encanador"
    }
  },
  {
    id: "mp5",
    id_profissional: "prof1",
    id_trabalho: "12",
    mensagem: "Olá! Trabalho com troca de encanamento há muitos anos. Posso fazer um orçamento sem compromisso.",
    valor_proposto: 1200,
    data_proposta: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    profissional_nome: "João Silva",
    profissional_rating: 4.8,
    profissional_reviews: 127,
    status: "recusada",
    trabalho: {
      id: "12",
      problema: "Troca completa de encanamento",
      descricao: "Encanamento antigo, precisa trocar tudo.",
      pagamento: 1500,
      data_abertura: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      id_usuario: "user12",
      rua: "Rua Oscar Freire",
      bairro: "Jardins",
      numero: "600",
      cidade: "São Paulo",
      cep: "01426-000",
      estado: "SP",
      status: "aceito",
      nomeUsuario: "Gabriel Souza",
      categoria_nome: "Encanador"
    }
  }
];

export function MyProposalsScreen({ onBack, onSelectRequest }: MyProposalsScreenProps) {
  const { user } = useAuth();
  const [propostas, setPropostas] = useState<typeof mockMinhasPropostas>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<string>("recentes");

  useEffect(() => {
    // TODO: Buscar do backend
    if (user?.role === "profissional") {
      setPropostas(mockMinhasPropostas);
    }
  }, [user]);

  // Filtragem
  const propostasFiltradas = propostas.filter(proposta => {
    if (filtroStatus === "todos") return true;
    return proposta.status === filtroStatus;
  });

  // Ordenação
  const propostasOrdenadas = [...propostasFiltradas].sort((a, b) => {
    if (ordenacao === "recentes") {
      return new Date(b.data_proposta).getTime() - new Date(a.data_proposta).getTime();
    } else {
      return new Date(a.data_proposta).getTime() - new Date(b.data_proposta).getTime();
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { 
        label: "Aguardando", 
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: <Clock className="w-3 h-3" />
      },
      aceita: { 
        label: "Aceita", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: <CheckCircle className="w-3 h-3" />
      },
      recusada: { 
        label: "Recusada", 
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: <XCircle className="w-3 h-3" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1 font-medium`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const total = propostas.length;
    const aceitas = propostas.filter(p => p.status === "aceita").length;
    const pendentes = propostas.filter(p => p.status === "pendente").length;
    const taxaAceitacao = total > 0 ? ((aceitas / total) * 100).toFixed(0) : "0";

    return { total, aceitas, pendentes, taxaAceitacao };
  };

  const stats = calcularEstatisticas();

  if (!user || user.role !== "profissional") return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Minhas Propostas
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Acompanhe todas as propostas que você enviou
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Enviadas</p>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-xs font-medium text-green-600 dark:text-green-400">Aceitas</p>
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.aceitas}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Pendentes</p>
          </div>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pendentes}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Taxa Aceitação</p>
          </div>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.taxaAceitacao}%</p>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Aguardando</SelectItem>
              <SelectItem value="aceita">Aceitas</SelectItem>
              <SelectItem value="recusada">Recusadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <Select value={ordenacao} onValueChange={setOrdenacao}>
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <SelectValue placeholder="Ordenar" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="antigos">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Propostas */}
      <div className="space-y-3">
        {propostasOrdenadas.length === 0 ? (
          <Card className="p-12 text-center bg-gray-50 dark:bg-gray-800/50">
            <Send className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
              {filtroStatus === "todos" ? "Nenhuma proposta ainda" : "Nenhuma proposta encontrada"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {filtroStatus === "todos" 
                ? "Envie propostas para pedidos de serviço disponíveis"
                : "Tente ajustar os filtros acima"}
            </p>
          </Card>
        ) : (
          propostasOrdenadas.map((proposta) => (
            <Card 
              key={proposta.id} 
              className="p-4 hover:shadow-md transition-all bg-white dark:bg-gray-800"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                        {proposta.trabalho?.categoria_nome}
                      </Badge>
                      {getStatusBadge(proposta.status)}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {proposta.trabalho?.problema}
                    </h3>
                  </div>
                </div>

                {/* Cliente e Data */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Enviada {formatDate(proposta.data_proposta)}</span>
                  </div>
                  {proposta.trabalho?.nomeUsuario && (
                    <span className="text-gray-600 dark:text-gray-400">
                      Cliente: {proposta.trabalho.nomeUsuario}
                    </span>
                  )}
                </div>

                {/* Valores */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor Cliente</p>
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      R$ {proposta.trabalho?.pagamento}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-400 mb-1">Sua Proposta</p>
                    <p className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      R$ {proposta.valor_proposto}
                    </p>
                  </div>
                </div>

                {/* Mensagem */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Sua mensagem:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {proposta.mensagem}
                  </p>
                </div>

                {/* Localização */}
                {proposta.trabalho && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {proposta.trabalho.bairro}, {proposta.trabalho.cidade}/{proposta.trabalho.estado}
                    </span>
                  </div>
                )}

                {/* Ações */}
                {proposta.status === "aceita" && (
                  <div className="pt-3 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Parabéns! Sua proposta foi aceita!</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Entre em contato com o cliente para combinar os detalhes
                    </p>
                  </div>
                )}

                {proposta.status === "recusada" && (
                  <div className="pt-3 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>O cliente escolheu outra proposta</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
