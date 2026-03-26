import { Snippet } from '@/lib/types'

export const dockerSnippets: Snippet[] = [
  {
    id: 'docker-001',
    concept: 'FROM e CMD',
    difficulty: 'easy',
    prompt: 'Crie um Dockerfile para uma aplicacao Node.js: defina a imagem base alpine, o diretorio de trabalho, copie os arquivos, instale dependencias e defina o comando de inicializacao.',
    code: `FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm ci

CMD ["node", "server.js"]`,
  },
  {
    id: 'docker-002',
    concept: 'ENV e EXPOSE',
    difficulty: 'easy',
    prompt: 'Configure variaveis de ambiente para uma aplicacao Python desabilitando bytecode e buffer, defina a porta e exponha-a.',
    code: `FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PORT=8000

EXPOSE 8000`,
  },
  {
    id: 'docker-003',
    concept: 'ARG e Labels',
    difficulty: 'easy',
    prompt: 'Defina argumentos de build para versao e data, e adicione labels de metadados a imagem com os valores desses argumentos.',
    code: `ARG APP_VERSION=1.0.0
ARG BUILD_DATE

LABEL maintainer="dev@example.com" \\
      version="$APP_VERSION" \\
      build-date="$BUILD_DATE"`,
  },
  {
    id: 'docker-004',
    concept: 'COPY e RUN',
    difficulty: 'easy',
    prompt: 'Compile uma aplicacao Go: copie primeiro os arquivos de modulo para cachear dependencias, depois copie o codigo e compile o binario.',
    code: `FROM golang:1.22-alpine AS build

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o /app ./cmd/server`,
  },
  {
    id: 'docker-005',
    concept: 'Multi-stage Build',
    difficulty: 'medium',
    prompt: 'Use multi-stage build para compilar um frontend React e servir apenas os arquivos estaticos com Nginx, sem incluir Node.js na imagem final.',
    code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
  },
  {
    id: 'docker-006',
    concept: 'HEALTHCHECK',
    difficulty: 'medium',
    prompt: 'Adicione um health check a uma aplicacao Python FastAPI que verifica o endpoint /health a cada 30 segundos com timeout de 5s.',
    code: `FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \\
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]`,
  },
  {
    id: 'docker-007',
    concept: 'ENTRYPOINT e CMD',
    difficulty: 'medium',
    prompt: 'Crie uma imagem Alpine com ferramentas de rede, um script de entrypoint executavel e CMD como argumento padrao substituivel.',
    code: `FROM alpine:3.19

RUN apk add --no-cache curl jq

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["--help"]`,
  },
  {
    id: 'docker-008',
    concept: 'USER e VOLUME',
    difficulty: 'medium',
    prompt: 'Execute a aplicacao como usuario nao-root por seguranca: crie grupo e usuario dedicados, transfira propriedade dos arquivos e declare um volume para persistencia.',
    code: `FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

COPY --chown=appuser:appgroup . .
RUN npm ci --omit=dev

VOLUME ["/app/data"]
USER appuser

CMD ["node", "server.js"]`,
  },
  {
    id: 'docker-009',
    concept: 'Build Otimizado',
    difficulty: 'hard',
    prompt: 'Use cargo-chef para cache otimizado de dependencias Rust em multi-stage: prepare o recipe, cozinhe as dependencias em cache separado e compile a aplicacao final.',
    code: `FROM rust:1.77-slim AS chef
RUN cargo install cargo-chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/server /usr/local/bin/
CMD ["server"]`,
  },
  {
    id: 'docker-010',
    concept: 'Docker Compose Service',
    difficulty: 'hard',
    prompt: 'Configure um servico PostgreSQL seguro: use arquivo de senha via secret, execute script de inicializacao, monte volume de dados e adicione health check de prontidao.',
    code: `FROM postgres:16-alpine

ENV POSTGRES_DB=myapp \\
    POSTGRES_USER=admin \\
    POSTGRES_PASSWORD_FILE=/run/secrets/db_password

COPY init.sql /docker-entrypoint-initdb.d/
COPY postgresql.conf /etc/postgresql/postgresql.conf

VOLUME ["/var/lib/postgresql/data"]
EXPOSE 5432

HEALTHCHECK --interval=10s --timeout=3s \\
  CMD pg_isready -U admin -d myapp`,
  },
]
