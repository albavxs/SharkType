import { Snippet } from '@/lib/types'

export const dockerSnippets: Snippet[] = [
  {
    id: 'docker-001',
    concept: { pt: 'FROM e CMD', en: 'FROM & CMD' },
    difficulty: 'easy',
    prompt: {
      pt: 'Monta um Dockerfile pra uma app Node.js: imagem alpine, diretório de trabalho, copia tudo, instala as deps e define o comando de start.',
      en: 'Build a Dockerfile for a Node.js app: alpine base image, working directory, copy files, install deps, and set the start command.',
    },
    code: `FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm ci

CMD ["node", "server.js"]`,
  },
  {
    id: 'docker-002',
    concept: { pt: 'ENV e EXPOSE', en: 'ENV & EXPOSE' },
    difficulty: 'easy',
    prompt: {
      pt: 'Configura as variáveis de ambiente pra uma app Python desabilitando bytecode e buffer, define a porta e expõe ela.',
      en: 'Set environment variables for a Python app disabling bytecode and buffering, define the port, and expose it.',
    },
    code: `FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PORT=8000

EXPOSE 8000`,
  },
  {
    id: 'docker-003',
    concept: { pt: 'ARG e Labels', en: 'ARG & Labels' },
    difficulty: 'easy',
    prompt: {
      pt: 'Define args de build pra versão e data, e bota labels de metadata na imagem com esses valores.',
      en: 'Define build args for version and date, and add metadata labels to the image using those values.',
    },
    code: `ARG APP_VERSION=1.0.0
ARG BUILD_DATE

LABEL maintainer="dev@example.com" \\
      version="$APP_VERSION" \\
      build-date="$BUILD_DATE"`,
  },
  {
    id: 'docker-004',
    concept: { pt: 'COPY e RUN', en: 'COPY & RUN' },
    difficulty: 'easy',
    prompt: {
      pt: 'Compila uma app Go: copia primeiro os módulos pra cachear as deps, depois o código e gera o binário.',
      en: 'Build a Go app: copy module files first to cache deps, then copy the source and compile the binary.',
    },
    code: `FROM golang:1.22-alpine AS build

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o /app ./cmd/server`,
  },
  {
    id: 'docker-005',
    concept: { pt: 'Build Multi-stage', en: 'Multi-stage Build' },
    difficulty: 'medium',
    prompt: {
      pt: 'Use multi-stage pra buildar um frontend React e servir só os arquivos estáticos com Nginx, sem Node na imagem final.',
      en: 'Use multi-stage to build a React frontend and serve only the static files with Nginx, keeping Node out of the final image.',
    },
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
    concept: { pt: 'HEALTHCHECK', en: 'HEALTHCHECK' },
    difficulty: 'medium',
    prompt: {
      pt: 'Adiciona um health check numa app FastAPI que bate no /health a cada 30s com timeout de 5s.',
      en: 'Add a health check to a FastAPI app that hits /health every 30s with a 5s timeout.',
    },
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
    concept: { pt: 'ENTRYPOINT e CMD', en: 'ENTRYPOINT & CMD' },
    difficulty: 'medium',
    prompt: {
      pt: 'Cria uma imagem Alpine com ferramentas de rede, um entrypoint executável e CMD como argumento padrão substituível.',
      en: 'Create an Alpine image with network tools, an executable entrypoint, and CMD as a default overridable argument.',
    },
    code: `FROM alpine:3.19

RUN apk add --no-cache curl jq

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["--help"]`,
  },
  {
    id: 'docker-008',
    concept: { pt: 'USER e VOLUME', en: 'USER & VOLUME' },
    difficulty: 'medium',
    prompt: {
      pt: 'Roda a app como usuário não-root: cria grupo e usuário, passa a ownership dos arquivos e declara um volume pra persistência.',
      en: 'Run the app as a non-root user: create a group and user, transfer file ownership, and declare a volume for persistence.',
    },
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
    concept: { pt: 'Build Otimizado', en: 'Optimized Build' },
    difficulty: 'hard',
    prompt: {
      pt: 'Use cargo-chef pra cachear deps Rust em multi-stage: prepare o recipe, cozinhe as deps separado e compile o app final.',
      en: 'Use cargo-chef to cache Rust deps in multi-stage: prepare the recipe, cook deps separately, and compile the final app.',
    },
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
    concept: { pt: 'Serviço Docker Compose', en: 'Docker Compose Service' },
    difficulty: 'hard',
    prompt: {
      pt: 'Configura um Postgres seguro: senha via secret, script de init, volume de dados e health check de readiness.',
      en: 'Set up a secure Postgres: password via secret, init script, data volume, and readiness health check.',
    },
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
