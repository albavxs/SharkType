import { Snippet } from '@/lib/types'

export const rubySnippets: Snippet[] = [
  {
    id: 'ruby-001',
    concept: { pt: 'Método', en: 'Method' },
    difficulty: 'easy',
    prompt: {
      pt: 'Métodos Ruby são definidos com "def" e retornam o valor da última expressão implicitamente. Defina greet com um argumento "name" que usa "World" como valor padrão — sem precisar de return explícito.',
      en: 'Ruby methods are defined with "def" and implicitly return the last expression\'s value. Define greet with a "name" argument that defaults to "World" — no explicit return needed.',
    },
    code: `def greet(name = "World")
  "Hello, #{name}!"
end

puts greet("Ruby")`,
  },
  {
    id: 'ruby-002',
    concept: { pt: 'String Interpolation', en: 'String Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interpolação de strings em Ruby usa #{expressão} dentro de aspas duplas. Combine a variável "language" e o número "version" em uma mensagem — qualquer expressão Ruby pode ser avaliada dentro de #{}.',
      en: 'Ruby string interpolation uses #{expression} inside double quotes. Combine the "language" variable and the "version" number in a message — any Ruby expression can be evaluated inside #{}.',
    },
    code: `language = "Ruby"
version = 3.2
puts "#{language} #{version} is awesome!"`,
  },
  {
    id: 'ruby-003',
    concept: { pt: 'Métodos de Array', en: 'Array Methods' },
    difficulty: 'easy',
    prompt: {
      pt: 'Ruby tem métodos funcionais ricos em Array. Use .map com bloco para dobrar cada número, .select com Symbol#to_proc (&:even?) para filtrar apenas os pares e .sum para calcular o total — cada um em uma linha.',
      en: 'Ruby has rich functional Array methods. Use .map with a block to double each number, .select with Symbol#to_proc (&:even?) to filter only evens and .sum to calculate the total — one per line.',
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
    prompt: {
      pt: 'Hashes em Ruby são dicionários criados com a sintaxe {chave: valor}. Declare um hash de pessoa com símbolos, acesse um campo específico pela chave e use .each com bloco de dois parâmetros para iterar todos os pares.',
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
    prompt: {
      pt: 'attr_accessor gera getters e setters automaticamente para variáveis de instância. Defina Animal com @name e @sound inicializados pelo constructor, e o método speak que combina os dois com interpolação de string.',
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
    concept: { pt: 'Block e Yield', en: 'Block and Yield' },
    difficulty: 'medium',
    prompt: {
      pt: 'Blocks são o mecanismo de customização mais fundamental do Ruby — qualquer método pode aceitar um bloco com yield. Implemente "repeat" que usa n.times e chama yield em cada iteração para executar o bloco fornecido.',
      en: 'Blocks are Ruby\'s most fundamental customization mechanism — any method can accept a block with yield. Implement "repeat" using n.times and calling yield on each iteration to execute the provided block.',
    },
    code: `def repeat(n)
  n.times { yield }
end

repeat(3) { puts "Hello!" }`,
  },
  {
    id: 'ruby-007',
    concept: { pt: 'Module e Mixin', en: 'Module and Mixin' },
    difficulty: 'medium',
    prompt: {
      pt: 'Modules fornecem namespacing e reutilização de código via include (mixin). Crie Serializable com o método to_json que usa instance_variables e inclua-o em User — instâncias de User ganham to_json sem herança.',
      en: 'Modules provide namespacing and code reuse via include (mixin). Create Serializable with a to_json method that uses instance_variables and include it in User — User instances gain to_json without inheritance.',
    },
    code: `module Serializable
  def to_json
    instance_variables.map { |v|
      "\"#{v.to_s.delete('@')}\": \"#{instance_variable_get(v)}\""
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
    concept: { pt: 'Enumerable', en: 'Enumerable' },
    difficulty: 'medium',
    prompt: {
      pt: 'Ruby encoraja o encadeamento fluente de métodos Enumerable. Em uma única expressão, filtre palavras com mais de 4 letras, transforme para capitalize, ordene alfabeticamente e una em uma string com ", " entre elas.',
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
    prompt: {
      pt: 'Lambdas (-> {}) e Procs diferem no comportamento com return e aridade. Defina square como lambda e cube como proc, depois implemente transform como uma lambda que recebe um array e uma função, chamando .map(&fn) para aplicar.',
      en: 'Lambdas (-> {}) and Procs differ in return behavior and arity. Define square as a lambda and cube as a proc, then implement transform as a lambda that takes an array and a function, calling .map(&fn) to apply it.',
    },
    code: `square = ->(x) { x ** 2 }
cube   = proc { |x| x ** 3 }

transform = ->(arr, fn) { arr.map(&fn) }
puts transform.call([1, 2, 3, 4], square)`,
  },
  {
    id: 'ruby-010',
    concept: { pt: 'Method Missing', en: 'Method Missing' },
    difficulty: 'hard',
    prompt: {
      pt: 'method_missing intercepta qualquer chamada a método não definido, permitindo DSLs dinâmicas. Implemente FlexObject: nomes terminando em "=" armazenam o valor em @data, os demais o recuperam — criando getters/setters arbitrários.',
      en: 'method_missing intercepts any call to an undefined method, enabling dynamic DSLs. Implement FlexObject: names ending in "=" store the value in @data, others retrieve it — creating arbitrary getters/setters.',
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
]
