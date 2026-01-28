import { useState } from "react";
import { X, Send, Bug, AlertTriangle, HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SupportCenterProps {
  onClose: () => void;
}

type IssueType = "bug" | "feature" | "help" | "other";

export function SupportCenter({ onClose }: SupportCenterProps) {
  const [issueType, setIssueType] = useState<IssueType>("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const issueTypes = [
    { id: "bug" as IssueType, label: "Bug/Erro", icon: Bug, color: "bg-red-500" },
    { id: "feature" as IssueType, label: "Sugestão", icon: MessageSquare, color: "bg-blue-500" },
    { id: "help" as IssueType, label: "Ajuda", icon: HelpCircle, color: "bg-green-500" },
    { id: "other" as IssueType, label: "Outro", icon: AlertTriangle, color: "bg-orange-500" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular envio do relatório
    const report = {
      type: issueType,
      title,
      description,
      timestamp: new Date().toISOString(),
      user: JSON.parse(localStorage.getItem("conectlar_user") || "{}"),
    };

    console.log("Relatório enviado:", report);
    
    // Salvar no localStorage (simular envio para servidor)
    const existingReports = JSON.parse(localStorage.getItem("conectlar_support_reports") || "[]");
    localStorage.setItem("conectlar_support_reports", JSON.stringify([...existingReports, report]));

    setIsSubmitted(true);
    
    // Fechar após 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Relatório Enviado!</h3>
          <p className="text-gray-600">
            Obrigado pelo seu feedback. Nossa equipe irá analisar e responder em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Central de Suporte</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100 text-sm">
            Relate bugs, sugira melhorias ou peça ajuda
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tipo de Issue */}
          <div>
            <label className="block text-sm font-medium mb-3">Tipo de Relatório</label>
            <div className="grid grid-cols-2 gap-3">
              {issueTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = issueType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setIssueType(type.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`${type.color} p-3 rounded-full`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Ex: Erro ao fazer login"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descrição Detalhada
            </label>
            <textarea
              id="description"
              placeholder="Descreva o problema, sugestão ou dúvida com o máximo de detalhes possível..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Mínimo 10 caracteres
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> Quanto mais detalhes você fornecer, mais rápido conseguiremos ajudar!
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!title || description.length < 10}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar Relatório
          </Button>
        </form>
      </div>
    </div>
  );
}
