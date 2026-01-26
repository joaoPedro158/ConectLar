import { useState } from "react";
import { X, MapPin, Calendar, DollarSign, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../contexts/AuthContext";

interface CreateServiceRequestProps {
  onClose: () => void;
  onSubmit: (data: ServiceRequestData) => void;
  selectedCategory?: string | null;
}

export interface ServiceRequestData {
  problema: string;
  descricao: string;
  pagamento: number;
  categoria: string;
  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  cep: string;
  estado: string;
  complemento?: string;
  data_preferencial?: string;
}

const categorias = [
  { id: "1", nome: "Encanador" },
  { id: "2", nome: "Eletricista" },
  { id: "3", nome: "Limpeza" },
  { id: "4", nome: "Pintor" },
  { id: "5", nome: "Marceneiro" },
  { id: "6", nome: "Jardineiro" },
  { id: "7", nome: "Mecânico" }
];

export function CreateServiceRequest({ onClose, onSubmit, selectedCategory }: CreateServiceRequestProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ServiceRequestData>({
    problema: "",
    descricao: "",
    pagamento: 0,
    categoria: selectedCategory || "",
    rua: user?.role === "usuario" ? user.rua : "",
    bairro: user?.role === "usuario" ? user.bairro : "",
    numero: user?.role === "usuario" ? user.numero : "",
    cidade: user?.role === "usuario" ? user.cidade : "",
    cep: user?.role === "usuario" ? user.cep : "",
    estado: user?.role === "usuario" ? user.estado : "",
    complemento: user?.role === "usuario" ? user.complemento : "",
    data_preferencial: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Publicar Serviço</h2>
            <p className="text-sm text-gray-600">Descreva o serviço que você precisa</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Categoria do Serviço *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Selecione a categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Problema */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Título do Problema *
            </label>
            <Input
              name="problema"
              placeholder="Ex: Torneira vazando na cozinha"
              value={formData.problema}
              onChange={handleChange}
              required
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">Seja breve e objetivo</p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Descrição Detalhada *
            </label>
            <Textarea
              name="descricao"
              placeholder="Descreva o problema em detalhes, materiais necessários, urgência, etc."
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Pagamento e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Valor Oferecido (R$) *
              </label>
              <Input
                type="number"
                name="pagamento"
                placeholder="0.00"
                value={formData.pagamento || ""}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data Preferencial
              </label>
              <Input
                type="date"
                name="data_preferencial"
                value={formData.data_preferencial}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Local do Serviço
            </h3>
            
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

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Publicar Serviço
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}