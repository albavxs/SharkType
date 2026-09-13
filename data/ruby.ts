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
]
