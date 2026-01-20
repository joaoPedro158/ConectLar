import { useState } from "react";
import { UserRole } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { UserPlus, User, Wrench, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { validarCNPJ, formatarCNPJ } from "../../utils/validators";

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

export function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
  const [step, setStep] = useState<"select" | "form">("select");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    categoria: "",
    cnpj: "",
    rua: "",
    bairro: "",
    numero: "",
    cidade: "",
    cep: "",
    estado: "",
    complemento: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cnpjValido, setCnpjValido] = useState<boolean | null>(null);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatar CNPJ automaticamente enquanto digita
    if (name === "cnpj") {
      const cnpjFormatado = formatarCNPJ(value);
      setFormData({ ...formData, [name]: cnpjFormatado });
      
      // Validar em tempo real se tiver 14 dígitos
      const cnpjLimpo = cnpjFormatado.replace(/[^\d]/g, '');
      if (cnpjLimpo.length === 14) {
        setCnpjValido(validarCNPJ(cnpjFormatado));
      } else {
        setCnpjValido(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!selectedRole) {
        throw new Error("Selecione o tipo de cadastro");
      }

      // Validar CNPJ para profissionais
      if (selectedRole === "profissional") {
        if (!validarCNPJ(formData.cnpj)) {
          throw new Error("CNPJ inválido. Por favor, verifique os dados.");
        }
      }

      await register(formData, selectedRole);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const categorias = [
    { id: "1", nome: "Encanador" },
    { id: "2", nome: "Eletricista" },
    { id: "3", nome: "Limpeza" },
    { id: "4", nome: "Pintor" },
    { id: "5", nome: "Marceneiro" },
    { id: "6", nome: "Jardineiro" },
    { id: "7", nome: "Mecânico" }
  ];

  // Etapa 1: Selecionar tipo de cadastro
  if (step === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <button
            onClick={onSwitchToLogin}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Criar Conta</h1>
            <p className="text-gray-600">Como você deseja se cadastrar?</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleSelectRole("usuario")}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors">
                  <User className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Cliente</h3>
                  <p className="text-sm text-gray-600">Buscar e contratar profissionais</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelectRole("profissional")}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                  <Wrench className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Profissional</h3>
                  <p className="text-sm text-gray-600">Oferecer seus serviços</p>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Etapa 2: Formulário de cadastro
  const roleColor = selectedRole === "usuario" ? "blue" : "green";
  const roleLabel = selectedRole === "usuario" ? "Cliente" : "Profissional";

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${roleColor}-500 to-${roleColor}-700 flex items-center justify-center p-4`}>
      <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setStep("select")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-${roleColor}-500 rounded-full mb-4`}>
            {selectedRole === "usuario" ? (
              <User className="w-8 h-8 text-white" />
            ) : (
              <Wrench className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">Cadastro de {roleLabel}</h1>
          <p className="text-gray-600">Preencha seus dados</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Dados Básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <Input
                name="nome"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone *</label>
              <Input
                name="telefone"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <Input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha *</label>
            <Input
              type="password"
              name="senha"
              placeholder="••••••••"
              value={formData.senha}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {/* Categoria (apenas para Profissional) */}
          {selectedRole === "profissional" && (
            <div>
              <label className="block text-sm font-medium mb-1">Categoria *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CNPJ (apenas para Profissional) */}
          {selectedRole === "profissional" && (
            <div>
              <label className="block text-sm font-medium mb-1">CNPJ *</label>
              <div className="relative">
                <Input
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                  maxLength={18}
                  className={`pr-10 ${
                    cnpjValido === true 
                      ? "border-green-500 focus:ring-green-500" 
                      : cnpjValido === false 
                      ? "border-red-500 focus:ring-red-500" 
                      : ""
                  }`}
                />
                {cnpjValido !== null && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {cnpjValido ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {cnpjValido === false && (
                <div className="flex items-center gap-1 mt-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">CNPJ inválido. Verifique os dígitos.</p>
                </div>
              )}
              {cnpjValido === true && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-green-600 text-sm">CNPJ válido!</p>
                </div>
              )}
            </div>
          )}

          {/* Endereço */}
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-3">Endereço</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">CEP *</label>
                <Input
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado *</label>
                <Input
                  name="estado"
                  placeholder="SP"
                  maxLength={2}
                  value={formData.estado}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cidade *</label>
                <Input
                  name="cidade"
                  placeholder="São Paulo"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bairro *</label>
                <Input
                  name="bairro"
                  placeholder="Centro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Rua *</label>
                <Input
                  name="rua"
                  placeholder="Rua das Flores"
                  value={formData.rua}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Número *</label>
                <Input
                  name="numero"
                  placeholder="123"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Complemento</label>
              <Input
                name="complemento"
                placeholder="Apto 10, Bloco B"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className={`w-full bg-${roleColor}-500 hover:bg-${roleColor}-600`}
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>
      </Card>
    </div>
  );
}