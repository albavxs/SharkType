# SharkType

![SharkType Logo](./icons/SHARK_logo.png)

## 🇧🇷 Português

### Sobre o Projeto

O SharkType é uma aplicação web interativa projetada para ajudar usuários a praticar e melhorar suas habilidades de digitação. Desenvolvido com Next.js, React e Supabase, oferece uma experiência de aprendizado gamificada com acompanhamento de progresso, placares de líderes e snippets de código para prática.

### Funcionalidades

*   **Prática de Digitação:** Diversos snippets de código e textos para aprimorar a velocidade e precisão.
*   **Acompanhamento de Progresso:** Monitoramento de WPM (palavras por minuto), precisão e outras métricas.
*   **Placar de Líderes:** Competição amigável com outros usuários.
*   **Autenticação:** Gerenciamento de usuários via Supabase.

### Tecnologias Utilizadas

*   **Framework:** Next.js (App Router)
*   **Biblioteca UI:** React
*   **Estilização:** TailwindCSS
*   **Banco de Dados & Autenticação:** Supabase
*   **Linguagem:** TypeScript

### Configuração do Supabase

Para configurar o Supabase para o projeto SharkType, siga os passos abaixo:

1.  Copie o arquivo `.env.example` para `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
2.  Preencha as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com as credenciais do seu projeto Supabase.
3.  Se você estiver usando um contrato de implantação mais antigo, `NEXT_PUBLIC_SUPABASE_ANON_KEY` também é aceito como fallback de compatibilidade, mas `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` é o nome preferencial.
4.  Defina `NEXT_PUBLIC_SITE_URL` para a URL do seu aplicativo (ex: `http://localhost:3000` para desenvolvimento local).
5.  Execute as migrações SQL localizadas em `supabase/migrations/202605130001_auth_progress.sql` e `supabase/migrations/202605130002_profiles_onboarding.sql` no seu banco de dados Supabase.
6.  No painel de autenticação do Supabase, habilite os provedores `GitHub` e `Email`.
7.  Configure o template de e-mail de cadastro para enviar o token OTP (One-Time Password), por exemplo, usando `{{ .Token }}`, pois o SharkType verifica o e-mail com uma tela de entrada de código em vez de um link mágico.
8.  Nas configurações de URL de autenticação do Supabase, defina a URL do site para o domínio do seu aplicativo e permita a rota de callback `/auth/callback`.

### Variáveis de Ambiente

O desenvolvimento local utiliza `.env.local`. Para implantações de produção e preview no Vercel, as mesmas variáveis públicas devem ser definidas nas configurações do projeto:

