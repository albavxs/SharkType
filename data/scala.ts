import { Snippet } from '@/lib/types'

export const scalaSnippets: Snippet[] = [
  {
    id: 'scala-001',
    concept: 'Val e Var',
    difficulty: 'easy',
    prompt: 'Em Scala, val cria uma referencia imutavel (como final em Java) e var cria uma mutavel. Declare as tres variaveis demonstrando os dois modificadores, com tipo inferido em alguns casos e tipo explicito em outros.',
    code: `val name: String = "Scala"
var version = 3.3
val pi: Double = 3.14159`,
  },
  {
    id: 'scala-002',
    concept: 'Case Class',
    difficulty: 'easy',
    prompt: 'Case classes sao os POJOs do Scala: imutaveis e com equals, toString e copy gerados automaticamente. Defina Person com name e age, crie alice, depois use .copy para criar "older" com a mesma pessoa mas um ano mais velha.',
    code: `case class Person(name: String, age: Int)

val alice = Person("Alice", 30)
val older = alice.copy(age = 31)`,
  },
  {
    id: 'scala-003',
    concept: 'String Interpolation',
    difficulty: 'easy',
    prompt: 'Scala oferece varios prefixos de interpolacao. Use s"" para inserir variaveis e expressoes com $nome e ${expressao}, e f"" para formatar numeros de ponto flutuante com especificadores como %.4f.',
    code: `val name = "World"
val greeting = s"Hello, $name!"
val msg = f"Pi is approximately \${math.Pi}%.4f"`,
  },
  {
    id: 'scala-004',
    concept: 'List Operations',
    difficulty: 'easy',
    prompt: 'Listas em Scala sao imutaveis e suportam operacoes funcionais encadeadas. Aplique .map (dobrar cada valor), .filter (manter apenas pares) e .reduce (somar tudo) sobre List(1,2,3,4,5).',
    code: `val nums = List(1, 2, 3, 4, 5)
val doubled = nums.map(_ * 2)
val evens = nums.filter(_ % 2 == 0)
val sum = nums.reduce(_ + _)`,
  },
  {
    id: 'scala-005',
    concept: 'Pattern Matching',
    difficulty: 'medium',
    prompt: 'Pattern matching em Scala e mais rico que switch: pode verificar tipos, valores e estruturas. Implemente describe com casos para o literal 0, um Int qualquer (com binding em n), uma String (com binding em s) e wildcard.',
    code: `def describe(x: Any): String = x match {
  case 0          => "zero"
  case n: Int     => s"integer: $n"
  case s: String  => s"string: $s"
  case _          => "something else"
}`,
  },
  {
    id: 'scala-006',
    concept: 'For Comprehension',
    difficulty: 'medium',
    prompt: 'For comprehensions sao acucar sintatico sobre map/flatMap/withFilter em Scala. Combine duas listas (x e y) com um guard "if x + y > 12" para gerar apenas os produtos dos pares cuja soma ultrapasse 12.',
    code: `val result = for {
  x <- List(1, 2, 3)
  y <- List(10, 20)
  if x + y > 12
} yield x * y`,
  },
  {
    id: 'scala-007',
    concept: 'Option Monad',
    difficulty: 'medium',
    prompt: 'Option[A] e um tipo funcional para valores que podem nao existir (Some ou None). Busque um usuario em um Map, transforme o resultado com .map(_.toUpperCase) e retorne "Not found" com .getOrElse se a chave nao existir.',
    code: `def findUser(id: Int): Option[String] =
  Map(1 -> "Alice", 2 -> "Bob").get(id)

val result = findUser(1)
  .map(_.toUpperCase)
  .getOrElse("Not found")`,
  },
  {
    id: 'scala-008',
    concept: 'Trait',
    difficulty: 'medium',
    prompt: 'Traits sao como interfaces com implementacao parcial — podem ter metodos abstratos e concretos. Declare Greeter com o metodo abstrato greet(name: String): String e implemente FormalGreeter estendendo o trait.',
    code: `trait Greeter {
  def greet(name: String): String
}

class FormalGreeter extends Greeter {
  def greet(name: String) = s"Good day, $name."
}`,
  },
  {
    id: 'scala-009',
    concept: 'Type Class (Given)',
    difficulty: 'hard',
    prompt: 'Type classes em Scala 3 usam "given" para fornecer instancias implicitas e "using" para recebe-las. Defina Show[A] com o metodo show, forneca uma instancia given para Int e implemente print usando "using s: Show[A]".',
    code: `trait Show[A]:
  def show(a: A): String

given Show[Int]:
  def show(n: Int) = s"Int($n)"

def print[A](a: A)(using s: Show[A]): Unit =
  println(s.show(a))`,
  },
  {
    id: 'scala-010',
    concept: 'Future',
    difficulty: 'hard',
    prompt: 'Futures representam computacoes assincronas que podem falhar. Encadeie duas Futures com for comprehension: primeiro fetchData, depois Future(data.trim) — o resultado e combinado com yield de forma declarativa.',
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
