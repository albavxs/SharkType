import { Snippet } from '@/lib/types'

export const cicdSnippets: Snippet[] = [
  {
    id: 'cicd-001',
    concept: { pt: 'Fluxo Básico do GitHub Actions', en: 'Basic GitHub Actions Workflow' },
    difficulty: 'medium',
    prompt: {
      pt: 'Cria um workflow de CI que roda os testes em push na main e em pull requests, usando Node 20.',
      en: 'Create a CI workflow that runs tests on push to main and on pull requests, using Node 20.',
    },
    code: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test`,
  },
  {
    id: 'cicd-002',
    concept: { pt: 'Deploy com GitHub Actions', en: 'Deploy with GitHub Actions' },
    difficulty: 'hard',
    prompt: {
      pt: 'Adiciona um job de deploy que depende dos testes, builda a imagem Docker tagueada com o SHA do commit e faz push pro registry.',
      en: 'Add a deploy job that depends on tests, builds a Docker image tagged with the commit SHA, and pushes it to the registry.',
    },
    code: `  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t app:\${{ github.sha }} .
      - name: Push para registry
        run: |
          docker tag app:\${{ github.sha }} registry/app:latest
          docker push registry/app:latest`,
  },
  {
    id: 'cicd-003',
    concept: { pt: 'Strategy Matrix', en: 'Matrix Strategy' },
    difficulty: 'medium',
    prompt: {
      pt: 'A strategy matrix roda o mesmo job com diferentes combinações de variáveis. Configure uma matrix pra testar em Node 18, 20 e 22 com diferentes SOs.',
      en: 'The strategy matrix runs the same job with different variable combinations. Configure a matrix to test on Node 18, 20, and 22 with different OSes.',
    },
    code: `jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, macos-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
      - run: npm ci
      - run: npm test`,
  },
  {
    id: 'cicd-004',
    concept: { pt: 'Cache de Dependências', en: 'Dependency Caching' },
    difficulty: 'medium',
    prompt: {
      pt: 'actions/cache salva e restaura o diretório node_modules entre runs, acelerando o CI. Configure cache baseado no hash do package-lock.json.',
      en: 'actions/cache saves and restores the node_modules directory between runs, speeding up CI. Configure cache based on the package-lock.json hash.',
    },
    code: `    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: \${{ runner.os }}-node-\${{ hashFiles('package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-node-
      - run: npm ci
      - run: npm run build`,
  },
  {
    id: 'cicd-005',
    concept: { pt: 'Secrets de Ambiente', en: 'Environment Secrets' },
    difficulty: 'medium',
    prompt: {
      pt: 'Secrets armazenam credenciais sensíveis de forma segura no GitHub. Use environments com proteção de aprovação pra separar staging de production.',
      en: 'Secrets store sensitive credentials securely in GitHub. Use environments with approval protection to separate staging from production.',
    },
    code: `  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    env:
      DATABASE_URL: \${{ secrets.DATABASE_URL }}
      API_KEY: \${{ secrets.API_KEY }}
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - name: Deploy para staging
        run: |
          echo "Deploying to \${{ vars.DEPLOY_URL }}"
          npm run deploy -- --env staging
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}`,
  },
  {
    id: 'cicd-006',
    concept: { pt: 'Pipeline Básica GitLab CI', en: 'Basic GitLab CI Pipeline' },
    difficulty: 'medium',
    prompt: {
      pt: '.gitlab-ci.yml define stages e jobs pra CI/CD no GitLab. Crie uma pipeline com stages de test, build e deploy com cache de node_modules.',
      en: '.gitlab-ci.yml defines stages and jobs for CI/CD in GitLab. Create a pipeline with test, build, and deploy stages with node_modules caching.',
    },
    code: `image: node:20-alpine

stages:
  - test
  - build
  - deploy

cache:
  key: \$CI_COMMIT_REF_SLUG
  paths:
    - node_modules/

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm test

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/`,
  },
  {
    id: 'cicd-007',
    concept: { pt: 'Pipeline Multi-stage GitLab', en: 'GitLab Multi-stage Pipeline' },
    difficulty: 'hard',
    prompt: {
      pt: 'Pipelines avançadas do GitLab usam rules, needs e environments pra controlar fluxo. Configure deploy condicional com aprovação manual pra produção.',
      en: 'Advanced GitLab pipelines use rules, needs, and environments to control flow. Configure conditional deploy with manual approval for production.',
    },
    code: `deploy-staging:
  stage: deploy
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - npm run deploy:staging
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"

deploy-production:
  stage: deploy
  environment:
    name: production
    url: https://example.com
  script:
    - npm run deploy:production
  needs: ["test", "build"]
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
      allow_failure: false`,
  },
  {
    id: 'cicd-008',
    concept: { pt: 'Docker Build e Push no CI', en: 'Docker Build and Push in CI' },
    difficulty: 'hard',
    prompt: {
      pt: 'Automatize o build e push de imagens Docker no CI com multi-stage build, tagging por SHA e latest, e login no registry.',
      en: 'Automate Docker image build and push in CI with multi-stage build, SHA and latest tagging, and registry login.',
    },
    code: `  build-image:
    runs-on: ubuntu-latest
    permissions:
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            ghcr.io/\${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max`,
  },
  {
    id: 'cicd-009',
    concept: { pt: 'Workflow Reutilizável', en: 'Reusable Workflow' },
    difficulty: 'hard',
    prompt: {
      pt: 'workflow_call permite criar workflows reutilizáveis que outros repos podem chamar. Defina um workflow de CI genérico com inputs e secrets configuráveis.',
      en: 'workflow_call allows creating reusable workflows that other repos can call. Define a generic CI workflow with configurable inputs and secrets.',
    },
    code: `# .github/workflows/ci-reusable.yml
name: Reusable CI

on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '20'
      run-e2e:
        type: boolean
        default: false
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ inputs.node-version }}
      - run: npm ci
      - run: npm test
      - if: \${{ inputs.run-e2e }}
        run: npm run test:e2e`,
  },
  {
    id: 'cicd-010',
    concept: { pt: 'Branch Protection e Required Checks', en: 'Branch Protection and Required Checks' },
    difficulty: 'medium',
    prompt: {
      pt: 'Status checks garantem que a CI passa antes de permitir merge. Configure um workflow que reporta status e funciona como required check na branch main.',
      en: 'Status checks ensure CI passes before allowing merge. Configure a workflow that reports status and works as a required check on the main branch.',
    },
    code: `name: Required Checks

on:
  pull_request:
    branches: [main]

concurrency:
  group: \${{ github.workflow }}-\${{ github.head_ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    needs: [lint, typecheck]
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage`,
  },
]
