import { ServiceProvider, ServiceProviderCard } from "./ServiceProviderCard";

interface ServiceProviderListProps {
  providers: ServiceProvider[];
  onSelectProvider: (provider: ServiceProvider) => void;
}

export function ServiceProviderList({ providers, onSelectProvider }: ServiceProviderListProps) {
  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {providers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum prestador disponível no momento</p>
        </div>
      ) : (
        providers.map((provider) => (
          <ServiceProviderCard
            key={provider.id}
            provider={provider}
            onClick={() => onSelectProvider(provider)}
          />
        ))
      )}
    </div>
  );
}
