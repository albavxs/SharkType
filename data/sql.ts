import { Snippet } from '@/lib/types'

export const sqlSnippets: Snippet[] = [
  {
    id: 'sql-001',
    concept: 'SELECT with JOIN',
    difficulty: 'easy',
    prompt: 'Escreva uma consulta que une users e orders para buscar nomes e totais de pedidos acima de 100.',
    code: `SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.total > 100;`,
  },
  {
    id: 'sql-002',
    concept: 'GROUP BY + HAVING',
    difficulty: 'medium',
    prompt: 'Conte funcionarios por departamento e filtre apenas departamentos com mais de 5 membros.',
    code: `SELECT department, COUNT(*) AS total
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY total DESC;`,
  },
  {
    id: 'sql-003',
    concept: 'Subquery',
    difficulty: 'medium',
    prompt: 'Use uma subquery para selecionar apenas os funcionarios com salario acima da media.',
    code: `SELECT name, salary
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);`,
  },
  {
    id: 'sql-004',
    concept: 'CTE',
    difficulty: 'medium',
    prompt: 'Use uma CTE (WITH) para nomear e reutilizar a selecao de usuarios ativos nos ultimos 30 dias.',
    code: `WITH active_users AS (
    SELECT id, name
    FROM users
    WHERE last_login > NOW() - INTERVAL '30 days'
)
SELECT * FROM active_users;`,
  },
  {
    id: 'sql-005',
    concept: 'Window Function',
    difficulty: 'hard',
    prompt: 'Use RANK() com PARTITION BY para classificar funcionarios por salario dentro de cada departamento.',
    code: `SELECT name, salary,
    RANK() OVER (
        PARTITION BY department
        ORDER BY salary DESC
    ) AS dept_rank
FROM employees;`,
  },
  {
    id: 'sql-006',
    concept: 'INSERT',
    difficulty: 'easy',
    prompt: 'Insira um novo usuario com nome, email e timestamp de criacao na tabela users.',
    code: `INSERT INTO users (name, email, created_at)
VALUES ('Alice', 'alice@example.com', NOW());`,
  },
  {
    id: 'sql-007',
    concept: 'UPDATE',
    difficulty: 'easy',
    prompt: 'Atualize o preco de todos os produtos eletronicos aplicando um aumento de 10% e atualize o timestamp.',
    code: `UPDATE products
SET price = price * 1.10,
    updated_at = NOW()
WHERE category = 'electronics';`,
  },
  {
    id: 'sql-008',
    concept: 'DELETE with Subquery',
    difficulty: 'medium',
    prompt: 'Delete sessoes de usuarios que nao fizeram login ha mais de um ano usando subquery.',
    code: `DELETE FROM sessions
WHERE user_id IN (
    SELECT id FROM users
    WHERE last_login < NOW() - INTERVAL '1 year'
);`,
  },
  {
    id: 'sql-009',
    concept: 'CREATE INDEX',
    difficulty: 'easy',
    prompt: 'Crie um indice simples no email e um indice unico no username para otimizar buscas.',
    code: `CREATE INDEX idx_users_email
ON users (email);

CREATE UNIQUE INDEX idx_users_username
ON users (username);`,
  },
  {
    id: 'sql-010',
    concept: 'CASE Expression',
    difficulty: 'medium',
    prompt: 'Use a expressao CASE para classificar alunos em notas A, B, C ou F com base na pontuacao.',
    code: `SELECT name,
    CASE
        WHEN score >= 90 THEN 'A'
        WHEN score >= 80 THEN 'B'
        WHEN score >= 70 THEN 'C'
        ELSE 'F'
    END AS grade
FROM students;`,
  },
]
