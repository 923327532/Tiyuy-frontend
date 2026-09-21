'use client';

import React from 'react';
import { InternationalVerificationGate } from '@/presentation/components/auth/InternationalVerificationGate';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InternationalVerificationGate>{children}</InternationalVerificationGate>;
}
