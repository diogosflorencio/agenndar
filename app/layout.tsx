import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agenndar - O futuro do seu negócio de serviços',
  description: 'Gerencie sua agenda, equipe e financeiro em um só lugar. O Agenndar é a plataforma premium para profissionais que buscam excelência.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="bg-background-dark min-h-screen text-white antialiased overflow-x-hidden selection:bg-primary/30">
        {children}
      </body>
    </html>
  )
}

