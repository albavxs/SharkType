import { Snippet } from '@/lib/types'

export const sqlSnippets: Snippet[] = [
  {
    id: 'sql-001',
    concept: { pt: 'SELECT com JOIN', en: 'SELECT with JOIN' },
    difficulty: 'easy',
    prompt: {
      pt: 'INNER JOIN junta linhas de duas tabelas quando a condição de junção bate. Seleciona o nome do usuário e o total do pedido unindo "users" e "orders" pela foreign key user_id, filtrando só pedidos acima de 100.',
      en: 'INNER JOIN combines rows from two tables where the join condition is met. Select the user name and order total by joining "users" and "orders" on the user_id foreign key, filtering only orders above 100.',
    },
    code: `SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.total > 100;`,
  },
  {
    id: 'sql-002',
    concept: { pt: 'GROUP BY + HAVING', en: 'GROUP BY + HAVING' },
    difficulty: 'medium',
    prompt: {
      pt: 'GROUP BY agrega linhas e HAVING filtra os grupos (diferente do WHERE, que filtra linha por linha). Conta funcionários por departamento e mostra só os que têm mais de 5 membros, do maior pro menor.',
      en: 'GROUP BY aggregates rows; HAVING filters groups (unlike WHERE which filters individual rows). Count employees per department and show only departments with more than 5 members, ordered from largest to smallest.',
    },
    code: `SELECT department, COUNT(*) AS total
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY total DESC;`,
  },
  {
    id: 'sql-003',
    concept: { pt: 'Subconsulta', en: 'Subquery' },
    difficulty: 'medium',
    prompt: {
      pt: 'Subquery é uma query dentro de outra. Usa ela pra calcular o salário médio de todos os funcionários no WHERE e retorna só quem ganha acima dessa média.',
      en: 'A subquery is a query nested inside another. Use it to calculate the average salary of all employees in the WHERE clause and return only those earning above that average.',
    },
    code: `SELECT name, salary
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);`,
  },
  {
    id: 'sql-004',
    concept: { pt: 'CTE', en: 'CTE' },
    difficulty: 'medium',
    prompt: {
      pt: 'CTE (Common Table Expression) dá nome a uma subquery pra você reutilizar sem ficar repetindo. Usa WITH active_users AS (...) pra pegar os usuários que logaram nos últimos 30 dias e faz o SELECT da CTE na query principal.',
      en: 'CTEs (Common Table Expressions) name a subquery for reuse without repetition. Use WITH active_users AS (...) to define users who logged in within the last 30 days and select everything from the CTE in the main query.',
    },
    code: `WITH active_users AS (
    SELECT id, name
    FROM users
    WHERE last_login > NOW() - INTERVAL '30 days'
)
SELECT * FROM active_users;`,
  },
  {
    id: 'sql-005',
    concept: { pt: 'Função de Janela', en: 'Window Function' },
    difficulty: 'hard',
    prompt: {
      pt: 'Window functions calculam valores sobre um conjunto de linhas sem colapsar o resultado como o GROUP BY faz. Usa RANK() com OVER(PARTITION BY department ORDER BY salary DESC) pra rankear cada funcionário dentro do departamento dele.',
      en: 'Window functions compute values over a set of rows without collapsing the result like GROUP BY. Use RANK() with OVER(PARTITION BY department ORDER BY salary DESC) to rank each employee within their department.',
    },
    code: `SELECT name, salary,
    RANK() OVER (
        PARTITION BY department
        ORDER BY salary DESC
    ) AS dept_rank
FROM employees;`,
  },
  {
    id: 'sql-006',
    concept: { pt: 'INSERT', en: 'INSERT' },
    difficulty: 'easy',
    prompt: {
      pt: 'INSERT INTO adiciona uma linha nova na tabela. Especifica as colunas entre parênteses e passa os valores correspondentes, usando NOW() pra preencher o timestamp de criação automaticamente.',
      en: 'INSERT INTO adds a new row to a table. Specify the columns in parentheses and provide the corresponding values, using NOW() to auto-fill the creation timestamp.',
    },
    code: `INSERT INTO users (name, email, created_at)
VALUES ('Alice', 'alice@example.com', NOW());`,
  },
]
