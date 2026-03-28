import { Snippet } from '@/lib/types'

export const pythonSnippets: Snippet[] = [
  {
    id: 'py-001',
    concept: { pt: 'List Comprehension', en: 'List Comprehension' },
    difficulty: 'easy',
    prompt: {
      pt: 'List comprehension é o jeito pythônico e enxuto de criar listas. Numa linha só, gere "squares" com o quadrado de cada número de 0 a 9 usando a sintaxe [expressão for variável in range(...)].',
      en: 'List comprehensions are the idiomatic and concise way to build lists in Python. In a single line, generate the "squares" list with the squares of all numbers from 0 to 9 using the syntax [expression for variable in range(...)].',
    },
    code: `squares = [x ** 2 for x in range(10)]`,
  },
  {
    id: 'py-002',
    concept: { pt: 'Dict Comprehension', en: 'Dict Comprehension' },
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
  },
  {
    id: 'py-004',
    concept: { pt: 'Decorator', en: 'Decorator' },
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
  },
  {
    id: 'py-005',
    concept: { pt: 'Context Manager', en: 'Context Manager' },
    difficulty: 'medium',
    prompt: {
      pt: 'Context manager (with) garante que os recursos sejam liberados certinho ao sair do bloco. Use "with open(\'data.json\', \'r\') as f" pra abrir o arquivo: o fechamento é automático mesmo se der exceção.',
      en: 'Context managers (with) ensure resources are properly released when exiting the block. Use "with open(\'data.json\', \'r\') as f" to open the file: it will be closed automatically even if an exception occurs.',
    },
    code: `with open('data.json', 'r') as f:
    data = json.load(f)`,
  },
  {
    id: 'py-006',
    concept: { pt: 'Dataclass', en: 'Dataclass' },
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
  },
  {
    id: 'py-007',
    concept: { pt: 'F-String', en: 'F-String' },
    difficulty: 'easy',
    prompt: {
      pt: 'F-string (Python 3.6+) é o jeito moderno de formatar strings: mais rápido e legível que .format() ou %. Monte a mensagem de saudação colocando "name" e "age" direto na string com a sintaxe f"... {variável} ...".',
      en: 'F-strings (Python 3.6+) are the modern way to format strings: faster and more readable than .format() or %. Build the greeting message by embedding "name" and "age" directly in the string using the f"... {variable} ..." syntax.',
    },
    code: `greeting = f"Hello, {name}! You are {age} years old."`,
  },
  {
    id: 'py-008',
    concept: { pt: 'Walrus Operator', en: 'Walrus Operator' },
    difficulty: 'hard',
    prompt: {
      pt: 'O walrus operator (:=) atribui e avalia numa expressão só, evitando cálculo duplicado. Use pra calcular len(data) uma vez só: atribua o resultado a "n" e teste se é maior que 10 no mesmo if — sem precisar de linha separada.',
      en: 'The walrus operator (:=) assigns and evaluates in a single expression, avoiding duplicate computation. Use it to calculate len(data) just once: assign the result to "n" and test if it\'s greater than 10 in the same if — no separate line needed.',
    },
    code: `if (n := len(data)) > 10:
    print(f"List is too long ({n} elements)")`,
  },
  {
    id: 'py-009',
    concept: { pt: 'Unpacking', en: 'Unpacking' },
    difficulty: 'easy',
    prompt: {
      pt: 'Unpacking estendido quebra sequências em partes nomeadas. A partir de [1, 2, 3, 4, 5], coloque o primeiro em "first", o último em "last" e capture tudo do meio em "middle" com o asterisco (*middle).',
      en: 'Extended unpacking breaks sequences into named parts. From [1, 2, 3, 4, 5], assign the first element to "first", the last to "last", and capture everything in between into "middle" with the asterisk (*middle).',
    },
    code: `first, *middle, last = [1, 2, 3, 4, 5]`,
  },
  {
    id: 'py-010',
    concept: { pt: 'Generator', en: 'Generator' },
    difficulty: 'hard',
    prompt: {
      pt: 'Generator produz valores sob demanda com yield, sem guardar a sequência inteira na memória. Implemente fibonacci() como um generator infinito: a cada iteração, dê yield no valor atual e avance a sequência.',
      en: 'Generators produce values on demand with yield, without storing the entire sequence in memory. Implement fibonacci() as an infinite generator: on each iteration, yield the current value and advance the sequence.',
    },
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b`,
  },
]
