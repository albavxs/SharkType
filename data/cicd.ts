import { Snippet } from '@/lib/types'

export const cicdSnippets: Snippet[] = [
  {
    id: 'cicd-001',
    concept: { pt: 'Workflow GitHub Actions Básico', en: 'Basic GitHub Actions Workflow' },
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
]
