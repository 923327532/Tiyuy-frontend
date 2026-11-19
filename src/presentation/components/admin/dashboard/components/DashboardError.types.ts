export interface DashboardErrorProps {
  error: unknown;
  onRetry: () => void;
  isRetrying: boolean;
}