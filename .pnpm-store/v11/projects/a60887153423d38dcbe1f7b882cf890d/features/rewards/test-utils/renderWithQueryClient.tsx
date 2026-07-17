import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const testQueryClients = new Set<QueryClient>();

afterEach(() => {
  testQueryClients.forEach((queryClient) => queryClient.clear());
  testQueryClients.clear();
});

export function createTestQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  testQueryClients.add(queryClient);
  return queryClient;
}

export function createQueryClientWrapper() {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, Wrapper };
}
