import { Wrench, Droplet, Zap, Paintbrush, Hammer, Sparkles, Trees, Car } from "lucide-react";

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const categories: ServiceCategory[] = [
  { id: "1", name: "Encanador", icon: Droplet, color: "bg-blue-500" },
  { id: "2", name: "Eletricista", icon: Zap, color: "bg-yellow-500" },
  { id: "3", name: "Limpeza", icon: Sparkles, color: "bg-purple-500" },
  { id: "4", name: "Pintor", icon: Paintbrush, color: "bg-pink-500" },
  { id: "5", name: "Marceneiro", icon: Hammer, color: "bg-orange-500" },
  { id: "6", name: "Jardineiro", icon: Trees, color: "bg-green-500" },
  { id: "7", name: "Mecânico", icon: Car, color: "bg-red-500" },
  { id: "8", name: "Geral", icon: Wrench, color: "bg-gray-600" }
];

interface ServiceCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string | null;
}

export function ServiceCategories({ onSelectCategory, selectedCategory }: ServiceCategoriesProps) {
  return (
    <div className="grid grid-cols-4 gap-3 px-4 py-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
              isSelected 
                ? 'bg-gray-100 dark:bg-gray-700 scale-105' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <div className={`${category.color} p-3 rounded-full`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-center dark:text-white">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}