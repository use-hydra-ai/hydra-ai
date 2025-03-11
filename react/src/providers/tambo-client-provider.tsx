import TamboAI, { ClientOptions } from "@tambo-ai/typescript-sdk";
import { QueryClient } from "@tanstack/react-query";
import React, { createContext, PropsWithChildren, useState } from "react";

export interface TamboClientProviderProps {
  tamboUrl: string;
  apiKey: string;
}
export interface TamboClientContextProps {
  client: TamboAI;
  /** The tambo-specific query client */
  queryClient: QueryClient;
}

const TamboClientContext = createContext<TamboClientContextProps | undefined>(
  undefined,
);

export const TamboClientProvider: React.FC<
  PropsWithChildren<TamboClientProviderProps>
> = ({ children, tamboUrl, apiKey }) => {
  const tamboConfig: ClientOptions = { apiKey };
  if (tamboUrl) {
    tamboConfig.baseURL = tamboUrl;
  }
  const [client] = useState(() => new TamboAI(tamboConfig));
  const [queryClient] = useState(() => new QueryClient());
  return (
    <TamboClientContext.Provider value={{ client, queryClient }}>
      {children}
    </TamboClientContext.Provider>
  );
};

export const useTamboClient = () => {
  const context = React.useContext(TamboClientContext);
  if (context === undefined) {
    throw new Error("useTamboClient must be used within a TamboClientProvider");
  }
  return context.client;
};

export const useTamboQueryClient = () => {
  const context = React.useContext(TamboClientContext);
  if (context === undefined) {
    throw new Error(
      "useTamboQueryClient must be used within a TamboClientProvider",
    );
  }
  return context.queryClient;
};
