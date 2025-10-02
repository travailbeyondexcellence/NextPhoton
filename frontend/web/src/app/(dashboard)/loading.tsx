import { CenteredPageLoader } from '@/components/MinimalisticLoader';

export default function Loading() {
  return <CenteredPageLoader variant="orbit" message="Loading dashboard..." />;
}