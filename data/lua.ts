import { Snippet } from '@/lib/types'

export const luaSnippets: Snippet[] = [
  {
    id: 'lua-001',
    concept: { pt: 'Função e Local', en: 'Function and Local' },
    difficulty: 'easy',
    slot: 'fn-basic',
    prompt: {
      pt: '"local function" define uma função com escopo restrito ao arquivo ou bloco atual. Crie greet usando o operador de concatenação (..) pra juntar as partes da saudação e chame print pra exibir.',
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
    slot: 'obj-create',
    prompt: {
      pt: 'Tabelas são a única estrutura de dados do Lua -- servem como array, dicionário e objeto. Crie a tabela "person" com campos chave-valor e acesse name e age com notação ponto.',
      en: 'Tables are Lua\'s only data structure -- used as arrays, dictionaries and objects. Create the "person" table with key-value fields and access name and age using dot notation.',
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
    concept: { pt: 'Laço For', en: 'For Loop' },
    difficulty: 'easy',
    slot: 'loop-for',
    prompt: {
      pt: 'O for numérico em Lua segue a sintaxe "for i = início, fim do". Use pra somar os inteiros de 1 a 10 numa variável local e imprima o resultado no final.',
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
    concept: { pt: 'Formatação de String', en: 'String Format' },
    difficulty: 'easy',
    slot: 'var-interpolation',
    prompt: {
      pt: 'string.format funciona igual printf em C. Use %s pra inserir uma string e %.4f pra formatar math.pi com exatamente quatro casas decimais, chamando print pra cada linha.',
      en: 'string.format works like printf in C. Use the %s specifier to insert a string and %.4f to format math.pi with exactly four decimal places, calling print for each line.',
    },
    code: `local name = "World"
local pi = math.pi
print(string.format("Hello, %s!", name))
print(string.format("Pi = %.4f", pi))`,
  },
  {
    id: 'lua-005',
    concept: { pt: 'Metatabelas', en: 'Metatables' },
    difficulty: 'medium',
    slot: 'class-basic',
    prompt: {
      pt: 'Metatables deixam você sobrecarregar operadores e botar métodos em tabelas. Crie Vector com __index apontando pra si mesmo, um construtor new com setmetatable e o método :length que calcula a norma euclidiana.',
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
    concept: { pt: 'Clausura', en: 'Closure' },
    difficulty: 'medium',
    slot: 'fn-closure',
    prompt: {
      pt: 'Closures em Lua capturam variáveis locais do escopo de fora (upvalues). Monte counter: retorne uma tabela com duas closures (inc e get) que compartilham e mexem na mesma variável "count" encapsulada.',
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
]