*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
*   (Opcional, fallback legado): `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `NEXT_PUBLIC_SITE_URL`

**Importante:** O Next.js incorpora variáveis `NEXT_PUBLIC_*` no bundle do cliente durante o tempo de build. Se você adicionar ou editar uma dessas variáveis no Vercel, você deve fazer um novo deploy para que os novos valores sejam aplicados na autenticação, cadastro, placar de líderes e sincronização.

### Como Rodar Localmente

Primeiro, instale as dependências:

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

Em seguida, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

Você pode começar a editar a página modificando `app/page.tsx`. A página será atualizada automaticamente conforme você edita o arquivo.

Este projeto usa [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar e carregar automaticamente [Geist](https://vercel.com/font), uma nova família de fontes para Vercel.

### Deploy no Vercel

A maneira mais fácil de fazer o deploy do SharkType é usando a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Antes de promover um deploy, confirme a lista de verificação de produção do Vercel (abaixo). Se o aplicativo exibir uma mensagem dizendo que as variáveis públicas do Supabase estão faltando no build, a correção usual é salvar as variáveis no Vercel e acionar um novo deploy.

#### Lista de Verificação de Produção Vercel

1.  Adicione as variáveis do Supabase para `Production` e `Preview` no painel do Vercel.
2.  Defina `NEXT_PUBLIC_SITE_URL` para a URL canônica do aplicativo para o ambiente de destino.
3.  Faça um novo deploy após cada alteração em `NEXT_PUBLIC_*`.
4.  No Supabase Auth, confirme se a URL do site corresponde ao aplicativo implantado.
5.  No Supabase Auth, confirme se `/auth/callback` é permitido como um caminho de redirecionamento/callback.
6.  Se o cadastro por e-mail estiver ativado, mantenha o template de e-mail OTP configurado com `{{ .Token }}`.

### Saiba Mais

Para saber mais sobre Next.js, consulte os seguintes recursos:

*   [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre os recursos e a API do Next.js.
*   [Aprenda Next.js](https://nextjs.org/learn) - um tutorial interativo do Next.js.

Você pode conferir o [repositório Next.js no GitHub](https://github.com/vercel/next.js) - seu feedback e contribuições são bem-vindos!

### Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

## 🇬🇧 English

### About the Project

SharkType is an interactive web application designed to help users practice and improve their typing skills. Developed with Next.js, React, and Supabase, it offers a gamified learning experience with progress tracking, leaderboards, and code snippets for practice.

### Features

*   **Typing Practice:** Various code and text snippets to enhance speed and accuracy.
*   **Progress Tracking:** Monitoring WPM (words per minute), accuracy, and other metrics.
*   **Leaderboard:** Friendly competition with other users.
*   **Authentication:** User management via Supabase.

### Technologies Used

*   **Framework:** Next.js (App Router)
*   **UI Library:** React
*   **Styling:** TailwindCSS
*   **Database & Authentication:** Supabase
*   **Language:** TypeScript

### Supabase Setup

To set up Supabase for the SharkType project, follow the steps below:

1.  Copy the `.env.example` file to `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
2.  Fill in the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` environment variables with your Supabase project credentials.
3.  If you are still using an older deployment contract, `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also accepted as a compatibility fallback, but `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the preferred name.
4.  Set `NEXT_PUBLIC_SITE_URL` to your application's URL (e.g., `http://localhost:3000` for local development).
5.  Run the SQL migrations located in `supabase/migrations/202605130001_auth_progress.sql` and `supabase/migrations/202605130002_profiles_onboarding.sql` in your Supabase database.
6.  In the Supabase authentication dashboard, enable the `GitHub` and `Email` providers.
7.  Configure the signup email template to send the OTP (One-Time Password) token, for example, using `{{ .Token }}`, because SharkType verifies email with a code entry screen instead of a magic link.
8.  In Supabase Auth URL settings, set the site URL to your app domain and allow the callback route `/auth/callback`.

### Environment Variables

Local development uses `.env.local`. For production and preview deployments on Vercel, the same public variables must be defined in the project settings:

*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
*   (Optional, legacy fallback): `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `NEXT_PUBLIC_SITE_URL`

**Important:** Next.js bakes `NEXT_PUBLIC_*` variables into the client bundle at build time. If you add or edit one of these variables in Vercel, you must redeploy for the new values to reach login, signup, leaderboard, and sync.

### Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Deploy on Vercel

The easiest way to deploy SharkType is with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Before promoting a deployment, confirm the Vercel production checklist (below). If the app shows a message saying the Supabase public variables are missing from the build, the usual fix is to save the variables in Vercel and trigger a new deployment.

#### Vercel Production Checklist

1.  Add the Supabase variables to both `Production` and `Preview` in the Vercel dashboard.
2.  Set `NEXT_PUBLIC_SITE_URL` to the canonical app URL for the target environment.
3.  Redeploy after every `NEXT_PUBLIC_*` change.
4.  In Supabase Auth, confirm the site URL matches the deployed app.
5.  In Supabase Auth, confirm `/auth/callback` is allowed as a redirect/callback path.
6.  If email signup is enabled, keep the OTP email template configured with `{{ .Token }}`.

### Learn More

To learn more about Next.js, take a look at the following resources:

*   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
*   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### License

This project is licensed under the [MIT License](LICENSE).
