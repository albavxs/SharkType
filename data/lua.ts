import { Snippet } from '@/lib/types'

export const luaSnippets: Snippet[] = [
  {
    id: 'lua-001',
    concept: 'Funcao e Local',
    difficulty: 'easy',
    prompt: 'Defina uma funcao local em Lua que concatena strings com o operador .. e retorna a saudacao.',
    code: `local function greet(name)
  return "Hello, " .. name .. "!"
end

print(greet("Lua"))`,
  },
  {
    id: 'lua-002',
    concept: 'Tabela',
    difficulty: 'easy',
    prompt: 'Crie uma tabela Lua com campos de pessoa e acesse os valores pelos nomes dos campos.',
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
    prompt: 'Use um for numerico para acumular a soma dos inteiros de 1 a 10.',
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
    prompt: 'Use string.format para formatar uma mensagem de texto e um numero de ponto flutuante com precisao.',
    code: `local name = "World"
local pi = math.pi
print(string.format("Hello, %s!", name))
print(string.format("Pi = %.4f", pi))`,
  },
  {
    id: 'lua-005',
    concept: 'Metatables',
    difficulty: 'medium',
    prompt: 'Implemente um objeto Vector usando metatables e __index para adicionar metodos como length.',
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
    prompt: 'Crie um contador usando closure, retornando uma tabela com funcoes inc e get encapsuladas.',
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
    prompt: 'Implemente um iterador range personalizado usando closures e use-o em um for generico.',
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
    prompt: 'Use coroutines com yield para implementar um produtor que entrega itens sob demanda via resume.',
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
    prompt: 'Implemente o padrao de modulo Lua com funcoes privadas e publicas, retornando a tabela M.',
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
    prompt: 'Use pcall para capturar erros lancados com error() e tratar o resultado com seguranca.',
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
