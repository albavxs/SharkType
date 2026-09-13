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
]
