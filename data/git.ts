import { Snippet } from '@/lib/types'

export const gitSnippets: Snippet[] = [
  {
    id: 'git-001',
    concept: { pt: 'Workflow Básico', en: 'Basic Workflow' },
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
    concept: { pt: 'Status & Diff', en: 'Status & Diff' },
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
    concept: { pt: 'Branches', en: 'Branches' },
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
    concept: { pt: 'Stash', en: 'Stash' },
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
    concept: { pt: 'Merge', en: 'Merge' },
    difficulty: 'medium',
    prompt: {
      pt: 'Volta pra main, integra a branch de feature com merge explícito e limpa a branch depois.',
      en: 'Switch to main, merge the feature branch with an explicit merge commit, then clean up.',
    },
    code: `git checkout main
git merge feature/login --no-ff
git branch -d feature/login`,
  },
  {
    id: 'git-007',
    concept: { pt: 'Rebase', en: 'Rebase' },
    difficulty: 'medium',
    prompt: {
      pt: 'Reaplica os commits da sua feature em cima da main pra manter o histórico linear.',
      en: 'Rebase your feature commits on top of main for a clean linear history.',
    },
    code: `git checkout feature/auth
git rebase main
git rebase --continue`,
  },
  {
    id: 'git-008',
    concept: { pt: 'Log & Blame', en: 'Log & Blame' },
    difficulty: 'medium',
    prompt: {
      pt: 'Vê o histórico compacto com grafo, filtra por autor e período, e descobre quem escreveu cada linha.',
      en: 'View compact log with graph, filter by author and date range, and blame specific lines.',
    },
    code: `git log --oneline --graph --all
git log --author="Alice" --since="1 week ago"
git blame -L 10,20 src/main.ts`,
  },
  {
    id: 'git-009',
    concept: { pt: 'Reset & Revert', en: 'Reset & Revert' },
    difficulty: 'hard',
    prompt: {
      pt: 'Desfaz o último commit mantendo as mudanças staged, força o sync com o remote e reverte um commit de forma segura.',
      en: 'Undo the last commit keeping changes staged, hard reset to remote, and safely revert a commit.',
    },
    code: `git reset --soft HEAD~1
git reset --hard origin/main
git revert HEAD --no-edit`,
  },
  {
    id: 'git-010',
    concept: { pt: 'Cherry-pick & Bisect', en: 'Cherry-pick & Bisect' },
    difficulty: 'hard',
    prompt: {
      pt: 'Traz commits específicos de outra branch e usa bisect pra descobrir qual commit quebrou tudo.',
      en: 'Cherry-pick specific commits from another branch and use bisect to find the bug-introducing commit.',
    },
    code: `git cherry-pick abc1234 def5678
git bisect start
git bisect bad HEAD
git bisect good v1.0.0`,
  },
  {
    id: 'git-011',
    concept: { pt: 'Identidade Global', en: 'Global Identity Config' },
    difficulty: 'easy',
    prompt: {
      pt: 'Configura seu nome e email globalmente pra que seus commits fiquem identificados certinho.',
      en: 'Set up your global name and email so your commits are properly attributed.',
    },
    code: `git config --global user.name "Seu Nome"
git config --global user.email "voce@email.com"`,
  },
  {
    id: 'git-012',
    concept: { pt: 'Aliases', en: 'Aliases' },
    difficulty: 'easy',
    prompt: {
      pt: 'Cria atalhos globais pro checkout, branch e status pra digitar menos no dia a dia.',
      en: 'Create global shortcuts for checkout, branch, and status to save keystrokes.',
    },
    code: `git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status`,
  },
  {
    id: 'git-013',
    concept: { pt: 'Opções de Clone', en: 'Clone Options' },
    difficulty: 'easy',
    prompt: {
      pt: 'Clona um repo normalmente, depois uma branch específica, e por fim faz um shallow clone só com o último commit.',
      en: 'Clone a repo normally, then a specific branch, and finally a shallow clone with only the latest commit.',
    },
    code: `git clone https://github.com/user/repo.git
git clone -b feature https://github.com/user/repo.git
git clone --depth 1 https://github.com/user/repo.git`,
  },
  {
    id: 'git-014',
    concept: { pt: 'Amend de Commits', en: 'Amend Commits' },
    difficulty: 'medium',
    prompt: {
      pt: 'Corrige a mensagem do último commit e depois faz um amend sem mudar a mensagem.',
      en: 'Fix the last commit message and then amend without changing the message.',
    },
    code: `git commit --amend -m "feat: mensagem corrigida"
git commit --amend --no-edit`,
  },
  {
    id: 'git-015',
    concept: { pt: 'Restore Moderno', en: 'Modern Restore' },
    difficulty: 'medium',
    prompt: {
      pt: 'Usa git restore pra descartar mudanças de um arquivo, tirar do stage e restaurar tudo de uma vez.',
      en: 'Use git restore to discard file changes, unstage a file, and restore everything at once.',
    },
    code: `git restore arquivo.ts
git restore --staged arquivo.ts
git restore .`,
  },
  {
    id: 'git-016',
    concept: { pt: 'Stash Avançado', en: 'Advanced Stash' },
    difficulty: 'medium',
    prompt: {
      pt: 'Faz stash com e sem mensagem, recupera, lista os stashes salvos e dropa um específico.',
      en: 'Stash with and without a message, pop it back, list all stashes, and drop a specific one.',
    },
    code: `git stash
git stash push -m "wip: refatorando auth"
git stash pop
git stash list
git stash drop stash@{0}`,
  },
  {
    id: 'git-017',
    concept: { pt: 'Push & Pull com Opções', en: 'Push & Pull Options' },
    difficulty: 'medium',
    prompt: {
      pt: 'Sobe a branch pro remote, faz force push seguro, pull com rebase e atualiza as refs.',
      en: 'Push the branch upstream, force push safely, pull with rebase, and fetch remote refs.',
    },
    code: `git push -u origin main
git push --force-with-lease
git pull --rebase
git fetch origin`,
  },
  {
    id: 'git-018',
    concept: { pt: 'Gerenciar Remotes', en: 'Manage Remotes' },
    difficulty: 'easy',
    prompt: {
      pt: 'Adiciona um remote origin, confere os remotes configurados e remove um que não precisa mais.',
      en: 'Add an origin remote, check configured remotes, and remove one you no longer need.',
    },
    code: `git remote add origin https://github.com/user/repo.git
git remote -v
git remote remove origin`,
  },
  {
    id: 'git-019',
    concept: { pt: 'Tags de Versão', en: 'Version Tags' },
    difficulty: 'medium',
    prompt: {
      pt: 'Cria uma tag leve, depois uma anotada com mensagem e sobe todas as tags pro remote.',
      en: 'Create a lightweight tag, then an annotated one with a message, and push all tags to remote.',
    },
    code: `git tag v1.0.0
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin --tags`,
  },
  {
    id: 'git-020',
    concept: { pt: 'Log Compacto e Gráfico', en: 'Compact & Graphic Log' },
    difficulty: 'easy',
    prompt: {
      pt: 'Vê o log resumido, adiciona o grafo de branches e filtra por autor e data.',
      en: 'View the condensed log, add the branch graph, and filter by author and date.',
    },
    code: `git log --oneline
git log --oneline --graph --all
git log --author="Jane" --since="2024-01-01"`,
  },
]
