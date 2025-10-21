import { CenteredPageLoader } from '@/components/loaders/MinimalisticLoader';

export default function Loading() {
  return <CenteredPageLoader variant="spinner" message="Loading..." />;
}