import { Snippet } from '@/lib/types'

export const gitSnippets: Snippet[] = [
  {
    id: 'git-001',
    concept: { pt: 'Fluxo Básico', en: 'Basic Workflow' },
    difficulty: 'easy',
    prompt: {
      pt: 'Inicia um repo do zero, adiciona tudo e faz o primeiro commit.',
      en: 'Initialize a repo from scratch, stage everything, and make the first commit.',
    },
    code: `git init
git add .
git commit -m "first commit"`,
  },
  {
    id: 'git-002',
    concept: { pt: 'Status e Diferenças', en: 'Status & Diff' },
    difficulty: 'easy',
    prompt: {
      pt: 'Checa o estado do repo, vê o que mudou fora do stage e o que já tá staged pro commit.',
      en: 'Check the repo state, view unstaged changes, and review what is already staged.',
    },
    code: `git status
git diff
git diff --staged`,
  },
  {
    id: 'git-003',
    concept: { pt: 'Ramificações', en: 'Branches' },
    difficulty: 'easy',
    prompt: {
      pt: 'Cria uma branch de feature, muda pra ela e depois deleta quando não precisar mais.',
      en: 'Create a feature branch, switch to it, then delete it once you are done.',
    },
    code: `git branch feature/login
git checkout feature/login
git branch -d feature/login`,
  },
  {
    id: 'git-004',
    concept: { pt: 'Repositório Remoto', en: 'Remote' },
    difficulty: 'easy',
    prompt: {
      pt: 'Conecta o repo local ao GitHub, sobe seus commits e puxa as atualizações.',
      en: 'Link your local repo to GitHub, push your commits, and pull remote changes.',
    },
    code: `git remote add origin https://github.com/user/repo.git
git push -u origin main
git pull origin main`,
  },
  {
    id: 'git-005',
    concept: { pt: 'Reserva', en: 'Stash' },
    difficulty: 'medium',
    prompt: {
      pt: 'Guarda suas mudanças no stash pra trocar de branch, lista os stashes e recupera o último.',
      en: 'Stash your WIP so you can switch branches, list stashes, and pop the latest one.',
    },
    code: `git stash push -m "WIP: login form"
git stash list
git stash pop`,
  },
  {
    id: 'git-006',
    concept: { pt: 'Mesclagem', en: 'Merge' },
    difficulty: 'medium',
    prompt: {
      pt: 'Volta pra main, integra a branch de feature com merge explícito e limpa a branch depois.',
      en: 'Switch to main, merge the feature branch with an explicit merge commit, then clean up.',
    },
    code: `git checkout main
git merge feature/login --no-ff
git branch -d feature/login`,
  },
]
