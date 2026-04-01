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
  {
    id: 'next-007',
    concept: { pt: 'Route Handlers (API)', en: 'Route Handlers (API)' },
    difficulty: 'medium',
    prompt: {
      pt: 'route.ts no App Router substitui as API Routes do Pages Router. Exporte funções GET, POST, etc. pra criar endpoints REST.',
      en: 'route.ts in the App Router replaces Pages Router API Routes. Export GET, POST, etc. functions to create REST endpoints.',
    },
    code: `// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const role = searchParams.get('role')

  const users = await db.user.findMany({
    where: role ? { role } : undefined,
  })

  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return NextResponse.json(user, { status: 201 })
}`,
  },
  {
    id: 'next-008',
    concept: { pt: 'Middleware', en: 'Middleware' },
    difficulty: 'hard',
    prompt: {
      pt: 'middleware.ts intercepta requisições antes de chegarem nas rotas. Use pra redirecionar usuários não autenticados e adicionar headers de segurança.',
      en: 'middleware.ts intercepts requests before they reach routes. Use it to redirect unauthenticated users and add security headers.',
    },
    code: `// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}`,
  },
  {
    id: 'next-009',
    concept: { pt: 'generateMetadata Dinâmico', en: 'Dynamic generateMetadata' },
    difficulty: 'hard',
    prompt: {
      pt: 'generateMetadata gera título, descrição e Open Graph dinâmicos por página. Crie metadata dinâmico pra uma página de post de blog.',
      en: 'generateMetadata generates dynamic title, description, and Open Graph per page. Create dynamic metadata for a blog post page.',
    },
    code: `// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`).then(r => r.json())

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`).then(r => r.json())

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}`,
  },
  {
    id: 'next-010',
    concept: { pt: 'generateStaticParams', en: 'generateStaticParams' },
    difficulty: 'hard',
    prompt: {
      pt: 'generateStaticParams pré-renderiza rotas dinâmicas no build, gerando páginas estáticas. Use pra pré-gerar todas as páginas de produto.',
      en: 'generateStaticParams pre-renders dynamic routes at build time, generating static pages. Use it to pre-generate all product pages.',
    },
    code: `// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products').then(r => r.json())

  return products.map((product) => ({
    id: String(product.id),
  }))
}

export const dynamicParams = false

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await fetch(
    \`https://api.example.com/products/\${id}\`,
    { next: { revalidate: 3600 } }
  ).then(r => r.json())

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}`,
  },
  {
    id: 'next-011',
    concept: { pt: 'Parallel Routes e Intercepting', en: 'Parallel Routes and Intercepting' },
    difficulty: 'hard',
    prompt: {
      pt: 'Parallel routes (@folder) renderizam múltiplas páginas no mesmo layout, e intercepting routes ((.)) capturam navegação pra exibir em modal. Combine ambos pra um modal de foto.',
      en: 'Parallel routes (@folder) render multiple pages in the same layout, and intercepting routes ((.)) capture navigation to display in a modal. Combine both for a photo modal.',
    },
    code: `// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

// app/@modal/(.)photos/[id]/page.tsx
import { Modal } from '@/components/Modal'

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return (
    <Modal>
      <img src={photo.url} alt={photo.title} />
      <h2>{photo.title}</h2>
    </Modal>
  )
}

// app/@modal/default.tsx
export default function Default() {
  return null
}`,
  },
  {
    id: 'next-012',
    concept: { pt: 'Cache e Revalidação', en: 'Caching and Revalidation' },
    difficulty: 'hard',
    prompt: {
      pt: 'Next.js cacheia fetch por padrão e oferece revalidação por tempo ou on-demand. Configure cache com revalidate, tags e revalidação manual.',
      en: 'Next.js caches fetch by default and offers time-based or on-demand revalidation. Configure cache with revalidate, tags, and manual revalidation.',
    },
    code: `// Revalidação por tempo (ISR)
const posts = await fetch('https://api.example.com/posts', {
  next: { revalidate: 60 },
}).then(r => r.json())

// Revalidação por tag
const product = await fetch(\`https://api.example.com/products/\${id}\`, {
  next: { tags: [\`product-\${id}\`] },
}).then(r => r.json())

// Revalidação on-demand (Server Action)
'use server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function updateProduct(id: string, data: FormData) {
  await db.product.update({ where: { id }, data: Object.fromEntries(data) })
  revalidateTag(\`product-\${id}\`)
  revalidatePath('/products')
}`,
  },
]
