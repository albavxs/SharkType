import { Snippet } from '@/lib/types'

export const nodejsSnippets: Snippet[] = [
  {
    id: 'node-001',
    concept: { pt: 'Servidor Básico Express', en: 'Basic Express Server' },
    difficulty: 'easy',
    prompt: {
      pt: 'Express é o framework Node.js mais popular pra APIs REST. Crie um servidor básico com uma rota GET que retorna JSON.',
      en: 'Express is the most popular Node.js framework for REST APIs. Create a basic server with a GET route that returns JSON.',
    },
    code: `import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
  },
  {
    id: 'node-002',
    concept: { pt: 'Route Params e Query', en: 'Route Params and Query' },
    difficulty: 'easy',
    prompt: {
      pt: 'Parâmetros de rota capturam segmentos da URL e query strings passam filtros opcionais. Use ambos pra buscar usuários com paginação.',
      en: 'Route params capture URL segments and query strings pass optional filters. Use both to fetch users with pagination.',
    },
    code: `app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10, role } = req.query;
  let result = users;
  if (role) result = result.filter(u => u.role === role);
  const start = (page - 1) * limit;
  res.json({
    data: result.slice(start, start + Number(limit)),
    total: result.length,
  });
});`,
  },
  {
    id: 'node-003',
    concept: { pt: 'Middleware', en: 'Middleware' },
    difficulty: 'medium',
    prompt: {
      pt: 'Middlewares são funções que interceptam requisições antes de chegar na rota. Crie um middleware de logging e um de autenticação por token.',
      en: 'Middlewares are functions that intercept requests before reaching the route. Create a logging middleware and a token authentication middleware.',
    },
    code: `function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(\`\${req.method} \${req.url} \${res.statusCode} \${ms}ms\`);
  });
  next();
}

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

app.use(logger);
app.get('/api/profile', auth, (req, res) => {
  res.json(req.user);
});`,
  },
  {
    id: 'node-004',
    concept: { pt: 'Error Handler Express', en: 'Express Error Handler' },
    difficulty: 'medium',
    prompt: {
      pt: 'O error handler do Express recebe 4 argumentos (err, req, res, next) e centraliza o tratamento de erros. Crie um handler que diferencia erros operacionais de bugs.',
      en: 'Express error handler takes 4 arguments (err, req, res, next) and centralizes error handling. Create a handler that differentiates operational errors from bugs.',
    },
    code: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational) {
    console.error('BUG:', err);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.get('/api/user/:id', (req, res, next) => {
  const user = db.find(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.json(user);
});`,
  },
  {
    id: 'node-005',
    concept: { pt: 'Servidor Básico Fastify', en: 'Basic Fastify Server' },
    difficulty: 'easy',
    prompt: {
      pt: 'Fastify é uma alternativa mais rápida ao Express com validação de schema embutida. Crie um servidor com rota GET e logging automático.',
      en: 'Fastify is a faster alternative to Express with built-in schema validation. Create a server with a GET route and automatic logging.',
    },
    code: `import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/api/health', async () => {
  return { status: 'ok', uptime: process.uptime() };
});

app.get('/api/users/:id', async (request, reply) => {
  const { id } = request.params;
  const user = await db.findUser(id);
  if (!user) {
    reply.code(404);
    return { error: 'Not found' };
  }
  return user;
});

app.listen({ port: 3000 });`,
  },
  {
    id: 'node-006',
    concept: { pt: 'Validação de Schema Fastify', en: 'Fastify Schema Validation' },
    difficulty: 'medium',
    prompt: {
      pt: 'Fastify valida request e response com JSON Schema automaticamente, rejeitando dados inválidos antes de chegar no handler.',
      en: 'Fastify validates request and response with JSON Schema automatically, rejecting invalid data before reaching the handler.',
    },
    code: `app.post('/api/users', {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', minLength: 2 },
        email: { type: 'string', format: 'email' },
        role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
      },
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
        },
      },
    },
  },
}, async (request, reply) => {
  const user = await db.createUser(request.body);
  reply.code(201);
  return user;
});`,
  },
]
