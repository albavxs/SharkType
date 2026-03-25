import { Snippet } from '@/lib/types'

export const javascriptSnippets: Snippet[] = [
  {
    id: 'js-001',
    concept: 'Arrow Function',
    difficulty: 'easy',
    code: `const add = (a, b) => a + b;`,
  },
  {
    id: 'js-002',
    concept: 'Array Destructuring',
    difficulty: 'easy',
    code: `const [first, ...rest] = [1, 2, 3, 4];`,
  },
  {
    id: 'js-003',
    concept: 'Object Destructuring',
    difficulty: 'easy',
    code: `const { name, age = 0 } = user;`,
  },
  {
    id: 'js-004',
    concept: 'Promise',
    difficulty: 'medium',
    code: `const fetchUser = (id) =>
  fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .catch(err => console.error(err));`,
  },
  {
    id: 'js-005',
    concept: 'Async/Await',
    difficulty: 'medium',
    code: `async function getUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}`,
  },
  {
    id: 'js-006',
    concept: 'Array Methods',
    difficulty: 'medium',
    code: `const result = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();`,
  },
  {
    id: 'js-007',
    concept: 'Closure',
    difficulty: 'hard',
    code: `function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}`,
  },
  {
    id: 'js-008',
    concept: 'Spread Operator',
    difficulty: 'easy',
    code: `const merged = { ...defaults, ...overrides };`,
  },
  {
    id: 'js-009',
    concept: 'Optional Chaining',
    difficulty: 'easy',
    code: `const city = user?.address?.city ?? 'Unknown';`,
  },
  {
    id: 'js-010',
    concept: 'Class',
    difficulty: 'medium',
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a noise.\`;
  }
}`,
  },
]
