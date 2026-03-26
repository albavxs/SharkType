import { Snippet } from '@/lib/types'

export const pythonSnippets: Snippet[] = [
  {
    id: 'py-001',
    concept: 'List Comprehension',
    difficulty: 'easy',
    prompt: 'List comprehensions sao a forma idiomatica e concisa de criar listas em Python. Em uma unica linha, gere a lista "squares" com os quadrados de todos os numeros de 0 a 9 usando a sintaxe [expressao for variavel in range(...)].',
    code: `squares = [x ** 2 for x in range(10)]`,
  },
  {
    id: 'py-002',
    concept: 'Dict Comprehension',
    difficulty: 'easy',
    prompt: 'Dict comprehensions constroem dicionarios de forma expressiva, da mesma forma que list comprehensions. Crie "counts" mapeando cada palavra de "words" ao seu comprimento com len(), usando a sintaxe {chave: valor for item in iteravel}.',
    code: `counts = {word: len(word) for word in words}`,
  },
  {
    id: 'py-003',
    concept: 'Lambda',
    difficulty: 'easy',
    prompt: 'Lambdas sao funcoes anonimas de uma linha, ideais para uso como argumentos de outras funcoes. Use sorted() com o parametro key=lambda para ordenar a lista "users" pela propriedade "age" de cada dicionario de usuario.',
    code: `sort_by_age = sorted(users, key=lambda u: u['age'])`,
  },
  {
    id: 'py-004',
    concept: 'Decorator',
    difficulty: 'medium',
    prompt: 'Decorators envolvem uma funcao para adicionar comportamento sem modifica-la diretamente. Implemente @timer: uma funcao que retorna um wrapper, mede o tempo antes e depois de chamar func(*args, **kwargs) e imprime o tempo decorrido.',
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
    prompt: 'Context managers (with) garantem que recursos sejam liberados corretamente ao sair do bloco. Use "with open(\'data.json\', \'r\') as f" para abrir o arquivo: o fechamento sera automatico mesmo em caso de excecao.',
    code: `with open('data.json', 'r') as f:
    data = json.load(f)`,
  },
  {
    id: 'py-006',
    concept: 'Dataclass',
    difficulty: 'medium',
    prompt: '@dataclass elimina o boilerplate de __init__, __repr__ e __eq__. Defina Point com coordenadas x, y e z (com valor padrao 0.0) e adicione o metodo distance() que calcula a distancia tridimensional da origem.',
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
    prompt: 'F-strings (Python 3.6+) sao a forma moderna de formatar strings: mais rapidas e legiveis que .format() ou %. Construa a mensagem de saudacao inserindo "name" e "age" diretamente na string usando a sintaxe f"... {variavel} ...".',
    code: `greeting = f"Hello, {name}! You are {age} years old."`,
  },
  {
    id: 'py-008',
    concept: 'Walrus Operator',
    difficulty: 'hard',
    prompt: 'O operador walrus (:=) atribui e avalia em uma unica expressao, evitando calculos duplicados. Use-o para calcular len(data) uma so vez: atribua o resultado a "n" e teste se e maior que 10 no mesmo if — sem uma linha separada.',
    code: `if (n := len(data)) > 10:
    print(f"List is too long ({n} elements)")`,
  },
  {
    id: 'py-009',
    concept: 'Unpacking',
    difficulty: 'easy',
    prompt: 'Unpacking extendido decompoe sequencias em partes nomeadas. A partir de [1, 2, 3, 4, 5], atribua o primeiro elemento a "first", o ultimo a "last" e capture todos os do meio em "middle" com o asterisco (*middle).',
    code: `first, *middle, last = [1, 2, 3, 4, 5]`,
  },
  {
    id: 'py-010',
    concept: 'Generator',
    difficulty: 'hard',
    prompt: 'Generators produzem valores sob demanda com yield, sem armazenar toda a sequencia na memoria. Implemente fibonacci() como um gerador infinito: a cada iteracao, produza o valor atual e avance a sequencia.',
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b`,
  },
]
