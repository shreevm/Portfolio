import type {Metadata} from 'next';
import { Space_Grotesk, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400'],
  style: ['italic'],
});

export const metadata: Metadata = {
  title: 'Shree Varaa Mangai V | AI Researcher & Software Engineer',
  description: 'Cinematic 3D Portfolio of Shree Varaa Mangai V, Master of Science in Artificial Intelligence Systems at the University of Florida.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="bg-[#080808] text-gray-100 font-sans antialiased">{children}</body>
    </html>
  );
}
