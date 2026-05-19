"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ServiceItem } from "@/types";

interface ServiceCartContextType {
  services: ServiceItem[];
  addService: (service: ServiceItem) => void;
  removeService: (id: string) => void;
  clearServiceCart: () => void;
  hasService: (id: string) => boolean;
  serviceCount: number;
}

const ServiceCartContext = createContext<ServiceCartContextType | undefined>(undefined);

const STORAGE_KEY = "skin-essential-service-cart";

export function ServiceCartProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setServices(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const addService = (service: ServiceItem) => {
    setServices((prev) =>
      prev.find((s) => s.id === service.id) ? prev : [...prev, service]
    );
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const clearServiceCart = () => setServices([]);

  const hasService = (id: string) => services.some((s) => s.id === id);

  return (
    <ServiceCartContext.Provider
      value={{
        services,
        addService,
        removeService,
        clearServiceCart,
        hasService,
        serviceCount: services.length,
      }}
    >
      {children}
    </ServiceCartContext.Provider>
  );
}

export function useServiceCart() {
  const ctx = useContext(ServiceCartContext);
  if (!ctx) throw new Error("useServiceCart must be used inside ServiceCartProvider");
  return ctx;
}
