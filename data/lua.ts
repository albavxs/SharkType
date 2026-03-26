import { Snippet } from '@/lib/types'

export const luaSnippets: Snippet[] = [
  {
    id: 'lua-001',
    concept: { pt: 'Função e Local', en: 'Function and Local' },
    difficulty: 'easy',
    prompt: {
      pt: '"local function" define uma função cujo escopo é restrito ao arquivo ou bloco atual. Implemente greet usando o operador de concatenação (..) para juntar as partes da saudação e chame print para exibir o resultado.',
      en: '"local function" defines a function scoped to the current file or block. Implement greet using the concatenation operator (..) to join the greeting parts and call print to display the result.',
    },
    code: `local function greet(name)
  return "Hello, " .. name .. "!"
end

print(greet("Lua"))`,
  },
  {
    id: 'lua-002',
    concept: { pt: 'Tabela', en: 'Table' },
    difficulty: 'easy',
    prompt: {
      pt: 'Tabelas são a única estrutura de dados em Lua — usadas como arrays, dicionários e objetos. Crie a tabela "person" com campos nome-valor e acesse name e age usando a notação ponto.',
      en: 'Tables are Lua\'s only data structure — used as arrays, dictionaries and objects. Create the "person" table with key-value fields and access name and age using dot notation.',
    },
    code: `local person = {
  name = "Alice",
  age  = 30,
  city = "Brasilia",
}
print(person.name, person.age)`,
  },
  {
    id: 'lua-003',
    concept: { pt: 'For Loop', en: 'For Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'O for numérico em Lua tem a sintaxe "for i = início, fim do". Use-o para acumular a soma dos inteiros de 1 a 10 em uma variável local e imprima o resultado ao final.',
      en: 'Lua\'s numeric for has the syntax "for i = start, end do". Use it to accumulate the sum of integers from 1 to 10 in a local variable and print the result at the end.',
    },
    code: `local sum = 0
for i = 1, 10 do
  sum = sum + i
end
print("Sum:", sum)`,
  },
  {
    id: 'lua-004',
    concept: { pt: 'String Format', en: 'String Format' },
    difficulty: 'easy',
    prompt: {
      pt: 'string.format funciona como printf em C. Use o especificador %s para inserir uma string e %.4f para formatar math.pi com exatamente quatro casas decimais, chamando print para cada linha.',
      en: 'string.format works like printf in C. Use the %s specifier to insert a string and %.4f to format math.pi with exactly four decimal places, calling print for each line.',
    },
    code: `local name = "World"
local pi = math.pi
print(string.format("Hello, %s!", name))
print(string.format("Pi = %.4f", pi))`,
  },
  {
    id: 'lua-005',
    concept: { pt: 'Metatables', en: 'Metatables' },
    difficulty: 'medium',
    prompt: {
      pt: 'Metatables permitem sobrecarregar operadores e adicionar métodos a tabelas. Crie Vector com __index apontando para si mesmo, um construtor new que usa setmetatable e o método :length que calcula a norma euclidiana.',
      en: 'Metatables let you overload operators and add methods to tables. Create Vector with __index pointing to itself, a new constructor using setmetatable and the :length method that computes the Euclidean norm.',
    },
    code: `local Vector = {}
Vector.__index = Vector

function Vector.new(x, y)
  return setmetatable({ x = x, y = y }, Vector)
end

function Vector:length()
  return math.sqrt(self.x^2 + self.y^2)
end`,
  },
  {
    id: 'lua-006',
    concept: { pt: 'Closure', en: 'Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Closures em Lua capturam variáveis locais do escopo externo (upvalues). Implemente counter: retorne uma tabela com duas closures (inc e get) que compartilham e manipulam a mesma variável "count" encapsulada.',
      en: 'Lua closures capture local variables from the outer scope (upvalues). Implement counter: return a table with two closures (inc and get) that share and manipulate the same encapsulated "count" variable.',
    },
    code: `local function counter(start)
  local count = start or 0
  return {
    inc = function() count = count + 1 end,
    get = function() return count end,
  }
end

local c = counter(10)
c.inc(); c.inc()
print(c.get())`,
  },
  {
    id: 'lua-007',
    concept: { pt: 'Iterador', en: 'Iterator' },
    difficulty: 'medium',
    prompt: {
      pt: 'Iteradores genéricos em Lua são funções que retornam o próximo valor a cada chamada. Implemente range como uma factory que retorna uma closure de iteração com step configurável, usável diretamente em um for genérico.',
      en: 'Generic iterators in Lua are functions that return the next value on each call. Implement range as a factory that returns an iteration closure with configurable step, usable directly in a generic for.',
    },
    code: `local function range(from, to, step)
  step = step or 1
  return function(_, i)
    i = i + step
    if i <= to then return i end
  end, nil, from - step
end

for i in range(1, 5) do io.write(i .. " ") end`,
  },
  {
    id: 'lua-008',
    concept: { pt: 'Coroutine', en: 'Coroutine' },
    difficulty: 'medium',
    prompt: {
      pt: 'Coroutines permitem pausar e retomar a execução cooperativamente. Crie um produtor que usa yield para cada item, crie a coroutine com coroutine.create e consuma cada valor com coroutine.resume em um loop.',
      en: 'Coroutines let you pause and resume execution cooperatively. Create a producer that uses yield for each item, create the coroutine with coroutine.create and consume each value with coroutine.resume in a loop.',
    },
    code: `local function producer()
  local items = {"a", "b", "c"}
  for _, v in ipairs(items) do
    coroutine.yield(v)
  end
end

local co = coroutine.create(producer)
while true do
  local ok, val = coroutine.resume(co)
  if not ok or val == nil then break end
  print(val)
end`,
  },
  {
    id: 'lua-009',
    concept: { pt: 'Padrão de Módulo', en: 'Module Pattern' },
    difficulty: 'hard',
    prompt: {
      pt: 'O padrão de módulo em Lua usa uma tabela local M para encapsular estado e expor apenas a API pública. Defina uma função privada (local) e duas públicas em M, depois retorne M ao final para uso como módulo.',
      en: 'Lua\'s module pattern uses a local table M to encapsulate state and expose only the public API. Define a private (local) function and two public ones in M, then return M at the end for use as a module.',
    },
    code: `local M = {}

local function private_helper(x)
  return x * x
end

function M.compute(n)
  return private_helper(n) + n
end

function M.greet(name)
  return "Hello from module, " .. name
end

return M`,
  },
  {
    id: 'lua-010',
    concept: { pt: 'pcall e Tratamento de Erros', en: 'pcall and Error Handling' },
    difficulty: 'hard',
    prompt: {
      pt: 'pcall chama uma função em modo protegido: captura erros lançados por error() sem abortar o programa. Defina risky que valida o tipo e lança um erro descritivo, depois use pcall e verifique ok/result para tratar sucesso e falha.',
      en: 'pcall calls a function in protected mode: it catches errors thrown by error() without crashing the program. Define risky that validates the type and throws a descriptive error, then use pcall and check ok/result to handle success and failure.',
    },
    code: `local function risky(x)
  if type(x) ~= "number" then
    error("expected number, got " .. type(x))
  end
  return math.sqrt(x)
end

local ok, result = pcall(risky, "oops")
if not ok then
  print("Error:", result)
else
  print("Result:", result)
end`,
  },
]
