import { X, ChevronRight, Shield, Moon, Sun, Bell, Lock, Eye, HelpCircle, Info, LogOut } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

interface SettingsScreenProps {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      logout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Configurações</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100 text-sm">
            Gerencie suas preferências e privacidade
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tema Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Aparência
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === "light" ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-400" />
                  )}
                  <span className="font-medium dark:text-white">Tema</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      theme === "light"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      theme === "dark"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacidade Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Privacidade e Segurança
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium dark:text-white">Privacidade</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Controle seus dados pessoais
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showPrivacyDetails ? 'rotate-90' : ''}`} />
              </button>

              {showPrivacyDetails && (
                <div className="border-t dark:border-gray-700 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm dark:text-gray-300">Perfil Visível</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm dark:text-gray-300">Localização Precisa</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm dark:text-gray-300">Notificações Push</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              )}

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium dark:text-white">Senha e Segurança</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Alterar senha e configurações
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Outros Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Suporte
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium dark:text-white">Central de Ajuda</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      FAQ e tutoriais
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Info className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium dark:text-white">Sobre o ConectLar</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Versão 1.0.0
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>

          {/* Footer Info */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-700">
            <p>ConectLar © 2026</p>
            <p className="mt-1">Conectando você aos melhores profissionais</p>
          </div>
        </div>
      </div>
    </div>
  );
}
