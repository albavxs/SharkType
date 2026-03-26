import { Snippet } from '@/lib/types'

export const luaSnippets: Snippet[] = [
  {
    id: 'lua-001',
    concept: 'Funcao e Local',
    difficulty: 'easy',
    prompt: '"local function" define uma funcao cujo escopo e restrito ao arquivo ou bloco atual. Implemente greet usando o operador de concatenacao (..) para juntar as partes da saudacao e chame print para exibir o resultado.',
    code: `local function greet(name)
  return "Hello, " .. name .. "!"
end

print(greet("Lua"))`,
  },
  {
    id: 'lua-002',
    concept: 'Tabela',
    difficulty: 'easy',
    prompt: 'Tabelas sao a unica estrutura de dados em Lua — usadas como arrays, dicionarios e objetos. Crie a tabela "person" com campos nome-valor e acesse name e age usando a notacao ponto.',
    code: `local person = {
  name = "Alice",
  age  = 30,
  city = "Brasilia",
}
print(person.name, person.age)`,
  },
  {
    id: 'lua-003',
    concept: 'For Loop',
    difficulty: 'easy',
    prompt: 'O for numerico em Lua tem a sintaxe "for i = inicio, fim do". Use-o para acumular a soma dos inteiros de 1 a 10 em uma variavel local e imprima o resultado ao final.',
    code: `local sum = 0
for i = 1, 10 do
  sum = sum + i
end
print("Sum:", sum)`,
  },
  {
    id: 'lua-004',
    concept: 'String Format',
    difficulty: 'easy',
    prompt: 'string.format funciona como printf em C. Use o especificador %s para inserir uma string e %.4f para formatar math.pi com exatamente quatro casas decimais, chamando print para cada linha.',
    code: `local name = "World"
local pi = math.pi
print(string.format("Hello, %s!", name))
print(string.format("Pi = %.4f", pi))`,
  },
  {
    id: 'lua-005',
    concept: 'Metatables',
    difficulty: 'medium',
    prompt: 'Metatables permitem sobrecarregar operadores e adicionar metodos a tabelas. Crie Vector com __index apontando para si mesmo, um construtor new que usa setmetatable e o metodo :length que calcula a norma euclidiana.',
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
    concept: 'Closure',
    difficulty: 'medium',
    prompt: 'Closures em Lua capturam variaveis locais do escopo externo (upvalues). Implemente counter: retorne uma tabela com duas closures (inc e get) que compartilham e manipulam a mesma variavel "count" encapsulada.',
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
    concept: 'Iterador',
    difficulty: 'medium',
    prompt: 'Iteradores genericos em Lua sao funcoes que retornam o proximo valor a cada chamada. Implemente range como uma factory que retorna uma closure de iteracao com step configuravel, usavel diretamente em um for generico.',
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
    concept: 'Coroutine',
    difficulty: 'medium',
    prompt: 'Coroutines permitem pausar e retomar a execucao cooperativamente. Crie um produtor que usa yield para cada item, crie a coroutine com coroutine.create e consuma cada valor com coroutine.resume em um loop.',
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
    concept: 'Modulo Pattern',
    difficulty: 'hard',
    prompt: 'O padrao de modulo em Lua usa uma tabela local M para encapsular estado e expor apenas a API publica. Defina uma funcao privada (local) e duas publicas em M, depois retorne M ao final para uso como modulo.',
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
    concept: 'pcall e Error Handling',
    difficulty: 'hard',
    prompt: 'pcall chama uma funcao em modo protegido: captura erros lancados por error() sem abortar o programa. Defina risky que valida o tipo e lanca um erro descritivo, depois use pcall e verifique ok/result para tratar sucesso e falha.',
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
