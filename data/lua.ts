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
      pt: 'Tabelas são a única estrutura de dados do Lua — servem como array, dicionário e objeto. Crie a tabela "person" com campos chave-valor e acesse name e age com notação ponto.',
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
  {
    id: 'lua-007',
    concept: { pt: 'Iterador', en: 'Iterator' },
    difficulty: 'medium',
    slot: 'loop-range',
    prompt: {
      pt: 'Iteradores genéricos em Lua são funções que devolvem o próximo valor a cada chamada. Crie range como factory que retorna uma closure de iteração com step configurável, pra usar direto num for genérico.',
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
    concept: { pt: 'Corrotina', en: 'Coroutine' },
    difficulty: 'medium',
    slot: 'adv-concurrent',
    prompt: {
      pt: 'Coroutines deixam você pausar e retomar a execução de forma cooperativa. Crie um produtor que dá yield pra cada item, instancie com coroutine.create e consuma cada valor chamando coroutine.resume num loop.',
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
    slot: 'obj-methods',
    prompt: {
      pt: 'O padrão de módulo em Lua usa uma tabela local M pra encapsular estado e expor só a API pública. Defina uma função privada (local) e duas públicas em M, e retorne M no final pra funcionar como módulo.',
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
    slot: 'err-try-catch',
    prompt: {
      pt: 'pcall roda uma função em modo protegido: captura erros de error() sem derrubar o programa. Crie risky que valida o tipo e lança um erro descritivo, depois use pcall e cheque ok/result pra tratar sucesso e falha.',
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
  // ── New snippets ──────────────────────────────────────────────────────────
  {
    id: 'lua-011',
    concept: { pt: 'If Básico', en: 'Basic If' },
    difficulty: 'easy',
    slot: 'cond-basic-if',
    prompt: {
      pt: 'Condicionais em Lua usam "if ... then ... end". Verifique se um número é positivo e imprima o resultado.',
      en: 'Lua conditionals use "if ... then ... end". Check if a number is positive and print the result.',
    },
    code: `local x = 10
if x > 0 then
  print("positive")
end`,
  },
  {
    id: 'lua-012',
    concept: { pt: 'If e Else', en: 'If and Else' },
    difficulty: 'easy',
    slot: 'cond-if-else',
    prompt: {
      pt: 'if/elseif/else em Lua encadeia múltiplas condições. Classifique uma nota em "A", "B" ou "C" usando condicionais encadeadas.',
      en: 'if/elseif/else in Lua chains multiple conditions. Classify a grade into "A", "B", or "C" using chained conditionals.',
    },
    code: `local score = 85
if score >= 90 then
  print("A")
elseif score >= 80 then
  print("B")
else
  print("C")
end`,
  },
  {
    id: 'lua-013',
    concept: { pt: 'Operador Ternário', en: 'Ternary Operator' },
    difficulty: 'easy',
    slot: 'cond-ternary',
    prompt: {
      pt: 'Lua não tem operador ternário, mas o idioma "a and b or c" funciona como um. Use esse padrão pra escolher entre dois valores.',
      en: 'Lua has no ternary operator, but the idiom "a and b or c" works as one. Use this pattern to choose between two values.',
    },
    code: `local n = 7
local parity = (n % 2 == 0) and "even" or "odd"
print(n .. " is " .. parity)`,
  },
  {
    id: 'lua-014',
    concept: { pt: 'Switch com Tabela', en: 'Switch with Table' },
    difficulty: 'medium',
    slot: 'cond-switch',
    prompt: {
      pt: 'Lua não tem switch/case nativo, mas tabelas de funções funcionam como despacho. Crie uma tabela onde cada chave mapeia pra uma ação.',
      en: 'Lua has no native switch/case, but function tables work as dispatch. Create a table where each key maps to an action.',
    },
    code: `local actions = {
  start = function() print("Starting...") end,
  stop  = function() print("Stopping...") end,
}

local cmd = "start"
local fn = actions[cmd]
if fn then fn() else print("Unknown: " .. cmd) end`,
  },
  {
    id: 'lua-015',
    concept: { pt: 'Guard Clause', en: 'Guard Clause' },
    difficulty: 'medium',
    slot: 'cond-guard',
    prompt: {
      pt: 'Guard clauses com return antecipado simplificam funções em Lua. Valide os argumentos no início e retorne cedo se inválidos.',
      en: 'Guard clauses with early return simplify Lua functions. Validate arguments at the start and return early if invalid.',
    },
    code: `local function process(data)
  if data == nil then return "no data" end
  if type(data) ~= "string" then return "bad type" end
  return string.upper(data)
end

print(process(nil))
print(process("hello"))`,
  },
  {
    id: 'lua-016',
    concept: { pt: 'Variável Local', en: 'Local Variable' },
    difficulty: 'easy',
    slot: 'var-declare',
    prompt: {
      pt: 'Em Lua, "local" cria variáveis com escopo restrito. Sem local, a variável é global. Declare variáveis locais de diferentes tipos.',
      en: 'In Lua, "local" creates scoped variables. Without local, the variable is global. Declare local variables of different types.',
    },
    code: `local name = "Lua"
local version = 5.4
local active = true
print(name, version, active)`,
  },
  {
    id: 'lua-017',
    concept: { pt: 'Constantes (Convenção)', en: 'Constants (Convention)' },
    difficulty: 'easy',
    slot: 'var-const',
    prompt: {
      pt: 'Lua não tem constantes nativas, mas a convenção é usar MAIÚSCULAS. Em Lua 5.4, <const> marca variáveis locais como constantes.',
      en: 'Lua has no native constants, but the convention is UPPER_CASE. In Lua 5.4, <const> marks local variables as constants.',
    },
    code: `local MAX_RETRIES <const> = 3
local API_URL = "https://api.example.com"
local PI = 3.14159
print(MAX_RETRIES, API_URL)`,
  },
  {
    id: 'lua-018',
    concept: { pt: 'Tipos Dinâmicos', en: 'Dynamic Types' },
    difficulty: 'easy',
    slot: 'var-types',
    prompt: {
      pt: 'Lua é dinamicamente tipada: use type() pra inspecionar o tipo de qualquer valor. Crie variáveis de tipos diferentes e verifique cada uma.',
      en: 'Lua is dynamically typed: use type() to inspect any value\'s type. Create variables of different types and check each one.',
    },
    code: `local n = 42
local s = "hello"
local t = {1, 2, 3}
local f = function() end
print(type(n), type(s), type(t), type(f))`,
  },
  {
    id: 'lua-019',
    concept: { pt: 'Array (Tabela Sequencial)', en: 'Array (Sequential Table)' },
    difficulty: 'easy',
    slot: 'var-array',
    prompt: {
      pt: 'Tabelas sequenciais funcionam como arrays em Lua, com índice começando em 1. Crie, acesse por índice, adicione elementos e veja o tamanho.',
      en: 'Sequential tables work as arrays in Lua, with index starting at 1. Create, access by index, add elements and check the length.',
    },
    code: `local langs = {"Lua", "Python", "Ruby"}
print(langs[1])
table.insert(langs, "Scala")
print(#langs)`,
  },
  {
    id: 'lua-020',
    concept: { pt: 'Desempacotamento', en: 'Unpacking' },
    difficulty: 'medium',
    slot: 'var-destructure',
    prompt: {
      pt: 'table.unpack (ou unpack em Lua 5.1) extrai valores de uma tabela em variáveis separadas. Use pra desempacotar coordenadas.',
      en: 'table.unpack (or unpack in Lua 5.1) extracts values from a table into separate variables. Use it to unpack coordinates.',
    },
    code: `local coords = {10, 20, 30}
local x, y, z = table.unpack(coords)
print(x, y, z)

local function swap(a, b) return b, a end
local a, b = swap(1, 2)
print(a, b)`,
  },
  {
    id: 'lua-021',
    concept: { pt: 'Função Anônima', en: 'Anonymous Function' },
    difficulty: 'easy',
    slot: 'fn-arrow',
    prompt: {
      pt: 'Funções anônimas em Lua são criadas com "function(...) ... end" inline. Atribua a variáveis locais e passe como argumentos.',
      en: 'Lua anonymous functions are created with inline "function(...) ... end". Assign to local variables and pass as arguments.',
    },
    code: `local double = function(x) return x * 2 end
local nums = {1, 2, 3}

for _, v in ipairs(nums) do
  print(double(v))
end`,
  },
  {
    id: 'lua-022',
    concept: { pt: 'Callback', en: 'Callback' },
    difficulty: 'medium',
    slot: 'fn-callback',
    prompt: {
      pt: 'Funções de alta ordem recebem outras funções como argumento. Crie apply que recebe uma tabela e uma função, aplicando-a a cada elemento.',
      en: 'Higher-order functions receive other functions as arguments. Create apply that takes a table and a function, applying it to each element.',
    },
    code: `local function apply(tbl, fn)
  local result = {}
  for i, v in ipairs(tbl) do
    result[i] = fn(v)
  end
  return result
end

local squared = apply({1, 2, 3}, function(x) return x * x end)`,
  },
  {
    id: 'lua-023',
    concept: { pt: 'Parâmetros Padrão', en: 'Default Parameters' },
    difficulty: 'easy',
    slot: 'fn-default-params',
    prompt: {
      pt: 'Lua simula parâmetros padrão com "param = param or valor". Crie uma função greet com saudação configurável e valor padrão.',
      en: 'Lua simulates default parameters with "param = param or value". Create a greet function with configurable greeting and default value.',
    },
    code: `local function greet(name, greeting)
  greeting = greeting or "Hello"
  return greeting .. ", " .. name .. "!"
end

print(greet("Alice"))
print(greet("Bob", "Hi"))`,
  },
  {
    id: 'lua-024',
    concept: { pt: 'Laço While', en: 'While Loop' },
    difficulty: 'easy',
    slot: 'loop-while',
    prompt: {
      pt: 'O while em Lua repete enquanto a condição for verdadeira. Use pra contar de 0 a 4, incrementando a cada iteração.',
      en: 'Lua while repeats as long as the condition is true. Use it to count from 0 to 4, incrementing each iteration.',
    },
    code: `local count = 0
while count < 5 do
  print("Count: " .. count)
  count = count + 1
end`,
  },
  {
    id: 'lua-025',
    concept: { pt: 'ipairs e Iteração', en: 'ipairs and Iteration' },
    difficulty: 'easy',
    slot: 'loop-foreach',
    prompt: {
      pt: 'ipairs itera sobre a parte sequencial da tabela e pairs sobre todas as chaves. Use ambos pra percorrer arrays e dicionários.',
      en: 'ipairs iterates over the sequential part of a table and pairs over all keys. Use both to traverse arrays and dictionaries.',
    },
    code: `local fruits = {"apple", "banana", "cherry"}
for i, v in ipairs(fruits) do
  print(i, v)
end

local cfg = {host = "localhost", port = 8080}
for k, v in pairs(cfg) do print(k, v) end`,
  },
  {
    id: 'lua-026',
    concept: { pt: 'Filtro com Tabela', en: 'Filter with Table' },
    difficulty: 'medium',
    slot: 'loop-filter',
    prompt: {
      pt: 'Lua não tem filter nativo, mas é fácil criar com um loop. Implemente filter que retorna uma nova tabela com os elementos que passam no teste.',
      en: 'Lua has no native filter, but it is easy to create with a loop. Implement filter that returns a new table with elements that pass the test.',
    },
    code: `local function filter(tbl, fn)
  local out = {}
  for _, v in ipairs(tbl) do
    if fn(v) then out[#out + 1] = v end
  end
  return out
end

local evens = filter({1,2,3,4,5}, function(n) return n % 2 == 0 end)`,
  },
  {
    id: 'lua-027',
    concept: { pt: 'Interface com Metatabela', en: 'Interface with Metatable' },
    difficulty: 'medium',
    slot: 'obj-interface',
    prompt: {
      pt: 'Lua simula interfaces com tabelas que definem contratos. Crie uma "interface" Drawable e verifique se um objeto implementa os métodos exigidos.',
      en: 'Lua simulates interfaces with tables that define contracts. Create a Drawable "interface" and verify that an object implements the required methods.',
    },
    code: `local function implements(obj, interface)
  for _, method in ipairs(interface) do
    if type(obj[method]) ~= "function" then return false end
  end
  return true
end

local Drawable = {"draw", "color"}
local shape = {draw = function() end, color = function() return "red" end}
print(implements(shape, Drawable))`,
  },
  {
    id: 'lua-028',
    concept: { pt: 'Tabela Aninhada', en: 'Nested Table' },
    difficulty: 'medium',
    slot: 'obj-nested',
    prompt: {
      pt: 'Tabelas podem ser aninhadas pra modelar dados hierárquicos. Crie uma empresa com endereço aninhado e acesse campos encadeando notação ponto.',
      en: 'Tables can be nested to model hierarchical data. Create a company with nested address and access fields by chaining dot notation.',
    },
    code: `local company = {
  name = "Acme",
  address = { city = "SP", zip = "01000" },
}
print(company.name)
print(company.address.city)`,
  },
  {
    id: 'lua-029',
    concept: { pt: 'Herança com Metatabela', en: 'Inheritance with Metatable' },
    difficulty: 'medium',
    slot: 'class-inherit',
    prompt: {
      pt: 'Herança em Lua usa cadeia de metatables: o __index de Dog aponta pra Animal. Crie Animal como "classe" base e Dog herdando seus métodos.',
      en: 'Lua inheritance uses metatable chains: Dog\'s __index points to Animal. Create Animal as a base "class" and Dog inheriting its methods.',
    },
    code: `local Animal = {}
Animal.__index = Animal
function Animal.new(name) return setmetatable({name=name}, Animal) end
function Animal:speak() return self.name .. " ..." end

local Dog = setmetatable({}, {__index = Animal})
Dog.__index = Dog
function Dog.new(name) return setmetatable(Animal.new(name), Dog) end
function Dog:speak() return self.name .. " barks!" end`,
  },
  {
    id: 'lua-030',
    concept: { pt: 'Override de Método', en: 'Method Override' },
    difficulty: 'medium',
    slot: 'class-override',
    prompt: {
      pt: 'Sobrescrever métodos em Lua é simplesmente redefinir a função na tabela filha. O __index faz o fallback pra métodos não sobrescritos.',
      en: 'Overriding methods in Lua is simply redefining the function in the child table. __index falls back for non-overridden methods.',
    },
    code: `local Shape = {}
Shape.__index = Shape
function Shape:area() return 0 end
function Shape:name() return "Shape" end

local Rect = setmetatable({}, {__index = Shape})
Rect.__index = Rect
function Rect.new(w, h) return setmetatable({w=w, h=h}, Rect) end
function Rect:area() return self.w * self.h end`,
  },
  {
    id: 'lua-031',
    concept: { pt: 'Classe Abstrata', en: 'Abstract Class' },
    difficulty: 'hard',
    slot: 'class-abstract',
    prompt: {
      pt: 'Lua simula classes abstratas com métodos que lançam error() se não forem sobrescritos. Crie uma "classe" base que exige implementação.',
      en: 'Lua simulates abstract classes with methods that throw error() if not overridden. Create a base "class" that requires implementation.',
    },
    code: `local Formatter = {}
Formatter.__index = Formatter
function Formatter:format()
  error("format() must be implemented")
end

local Json = setmetatable({}, {__index = Formatter})
Json.__index = Json
function Json:format(data)
  return "{ data: " .. tostring(data) .. " }"
end`,
  },
  {
    id: 'lua-032',
    concept: { pt: 'Erro Personalizado', en: 'Custom Error' },
    difficulty: 'medium',
    slot: 'err-custom',
    prompt: {
      pt: 'Erros customizados em Lua usam tabelas como objetos de erro. Crie um erro estruturado com tipo e mensagem e lance com error().',
      en: 'Custom errors in Lua use tables as error objects. Create a structured error with type and message and throw with error().',
    },
    code: `local function validate(age)
  if age < 0 then
    error({type = "ValidationError", msg = "negative age"})
  end
  return age
end

local ok, err = pcall(validate, -1)
if not ok then print(err.type .. ": " .. err.msg) end`,
  },
  {
    id: 'lua-033',
    concept: { pt: 'Result Pattern com pcall', en: 'Result Pattern with pcall' },
    difficulty: 'hard',
    slot: 'err-result',
    prompt: {
      pt: 'pcall retorna um booleano ok e o resultado ou erro, funcionando como um Result. Use pcall pra criar um padrão Result explícito.',
      en: 'pcall returns a boolean ok and the result or error, working as a Result. Use pcall to create an explicit Result pattern.',
    },
    code: `local function parse_int(str)
  local n = tonumber(str)
  if not n then error("invalid: " .. str) end
  return math.floor(n)
end

local ok, val = pcall(parse_int, "42")
if ok then print("Ok:", val) else print("Err:", val) end`,
  },
  {
    id: 'lua-034',
    concept: { pt: 'Finally com xpcall', en: 'Finally with xpcall' },
    difficulty: 'medium',
    slot: 'err-finally',
    prompt: {
      pt: 'Lua não tem finally, mas xpcall com handler e cleanup manual simulam o mesmo efeito. Execute cleanup independente do resultado.',
      en: 'Lua has no finally, but xpcall with handler and manual cleanup simulate the same effect. Execute cleanup regardless of the result.',
    },
    code: `local resource = "open"
local ok, result = xpcall(function()
  error("oops")
end, function(err)
  return "Caught: " .. err
end)
resource = nil
print(result)
print("Cleaned up, resource:", resource)`,
  },
  {
    id: 'lua-035',
    concept: { pt: 'Genérico com Função', en: 'Generic with Function' },
    difficulty: 'medium',
    slot: 'type-generic',
    prompt: {
      pt: 'Lua é dinamicamente tipada, mas funções podem atuar genericamente sobre qualquer tipo. Crie map que transforma qualquer tabela usando uma função.',
      en: 'Lua is dynamically typed, but functions can act generically on any type. Create map that transforms any table using a function.',
    },
    code: `local function map(tbl, fn)
  local out = {}
  for i, v in ipairs(tbl) do
    out[i] = fn(v)
  end
  return out
end

local strs = map({1, 2, 3}, tostring)`,
  },
  {
    id: 'lua-036',
    concept: { pt: 'Union com Type Check', en: 'Union with Type Check' },
    difficulty: 'medium',
    slot: 'type-union',
    prompt: {
      pt: 'Lua simula tipos union verificando type() em runtime. Crie uma função que aceita string ou number e trata cada caso.',
      en: 'Lua simulates union types by checking type() at runtime. Create a function that accepts string or number and handles each case.',
    },
    code: `local function stringify(val)
  local t = type(val)
  if t == "string" then return val
  elseif t == "number" then return tostring(val)
  elseif t == "table" then return table.concat(val, ", ")
  else error("unsupported type: " .. t)
  end
end`,
  },
  {
    id: 'lua-037',
    concept: { pt: 'Constraint com Assert', en: 'Constraint with Assert' },
    difficulty: 'hard',
    slot: 'type-constraint',
    prompt: {
      pt: 'assert valida pré-condições em Lua, funcionando como type constraint. Use assert com type() pra garantir tipos corretos nos parâmetros.',
      en: 'assert validates preconditions in Lua, acting as a type constraint. Use assert with type() to ensure correct parameter types.',
    },
    code: `local function add_nums(a, b)
  assert(type(a) == "number", "a must be number")
  assert(type(b) == "number", "b must be number")
  return a + b
end

print(add_nums(3, 4))`,
  },
  {
    id: 'lua-038',
    concept: { pt: 'Tipo Utilitário', en: 'Utility Type' },
    difficulty: 'hard',
    slot: 'type-utility',
    prompt: {
      pt: 'Tabelas com metatables podem criar tipos utilitários como readonly. Use __newindex pra criar uma tabela somente leitura.',
      en: 'Tables with metatables can create utility types like readonly. Use __newindex to create a read-only table.',
    },
    code: `local function readonly(tbl)
  return setmetatable({}, {
    __index = tbl,
    __newindex = function()
      error("attempt to modify read-only table")
    end,
  })
end

local cfg = readonly({host = "localhost", port = 8080})
print(cfg.host)`,
  },
  {
    id: 'lua-039',
    concept: { pt: 'Async com Coroutine', en: 'Async with Coroutine' },
    difficulty: 'hard',
    slot: 'adv-async',
    prompt: {
      pt: 'Coroutines simulam async/await em Lua. Crie um scheduler simples que resume coroutines até todas completarem.',
      en: 'Coroutines simulate async/await in Lua. Create a simple scheduler that resumes coroutines until all complete.',
    },
    code: `local function task(name, n)
  for i = 1, n do
    coroutine.yield(name .. " step " .. i)
  end
end

local tasks = {
  coroutine.create(function() task("A", 2) end),
  coroutine.create(function() task("B", 3) end),
}`,
  },
  {
    id: 'lua-040',
    concept: { pt: 'Pattern Matching', en: 'Pattern Matching' },
    difficulty: 'hard',
    slot: 'adv-pattern',
    prompt: {
      pt: 'Lua tem padrões de string com string.match e string.gmatch pra extrair dados. Use padrões pra parsear formatos estruturados.',
      en: 'Lua has string patterns with string.match and string.gmatch to extract data. Use patterns to parse structured formats.',
    },
    code: `local date = "2026-03-28"
local y, m, d = string.match(date, "(%d+)-(%d+)-(%d+)")
print(y, m, d)

local csv = "Alice,30,SP"
for field in string.gmatch(csv, "([^,]+)") do
  print(field)
end`,
  },
  {
    id: 'lua-041',
    concept: { pt: 'Macro (Metaprogramação)', en: 'Macro (Metaprogramming)' },
    difficulty: 'hard',
    slot: 'adv-macro',
    prompt: {
      pt: 'Lua permite metaprogramação via metatables e load(). Use load() pra compilar e executar código gerado dinamicamente.',
      en: 'Lua enables metaprogramming via metatables and load(). Use load() to compile and execute dynamically generated code.',
    },
    code: `local function make_getter(field)
  local code = "return function(t) return t." .. field .. " end"
  return load(code)()
end

local get_name = make_getter("name")
local obj = {name = "Lua", version = 5.4}
print(get_name(obj))`,
  },
]
