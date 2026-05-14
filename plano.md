# Plano de Implementação - SharkType

Este plano detalha as correções e melhorias solicitadas para o menu de perfil do SharkType.

## 1. Correção da Animação do Arrow Back
- **Problema**: Bug na animação do botão de voltar (Arrow Left) no menu de perfil.
- **Análise**: O componente `Link` em `app/profile/page.tsx` utiliza `hover:scale-105 active:scale-95`. Isso pode causar um "salto" visual ou inconsistência com outros menus.
- **Solução**: Ajustar as classes de transição para garantir suavidade e consistência com o padrão do projeto (ex: `transition-opacity` ou ajuste no container).

## 2. Funcionalidade de Troca de Foto de Perfil
- **Objetivo**: Permitir que o usuário altere sua foto de perfil via URL.
- **Alterações no Frontend**:
    - Atualizar o hook `useAuth` (`AuthProvider.tsx`) para incluir `avatarUrl` na função `updateProfile`.
    - Adicionar um campo de input para `URL da Imagem` na página de perfil (`app/profile/page.tsx`).
    - Melhorar o preview da imagem no perfil para refletir as mudanças em tempo real.
- **Alterações no Backend**:
    - A rota `api/me/profile` já suporta `avatarUrl`, então apenas garantiremos que o fluxo de dados esteja correto.

## 3. Gestão de Versão e Entrega
- **Branch**: Criar uma nova branch chamada `dev`.
- **Commit**: Realizar o commit das alterações na branch `dev` sob o nome do desenvolvedor.
- **Validação**: Verificar se as alterações não quebram outras funcionalidades (como o ranking global que utiliza a foto de perfil).

---
*Nota: Não serão realizados commits na branch principal (main) conforme solicitado.*
