'use client';
import { usePathname } from 'next/navigation';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import EditorialMotion from './EditorialMotion';
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return usePathname() === '/' ? (
    <EditorialMotion>{children}</EditorialMotion>
  ) : (
    <EditorialMotion>
      <SiteHeader />
      {children}
      <SiteFooter />
    </EditorialMotion>
  );
}
