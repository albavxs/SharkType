import { Snippet } from '@/lib/types'

export const sqlSnippets: Snippet[] = [
  {
    id: 'sql-001',
    concept: 'SELECT with JOIN',
    difficulty: 'easy',
    code: `SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.total > 100;`,
  },
  {
    id: 'sql-002',
    concept: 'GROUP BY + HAVING',
    difficulty: 'medium',
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
    code: `INSERT INTO users (name, email, created_at)
VALUES ('Alice', 'alice@example.com', NOW());`,
  },
  {
    id: 'sql-007',
    concept: 'UPDATE',
    difficulty: 'easy',
    code: `UPDATE products
SET price = price * 1.10,
    updated_at = NOW()
WHERE category = 'electronics';`,
  },
  {
    id: 'sql-008',
    concept: 'DELETE with Subquery',
    difficulty: 'medium',
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
    code: `CREATE INDEX idx_users_email
ON users (email);

CREATE UNIQUE INDEX idx_users_username
ON users (username);`,
  },
  {
    id: 'sql-010',
    concept: 'CASE Expression',
    difficulty: 'medium',
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
