import { Snippet } from '@/lib/types'

export const scalaSnippets: Snippet[] = [
  {
    id: 'scala-001',
    concept: 'Val e Var',
    difficulty: 'easy',
    prompt: 'Declare valores imutaveis com val e mutaveis com var em Scala, com tipos inferidos e explicitos.',
    code: `val name: String = "Scala"
var version = 3.3
val pi: Double = 3.14159`,
  },
  {
    id: 'scala-002',
    concept: 'Case Class',
    difficulty: 'easy',
    prompt: 'Defina uma case class Person e use o metodo copy para criar uma variacao imutavel.',
    code: `case class Person(name: String, age: Int)

val alice = Person("Alice", 30)
val older = alice.copy(age = 31)`,
  },
  {
    id: 'scala-003',
    concept: 'String Interpolation',
    difficulty: 'easy',
    prompt: 'Use interpolacao s"" para insercao simples e f"" para formatacao numerica em Scala.',
    code: `val name = "World"
val greeting = s"Hello, $name!"
val msg = f"Pi is approximately \${math.Pi}%.4f"`,
  },
  {
    id: 'scala-004',
    concept: 'List Operations',
    difficulty: 'easy',
    prompt: 'Aplique map, filter e reduce em uma lista de inteiros para dobrar, filtrar pares e somar.',
    code: `val nums = List(1, 2, 3, 4, 5)
val doubled = nums.map(_ * 2)
val evens = nums.filter(_ % 2 == 0)
val sum = nums.reduce(_ + _)`,
  },
  {
    id: 'scala-005',
    concept: 'Pattern Matching',
    difficulty: 'medium',
    prompt: 'Use pattern matching com type patterns para descrever valores zero, Int, String ou outros.',
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
    prompt: 'Use for comprehension para combinar duas listas com um filtro e gerar o produto dos pares.',
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
    prompt: 'Use Option com map e getOrElse para tratar resultados que podem nao existir em um Map.',
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
    prompt: 'Defina um trait Greeter com metodo abstrato e implemente-o em uma classe concreta.',
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
    prompt: 'Implemente uma type class Show usando given/using do Scala 3 para derivar representacao textual.',
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
    prompt: 'Use Future com for comprehension para compor operacoes assincronas de forma declarativa.',
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
