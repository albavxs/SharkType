import { Snippet } from '@/lib/types'

export const gitSnippets: Snippet[] = [
  {
    id: 'git-001',
    concept: 'Basic Workflow',
    difficulty: 'easy',
    prompt: 'Execute o workflow basico: inicialize um repositorio, adicione todos os arquivos e crie o primeiro commit.',
    code: `git init
git add .
git commit -m "first commit"`,
  },
  {
    id: 'git-002',
    concept: 'Status & Diff',
    difficulty: 'easy',
    prompt: 'Verifique o estado atual do repositorio, veja as mudancas nao staged e as mudancas ja preparadas para commit.',
    code: `git status
git diff
git diff --staged`,
  },
  {
    id: 'git-003',
    concept: 'Branches',
    difficulty: 'easy',
    prompt: 'Crie uma nova branch para uma feature, mude para ela e depois delete-a apos o merge.',
    code: `git branch feature/login
git checkout feature/login
git branch -d feature/login`,
  },
  {
    id: 'git-004',
    concept: 'Remote',
    difficulty: 'easy',
    prompt: 'Conecte seu repositorio local a um repositorio remoto, envie os commits e sincronize com as mudancas remotas.',
    code: `git remote add origin https://github.com/user/repo.git
git push -u origin main
git pull origin main`,
  },
  {
    id: 'git-005',
    concept: 'Stash',
    difficulty: 'medium',
    prompt: 'Salve temporariamente seu trabalho em andamento sem criar um commit, liste os stashes e recupere o mais recente.',
    code: `git stash push -m "WIP: login form"
git stash list
git stash pop`,
  },
  {
    id: 'git-006',
    concept: 'Merge',
    difficulty: 'medium',
    prompt: 'Integre uma branch de feature na branch principal preservando o historico com um merge commit explicito.',
    code: `git checkout main
git merge feature/login --no-ff
git branch -d feature/login`,
  },
  {
    id: 'git-007',
    concept: 'Rebase',
    difficulty: 'medium',
    prompt: 'Reaplique os commits da sua branch de feature sobre a ponta da branch main para manter um historico linear.',
    code: `git checkout feature/auth
git rebase main
git rebase --continue`,
  },
  {
    id: 'git-008',
    concept: 'Log & Blame',
    difficulty: 'medium',
    prompt: 'Visualize o historico de commits em formato compacto com grafo, filtre por autor/periodo e identifique quem escreveu cada linha.',
    code: `git log --oneline --graph --all
git log --author="Alice" --since="1 week ago"
git blame -L 10,20 src/main.ts`,
  },
  {
    id: 'git-009',
    concept: 'Reset & Revert',
    difficulty: 'hard',
    prompt: 'Desfaca o ultimo commit mantendo as mudancas staged, sincronize forcadamente com o remoto e crie um commit de reversao seguro.',
    code: `git reset --soft HEAD~1
git reset --hard origin/main
git revert HEAD --no-edit`,
  },
  {
    id: 'git-010',
    concept: 'Cherry-pick & Bisect',
    difficulty: 'hard',
    prompt: 'Aplique commits especificos de outra branch e use busca binaria para encontrar qual commit introduziu um bug.',
    code: `git cherry-pick abc1234 def5678
git bisect start
git bisect bad HEAD
git bisect good v1.0.0`,
  },
]
