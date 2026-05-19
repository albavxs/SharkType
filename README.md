# 🦈 SharkType

🇧🇷 PT-BR | 🇺🇸 EN

---

# 🇧🇷 Português

## Sobre o Projeto

O **SharkType** é uma aplicação interativa de prática de digitação focada em melhorar velocidade, precisão e consistência através de snippets de código e textos dinâmicos.

A proposta é oferecer uma experiência moderna para desenvolvedores e entusiastas de tecnologia treinarem digitação em cenários mais próximos do dia a dia de programação.

---

## ✨ Funcionalidades

* ⚡ Testes de velocidade e precisão
* 💻 Prática com snippets de código
* 📊 Feedback instantâneo de desempenho
* 🎨 Interface moderna e responsiva
* 🔐 Sistema de autenticação

---

## 🛠️ Stack Tecnológica

| Tecnologia  | Descrição              |
| ----------- | ---------------------- |
| Next.js     | Framework principal    |
| React       | Interface da aplicação |
| TailwindCSS | Estilização            |
| TypeScript  | Linguagem principal    |
| Supabase    | Backend e autenticação |

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

### Scripts Disponíveis
- `npm run dev`: Inicia o ambiente de desenvolvimento.
- `npm run build`: Gera a build de produção otimizada.
- `npm run lint`: Executa a verificação de linting.

---

## 🌐 Internacionalização (i18n)
O projeto suporta múltiplos idiomas (PT-BR, EN). A lógica de tradução é gerenciada via `lib/i18n.ts` e o componente `LocaleProvider.tsx`, permitindo que tanto a interface quanto os snippets se adaptem à preferência do usuário.

---

## 🚀 Rodando Localmente

### Clone o repositório

```bash
git clone <repo-url>
```

### Entre na pasta do projeto

```bash
cd sharktype
```

### Instale as dependências

```bash
npm install
```

### Inicie o projeto

```bash
npm run dev
```

### Abra no navegador

```bash
http://localhost:3000
```

---

## 👨‍💻 Autor

<img src="https://avatars.githubusercontent.com/u/126200347?v=4" width="100" style="border-radius: 50%;" alt="Paulo Guilherme Santos Alves">

**Paulo Guilherme Santos Alves** ([@albavxs](https://github.com/albavxs))

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

# 🇺🇸 English

## About

**SharkType** is an interactive typing practice application focused on improving typing speed, accuracy, and consistency through dynamic texts and code snippets.

The project aims to provide a modern experience for developers and tech enthusiasts who want to practice typing in programming-oriented scenarios.

---

## ✨ Features

* ⚡ Speed and accuracy tests
* 💻 Code snippet typing practice
* 📊 Instant performance feedback
* 🎨 Modern and responsive UI
* 🔐 Authentication system

---

## 🛠️ Tech Stack

| Technology  | Purpose                  |
| ----------- | ------------------------ |
| Next.js     | Main framework           |
| React       | Frontend library         |
| TailwindCSS | Styling                  |
| TypeScript  | Main language            |
| Supabase    | Backend & authentication |

---

## 🏗️ Architecture and Project Structure

SharkType is built using **Next.js 15+** with the **App Router**, following a modular architecture based on hooks and context providers.

### Directory Structure

| Directory | Description |
|-----------|-------------|
| `app/` | Contains application routes, pages, and API endpoints (Next.js App Router). |
| `components/` | Reusable React components, divided by functionality (auth, typing, stats, three). |
| `components/three/` | 3D visual effects implementations using **React Three Fiber** and **Three.js**. |
| `components/typing/` | Core components of the typing interface (TypingArea, Toolbar, ResultScreen). |
| `data/` | Content library. Contains code snippets organized by language/technology. |
| `hooks/` | State and effect logic encapsulated in Custom Hooks (e.g., `useTypingEngine`, `useProgress`). |
| `lib/` | Utilities, type definitions, constants, and **Supabase** client configurations. |
| `public/` | Static assets like icons and manifests. |

---

## ⚙️ Internal Workings

### 1. Typing Engine (`useTypingEngine`)
The core logic resides in the `useTypingEngine.ts` hook. It manages:
- User input state.
- Real-time character validation (`pending`, `correct`, `incorrect`).
- Calculation of metrics like **WPM** (Words Per Minute) and **Accuracy**.
- Session state control (`idle`, `running`, `finished`).

### 2. Persistence and Authentication
We use **Supabase** for:
- **Auth:** User and session management (Google/GitHub/Email).
- **Database:** Storage of user progress, records, and statistics.
- **Middleware:** Route protection and server state synchronization.

### 3. Visuals and Experience
- **Styling:** Tailwind CSS 4 for a modern and responsive design.
- **Animations:** Framer Motion for smooth transitions.
- **3D Effects:** Immersive backgrounds with particles and orbs generated via WebGL.

---

## 🛠️ Development Guide

### Adding New Languages
To add a new programming language:
1. Create a new file in `data/language-name.ts`.
2. Follow the `Snippet` interface defined in `lib/types.ts`.
3. Register the new language in the `data/index.ts` file.

### Available Scripts
- `npm run dev`: Starts the development environment.
- `npm run build`: Generates the optimized production build.
- `npm run lint`: Runs linting checks.

---

## 🌐 Internationalization (i18n)
The project supports multiple languages (PT-BR, EN). Translation logic is managed via `lib/i18n.ts` and the `LocaleProvider.tsx` component, allowing both the interface and snippets to adapt to the user's preference.

---

## 🚀 Running Locally

### Clone the repository

```bash
git clone <repo-url>
```

### Open the project folder

```bash
cd sharktype
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Open in your browser

```bash
http://localhost:3000
```

---

## 👨‍💻 Author

<img src="https://avatars.githubusercontent.com/u/126200347?v=4" width="100" style="border-radius: 50%;" alt="Paulo Guilherme Santos Alves">

**Paulo Guilherme Santos Alves** ([@albavxs](https://github.com/albavxs))

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
