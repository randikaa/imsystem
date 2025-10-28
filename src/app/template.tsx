'use client';

import { AuthProvider } from '@/components/auth/auth-provider';

export default function Template({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
