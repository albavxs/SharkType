import { Snippet } from '@/lib/types'

export const rubySnippets: Snippet[] = [
  {
    id: 'ruby-001',
    concept: 'Metodo',
    difficulty: 'easy',
    prompt: 'Defina um metodo Ruby com argumento padrao e use puts para exibir o resultado.',
    code: `def greet(name = "World")
  "Hello, #{name}!"
end

puts greet("Ruby")`,
  },
  {
    id: 'ruby-002',
    concept: 'String Interpolation',
    difficulty: 'easy',
    prompt: 'Use interpolacao #{} para construir uma mensagem com variavel de texto e numero.',
    code: `language = "Ruby"
version = 3.2
puts "#{language} #{version} is awesome!"`,
  },
  {
    id: 'ruby-003',
    concept: 'Array Methods',
    difficulty: 'easy',
    prompt: 'Use map, select e sum para dobrar os valores, filtrar os pares e somar um array de numeros.',
    code: `nums = [3, 1, 4, 1, 5, 9, 2, 6]
doubled = nums.map { |n| n * 2 }
evens = nums.select(&:even?)
total = nums.sum`,
  },
  {
    id: 'ruby-004',
    concept: 'Hash',
    difficulty: 'easy',
    prompt: 'Crie um hash com atributos de pessoa, acesse um campo e itere exibindo todas as chaves e valores.',
    code: `person = { name: "Alice", age: 30, city: "SP" }
puts person[:name]
person.each { |k, v| puts "#{k}: #{v}" }`,
  },
  {
    id: 'ruby-005',
    concept: 'Classe',
    difficulty: 'medium',
    prompt: 'Defina uma classe Animal com attr_accessor, construtor initialize e metodo speak.',
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
    prompt: 'Implemente um metodo que aceita bloco e usa yield para chamar o bloco N vezes.',
    code: `def repeat(n)
  n.times { yield }
end

repeat(3) { puts "Hello!" }`,
  },
  {
    id: 'ruby-007',
    concept: 'Module e Mixin',
    difficulty: 'medium',
    prompt: 'Crie um module Serializable com to_json e inclua-o em uma classe via include.',
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
    prompt: 'Encadeie select, map, sort e join para filtrar palavras longas e formata-las em uma string.',
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
    prompt: 'Defina um lambda e um proc para transformar arrays, passando-os como funcoes de ordem superior.',
    code: `square = ->(x) { x ** 2 }
cube   = proc { |x| x ** 3 }

transform = ->(arr, fn) { arr.map(&fn) }
puts transform.call([1, 2, 3, 4], square)`,
  },
  {
    id: 'ruby-010',
    concept: 'Method Missing',
    difficulty: 'hard',
    prompt: 'Use method_missing para criar um objeto dinamico que aceita getters e setters com nomes arbitrarios.',
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
