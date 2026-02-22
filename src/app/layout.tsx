import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: '모두의 리뷰 | All Reviews Hub',
  description: '여러 출처의 리뷰를 한 화면에서 비교하고 요약합니다.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
