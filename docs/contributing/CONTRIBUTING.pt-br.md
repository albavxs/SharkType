# Guia de Contribuição - SharkType 🦈

Obrigado por se interessar em contribuir para o **SharkType**! Este documento detalha a arquitetura técnica e como você pode ajudar a melhorar o projeto.

---

## 🏗️ Arquitetura e Estrutura do Projeto

O SharkType é construído utilizando **Next.js 15+** com a **App Router**, seguindo uma arquitetura modular baseada em hooks e provedores de contexto.

### Estrutura de Diretórios

| Diretório | Descrição |
|-----------|-----------|
| `app/` | Contém as rotas da aplicação, páginas e endpoints da API (Next.js App Router). |
| `components/` | Componentes React reutilizáveis, divididos por funcionalidade (auth, typing, stats, three). |
| `components/three/` | Implementações de efeitos visuais 3D utilizando **React Three Fiber** e **Three.js**. |
| `components/typing/` | Componentes centrais da interface de digitação (TypingArea, Toolbar, ResultScreen). |
| `data/` | Biblioteca de conteúdos. Contém os snippets de código organizados por linguagem/tecnologia. |
| `hooks/` | Lógica de estado e efeitos encapsulada em Custom Hooks (ex: `useTypingEngine`, `useProgress`). |
| `lib/` | Utilitários, definições de tipos, constantes e configurações do cliente **Supabase**. |
| `public/` | Ativos estáticos como ícones e manifestos. |

---

## ⚙️ Funcionamento Interno

### 1. Motor de Digitação (`useTypingEngine`)
A lógica central reside no hook `useTypingEngine.ts`. Ele gerencia:
- O estado de entrada do usuário.
- A validação de caracteres em tempo real (`pending`, `correct`, `incorrect`).
- O cálculo de métricas como **WPM** (Words Per Minute) e **Accuracy**.
- O controle de estados da sessão (`idle`, `running`, `finished`).

### 2. Persistência e Autenticação
Utilizamos o **Supabase** para:
- **Auth:** Gerenciamento de usuários e sessões (Google/GitHub/Email).
- **Database:** Armazenamento de progresso, recordes e estatísticas do usuário.
- **Middleware:** Proteção de rotas e sincronização de estado do servidor.

### 3. Visual e Experiência
- **Estilização:** Tailwind CSS 4 para um design moderno e responsivo.
- **Animações:** Framer Motion para transições suaves.
- **Efeitos 3D:** Backgrounds imersivos com partículas e orbes gerados via WebGL.

---

## 🛠️ Guia de Desenvolvimento

### Adicionando Novas Linguagens
Para adicionar uma nova linguagem de programação:
1. Crie um novo arquivo em `data/nome-da-linguagem.ts`.
2. Siga a interface `Snippet` definida em `lib/types.ts`.
3. Registre a nova linguagem no arquivo `data/index.ts`.

### Padronização de Código
- Utilize **TypeScript** para todas as novas funcionalidades.
- Documente funções complexas utilizando **JSDoc**.
- Siga as convenções de componentes do React (Functional Components + Hooks).

---

## 🌐 Internacionalização (i18n)
O projeto suporta múltiplos idiomas (PT-BR, EN). A lógica de tradução é gerenciada via `lib/i18n.ts` e o componente `LocaleProvider.tsx`.

---

## 🚀 Como Contribuir
1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`).
3. Faça o **Commit** de suas alterações (`git commit -m 'Add: nova funcionalidade'`).
4. Faça o **Push** para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um **Pull Request**.
