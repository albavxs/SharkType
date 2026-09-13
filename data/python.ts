import { Snippet } from '@/lib/types'

export const pythonSnippets: Snippet[] = [
  {
    id: 'py-001',
    concept: { pt: 'Compreensão de Lista', en: 'List Comprehension' },
    difficulty: 'easy',
    prompt: {
      pt: 'List comprehension é o jeito pythônico e enxuto de criar listas. Numa linha só, gere "squares" com o quadrado de cada número de 0 a 9 usando a sintaxe [expressão for variável in range(...)].',
      en: 'List comprehensions are the idiomatic and concise way to build lists in Python. In a single line, generate the "squares" list with the squares of all numbers from 0 to 9 using the syntax [expression for variable in range(...)].',
    },
    code: `squares = [x ** 2 for x in range(10)]`,
    slot: 'loop-range',
  },
  {
    id: 'py-002',
    concept: { pt: 'Compreensão de Dicionário', en: 'Dict Comprehension' },
    difficulty: 'easy',
    prompt: {
      pt: 'Dict comprehension constrói dicionários de forma expressiva, igualzinho a list comprehension. Crie "counts" mapeando cada palavra de "words" pro seu tamanho com len(), usando a sintaxe {chave: valor for item in iterável}.',
      en: 'Dict comprehensions build dictionaries expressively, just like list comprehensions. Create "counts" mapping each word in "words" to its length with len(), using the syntax {key: value for item in iterable}.',
    },
    code: `counts = {word: len(word) for word in words}`,
  },
  {
    id: 'py-003',
    concept: { pt: 'Lambda', en: 'Lambda' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lambda é uma função anônima de uma linha, perfeita pra passar como argumento pra outras funções. Use sorted() com key=lambda pra ordenar a lista "users" pela propriedade "age" de cada dicionário de usuário.',
      en: 'Lambdas are one-line anonymous functions, ideal for passing as arguments to other functions. Use sorted() with the key=lambda parameter to sort the "users" list by the "age" property of each user dictionary.',
    },
    code: `sort_by_age = sorted(users, key=lambda u: u['age'])`,
    slot: 'fn-arrow',
  },
  {
    id: 'py-004',
    concept: { pt: 'Decorador', en: 'Decorator' },
    difficulty: 'medium',
    prompt: {
      pt: 'Decorator envolve uma função pra adicionar comportamento sem mexer nela diretamente. Implemente @timer: uma função que retorna um wrapper, mede o tempo antes e depois de chamar func(*args, **kwargs) e printa o tempo que levou.',
      en: 'Decorators wrap a function to add behavior without modifying it directly. Implement @timer: a function that returns a wrapper, measures the time before and after calling func(*args, **kwargs), and prints the elapsed time.',
    },
    code: `def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Took {time.time() - start:.2f}s")
        return result
    return wrapper`,
    slot: 'adv-pattern',
  },
  {
    id: 'py-005',
    concept: { pt: 'Gerenciador de Contexto', en: 'Context Manager' },
    difficulty: 'medium',
    prompt: {
      pt: 'Context manager (with) garante que os recursos sejam liberados certinho ao sair do bloco. Use "with open(\'data.json\', \'r\') as f" pra abrir o arquivo: o fechamento é automático mesmo se der exceção.',
      en: 'Context managers (with) ensure resources are properly released when exiting the block. Use "with open(\'data.json\', \'r\') as f" to open the file: it will be closed automatically even if an exception occurs.',
    },
    code: `with open('data.json', 'r') as f:
    data = json.load(f)`,
    slot: 'err-finally',
  },
  {
    id: 'py-006',
    concept: { pt: 'Classe de Dados', en: 'Dataclass' },
    difficulty: 'medium',
    prompt: {
      pt: '@dataclass elimina aquele boilerplate de __init__, __repr__ e __eq__. Defina Point com coordenadas x, y e z (z com default 0.0) e adicione o método distance() que calcula a distância 3D até a origem.',
      en: '@dataclass eliminates the boilerplate of __init__, __repr__, and __eq__. Define Point with x, y, and z coordinates (z defaults to 0.0) and add a distance() method that calculates the 3D distance from the origin.',
    },
    code: `@dataclass
class Point:
    x: float
    y: float
    z: float = 0.0

    def distance(self) -> float:
        return (self.x**2 + self.y**2 + self.z**2) ** 0.5`,
    slot: 'class-basic',
  },
]
