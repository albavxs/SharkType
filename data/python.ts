import { Snippet } from '@/lib/types'

export const pythonSnippets: Snippet[] = [
  {
    id: 'py-001',
    concept: 'List Comprehension',
    difficulty: 'easy',
    code: `squares = [x ** 2 for x in range(10)]`,
  },
  {
    id: 'py-002',
    concept: 'Dict Comprehension',
    difficulty: 'easy',
    code: `counts = {word: len(word) for word in words}`,
  },
  {
    id: 'py-003',
    concept: 'Lambda',
    difficulty: 'easy',
    code: `sort_by_age = sorted(users, key=lambda u: u['age'])`,
  },
  {
    id: 'py-004',
    concept: 'Decorator',
    difficulty: 'medium',
    code: `def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Took {time.time() - start:.2f}s")
        return result
    return wrapper`,
  },
  {
    id: 'py-005',
    concept: 'Context Manager',
    difficulty: 'medium',
    code: `with open('data.json', 'r') as f:
    data = json.load(f)`,
  },
  {
    id: 'py-006',
    concept: 'Dataclass',
    difficulty: 'medium',
    code: `@dataclass
class Point:
    x: float
    y: float
    z: float = 0.0

    def distance(self) -> float:
        return (self.x**2 + self.y**2 + self.z**2) ** 0.5`,
  },
  {
    id: 'py-007',
    concept: 'F-String',
    difficulty: 'easy',
    code: `greeting = f"Hello, {name}! You are {age} years old."`,
  },
  {
    id: 'py-008',
    concept: 'Walrus Operator',
    difficulty: 'hard',
    code: `if (n := len(data)) > 10:
    print(f"List is too long ({n} elements)")`,
  },
  {
    id: 'py-009',
    concept: 'Unpacking',
    difficulty: 'easy',
    code: `first, *middle, last = [1, 2, 3, 4, 5]`,
  },
  {
    id: 'py-010',
    concept: 'Generator',
    difficulty: 'hard',
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b`,
  },
]
