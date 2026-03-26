import { Snippet } from '@/lib/types'

export const rubySnippets: Snippet[] = [
  {
    id: 'ruby-001',
    concept: 'Metodo',
    difficulty: 'easy',
    prompt: 'Metodos Ruby sao definidos com "def" e retornam o valor da ultima expressao implicitamente. Defina greet com um argumento "name" que usa "World" como valor padrao — sem precisar de return explicito.',
    code: `def greet(name = "World")
  "Hello, #{name}!"
end

puts greet("Ruby")`,
  },
  {
    id: 'ruby-002',
    concept: 'String Interpolation',
    difficulty: 'easy',
    prompt: 'Interpolacao de strings em Ruby usa #{expressao} dentro de aspas duplas. Combine a variavel "language" e o numero "version" em uma mensagem — qualquer expressao Ruby pode ser avaliada dentro de #{}.',
    code: `language = "Ruby"
version = 3.2
puts "#{language} #{version} is awesome!"`,
  },
  {
    id: 'ruby-003',
    concept: 'Array Methods',
    difficulty: 'easy',
    prompt: 'Ruby tem metodos funcionais ricos em Array. Use .map com bloco para dobrar cada numero, .select com Symbol#to_proc (&:even?) para filtrar apenas os pares e .sum para calcular o total — cada um em uma linha.',
    code: `nums = [3, 1, 4, 1, 5, 9, 2, 6]
doubled = nums.map { |n| n * 2 }
evens = nums.select(&:even?)
total = nums.sum`,
  },
  {
    id: 'ruby-004',
    concept: 'Hash',
    difficulty: 'easy',
    prompt: 'Hashes em Ruby sao dicionarios criados com a sintaxe {chave: valor}. Declare um hash de pessoa com simbolos, acesse um campo especifico pela chave e use .each com bloco de dois parametros para iterar todos os pares.',
    code: `person = { name: "Alice", age: 30, city: "SP" }
puts person[:name]
person.each { |k, v| puts "#{k}: #{v}" }`,
  },
  {
    id: 'ruby-005',
    concept: 'Classe',
    difficulty: 'medium',
    prompt: 'attr_accessor gera getters e setters automaticamente para variaveis de instancia. Defina Animal com @name e @sound inicializados pelo constructor, e o metodo speak que combina os dois com interpolacao de string.',
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
    concept: 'Block e Yield',
    difficulty: 'medium',
    prompt: 'Blocks sao o mecanismo de customizacao mais fundamental do Ruby — qualquer metodo pode aceitar um bloco com yield. Implemente "repeat" que usa n.times e chama yield em cada iteracao para executar o bloco fornecido.',
    code: `def repeat(n)
  n.times { yield }
end

repeat(3) { puts "Hello!" }`,
  },
  {
    id: 'ruby-007',
    concept: 'Module e Mixin',
    difficulty: 'medium',
    prompt: 'Modules fornecem namespacing e reutilizacao de codigo via include (mixin). Crie Serializable com o metodo to_json que usa instance_variables e inclua-o em User — instancias de User ganham to_json sem heranca.',
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
    concept: 'Enumerable',
    difficulty: 'medium',
    prompt: 'Ruby encoraja o encadeamento fluente de metodos Enumerable. Em uma unica expressao, filtre palavras com mais de 4 letras, transforme para capitalize, ordene alfabeticamente e una em uma string com ", " entre elas.',
    code: `words = %w[hello world ruby programming]
result = words
  .select { |w| w.length > 4 }
  .map(&:capitalize)
  .sort
  .join(", ")`,
  },
  {
    id: 'ruby-009',
    concept: 'Proc e Lambda',
    difficulty: 'hard',
    prompt: 'Lambdas (-> {}) e Procs diferem no comportamento com return e aridade. Defina square como lambda e cube como proc, depois implemente transform como uma lambda que recebe um array e uma funcao, chamando .map(&fn) para aplicar.',
    code: `square = ->(x) { x ** 2 }
cube   = proc { |x| x ** 3 }

transform = ->(arr, fn) { arr.map(&fn) }
puts transform.call([1, 2, 3, 4], square)`,
  },
  {
    id: 'ruby-010',
    concept: 'Method Missing',
    difficulty: 'hard',
    prompt: 'method_missing intercepta qualquer chamada a metodo nao definido, permitindo DSLs dinamicas. Implemente FlexObject: nomes terminando em "=" armazenam o valor em @data, os demais o recuperam — criando getters/setters arbitrarios.',
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
