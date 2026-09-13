import { Snippet } from '@/lib/types'

export const nextjsSnippets: Snippet[] = [
  {
    id: 'next-001',
    concept: { pt: 'Server Component', en: 'Server Component' },
    difficulty: 'easy',
    prompt: {
      pt: 'No App Router do Next.js, todo componente é Server Component por padrão -- roda no servidor e pode fazer fetch direto. Crie uma página que busca e exibe dados sem useEffect.',
      en: 'In Next.js App Router, every component is a Server Component by default -- it runs on the server and can fetch directly. Create a page that fetches and displays data without useEffect.',
    },
    code: `export default async function UsersPage() {
  const res = await fetch('https://api.example.com/users');
  const users = await res.json();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
  },
  {
    id: 'next-002',
    concept: { pt: 'Client Component', en: 'Client Component' },
    difficulty: 'easy',
    prompt: {
      pt: '"use client" marca um componente pra rodar no browser, habilitando hooks como useState e useEffect. Crie um contador interativo como Client Component.',
      en: '"use client" marks a component to run in the browser, enabling hooks like useState and useEffect. Create an interactive counter as a Client Component.',
    },
    code: `'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
    </div>
  )
}`,
  },
  {
    id: 'next-003',
    concept: { pt: 'Rotas Dinâmicas', en: 'Dynamic Routes' },
    difficulty: 'medium',
    prompt: {
      pt: 'Pastas com [param] criam rotas dinâmicas no App Router. Crie uma página de produto que recebe o id da URL e busca os dados no servidor.',
      en: 'Folders with [param] create dynamic routes in the App Router. Create a product page that receives the id from the URL and fetches data on the server.',
    },
    code: `// app/products/[id]/page.tsx
import { notFound } from 'next/navigation'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await fetch(\`https://api.example.com/products/\${id}\`)
  if (!res.ok) notFound()

  const product = await res.json()

  return (
    <div>
      <h1>{product.name}</h1>
      <p>R$ {product.price.toFixed(2)}</p>
    </div>
  )
}`,
  },
  {
    id: 'next-004',
    concept: { pt: 'Layout e Template', en: 'Layout and Template' },
    difficulty: 'medium',
    prompt: {
      pt: 'layout.tsx envolve todas as páginas filhas e preserva estado entre navegações. Crie um layout raiz com metadados, fontes e um nav persistente.',
      en: 'layout.tsx wraps all child pages and preserves state across navigations. Create a root layout with metadata, fonts, and a persistent nav.',
    },
    code: `// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meu App',
  description: 'Feito com Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav>
          <a href="/">Home</a>
          <a href="/about">Sobre</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}`,
  },
  {
    id: 'next-005',
    concept: { pt: 'Server Actions', en: 'Server Actions' },
    difficulty: 'medium',
    prompt: {
      pt: 'Server Actions são funções async marcadas com "use server" que rodam no servidor e podem ser chamadas de formulários. Crie uma action pra salvar dados de um form.',
      en: 'Server Actions are async functions marked with "use server" that run on the server and can be called from forms. Create an action to save form data.',
    },
    code: `// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await db.post.create({ data: { title, content } })
  revalidatePath('/posts')
}

// app/posts/new/page.tsx
import { createPost } from '@/app/actions'

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Publicar</button>
    </form>
  )
}`,
  },
  {
    id: 'next-006',
    concept: { pt: 'Loading e Error UI', en: 'Loading and Error UI' },
    difficulty: 'medium',
    prompt: {
      pt: 'loading.tsx exibe uma UI de carregamento automática via Suspense, e error.tsx captura erros da página. Crie ambos pra uma rota de dashboard.',
      en: 'loading.tsx shows an automatic loading UI via Suspense, and error.tsx catches page errors. Create both for a dashboard route.',
    },
    code: `// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  )
}

// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div role="alert">
      <h2>Algo deu errado!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}`,
  },
]
