import { useEffect, useState } from "react";
import { X, MapPin, Calendar, DollarSign, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../contexts/AuthContext";


interface CreateServiceRequestProps {
  onClose: () => void;
 onSubmit: (data: ServiceRequestData, images: File[]) => Promise<void> | void;
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
  { id: "7", nome: "Mecânico" },
];

export function CreateServiceRequest({
  onClose,
  onSubmit,
  selectedCategory,
}: CreateServiceRequestProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files ?? []);


  const onlyImages = files.filter(f => f.type.startsWith("image/"));
  setImages(prev => [...prev, ...onlyImages].slice(0, 6));
  e.target.value = "";
};

const removeImage = (idx: number) => {
  setImages(prev => prev.filter((_, i) => i !== idx));
};


  const loc = user?.localizacao;

   const [formData, setFormData] = useState<ServiceRequestData>({
     problema: "",
     descricao: "",
     pagamento: 0,
     categoria: selectedCategory || "",

     rua: loc?.rua ?? "",
     bairro: loc?.bairro ?? "",
     numero: loc?.numero ?? "",
     cidade: loc?.cidade ?? "",
     cep: loc?.cep ?? "",
     estado: loc?.estado ?? "",
     complemento: loc?.complemento ?? "",

     data_preferencial: "",
   });


  useEffect(() => {
    if (selectedCategory != null) {
      setFormData((prev) => ({ ...prev, categoria: selectedCategory }));
    }
  }, [selectedCategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;


    if (name === "pagamento") {
      const n = value === "" ? 0 : Number(value);
      setFormData((prev) => ({ ...prev, pagamento: n }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.categoria) return "Selecione uma categoria.";
    if (!formData.problema.trim()) return "Informe o título do problema.";
    if (!formData.descricao.trim()) return "Informe a descrição detalhada.";
    if (!formData.pagamento || Number.isNaN(formData.pagamento) || formData.pagamento < 0)
      return "Informe um valor válido.";
    if (!formData.cep.trim()) return "Informe o CEP.";
    if (!formData.estado.trim() || formData.estado.trim().length !== 2) return "Informe o estado (UF).";
    if (!formData.cidade.trim()) return "Informe a cidade.";
    if (!formData.bairro.trim()) return "Informe o bairro.";
    if (!formData.rua.trim()) return "Informe a rua.";
    if (!formData.numero.trim()) return "Informe o número.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData, images);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Erro ao publicar serviço.");
    } finally {
      setLoading(false);
    }
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
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

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
              disabled={loading}
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
            <label className="block text-sm font-medium mb-2">Título do Problema *</label>
            <Input
              name="problema"
              placeholder="Ex: Torneira vazando na cozinha"
              value={formData.problema}
              onChange={handleChange}
              required
              maxLength={100}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Seja breve e objetivo</p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-2">Descrição Detalhada *</label>
            <Textarea
              name="descricao"
              placeholder="Descreva o problema em detalhes, materiais necessários, urgência, etc."
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={4}
              className="resize-none"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Imagens (opcional)</label>

            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={onPickImages}
              disabled={loading}
            />

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {images.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt={file.name}
                        className="h-24 w-full object-cover rounded-lg border"
                        onLoad={() => URL.revokeObjectURL(url)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow"
                        title="Remover"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Você pode enviar até 6 imagens.
            </p>
          </div>


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
                value={formData.pagamento === 0 ? "" : String(formData.pagamento)}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Serviço"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
