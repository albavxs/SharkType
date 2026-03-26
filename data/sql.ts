import { Snippet } from '@/lib/types'

export const sqlSnippets: Snippet[] = [
  {
    id: 'sql-001',
    concept: { pt: 'SELECT com JOIN', en: 'SELECT with JOIN' },
    difficulty: 'easy',
    prompt: {
      pt: 'INNER JOIN combina linhas de duas tabelas onde a condição de junção é satisfeita. Selecione o nome do usuário e o total do pedido unindo "users" e "orders" pela chave estrangeira user_id, filtrando apenas pedidos acima de 100.',
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
      pt: 'GROUP BY agrega linhas; HAVING filtra grupos (diferente de WHERE que filtra linhas individuais). Conte funcionários por departamento e exiba apenas os departamentos com mais de 5 membros, ordenados do maior para o menor.',
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
    concept: { pt: 'Subquery', en: 'Subquery' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma subquery é uma consulta aninhada dentro de outra. Use-a para calcular o salário médio de todos os funcionários na cláusula WHERE e retorne apenas os que ganham acima dessa média.',
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
      pt: 'CTEs (Common Table Expressions) nomeiam uma subconsulta para reutilizar sem repetição. Use WITH active_users AS (...) para definir os usuários com login nos últimos 30 dias e selecione tudo da CTE na query principal.',
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
    concept: { pt: 'Window Function', en: 'Window Function' },
    difficulty: 'hard',
    prompt: {
      pt: 'Window functions calculam valores sobre um conjunto de linhas sem colapsar o resultado como GROUP BY. Use RANK() com OVER(PARTITION BY department ORDER BY salary DESC) para rankear cada funcionário dentro do seu departamento.',
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
      pt: 'INSERT INTO adiciona uma nova linha a uma tabela. Especifique as colunas entre parênteses e forneça os valores correspondentes, usando NOW() para preencher o timestamp de criação automaticamente.',
      en: 'INSERT INTO adds a new row to a table. Specify the columns in parentheses and provide the corresponding values, using NOW() to auto-fill the creation timestamp.',
    },
    code: `INSERT INTO users (name, email, created_at)
VALUES ('Alice', 'alice@example.com', NOW());`,
  },
  {
    id: 'sql-007',
    concept: { pt: 'UPDATE', en: 'UPDATE' },
    difficulty: 'easy',
    prompt: {
      pt: 'UPDATE modifica linhas existentes com a cláusula SET. Aplique um aumento de 10% no preço (price * 1.10) e atualize o campo updated_at para o momento atual em todos os produtos da categoria "electronics".',
      en: 'UPDATE modifies existing rows with the SET clause. Apply a 10% price increase (price * 1.10) and update the updated_at field to the current time for all products in the "electronics" category.',
    },
    code: `UPDATE products
SET price = price * 1.10,
    updated_at = NOW()
WHERE category = 'electronics';`,
  },
  {
    id: 'sql-008',
    concept: { pt: 'DELETE com Subquery', en: 'DELETE with Subquery' },
    difficulty: 'medium',
    prompt: {
      pt: 'DELETE com subquery remove linhas com base em condição de outra tabela. Exclua todas as sessões cujos usuários (identificados pelo user_id) não fizeram login há mais de 1 ano — sem join, usando IN com subquery.',
      en: 'DELETE with subquery removes rows based on a condition from another table. Delete all sessions whose users (identified by user_id) haven\'t logged in for over 1 year — no join, using IN with a subquery.',
    },
    code: `DELETE FROM sessions
WHERE user_id IN (
    SELECT id FROM users
    WHERE last_login < NOW() - INTERVAL '1 year'
);`,
  },
  {
    id: 'sql-009',
    concept: { pt: 'CREATE INDEX', en: 'CREATE INDEX' },
    difficulty: 'easy',
    prompt: {
      pt: 'Índices aceleram buscas ao custo de espaço em disco e tempo de escrita. Crie um índice simples na coluna email (para buscas rápidas) e um índice UNIQUE na coluna username (garantindo unicidade a nível de banco).',
      en: 'Indexes speed up lookups at the cost of disk space and write time. Create a simple index on the email column (for fast lookups) and a UNIQUE index on the username column (enforcing uniqueness at the database level).',
    },
    code: `CREATE INDEX idx_users_email
ON users (email);

CREATE UNIQUE INDEX idx_users_username
ON users (username);`,
  },
  {
    id: 'sql-010',
    concept: { pt: 'Expressão CASE', en: 'CASE Expression' },
    difficulty: 'medium',
    prompt: {
      pt: 'CASE é uma expressão condicional inline no SQL, similar ao if/else de outras linguagens. Classifique cada aluno em nota A (>=90), B (>=80), C (>=70) ou F (demais) usando WHEN/THEN e ELSE como fallback.',
      en: 'CASE is an inline conditional expression in SQL, similar to if/else in other languages. Grade each student as A (>=90), B (>=80), C (>=70) or F (otherwise) using WHEN/THEN and ELSE as fallback.',
    },
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
