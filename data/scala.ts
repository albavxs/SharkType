import { Snippet } from '@/lib/types'

export const scalaSnippets: Snippet[] = [
  {
    id: 'scala-001',
    concept: { pt: 'Val e Var', en: 'Val and Var' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Scala, val cria uma referência imutável (como final em Java) e var cria uma mutável. Declare as três variáveis demonstrando os dois modificadores, com tipo inferido em alguns casos e tipo explícito em outros.',
      en: 'In Scala, val creates an immutable reference (like final in Java) and var creates a mutable one. Declare three variables demonstrating both modifiers, with inferred type in some cases and explicit type in others.',
    },
    code: `val name: String = "Scala"
var version = 3.3
val pi: Double = 3.14159`,
  },
  {
    id: 'scala-002',
    concept: { pt: 'Case Class', en: 'Case Class' },
    difficulty: 'easy',
    prompt: {
      pt: 'Case classes são os POJOs do Scala: imutáveis e com equals, toString e copy gerados automaticamente. Defina Person com name e age, crie alice, depois use .copy para criar "older" com a mesma pessoa mas um ano mais velha.',
      en: 'Case classes are Scala\'s POJOs: immutable with auto-generated equals, toString and copy. Define Person with name and age, create alice, then use .copy to create "older" with the same person but one year older.',
    },
    code: `case class Person(name: String, age: Int)

val alice = Person("Alice", 30)
val older = alice.copy(age = 31)`,
  },
  {
    id: 'scala-003',
    concept: { pt: 'String Interpolation', en: 'String Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Scala oferece vários prefixos de interpolação. Use s"" para inserir variáveis e expressões com $nome e ${expressão}, e f"" para formatar números de ponto flutuante com especificadores como %.4f.',
      en: 'Scala offers several interpolation prefixes. Use s"" to insert variables and expressions with $name and ${expression}, and f"" to format floating-point numbers with specifiers like %.4f.',
    },
    code: `val name = "World"
val greeting = s"Hello, $name!"
val msg = f"Pi is approximately \${math.Pi}%.4f"`,
  },
  {
    id: 'scala-004',
    concept: { pt: 'Operações com List', en: 'List Operations' },
    difficulty: 'easy',
    prompt: {
      pt: 'Listas em Scala são imutáveis e suportam operações funcionais encadeadas. Aplique .map (dobrar cada valor), .filter (manter apenas pares) e .reduce (somar tudo) sobre List(1,2,3,4,5).',
      en: 'Scala lists are immutable and support chained functional operations. Apply .map (double each value), .filter (keep only evens) and .reduce (sum everything) on List(1,2,3,4,5).',
    },
    code: `val nums = List(1, 2, 3, 4, 5)
val doubled = nums.map(_ * 2)
val evens = nums.filter(_ % 2 == 0)
val sum = nums.reduce(_ + _)`,
  },
  {
    id: 'scala-005',
    concept: { pt: 'Pattern Matching', en: 'Pattern Matching' },
    difficulty: 'medium',
    prompt: {
      pt: 'Pattern matching em Scala é mais rico que switch: pode verificar tipos, valores e estruturas. Implemente describe com casos para o literal 0, um Int qualquer (com binding em n), uma String (com binding em s) e wildcard.',
      en: 'Scala pattern matching is richer than switch: it can check types, values and structures. Implement describe with cases for the literal 0, any Int (binding to n), a String (binding to s) and a wildcard.',
    },
    code: `def describe(x: Any): String = x match {
  case 0          => "zero"
  case n: Int     => s"integer: $n"
  case s: String  => s"string: $s"
  case _          => "something else"
}`,
  },
  {
    id: 'scala-006',
    concept: { pt: 'For Comprehension', en: 'For Comprehension' },
    difficulty: 'medium',
    prompt: {
      pt: 'For comprehensions são açúcar sintático sobre map/flatMap/withFilter em Scala. Combine duas listas (x e y) com um guard "if x + y > 12" para gerar apenas os produtos dos pares cuja soma ultrapasse 12.',
      en: 'For comprehensions are syntactic sugar over map/flatMap/withFilter in Scala. Combine two lists (x and y) with a guard "if x + y > 12" to yield only the products of pairs whose sum exceeds 12.',
    },
    code: `val result = for {
  x <- List(1, 2, 3)
  y <- List(10, 20)
  if x + y > 12
} yield x * y`,
  },
  {
    id: 'scala-007',
    concept: { pt: 'Option Monad', en: 'Option Monad' },
    difficulty: 'medium',
    prompt: {
      pt: 'Option[A] é um tipo funcional para valores que podem não existir (Some ou None). Busque um usuário em um Map, transforme o resultado com .map(_.toUpperCase) e retorne "Not found" com .getOrElse se a chave não existir.',
      en: 'Option[A] is a functional type for values that may not exist (Some or None). Look up a user in a Map, transform the result with .map(_.toUpperCase) and return "Not found" with .getOrElse if the key doesn\'t exist.',
    },
    code: `def findUser(id: Int): Option[String] =
  Map(1 -> "Alice", 2 -> "Bob").get(id)

val result = findUser(1)
  .map(_.toUpperCase)
  .getOrElse("Not found")`,
  },
  {
    id: 'scala-008',
    concept: { pt: 'Trait', en: 'Trait' },
    difficulty: 'medium',
    prompt: {
      pt: 'Traits são como interfaces com implementação parcial — podem ter métodos abstratos e concretos. Declare Greeter com o método abstrato greet(name: String): String e implemente FormalGreeter estendendo o trait.',
      en: 'Traits are like interfaces with partial implementation — they can have both abstract and concrete methods. Declare Greeter with the abstract method greet(name: String): String and implement FormalGreeter extending the trait.',
    },
    code: `trait Greeter {
  def greet(name: String): String
}

class FormalGreeter extends Greeter {
  def greet(name: String) = s"Good day, $name."
}`,
  },
  {
    id: 'scala-009',
    concept: { pt: 'Type Class (Given)', en: 'Type Class (Given)' },
    difficulty: 'hard',
    prompt: {
      pt: 'Type classes em Scala 3 usam "given" para fornecer instâncias implícitas e "using" para recebê-las. Defina Show[A] com o método show, forneça uma instância given para Int e implemente print usando "using s: Show[A]".',
      en: 'Scala 3 type classes use "given" to provide implicit instances and "using" to receive them. Define Show[A] with the show method, provide a given instance for Int and implement print using "using s: Show[A]".',
    },
    code: `trait Show[A]:
  def show(a: A): String

given Show[Int]:
  def show(n: Int) = s"Int($n)"

def print[A](a: A)(using s: Show[A]): Unit =
  println(s.show(a))`,
  },
  {
    id: 'scala-010',
    concept: { pt: 'Future', en: 'Future' },
    difficulty: 'hard',
    prompt: {
      pt: 'Futures representam computações assíncronas que podem falhar. Encadeie duas Futures com for comprehension: primeiro fetchData, depois Future(data.trim) — o resultado é combinado com yield de forma declarativa.',
      en: 'Futures represent async computations that can fail. Chain two Futures with a for comprehension: first fetchData, then Future(data.trim) — the result is combined with yield in a declarative way.',
    },
    code: `import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

def fetchData(url: String): Future[String] =
  Future { /* HTTP call */ url }

val result = for {
  data <- fetchData("https://api.example.com")
  parsed <- Future(data.trim)
} yield parsed`,
  },
]
