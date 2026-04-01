import { Snippet } from '@/lib/types'

export const rubySnippets: Snippet[] = [
  {
    id: 'ruby-001',
    concept: { pt: 'Método', en: 'Method' },
    difficulty: 'easy',
    slot: 'fn-default-params',
    prompt: {
      pt: 'Métodos em Ruby são definidos com "def" e retornam a última expressão automaticamente. Crie greet com um argumento "name" que tem "World" como valor padrão -- sem precisar de return explícito.',
      en: 'Ruby methods are defined with "def" and implicitly return the last expression\'s value. Define greet with a "name" argument that defaults to "World" -- no explicit return needed.',
    },
    code: `def greet(name = "World")
  "Hello, #{name}!"
end

puts greet("Ruby")`,
  },
  {
    id: 'ruby-002',
    concept: { pt: 'Interpolação de String', en: 'String Interpolation' },
    difficulty: 'easy',
    slot: 'var-interpolation',
    prompt: {
      pt: 'Interpolação de string em Ruby usa #{expressão} dentro de aspas duplas. Junte a variável "language" e o número "version" numa mensagem -- qualquer expressão Ruby pode entrar dentro de #{}.',
      en: 'Ruby string interpolation uses #{expression} inside double quotes. Combine the "language" variable and the "version" number in a message -- any Ruby expression can be evaluated inside #{}.',
    },
    code: `language = "Ruby"
version = 3.2
puts "#{language} #{version} is awesome!"`,
  },
  {
    id: 'ruby-003',
    concept: { pt: 'Métodos de Array', en: 'Array Methods' },
    difficulty: 'easy',
    slot: 'loop-filter',
    prompt: {
      pt: 'Ruby tem métodos funcionais bem ricos em Array. Use .map com bloco pra dobrar cada número, .select com Symbol#to_proc (&:even?) pra pegar só os pares e .sum pro total -- um por linha.',
      en: 'Ruby has rich functional Array methods. Use .map with a block to double each number, .select with Symbol#to_proc (&:even?) to filter only evens and .sum to calculate the total -- one per line.',
    },
    code: `nums = [3, 1, 4, 1, 5, 9, 2, 6]
doubled = nums.map { |n| n * 2 }
evens = nums.select(&:even?)
total = nums.sum`,
  },
  {
    id: 'ruby-004',
    concept: { pt: 'Hash', en: 'Hash' },
    difficulty: 'easy',
    slot: 'obj-create',
    prompt: {
      pt: 'Hashes em Ruby são dicionários criados com {chave: valor}. Declare um hash de pessoa com símbolos, acesse um campo pela chave e use .each com bloco de dois parâmetros pra percorrer todos os pares.',
      en: 'Ruby hashes are dictionaries created with the {key: value} syntax. Declare a person hash with symbols, access a specific field by key and use .each with a two-parameter block to iterate all pairs.',
    },
    code: `person = { name: "Alice", age: 30, city: "SP" }
puts person[:name]
person.each { |k, v| puts "#{k}: #{v}" }`,
  },
  {
    id: 'ruby-005',
    concept: { pt: 'Classe', en: 'Class' },
    difficulty: 'medium',
    slot: 'class-basic',
    prompt: {
      pt: 'attr_accessor gera getters e setters automaticamente pras variáveis de instância. Defina Animal com @name e @sound inicializados no constructor, e o método speak que junta os dois com interpolação de string.',
      en: 'attr_accessor auto-generates getters and setters for instance variables. Define Animal with @name and @sound initialized by the constructor, and the speak method that combines both with string interpolation.',
    },
    code: `class Animal
  attr_accessor :name, :sound

  def initialize(name, sound)
    @name = name
    @sound = sound
  end

  def speak
    "#{@name} says #{@sound}!"
  end
end`,
  },
  {
    id: 'ruby-006',
    concept: { pt: 'Bloco e Yield', en: 'Block and Yield' },
    difficulty: 'medium',
    slot: 'fn-callback',
    prompt: {
      pt: 'Blocks são o mecanismo mais fundamental de customização no Ruby -- qualquer método pode receber um bloco via yield. Crie "repeat" usando n.times e chamando yield a cada iteração pra executar o bloco que foi passado.',
      en: 'Blocks are Ruby\'s most fundamental customization mechanism -- any method can accept a block with yield. Implement "repeat" using n.times and calling yield on each iteration to execute the provided block.',
    },
    code: `def repeat(n)
  n.times { yield }
end

repeat(3) { puts "Hello!" }`,
  },
  {
    id: 'ruby-007',
    concept: { pt: 'Módulo e Mixin', en: 'Module and Mixin' },
    difficulty: 'medium',
    slot: 'obj-interface',
    prompt: {
      pt: 'Modules dão namespacing e reuso de código via include (mixin). Crie Serializable com o método to_json usando instance_variables e inclua em User -- as instâncias de User ganham to_json sem precisar de herança.',
      en: 'Modules provide namespacing and code reuse via include (mixin). Create Serializable with a to_json method that uses instance_variables and include it in User -- User instances gain to_json without inheritance.',
    },
    code: `module Serializable
  def to_json
    instance_variables.map { |v|
      "\\"#{v.to_s.delete('@')}\\": \\"#{instance_variable_get(v)}\\""
    }.join(", ")
  end
end

class User
  include Serializable
  attr_accessor :name
end`,
  },
  {
    id: 'ruby-008',
    concept: { pt: 'Enumerável', en: 'Enumerable' },
    difficulty: 'medium',
    slot: 'loop-foreach',
    prompt: {
      pt: 'Ruby incentiva encadear métodos Enumerable de forma fluente. Numa expressão só, filtre palavras com mais de 4 letras, aplique capitalize, ordene em ordem alfabética e junte tudo numa string com ", " entre elas.',
      en: 'Ruby encourages fluent chaining of Enumerable methods. In a single expression, filter words longer than 4 characters, transform to capitalize, sort alphabetically and join into a string with ", " between them.',
    },
    code: `words = %w[hello world ruby programming]
result = words
  .select { |w| w.length > 4 }
  .map(&:capitalize)
  .sort
  .join(", ")`,
  },
  {
    id: 'ruby-009',
    concept: { pt: 'Proc e Lambda', en: 'Proc and Lambda' },
    difficulty: 'hard',
    slot: 'fn-closure',
    prompt: {
      pt: 'Lambdas (-> {}) e Procs se comportam diferente no return e na aridade. Defina square como lambda e cube como proc, depois crie transform como lambda que recebe um array e uma função, usando .map(&fn) pra aplicar.',
      en: 'Lambdas (-> {}) and Procs differ in return behavior and arity. Define square as a lambda and cube as a proc, then implement transform as a lambda that takes an array and a function, calling .map(&fn) to apply it.',
    },
    code: `square = ->(x) { x ** 2 }
cube   = proc { |x| x ** 3 }

transform = ->(arr, fn) { arr.map(&fn) }
puts transform.call([1, 2, 3, 4], square)`,
  },
  {
    id: 'ruby-010',
    concept: { pt: 'Método Ausente', en: 'Method Missing' },
    difficulty: 'hard',
    slot: 'adv-pattern',
    prompt: {
      pt: 'method_missing intercepta chamadas a métodos que não existem, abrindo espaço pra DSLs dinâmicas. Monte FlexObject: nomes que terminam em "=" salvam o valor em @data, os demais leem -- criando getters/setters sob demanda.',
      en: 'method_missing intercepts any call to an undefined method, enabling dynamic DSLs. Implement FlexObject: names ending in "=" store the value in @data, others retrieve it -- creating arbitrary getters/setters.',
    },
    code: `class FlexObject
  def initialize
    @data = {}
  end

  def method_missing(name, *args)
    key = name.to_s
    if key.end_with?("=")
      @data[key.chomp("=")] = args.first
    else
      @data[key]
    end
  end
end`,
  },
  // ── New snippets ──────────────────────────────────────────────────────────
  {
    id: 'ruby-011',
    concept: { pt: 'If Básico', en: 'Basic If' },
    difficulty: 'easy',
    slot: 'cond-basic-if',
    prompt: {
      pt: 'Ruby suporta if, unless e modificadores de linha. Use if pra verificar se um número é positivo e unless como forma invertida.',
      en: 'Ruby supports if, unless, and line modifiers. Use if to check if a number is positive and unless as an inverted form.',
    },
    code: `x = 10
puts "positive" if x > 0
unless x.zero?
  puts "not zero"
end`,
  },
  {
    id: 'ruby-012',
    concept: { pt: 'If e Else', en: 'If and Else' },
    difficulty: 'easy',
    slot: 'cond-if-else',
    prompt: {
      pt: 'if/elsif/else em Ruby encadeia condições sem parênteses. Classifique uma temperatura em "cold", "warm" ou "hot" com condicionais encadeadas.',
      en: 'if/elsif/else in Ruby chains conditions without parentheses. Classify a temperature as "cold", "warm", or "hot" with chained conditionals.',
    },
    code: `temp = 25
if temp < 10
  puts "cold"
elsif temp < 30
  puts "warm"
else
  puts "hot"
end`,
  },
  {
    id: 'ruby-013',
    concept: { pt: 'Operador Ternário', en: 'Ternary Operator' },
    difficulty: 'easy',
    slot: 'cond-ternary',
    prompt: {
      pt: 'Ruby tem operador ternário "condição ? verdadeiro : falso" pra expressões curtas. Use pra atribuir um status baseado em idade.',
      en: 'Ruby has a ternary operator "condition ? true : false" for short expressions. Use it to assign a status based on age.',
    },
    code: `age = 20
status = age >= 18 ? "adult" : "minor"
puts "Status: #{status}"`,
  },
  {
    id: 'ruby-014',
    concept: { pt: 'Estrutura Case', en: 'Case Statement' },
    difficulty: 'medium',
    slot: 'cond-switch',
    prompt: {
      pt: 'case/when em Ruby suporta ranges, classes e regex nos padrões. Use case pra classificar um valor com diferentes tipos de padrão.',
      en: 'case/when in Ruby supports ranges, classes, and regex in patterns. Use case to classify a value with different pattern types.',
    },
    code: `def classify(val)
  case val
  when 1..10   then "small"
  when Integer then "big number"
  when String  then "text"
  else "unknown"
  end
end`,
  },
  {
    id: 'ruby-015',
    concept: { pt: 'Guard Clause', en: 'Guard Clause' },
    difficulty: 'medium',
    slot: 'cond-guard',
    prompt: {
      pt: 'Guard clauses com return antecipado simplificam o fluxo. Use return no início do método pra tratar casos inválidos antes da lógica principal.',
      en: 'Guard clauses with early return simplify the flow. Use return at the start of the method to handle invalid cases before the main logic.',
    },
    code: `def process(data)
  return "no data" if data.nil?
  return "empty" if data.empty?
  data.upcase
end

puts process(nil)
puts process("hello")`,
  },
  {
    id: 'ruby-016',
    concept: { pt: 'Variáveis Locais', en: 'Local Variables' },
    difficulty: 'easy',
    slot: 'var-declare',
    prompt: {
      pt: 'Ruby usa tipagem dinâmica: variáveis são criadas na atribuição. Declare variáveis de tipos diferentes e mostre seus valores com puts.',
      en: 'Ruby uses dynamic typing: variables are created on assignment. Declare variables of different types and show their values with puts.',
    },
    code: `name = "Ruby"
version = 3.2
active = true
puts "#{name} #{version} active=#{active}"`,
  },
  {
    id: 'ruby-017',
    concept: { pt: 'Constantes', en: 'Constants' },
    difficulty: 'easy',
    slot: 'var-const',
    prompt: {
      pt: 'Constantes em Ruby começam com letra maiúscula. Defina constantes e use freeze pra impedir modificação do valor.',
      en: 'Ruby constants start with an uppercase letter. Define constants and use freeze to prevent value modification.',
    },
    code: `MAX_RETRIES = 3
API_URL = "https://api.example.com".freeze
PI = 3.14159
puts "#{API_URL} max=#{MAX_RETRIES}"`,
  },
  {
    id: 'ruby-018',
    concept: { pt: 'Tipos Dinâmicos', en: 'Dynamic Types' },
    difficulty: 'easy',
    slot: 'var-types',
    prompt: {
      pt: 'Ruby é dinamicamente tipada: a mesma variável pode mudar de tipo. Use .class pra inspecionar o tipo de cada valor.',
      en: 'Ruby is dynamically typed: the same variable can change type. Use .class to inspect the type of each value.',
    },
    code: `val = 42
puts "#{val} is #{val.class}"
val = "hello"
puts "#{val} is #{val.class}"
val = [1, 2, 3]
puts "#{val} is #{val.class}"`,
  },
  {
    id: 'ruby-019',
    concept: { pt: 'Array', en: 'Array' },
    difficulty: 'easy',
    slot: 'var-array',
    prompt: {
      pt: 'Arrays em Ruby são dinâmicos e aceitam tipos mistos. Crie um array, acesse por índice, adicione elementos e use métodos como .length.',
      en: 'Ruby arrays are dynamic and accept mixed types. Create an array, access by index, add elements and use methods like .length.',
    },
    code: `langs = ["Ruby", "Python", "Lua"]
puts langs[0]
langs << "Scala"
puts langs.length`,
  },
  {
    id: 'ruby-020',
    concept: { pt: 'Destructuring', en: 'Destructuring' },
    difficulty: 'medium',
    slot: 'var-destructure',
    prompt: {
      pt: 'Ruby permite atribuição múltipla e destructuring de arrays. Use atribuição paralela pra extrair valores de arrays e retornos de métodos.',
      en: 'Ruby allows multiple assignment and array destructuring. Use parallel assignment to extract values from arrays and method returns.',
    },
    code: `a, b, c = 1, 2, 3
first, *rest = [10, 20, 30, 40]
x, y = y, x rescue nil
puts "#{a} #{b} #{c}"
puts "first=#{first} rest=#{rest}"`,
  },
  {
    id: 'ruby-021',
    concept: { pt: 'Função Básica', en: 'Basic Function' },
    difficulty: 'easy',
    slot: 'fn-basic',
    prompt: {
      pt: 'Métodos simples em Ruby retornam a última expressão. Defina add com dois parâmetros e chame pra somar dois números.',
      en: 'Simple Ruby methods return the last expression. Define add with two parameters and call it to sum two numbers.',
    },
    code: `def add(a, b)
  a + b
end

result = add(3, 4)
puts "Sum: #{result}"`,
  },
  {
    id: 'ruby-022',
    concept: { pt: 'Lambda (Arrow)', en: 'Lambda (Arrow)' },
    difficulty: 'medium',
    slot: 'fn-arrow',
    prompt: {
      pt: 'Lambdas em Ruby usam a sintaxe "-> {}" e se comportam como funções anônimas. Crie lambdas e passe-as como argumentos.',
      en: 'Ruby lambdas use the "-> {}" syntax and behave as anonymous functions. Create lambdas and pass them as arguments.',
    },
    code: `double = ->(x) { x * 2 }
greet = ->(name) { "Hello, #{name}!" }

puts double.call(5)
puts greet.call("Ruby")`,
  },
  {
    id: 'ruby-023',
    concept: { pt: 'Laço For', en: 'For Loop' },
    difficulty: 'easy',
    slot: 'loop-for',
    prompt: {
      pt: 'Ruby tem for/in pra iterar sobre ranges e arrays. Use for com um range pra somar números de 1 a 10.',
      en: 'Ruby has for/in to iterate over ranges and arrays. Use for with a range to sum numbers from 1 to 10.',
    },
    code: `sum = 0
for i in 1..10
  sum += i
end
puts "Sum: #{sum}"`,
  },
  {
    id: 'ruby-024',
    concept: { pt: 'Laço While', en: 'While Loop' },
    difficulty: 'easy',
    slot: 'loop-while',
    prompt: {
      pt: 'while em Ruby repete enquanto a condição for verdadeira. Use while pra contar de 0 a 4, incrementando a cada iteração.',
      en: 'while in Ruby repeats as long as the condition is true. Use while to count from 0 to 4, incrementing each iteration.',
    },
    code: `count = 0
while count < 5
  puts "Count: #{count}"
  count += 1
end`,
  },
  {
    id: 'ruby-025',
    concept: { pt: 'Range e Each', en: 'Range and Each' },
    difficulty: 'easy',
    slot: 'loop-range',
    prompt: {
      pt: 'Ranges em Ruby usam ".." (inclusive) e "..." (exclusive). Combine com .each, .step e .to_a pra diferentes estilos de iteração.',
      en: 'Ruby ranges use ".." (inclusive) and "..." (exclusive). Combine with .each, .step and .to_a for different iteration styles.',
    },
    code: `(1..5).each { |i| print "#{i} " }
puts
(0...10).step(3).each { |i| print "#{i} " }`,
  },
  {
    id: 'ruby-026',
    concept: { pt: 'Métodos de Hash', en: 'Hash Methods' },
    difficulty: 'medium',
    slot: 'obj-methods',
    prompt: {
      pt: 'Hashes em Ruby têm métodos ricos pra transformar e acessar dados. Use .merge, .select e .transform_values pra manipular um hash.',
      en: 'Ruby hashes have rich methods to transform and access data. Use .merge, .select and .transform_values to manipulate a hash.',
    },
    code: `prices = { apple: 1.5, banana: 0.8, mango: 3.0 }
expensive = prices.select { |_, v| v > 1.0 }
doubled = prices.transform_values { |v| v * 2 }
puts expensive
puts doubled`,
  },
  {
    id: 'ruby-027',
    concept: { pt: 'Hash Aninhado', en: 'Nested Hash' },
    difficulty: 'medium',
    slot: 'obj-nested',
    prompt: {
      pt: 'Hashes podem ser aninhados pra representar dados complexos. Crie uma estrutura de empresa com endereço aninhado e acesse campos com dig.',
      en: 'Hashes can be nested to represent complex data. Create a company structure with nested address and access fields with dig.',
    },
    code: `company = {
  name: "Acme",
  address: { city: "SP", zip: "01000" }
}
puts company[:name]
puts company.dig(:address, :city)`,
  },
  {
    id: 'ruby-028',
    concept: { pt: 'Herança de Classe', en: 'Class Inheritance' },
    difficulty: 'medium',
    slot: 'class-inherit',
    prompt: {
      pt: 'Herança em Ruby usa "<" e super chama o método pai. Crie Animal como superclasse e Dog que sobrescreve speak chamando super.',
      en: 'Ruby inheritance uses "<" and super calls the parent method. Create Animal as superclass and Dog that overrides speak calling super.',
    },
    code: `class Animal
  def speak
    "..."
  end
end

class Dog < Animal
  def speak
    "Woof!"
  end
end

puts Dog.new.speak`,
  },
  {
    id: 'ruby-029',
    concept: { pt: 'Override de Método', en: 'Method Override' },
    difficulty: 'medium',
    slot: 'class-override',
    prompt: {
      pt: 'Ruby permite sobrescrever qualquer método, incluindo to_s. Sobrescreva to_s e um método herdado pra customizar o comportamento.',
      en: 'Ruby allows overriding any method, including to_s. Override to_s and an inherited method to customize behavior.',
    },
    code: `class Shape
  def area
    0
  end
end

class Circle < Shape
  def initialize(r)
    @r = r
  end
  def area
    Math::PI * @r ** 2
  end
  def to_s
    "Circle(r=#{@r})"
  end
end`,
  },
  {
    id: 'ruby-030',
    concept: { pt: 'Classe Abstrata', en: 'Abstract Class' },
    difficulty: 'hard',
    slot: 'class-abstract',
    prompt: {
      pt: 'Ruby simula classes abstratas levantando NotImplementedError nos métodos que subclasses devem implementar.',
      en: 'Ruby simulates abstract classes by raising NotImplementedError in methods that subclasses must implement.',
    },
    code: `class Formatter
  def format(data)
    raise NotImplementedError
  end
end

class JsonFormatter < Formatter
  def format(data)
    "{ data: \\"#{data}\\" }"
  end
end

puts JsonFormatter.new.format("hi")`,
  },
  {
    id: 'ruby-031',
    concept: { pt: 'Try/Catch (begin/rescue)', en: 'Try/Catch (begin/rescue)' },
    difficulty: 'medium',
    slot: 'err-try-catch',
    prompt: {
      pt: 'begin/rescue em Ruby captura exceções, equivalente a try/catch. Use rescue pra capturar um erro específico e tratar com uma mensagem.',
      en: 'begin/rescue in Ruby catches exceptions, equivalent to try/catch. Use rescue to catch a specific error and handle it with a message.',
    },
    code: `begin
  result = 10 / 0
rescue ZeroDivisionError => e
  puts "Error: #{e.message}"
end`,
  },
  {
    id: 'ruby-032',
    concept: { pt: 'Exceção Personalizada', en: 'Custom Exception' },
    difficulty: 'medium',
    slot: 'err-custom',
    prompt: {
      pt: 'Exceções customizadas herdam de StandardError. Crie ValidationError e lance-a com raise quando uma validação falhar.',
      en: 'Custom exceptions inherit from StandardError. Create ValidationError and raise it when a validation fails.',
    },
    code: `class ValidationError < StandardError; end

def validate_age(age)
  raise ValidationError, "negative age" if age < 0
  age
end

begin
  validate_age(-1)
rescue ValidationError => e
  puts e.message
end`,
  },
  {
    id: 'ruby-033',
    concept: { pt: 'Result Pattern', en: 'Result Pattern' },
    difficulty: 'hard',
    slot: 'err-result',
    prompt: {
      pt: 'Ruby pode simular o pattern Result com arrays [ok, valor]. Crie um método que retorna sucesso ou falha como tupla e desempacote o resultado.',
      en: 'Ruby can simulate the Result pattern with arrays [ok, value]. Create a method that returns success or failure as a tuple and unpack the result.',
    },
    code: `def parse_int(str)
  [:ok, Integer(str)]
rescue ArgumentError
  [:error, "invalid: #{str}"]
end

status, value = parse_int("42")
puts "#{status}: #{value}"`,
  },
  {
    id: 'ruby-034',
    concept: { pt: 'Ensure (Finally)', en: 'Ensure (Finally)' },
    difficulty: 'medium',
    slot: 'err-finally',
    prompt: {
      pt: 'ensure em Ruby garante execução do bloco independente de exceções, como finally em outras linguagens. Use pra limpar recursos.',
      en: 'ensure in Ruby guarantees block execution regardless of exceptions, like finally in other languages. Use it to clean up resources.',
    },
    code: `resource = "open"
begin
  raise "oops"
rescue => e
  puts "Caught: #{e.message}"
ensure
  resource = nil
  puts "Cleaned up"
end`,
  },
  {
    id: 'ruby-035',
    concept: { pt: 'Async com Thread', en: 'Async with Thread' },
    difficulty: 'hard',
    slot: 'adv-async',
    prompt: {
      pt: 'Threads em Ruby rodam código concorrente. Crie threads que executam tarefas em paralelo e aguarde todas com .join.',
      en: 'Ruby threads run concurrent code. Create threads that execute tasks in parallel and wait for all with .join.',
    },
    code: `threads = (1..3).map do |i|
  Thread.new { sleep(0.1); "Task #{i} done" }
end

results = threads.map(&:join).map(&:value)
puts results`,
  },
  {
    id: 'ruby-036',
    concept: { pt: 'Macro (define_method)', en: 'Macro (define_method)' },
    difficulty: 'hard',
    slot: 'adv-macro',
    prompt: {
      pt: 'define_method cria métodos dinamicamente em tempo de execução, funcionando como uma macro. Gere getters pra uma lista de atributos automaticamente.',
      en: 'define_method creates methods dynamically at runtime, acting like a macro. Generate getters for a list of attributes automatically.',
    },
    code: `class Config
  FIELDS = [:host, :port, :env]

  FIELDS.each do |f|
    define_method(f) { instance_variable_get("@#{f}") }
    define_method("#{f}=") { |v| instance_variable_set("@#{f}", v) }
  end
end`,
  },
  {
    id: 'ruby-037',
    concept: { pt: 'Concorrência com Queue', en: 'Concurrency with Queue' },
    difficulty: 'hard',
    slot: 'adv-concurrent',
    prompt: {
      pt: 'Queue do Ruby é thread-safe pra comunicação entre threads. Crie um produtor e consumidor que trocam dados via Queue.',
      en: 'Ruby Queue is thread-safe for inter-thread communication. Create a producer and consumer that exchange data via Queue.',
    },
    code: `q = Queue.new

producer = Thread.new do
  3.times { |i| q << "item-#{i}" }
  q << :done
end

consumer = Thread.new do
  loop { val = q.pop; break if val == :done; puts val }
end

[producer, consumer].each(&:join)`,
  },
  {
    id: 'ruby-038',
    concept: { pt: 'Genérico com Duck Typing', en: 'Generic with Duck Typing' },
    difficulty: 'medium',
    slot: 'type-generic',
    prompt: {
      pt: 'Ruby usa duck typing ao invés de generics formais: se o objeto responde ao método, funciona. Crie um método genérico que aceita qualquer coisa que responda a .to_s.',
      en: 'Ruby uses duck typing instead of formal generics: if the object responds to the method, it works. Create a generic method that accepts anything responding to .to_s.',
    },
    code: `def wrap(value)
  "[#{value.to_s}]"
end

puts wrap(42)
puts wrap("hello")
puts wrap([1, 2, 3])`,
  },
  {
    id: 'ruby-039',
    concept: { pt: 'Union com Validação', en: 'Union with Validation' },
    difficulty: 'medium',
    slot: 'type-union',
    prompt: {
      pt: 'Ruby simula tipos union com case/when e .is_a? pra verificar o tipo em runtime e tratar cada caso.',
      en: 'Ruby simulates union types with case/when and .is_a? to check the type at runtime and handle each case.',
    },
    code: `def stringify(val)
  case val
  when String  then val
  when Integer then val.to_s
  when Array   then val.join(", ")
  else raise TypeError
  end
end

puts stringify([1, 2, 3])`,
  },
  {
    id: 'ruby-040',
    concept: { pt: 'Constraint com respond_to?', en: 'Constraint with respond_to?' },
    difficulty: 'hard',
    slot: 'type-constraint',
    prompt: {
      pt: 'respond_to? verifica se um objeto suporta um método, funcionando como constraint de tipo. Use pra validar capacidades antes de operar.',
      en: 'respond_to? checks if an object supports a method, acting as a type constraint. Use it to validate capabilities before operating.',
    },
    code: `def serialize(obj)
  unless obj.respond_to?(:to_json) || obj.respond_to?(:to_s)
    raise ArgumentError, "not serializable"
  end
  obj.respond_to?(:to_json) ? obj.to_json : obj.to_s
end`,
  },
  {
    id: 'ruby-041',
    concept: { pt: 'Tipo Utilitário com Struct', en: 'Utility Type with Struct' },
    difficulty: 'medium',
    slot: 'type-utility',
    prompt: {
      pt: 'Struct cria classes leves com campos nomeados, como utility types. Use Struct pra definir tipos de dados simples de forma concisa.',
      en: 'Struct creates lightweight classes with named fields, like utility types. Use Struct to define simple data types concisely.',
    },
    code: `Point = Struct.new(:x, :y) do
  def distance_to(other)
    Math.sqrt((x - other.x)**2 + (y - other.y)**2)
  end
end

p1 = Point.new(0, 0)
p2 = Point.new(3, 4)
puts p1.distance_to(p2)`,
  },
  // ── Algoritmos & Estruturas de Dados ──────────────────────
  {
    id: 'ruby-042',
    concept: { pt: 'Notação Big O', en: 'Big O Notation' },
    difficulty: 'easy',
    prompt: { pt: 'Big O descreve a complexidade de tempo. Demonstre O(1), O(n) e O(n²) em Ruby.', en: 'Big O describes time complexity. Demonstrate O(1), O(n), and O(n²) in Ruby.' },
    code: `# O(1) -- acesso direto
first = arr[0]

# O(n) -- percorrer tudo
def contains?(arr, target)
  arr.any? { |x| x == target }
end

# O(n²) -- loop aninhado
def has_duplicate?(arr)
  (0...arr.length).each do |i|
    ((i + 1)...arr.length).each do |j|
      return true if arr[i] == arr[j]
    end
  end
  false
end`,
  },
  {
    id: 'ruby-043',
    concept: { pt: 'Busca Binária', en: 'Binary Search' },
    difficulty: 'medium',
    prompt: { pt: 'Busca binária divide o array ordenado ao meio -- O(log n). Implemente iterativamente.', en: 'Binary search halves a sorted array -- O(log n). Implement it iteratively.' },
    code: `def binary_search(arr, target)
  left, right = 0, arr.length - 1
  while left <= right
    mid = (left + right) / 2
    return mid if arr[mid] == target
    arr[mid] < target ? left = mid + 1 : right = mid - 1
  end
  -1
end`,
  },
  {
    id: 'ruby-044',
    concept: { pt: 'Bubble Sort', en: 'Bubble Sort' },
    difficulty: 'easy',
    prompt: { pt: 'Bubble Sort compara pares adjacentes e troca -- O(n²). Implemente com parada antecipada.', en: 'Bubble Sort compares adjacent pairs and swaps -- O(n²). Implement with early stop.' },
    code: `def bubble_sort(arr)
  a = arr.dup
  (a.length - 1).times do |i|
    swapped = false
    (a.length - 1 - i).times do |j|
      if a[j] > a[j + 1]
        a[j], a[j + 1] = a[j + 1], a[j]
        swapped = true
      end
    end
    break unless swapped
  end
  a
end`,
  },
  {
    id: 'ruby-045',
    concept: { pt: 'Merge Sort', en: 'Merge Sort' },
    difficulty: 'hard',
    prompt: { pt: 'Merge Sort divide recursivamente e intercala -- O(n log n).', en: 'Merge Sort recursively splits and merges -- O(n log n).' },
    code: `def merge_sort(arr)
  return arr if arr.length <= 1
  mid = arr.length / 2
  merge(merge_sort(arr[0...mid]), merge_sort(arr[mid..]))
end

def merge(a, b)
  result, i, j = [], 0, 0
  while i < a.length && j < b.length
    a[i] <= b[j] ? (result << a[i]; i += 1) : (result << b[j]; j += 1)
  end
  result + a[i..] + b[j..]
end`,
  },
  {
    id: 'ruby-046',
    concept: { pt: 'Quick Sort', en: 'Quick Sort' },
    difficulty: 'hard',
    prompt: { pt: 'Quick Sort particiona em torno de um pivô -- O(n log n) médio.', en: 'Quick Sort partitions around a pivot -- O(n log n) average.' },
    code: `def quick_sort(arr)
  return arr if arr.length <= 1
  pivot = arr.last
  rest = arr[0...-1]
  left = rest.select { |x| x < pivot }
  right = rest.select { |x| x >= pivot }
  quick_sort(left) + [pivot] + quick_sort(right)
end`,
  },
  {
    id: 'ruby-047',
    concept: { pt: 'Pilha (Stack)', en: 'Stack' },
    difficulty: 'easy',
    prompt: { pt: 'Em Ruby, Array funciona como pilha com push, pop e last.', en: 'In Ruby, Array works as a stack with push, pop, and last.' },
    code: `stack = []
stack.push(1)
stack.push(2)
stack.push(3)

top = stack.last     # 3
removed = stack.pop  # 3
empty = stack.empty?`,
  },
  {
    id: 'ruby-048',
    concept: { pt: 'Fila (Queue)', en: 'Queue' },
    difficulty: 'easy',
    prompt: { pt: 'Uma fila em Ruby usa Array com push e shift.', en: 'A queue in Ruby uses Array with push and shift.' },
    code: `queue = []
queue.push("A")
queue.push("B")
queue.push("C")

front = queue.first    # "A"
removed = queue.shift  # "A"
size = queue.length`,
  },
  {
    id: 'ruby-049',
    concept: { pt: 'Lista Ligada', en: 'Linked List' },
    difficulty: 'medium',
    prompt: { pt: 'Uma lista ligada usa Struct com referência ao próximo nó.', en: 'A linked list uses Struct with reference to the next node.' },
    code: `Node = Struct.new(:value, :next_node)

class LinkedList
  attr_accessor :head

  def prepend(value)
    @head = Node.new(value, @head)
  end

  def to_a
    result, curr = [], @head
    while curr
      result << curr.value
      curr = curr.next_node
    end
    result
  end
end`,
  },
  {
    id: 'ruby-050',
    concept: { pt: 'Árvore Binária de Busca', en: 'Binary Search Tree' },
    difficulty: 'medium',
    prompt: { pt: 'Uma BST mantém menores à esquerda e maiores à direita.', en: 'A BST keeps smaller left and larger right.' },
    code: `class TreeNode
  attr_accessor :val, :left, :right
  def initialize(val) = @val = val
end

def insert(node, val)
  return TreeNode.new(val) if node.nil?
  val < node.val ? node.left = insert(node.left, val) : node.right = insert(node.right, val)
  node
end

def search?(node, val)
  return false if node.nil?
  return true if val == node.val
  val < node.val ? search?(node.left, val) : search?(node.right, val)
end`,
  },
  {
    id: 'ruby-051',
    concept: { pt: 'BFS (Busca em Largura)', en: 'BFS (Breadth-First Search)' },
    difficulty: 'hard',
    prompt: { pt: 'BFS explora nível por nível com Array como fila e Set.', en: 'BFS explores level by level with Array as queue and Set.' },
    code: `require 'set'

def bfs(graph, start)
  visited = Set.new([start])
  queue, result = [start], []
  until queue.empty?
    node = queue.shift
    result << node
    (graph[node] || []).each do |nb|
      next if visited.include?(nb)
      visited.add(nb)
      queue << nb
    end
  end
  result
end`,
  },
  {
    id: 'ruby-052',
    concept: { pt: 'DFS (Busca em Profundidade)', en: 'DFS (Depth-First Search)' },
    difficulty: 'hard',
    prompt: { pt: 'DFS explora o mais fundo possível com Array como pilha.', en: 'DFS explores as deep as possible with Array as stack.' },
    code: `def dfs(graph, start)
  visited = Set.new
  stack, result = [start], []
  until stack.empty?
    node = stack.pop
    next if visited.include?(node)
    visited.add(node)
    result << node
    (graph[node] || []).reverse_each { |nb| stack << nb unless visited.include?(nb) }
  end
  result
end`,
  },
  {
    id: 'ruby-053',
    concept: { pt: 'Hash Map', en: 'Hash Map' },
    difficulty: 'medium',
    prompt: { pt: 'Hash é o hash map nativo do Ruby com acesso O(1) médio.', en: 'Hash is Ruby\'s native hash map with O(1) average access.' },
    code: `scores = { "Alice" => 95, "Bob" => 87, "Carol" => 92 }

alice = scores["Alice"]
has_bob = scores.key?("Bob")
dave = scores.fetch("Dave", 0)

scores.each { |name, score| puts "#{name}: #{score}" }`,
  },
]
