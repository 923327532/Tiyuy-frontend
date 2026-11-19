'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/presentation/components/ThemeProvider';
import { ConditionalHeader } from '@/presentation/components/layout/ConditionalHeader/ConditionalHeader';
import { TiyuyAgentWidget } from '@/presentation/components/agent/TiyuyAgentWidget';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ConditionalHeader />
        <Toaster richColors position="top-right" />
        {children}
        <TiyuyAgentWidget />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
