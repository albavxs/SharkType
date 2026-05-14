# SharkType

![SharkType Logo](./icons/SHARK_logo.png)

## 🇧🇷 Português

### Sobre o Projeto
O **SharkType** é uma aplicação interativa para prática de digitação, focada em melhorar a velocidade e precisão dos usuários através de snippets de código e textos.

### Stack Tecnológica
*   **Framework:** Next.js (App Router)
*   **Frontend:** React + TailwindCSS
*   **Backend/Auth:** Supabase
*   **Linguagem:** TypeScript

### Como Rodar Localmente

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz e adicione suas chaves do Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_aqui
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Acesse: [http://localhost:3000](http://localhost:3000)

> **Importante (OTP):** O SharkType utiliza códigos numéricos (OTP) para todas as verificações. No painel do Supabase (Authentication > Email Templates), você deve alterar todos os templates para usar `{{ .Token }}` em vez de links.

### Licença
Este projeto está sob a [Licença MIT](LICENSE).

---

## 🇬🇧 English

### About
**SharkType** is an interactive typing practice application focused on improving user speed and accuracy through code snippets and texts.

### Tech Stack
*   **Framework:** Next.js (App Router)
*   **Frontend:** React + TailwindCSS
*   **Backend/Auth:** Supabase
*   **Language:** TypeScript

### Local Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env.local` file in the root and add your Supabase keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url_here
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key_here
    ```

3.  **Run development server:**
    ```bash
    npm run dev
    ```
    Visit: [http://localhost:3000](http://localhost:3000)

> **Important (OTP):** SharkType uses numerical codes (OTP) for all verifications. In the Supabase dashboard (Authentication > Email Templates), you must change all templates to use `{{ .Token }}` instead of links.

### License
This project is licensed under the [MIT License](LICENSE).
