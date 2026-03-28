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
  {
    id: 'py-007',
    concept: { pt: 'String Formatada', en: 'F-String' },
    difficulty: 'easy',
    prompt: {
      pt: 'F-string (Python 3.6+) é o jeito moderno de formatar strings: mais rápido e legível que .format() ou %. Monte a mensagem de saudação colocando "name" e "age" direto na string com a sintaxe f"... {variável} ...".',
      en: 'F-strings (Python 3.6+) are the modern way to format strings: faster and more readable than .format() or %. Build the greeting message by embedding "name" and "age" directly in the string using the f"... {variable} ..." syntax.',
    },
    code: `greeting = f"Hello, {name}! You are {age} years old."`,
    slot: 'var-interpolation',
  },
  {
    id: 'py-008',
    concept: { pt: 'Operador Morsa', en: 'Walrus Operator' },
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
    concept: { pt: 'Desempacotamento', en: 'Unpacking' },
    difficulty: 'easy',
    prompt: {
      pt: 'Unpacking estendido quebra sequências em partes nomeadas. A partir de [1, 2, 3, 4, 5], coloque o primeiro em "first", o último em "last" e capture tudo do meio em "middle" com o asterisco (*middle).',
      en: 'Extended unpacking breaks sequences into named parts. From [1, 2, 3, 4, 5], assign the first element to "first", the last to "last", and capture everything in between into "middle" with the asterisk (*middle).',
    },
    code: `first, *middle, last = [1, 2, 3, 4, 5]`,
    slot: 'var-destructure',
  },
  {
    id: 'py-010',
    concept: { pt: 'Gerador', en: 'Generator' },
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
  // ── If e Else ──────────────────────────────────────────────
  {
    id: 'py-011',
    concept: { pt: 'If Simples', en: 'Basic If' },
    difficulty: 'easy',
    prompt: {
      pt: 'A estrutura if avalia uma condição e executa o bloco indentado se for verdadeira. Verifique se age é maior ou igual a 18 e imprima a mensagem.',
      en: 'The if statement evaluates a condition and runs the indented block if true. Check if age is 18 or older and print the message.',
    },
    code: `if age >= 18:
    print("You are an adult")`,
    slot: 'cond-basic-if',
  },
  {
    id: 'py-012',
    concept: { pt: 'If e Else', en: 'If and Else' },
    difficulty: 'easy',
    prompt: {
      pt: 'O else define o que acontece quando a condição do if é falsa. Verifique se a temperatura está acima de 30 e imprima a mensagem adequada.',
      en: 'The else block runs when the if condition is false. Check if the temperature is above 30 and print the appropriate message.',
    },
    code: `if temperature > 30:
    print("It's hot!")
else:
    print("It's cool.")`,
    slot: 'cond-if-else',
  },
  {
    id: 'py-013',
    concept: { pt: 'Expressão Ternária', en: 'Ternary Expression' },
    difficulty: 'easy',
    prompt: {
      pt: 'Python tem operador ternário com a sintaxe "valor_se_true if condição else valor_se_false". Use-o pra definir o status numa linha.',
      en: 'Python has a ternary operator with the syntax "value_if_true if condition else value_if_false". Use it to define the status in one line.',
    },
    code: `status = "adult" if age >= 18 else "minor"`,
    slot: 'cond-ternary',
  },
  {
    id: 'py-014',
    concept: { pt: 'Match/Case', en: 'Match/Case' },
    difficulty: 'medium',
    prompt: {
      pt: 'match/case (Python 3.10+) é o pattern matching estrutural do Python. Use-o pra despachar ações baseadas no comando recebido.',
      en: 'match/case (Python 3.10+) is Python\'s structural pattern matching. Use it to dispatch actions based on the received command.',
    },
    code: `match command:
    case "start":
        run()
    case "stop":
        halt()
    case _:
        print("Unknown")`,
    slot: 'cond-switch',
  },
  {
    id: 'py-015',
    concept: { pt: 'Cláusula de Guarda', en: 'Guard Clause' },
    difficulty: 'easy',
    prompt: {
      pt: 'Guard clauses retornam cedo pra evitar aninhamento. Valide a entrada no início da função e retorne antes da lógica principal.',
      en: 'Guard clauses return early to avoid nesting. Validate the input at the top of the function and return before the main logic.',
    },
    code: `def divide(a, b):
    if b == 0:
        return None
    return a / b`,
    slot: 'cond-guard',
  },
  // ── Variáveis ──────────────────────────────────────────────
  {
    id: 'py-016',
    concept: { pt: 'Declaração de Variável', en: 'Variable Declaration' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Python, variáveis são declaradas por atribuição simples sem palavras-chave como let ou const. Atribua valores a variáveis de diferentes tipos.',
      en: 'In Python, variables are declared by simple assignment without keywords like let or const. Assign values to variables of different types.',
    },
    code: `name = "Alice"
age = 30
active = True`,
    slot: 'var-declare',
  },
  {
    id: 'py-017',
    concept: { pt: 'Constante (convenção)', en: 'Constant (convention)' },
    difficulty: 'easy',
    prompt: {
      pt: 'Python não tem constantes reais, mas a convenção é usar UPPER_SNAKE_CASE pra indicar que o valor não deve ser alterado.',
      en: 'Python has no real constants, but the convention is to use UPPER_SNAKE_CASE to indicate the value should not be changed.',
    },
    code: `MAX_RETRIES = 3
PI = 3.14159
BASE_URL = "https://api.example.com"`,
    slot: 'var-const',
  },
  {
    id: 'py-018',
    concept: { pt: 'Tipos Básicos', en: 'Basic Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'Python tem tipagem dinâmica: int, float, str, bool e list são os tipos mais comuns. Use type() pra verificar o tipo de cada valor.',
      en: 'Python has dynamic typing: int, float, str, bool, and list are the most common types. Use type() to check the type of each value.',
    },
    code: `count: int = 42
price: float = 9.99
name: str = "Alice"`,
    slot: 'var-types',
  },
  {
    id: 'py-019',
    concept: { pt: 'Lista', en: 'List' },
    difficulty: 'easy',
    prompt: {
      pt: 'Listas são coleções ordenadas e mutáveis. Crie uma lista de cores e acesse o primeiro elemento com índice 0.',
      en: 'Lists are ordered and mutable collections. Create a list of colors and access the first element with index 0.',
    },
    code: `colors = ["red", "green", "blue"]
first = colors[0]`,
    slot: 'var-array',
  },
  // ── Funções ────────────────────────────────────────────────
  {
    id: 'py-020',
    concept: { pt: 'Função Básica', en: 'Basic Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'def define uma função em Python. Crie uma função greet que recebe um nome e retorna uma saudação.',
      en: 'def defines a function in Python. Create a greet function that takes a name and returns a greeting.',
    },
    code: `def greet(name):
    return f"Hello, {name}!"`,
    slot: 'fn-basic',
  },
  {
    id: 'py-021',
    concept: { pt: 'Callback', en: 'Callback' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Python, funções são objetos de primeira classe e podem ser passadas como argumento. Crie uma função apply que recebe uma função e um valor.',
      en: 'In Python, functions are first-class objects and can be passed as arguments. Create an apply function that takes a function and a value.',
    },
    code: `def apply(func, value):
    return func(value)

result = apply(str.upper, "hello")`,
    slot: 'fn-callback',
  },
  {
    id: 'py-022',
    concept: { pt: 'Closure', en: 'Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Closures capturam variáveis do escopo externo. Crie uma factory que retorna uma função multiplicadora configurável.',
      en: 'Closures capture variables from the outer scope. Create a factory that returns a configurable multiplier function.',
    },
    code: `def multiplier(factor):
    def multiply(n):
        return n * factor
    return multiply

double = multiplier(2)`,
    slot: 'fn-closure',
  },
  {
    id: 'py-023',
    concept: { pt: 'Parâmetro Padrão', en: 'Default Parameter' },
    difficulty: 'easy',
    prompt: {
      pt: 'Parâmetros com valor padrão permitem chamar a função sem passar todos os argumentos. Crie greet com um parâmetro greeting com valor padrão.',
      en: 'Default parameters allow calling the function without all arguments. Create greet with a greeting parameter with a default value.',
    },
    code: `def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"`,
    slot: 'fn-default-params',
  },
  // ── Loops ──────────────────────────────────────────────────
  {
    id: 'py-024',
    concept: { pt: 'For com Range', en: 'For with Range' },
    difficulty: 'easy',
    prompt: {
      pt: 'O for com range é o loop mais básico do Python. Itere de 0 a 4 e imprima cada número.',
      en: 'The for with range is Python\'s most basic loop. Iterate from 0 to 4 and print each number.',
    },
    code: `for i in range(5):
    print(i)`,
    slot: 'loop-for',
  },
  {
    id: 'py-025',
    concept: { pt: 'While', en: 'While Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'O while executa enquanto a condição for verdadeira. Conte de 1 até ultrapassar 100, dobrando a cada iteração.',
      en: 'The while loop runs as long as the condition is true. Count from 1 until exceeding 100, doubling each iteration.',
    },
    code: `n = 1
while n <= 100:
    n *= 2`,
    slot: 'loop-while',
  },
  {
    id: 'py-026',
    concept: { pt: 'For Each', en: 'For Each' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Python, o for itera diretamente sobre os elementos de uma coleção. Percorra uma lista de frutas e imprima cada uma.',
      en: 'In Python, for iterates directly over the elements of a collection. Loop through a list of fruits and print each one.',
    },
    code: `fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)`,
    slot: 'loop-foreach',
  },
  {
    id: 'py-027',
    concept: { pt: 'Filter', en: 'Filter' },
    difficulty: 'easy',
    prompt: {
      pt: 'List comprehension com condição é o jeito pythônico de filtrar listas. Filtre apenas os números pares de uma lista.',
      en: 'List comprehension with a condition is the Pythonic way to filter lists. Filter only the even numbers from a list.',
    },
    code: `evens = [x for x in numbers if x % 2 == 0]`,
    slot: 'loop-filter',
  },
  // ── Objetos ────────────────────────────────────────────────
  {
    id: 'py-028',
    concept: { pt: 'Criação de Dicionário', en: 'Dictionary Creation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Dicionários são a estrutura equivalente a objetos em Python. Crie um dicionário com informações de um usuário.',
      en: 'Dictionaries are Python\'s equivalent to objects. Create a dictionary with user information.',
    },
    code: `user = {
    "name": "Alice",
    "age": 30,
    "email": "alice@example.com",
}`,
    slot: 'obj-create',
  },
  {
    id: 'py-029',
    concept: { pt: 'Métodos de Dicionário', en: 'Dictionary Methods' },
    difficulty: 'medium',
    prompt: {
      pt: 'Dicionários têm métodos úteis como get(), keys(), values() e items(). Use get() com valor padrão pra acessar chaves com segurança.',
      en: 'Dictionaries have useful methods like get(), keys(), values(), and items(). Use get() with a default value to safely access keys.',
    },
    code: `email = user.get("email", "N/A")
keys = list(user.keys())`,
    slot: 'obj-methods',
  },
  {
    id: 'py-030',
    concept: { pt: 'Protocolo (Interface)', en: 'Protocol (Interface)' },
    difficulty: 'hard',
    prompt: {
      pt: 'Protocol (typing) define uma interface estrutural sem herança. Qualquer classe com os métodos certos satisfaz o protocolo automaticamente.',
      en: 'Protocol (typing) defines a structural interface without inheritance. Any class with the right methods satisfies the protocol automatically.',
    },
    code: `from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...`,
    slot: 'obj-interface',
  },
  {
    id: 'py-031',
    concept: { pt: 'Dicionário Aninhado', en: 'Nested Dictionary' },
    difficulty: 'medium',
    prompt: {
      pt: 'Dicionários podem conter outros dicionários. Acesse valores aninhados de forma segura com get() encadeado.',
      en: 'Dictionaries can contain other dictionaries. Access nested values safely with chained get() calls.',
    },
    code: `config = {
    "db": {"host": "localhost", "port": 5432},
    "cache": {"ttl": 300},
}
host = config.get("db", {}).get("host", "unknown")`,
    slot: 'obj-nested',
  },
  // ── Classes ────────────────────────────────────────────────
  {
    id: 'py-032',
    concept: { pt: 'Herança', en: 'Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: 'Herança permite que uma classe reutilize código de outra. Crie Dog herdando de Animal e chame super().__init__() no construtor.',
      en: 'Inheritance lets a class reuse code from another. Create Dog inheriting from Animal and call super().__init__() in the constructor.',
    },
    code: `class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed`,
    slot: 'class-inherit',
  },
  {
    id: 'py-033',
    concept: { pt: 'Sobrescrita de Método', en: 'Method Override' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma classe filha pode sobrescrever métodos da classe pai. Sobrescreva __str__ na classe Product pra retornar uma representação personalizada.',
      en: 'A child class can override parent methods. Override __str__ in the Product class to return a custom representation.',
    },
    code: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __str__(self):
        return f"{self.name}: \${self.price}"`,
    slot: 'class-override',
  },
  {
    id: 'py-034',
    concept: { pt: 'Classe Abstrata', en: 'Abstract Class' },
    difficulty: 'hard',
    prompt: {
      pt: 'ABC (Abstract Base Class) define métodos abstratos que as subclasses devem implementar. Use @abstractmethod pra forçar a implementação.',
      en: 'ABC (Abstract Base Class) defines abstract methods that subclasses must implement. Use @abstractmethod to enforce implementation.',
    },
    code: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass`,
    slot: 'class-abstract',
  },
  // ── Erros ──────────────────────────────────────────────────
  {
    id: 'py-035',
    concept: { pt: 'Try/Except', en: 'Try/Except' },
    difficulty: 'medium',
    prompt: {
      pt: 'try/except captura exceções sem quebrar o programa. Tente converter uma string pra inteiro e capture ValueError se falhar.',
      en: 'try/except catches exceptions without crashing the program. Try to convert a string to int and catch ValueError if it fails.',
    },
    code: `try:
    value = int(user_input)
except ValueError:
    print("Invalid number")`,
    slot: 'err-try-catch',
  },
  {
    id: 'py-036',
    concept: { pt: 'Exceção Customizada', en: 'Custom Exception' },
    difficulty: 'medium',
    prompt: {
      pt: 'Estenda Exception pra criar exceções de domínio com informações extras. Crie ValidationError com um campo indicando qual campo falhou.',
      en: 'Extend Exception to create domain exceptions with extra info. Create ValidationError with a field indicating which field failed.',
    },
    code: `class ValidationError(Exception):
    def __init__(self, field, message):
        super().__init__(message)
        self.field = field`,
    slot: 'err-custom',
  },
  {
    id: 'py-037',
    concept: { pt: 'Resultado com Tupla', en: 'Result with Tuple' },
    difficulty: 'medium',
    prompt: {
      pt: 'Python não tem tipo Result nativo, mas tuplas (sucesso, valor/erro) são um padrão comum pra retornar resultados sem exceções.',
      en: 'Python has no native Result type, but tuples (success, value/error) are a common pattern for returning results without exceptions.',
    },
    code: `def safe_divide(a, b):
    if b == 0:
        return (False, "Division by zero")
    return (True, a / b)`,
    slot: 'err-result',
  },
  // ── Avançado ───────────────────────────────────────────────
  {
    id: 'py-038',
    concept: { pt: 'Async/Await', en: 'Async/Await' },
    difficulty: 'hard',
    prompt: {
      pt: 'async/await permite código assíncrono em Python com asyncio. Defina uma função async que busca dados com aiohttp ou similar.',
      en: 'async/await enables asynchronous code in Python with asyncio. Define an async function that fetches data with aiohttp or similar.',
    },
    code: `async def fetch_data(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return await resp.json()`,
    slot: 'adv-async',
  },
  {
    id: 'py-039',
    concept: { pt: 'Concorrência com gather', en: 'Concurrency with gather' },
    difficulty: 'hard',
    prompt: {
      pt: 'asyncio.gather executa várias coroutines em paralelo. Use-o pra buscar dados de múltiplas URLs simultaneamente.',
      en: 'asyncio.gather runs multiple coroutines in parallel. Use it to fetch data from multiple URLs simultaneously.',
    },
    code: `async def fetch_all(urls: list[str]):
    tasks = [fetch_data(url) for url in urls]
    return await asyncio.gather(*tasks)`,
    slot: 'adv-concurrent',
  },
]
