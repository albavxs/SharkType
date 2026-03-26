import { Snippet } from '@/lib/types'

export const sqlSnippets: Snippet[] = [
  {
    id: 'sql-001',
    concept: 'SELECT with JOIN',
    difficulty: 'easy',
    prompt: 'INNER JOIN combina linhas de duas tabelas onde a condicao de juncao e satisfeita. Selecione o nome do usuario e o total do pedido unindo "users" e "orders" pela chave estrangeira user_id, filtrando apenas pedidos acima de 100.',
    code: `SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.total > 100;`,
  },
  {
    id: 'sql-002',
    concept: 'GROUP BY + HAVING',
    difficulty: 'medium',
    prompt: 'GROUP BY agrega linhas; HAVING filtra grupos (diferente de WHERE que filtra linhas individuais). Conte funcionarios por departamento e exiba apenas os departamentos com mais de 5 membros, ordenados do maior para o menor.',
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
    prompt: 'Uma subquery e uma consulta aninhada dentro de outra. Use-a para calcular o salario medio de todos os funcionarios na clausula WHERE e retorne apenas os que ganham acima dessa media.',
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
    prompt: 'CTEs (Common Table Expressions) nomeiam uma subconsulta para reutilizar sem repeticao. Use WITH active_users AS (...) para definir os usuarios com login nos ultimos 30 dias e selecione tudo da CTE na query principal.',
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
    prompt: 'Window functions calculam valores sobre um conjunto de linhas sem colapsar o resultado como GROUP BY. Use RANK() com OVER(PARTITION BY department ORDER BY salary DESC) para rankear cada funcionario dentro do seu departamento.',
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
    prompt: 'INSERT INTO adiciona uma nova linha a uma tabela. Especifique as colunas entre parenteses e forneca os valores correspondentes, usando NOW() para preencher o timestamp de criacao automaticamente.',
    code: `INSERT INTO users (name, email, created_at)
VALUES ('Alice', 'alice@example.com', NOW());`,
  },
  {
    id: 'sql-007',
    concept: 'UPDATE',
    difficulty: 'easy',
    prompt: 'UPDATE modifica linhas existentes com a clausula SET. Aplique um aumento de 10% no preco (price * 1.10) e atualize o campo updated_at para o momento atual em todos os produtos da categoria "electronics".',
    code: `UPDATE products
SET price = price * 1.10,
    updated_at = NOW()
WHERE category = 'electronics';`,
  },
  {
    id: 'sql-008',
    concept: 'DELETE with Subquery',
    difficulty: 'medium',
    prompt: 'DELETE com subquery remove linhas com base em condicao de outra tabela. Exclua todas as sessoes cujos usuarios (identificados pelo user_id) nao fizeram login ha mais de 1 ano — sem join, usando IN com subquery.',
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
    prompt: 'Indices aceleram buscas ao custo de espaco em disco e tempo de escrita. Crie um indice simples na coluna email (para buscas rapidas) e um indice UNIQUE na coluna username (garantindo unicidade a nivel de banco).',
    code: `CREATE INDEX idx_users_email
ON users (email);

CREATE UNIQUE INDEX idx_users_username
ON users (username);`,
  },
  {
    id: 'sql-010',
    concept: 'CASE Expression',
    difficulty: 'medium',
    prompt: 'CASE e uma expressao condicional inline no SQL, similar ao if/else de outras linguagens. Classifique cada aluno em nota A (>=90), B (>=80), C (>=70) ou F (demais) usando WHEN/THEN e ELSE como fallback.',
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
