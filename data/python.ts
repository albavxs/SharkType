import { Snippet } from '@/lib/types'

export const pythonSnippets: Snippet[] = [
  {
    id: 'py-001',
    concept: 'List Comprehension',
    difficulty: 'easy',
    prompt: 'Gere uma lista dos quadrados dos numeros de 0 a 9 usando list comprehension.',
    code: `squares = [x ** 2 for x in range(10)]`,
  },
  {
    id: 'py-002',
    concept: 'Dict Comprehension',
    difficulty: 'easy',
    prompt: 'Crie um dicionario mapeando cada palavra ao seu comprimento usando dict comprehension.',
    code: `counts = {word: len(word) for word in words}`,
  },
  {
    id: 'py-003',
    concept: 'Lambda',
    difficulty: 'easy',
    prompt: 'Ordene uma lista de usuarios pela idade usando uma funcao lambda como chave de ordenacao.',
    code: `sort_by_age = sorted(users, key=lambda u: u['age'])`,
  },
  {
    id: 'py-004',
    concept: 'Decorator',
    difficulty: 'medium',
    prompt: 'Implemente um decorator timer que mede e imprime o tempo de execucao de qualquer funcao decorada.',
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
    prompt: 'Abra e leia um arquivo JSON usando context manager para garantir o fechamento automatico.',
    code: `with open('data.json', 'r') as f:
    data = json.load(f)`,
  },
  {
    id: 'py-006',
    concept: 'Dataclass',
    difficulty: 'medium',
    prompt: 'Defina um dataclass Point com coordenadas 3D e um metodo para calcular a distancia da origem.',
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
    prompt: 'Construa uma mensagem de saudacao usando f-string com nome e idade interpolados.',
    code: `greeting = f"Hello, {name}! You are {age} years old."`,
  },
  {
    id: 'py-008',
    concept: 'Walrus Operator',
    difficulty: 'hard',
    prompt: 'Use o operador walrus para calcular e testar o tamanho de uma lista em uma unica expressao.',
    code: `if (n := len(data)) > 10:
    print(f"List is too long ({n} elements)")`,
  },
  {
    id: 'py-009',
    concept: 'Unpacking',
    difficulty: 'easy',
    prompt: 'Use unpacking extendido para separar o primeiro elemento, os do meio e o ultimo de uma lista.',
    code: `first, *middle, last = [1, 2, 3, 4, 5]`,
  },
  {
    id: 'py-010',
    concept: 'Generator',
    difficulty: 'hard',
    prompt: 'Implemente um gerador infinito da sequencia de Fibonacci usando yield.',
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b`,
  },
]
