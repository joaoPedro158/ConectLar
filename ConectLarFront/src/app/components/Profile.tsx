import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, Mail, Phone, MapPin, Edit2, Save, LogOut, Shield, Camera } from "lucide-react";
import { Profissional } from "../types";

interface ProfileProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export function Profile({ onBack, onLogout }: ProfileProps) {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  if (!user) return null;

  const displayName = user?.nome || user?.email || "U";

  const currentPhoto =
    (formData as Profissional)?.foto ||
    (user as Profissional)?.foto ||
    undefined;

  const loc = formData?.localizacao || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      localizacao: {
        ...(prev.localizacao || {}),
        [name]: value,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev: any) => ({ ...prev, foto: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleSave = async () => {
    await updateUser({
      nome: formData.nome,
      telefone: formData.telefone,
      localizacao: formData.localizacao,
    } as any);

    setIsEditing(false);
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case "usuario": return "Cliente";
      case "profissional": return "Profissional";
      case "admin": return "Administrador";
      default: return String(user.role);
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case "usuario": return "bg-blue-500";
      case "profissional": return "bg-green-500";
      case "admin": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
              <Avatar className="w-20 h-20 border-2 border-gray-100 dark:border-gray-700">
                <AvatarImage src={currentPhoto} alt={displayName} className="object-cover" />
                <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold dark:text-white">{user.nome}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-white text-xs ${getRoleColor()} mt-1`}>
                {getRoleLabel()}
              </span>
              {isEditing && <p className="text-xs text-gray-500 mt-1">Clique na foto para alterar</p>}
            </div>
          </div>

          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData(user);
                  setIsEditing(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Informações do Perfil */}
      {user.role !== "admin" && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 dark:text-white">Informações Pessoais</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  Nome
                </label>
                {isEditing ? (
                  <Input name="nome" value={formData.nome || ""} onChange={handleChange} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{user.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-2 dark:text-gray-300">
                  <Phone className="w-4 h-4" />
                  Telefone
                </label>
                {isEditing ? (
                  <Input name="telefone" value={formData.telefone || ""} onChange={handleChange} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{user.telefone || "-"}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-2 dark:text-gray-300">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Endereço */}
      {user.role !== "admin" && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 dark:text-white">
            <MapPin className="w-5 h-5" />
            Endereço
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">CEP</label>
                {isEditing ? (
                  <Input name="cep" value={loc.cep || ""} onChange={handleLocChange} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{loc.cep || "-"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Estado</label>
                {isEditing ? (
                  <Input name="estado" value={loc.estado || ""} onChange={handleLocChange} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{loc.estado || "-"}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Cidade</label>
                {isEditing ? (
                  <Input name="cidade" value={loc.cidade || ""} onChange={handleLocChange} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{loc.cidade || "-"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Bairro</label>
                {isEditing ? (
                  <Input name="bairro" value={loc.bairro || ""} onChange={handleLocChange} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{loc.bairro || "-"}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Rua</label>
                {isEditing ? (
                  <Input name="rua" value={loc.rua || ""} onChange={handleLocChange} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{loc.rua || "-"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Número</label>
                {isEditing ? (
                  <Input name="numero" value={loc.numero || ""} onChange={handleLocChange} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{loc.numero || "-"}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Complemento</label>
              {isEditing ? (
                <Input name="complemento" value={loc.complemento || ""} onChange={handleLocChange} />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{loc.complemento || "-"}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Admin Info */}
      {user.role === "admin" && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold dark:text-white">Painel Administrativo</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acesso total ao sistema</p>
            </div>
          </div>
          <div className="space-y-2 text-sm dark:text-gray-300">
            <p><strong>Nome:</strong> {user.nome}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </Card>
      )}

      <Button
        variant="outline"
        className="w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 dark:border-red-800"
        onClick={logout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sair da Conta
      </Button>
    </div>
  );
}
