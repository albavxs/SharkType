import { Snippet } from '@/lib/types'

export const scalaSnippets: Snippet[] = [
  {
    id: 'scala-001',
    concept: { pt: 'Val e Var', en: 'Val and Var' },
    difficulty: 'easy',
    slot: 'var-declare',
    prompt: {
      pt: 'Em Scala, val cria referência imutável (tipo final em Java) e var cria mutável. Declare três variáveis usando os dois modificadores, com tipo inferido em alguns casos e tipo explícito em outros.',
      en: 'In Scala, val creates an immutable reference (like final in Java) and var creates a mutable one. Declare three variables demonstrating both modifiers, with inferred type in some cases and explicit type in others.',
    },
    code: `val name: String = "Scala"
var version = 3.3
val pi: Double = 3.14159`,
  },
  {
    id: 'scala-002',
    concept: { pt: 'Classe Caso', en: 'Case Class' },
    difficulty: 'easy',
    slot: 'class-basic',
    prompt: {
      pt: 'Case classes são os POJOs do Scala: imutáveis, já vêm com equals, toString e copy de graça. Defina Person com name e age, crie alice e use .copy pra gerar "older" com a mesma pessoa mas um ano a mais.',
      en: 'Case classes are Scala\'s POJOs: immutable with auto-generated equals, toString and copy. Define Person with name and age, create alice, then use .copy to create "older" with the same person but one year older.',
    },
    code: `case class Person(name: String, age: Int)

val alice = Person("Alice", 30)
val older = alice.copy(age = 31)`,
  },
  {
    id: 'scala-003',
    concept: { pt: 'Interpolação de String', en: 'String Interpolation' },
    difficulty: 'easy',
    slot: 'var-interpolation',
    prompt: {
      pt: 'Scala tem vários prefixos de interpolação. Use s"" pra inserir variáveis e expressões com $nome e ${expressão}, e f"" pra formatar números de ponto flutuante com especificadores tipo %.4f.',
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
    slot: 'loop-filter',
    prompt: {
      pt: 'Listas em Scala são imutáveis e dá pra encadear operações funcionais nelas. Aplique .map (dobrar cada valor), .filter (só pares) e .reduce (somar tudo) sobre List(1,2,3,4,5).',
      en: 'Scala lists are immutable and support chained functional operations. Apply .map (double each value), .filter (keep only evens) and .reduce (sum everything) on List(1,2,3,4,5).',
    },
    code: `val nums = List(1, 2, 3, 4, 5)
val doubled = nums.map(_ * 2)
val evens = nums.filter(_ % 2 == 0)
val sum = nums.reduce(_ + _)`,
  },
  {
    id: 'scala-005',
    concept: { pt: 'Casamento de Padrões', en: 'Pattern Matching' },
    difficulty: 'medium',
    slot: 'cond-switch',
    prompt: {
      pt: 'Pattern matching em Scala vai muito além de um switch: dá pra checar tipos, valores e estruturas. Monte describe com casos pro literal 0, um Int qualquer (com binding em n), uma String (com binding em s) e wildcard.',
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
    concept: { pt: 'Compreensão For', en: 'For Comprehension' },
    difficulty: 'medium',
    slot: 'loop-foreach',
    prompt: {
      pt: 'For comprehensions são açúcar sintático pra map/flatMap/withFilter em Scala. Combine duas listas (x e y) com um guard "if x + y > 12" pra gerar só os produtos dos pares cuja soma passe de 12.',
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
    concept: { pt: 'Mônada Option', en: 'Option Monad' },
    difficulty: 'medium',
    slot: 'err-result',
    prompt: {
      pt: 'Option[A] é o jeito funcional de lidar com valores que podem não existir (Some ou None). Busque um usuário num Map, transforme com .map(_.toUpperCase) e devolva "Not found" via .getOrElse se a chave não existir.',
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
    slot: 'class-abstract',
    prompt: {
      pt: 'Traits funcionam como interfaces com implementação parcial -- podem ter métodos abstratos e concretos. Declare Greeter com o método abstrato greet(name: String): String e crie FormalGreeter estendendo esse trait.',
      en: 'Traits are like interfaces with partial implementation -- they can have both abstract and concrete methods. Declare Greeter with the abstract method greet(name: String): String and implement FormalGreeter extending the trait.',
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
    concept: { pt: 'Classe de Tipo (Given)', en: 'Type Class (Given)' },
    difficulty: 'hard',
    slot: 'type-generic',
    prompt: {
      pt: 'Type classes em Scala 3 usam "given" pra fornecer instâncias implícitas e "using" pra recebê-las. Defina Show[A] com o método show, crie uma instância given pra Int e monte print usando "using s: Show[A]".',
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
    concept: { pt: 'Futuro', en: 'Future' },
    difficulty: 'hard',
    slot: 'adv-async',
    prompt: {
      pt: 'Futures representam computações assíncronas que podem falhar. Encadeie duas Futures com for comprehension: primeiro fetchData, depois Future(data.trim) -- o resultado vem junto no yield de forma declarativa.',
      en: 'Futures represent async computations that can fail. Chain two Futures with a for comprehension: first fetchData, then Future(data.trim) -- the result is combined with yield in a declarative way.',
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
  // ── New snippets ──────────────────────────────────────────────────────────
  {
    id: 'scala-011',
    concept: { pt: 'If Básico', en: 'Basic If' },
    difficulty: 'easy',
    slot: 'cond-basic-if',
    prompt: {
      pt: 'Em Scala, if é uma expressão que retorna valor. Use if pra checar se um número é positivo e atribua a mensagem resultante a uma val.',
      en: 'In Scala, if is an expression that returns a value. Use if to check whether a number is positive and assign the resulting message to a val.',
    },
    code: `val x = 42
val msg = if (x > 0) "positive" else "non-positive"
println(msg)`,
  },
  {
    id: 'scala-012',
    concept: { pt: 'If e Else', en: 'If and Else' },
    difficulty: 'easy',
    slot: 'cond-if-else',
    prompt: {
      pt: 'if/else if/else em Scala encadeia condições e retorna um valor. Classifique uma nota numérica em "A", "B" ou "C" com if encadeado.',
      en: 'if/else if/else in Scala chains conditions and returns a value. Classify a numeric grade into "A", "B", or "C" with chained if.',
    },
    code: `val score = 85
val grade = if (score >= 90) "A"
  else if (score >= 80) "B"
  else "C"`,
  },
  {
    id: 'scala-013',
    concept: { pt: 'Operador Ternário', en: 'Ternary Operator' },
    difficulty: 'easy',
    slot: 'cond-ternary',
    prompt: {
      pt: 'Scala não tem operador ternário dedicado porque if/else já é expressão. Use um if inline pra escolher entre "even" e "odd" e atribua a uma val.',
      en: 'Scala has no dedicated ternary operator because if/else is already an expression. Use an inline if to choose between "even" and "odd" and assign it to a val.',
    },
    code: `val n = 7
val parity = if (n % 2 == 0) "even" else "odd"
println(s"$n is $parity")`,
  },
  {
    id: 'scala-014',
    concept: { pt: 'Guard em Pattern Matching', en: 'Pattern Match Guard' },
    difficulty: 'medium',
    slot: 'cond-guard',
    prompt: {
      pt: 'Guards adicionam condições extras aos cases de um match. Use "case n if ..." pra classificar um número em "negative", "zero" ou "positive".',
      en: 'Guards add extra conditions to match cases. Use "case n if ..." to classify a number into "negative", "zero", or "positive".',
    },
    code: `def classify(x: Int): String = x match {
  case n if n < 0 => "negative"
  case 0          => "zero"
  case n if n > 0 => "positive"
}`,
  },
  {
    id: 'scala-015',
    concept: { pt: 'Val Imutável', en: 'Immutable Val' },
    difficulty: 'easy',
    slot: 'var-const',
    prompt: {
      pt: 'val é a constante do Scala: uma vez atribuída, não muda. Declare val com tipo explícito e tente reatribuir pra ver o erro conceitual (demonstre o uso correto).',
      en: 'val is Scala\'s constant: once assigned, it cannot change. Declare val with explicit type and show proper usage of immutable bindings.',
    },
    code: `val maxRetries: Int = 3
val apiUrl: String = "https://api.example.com"
val timeout: Double = 30.0`,
  },
  {
    id: 'scala-016',
    concept: { pt: 'Tipos Básicos', en: 'Basic Types' },
    difficulty: 'easy',
    slot: 'var-types',
    prompt: {
      pt: 'Scala tem tipos ricos: Int, Double, Boolean, String, Char. Declare variáveis de cada tipo com anotação explícita pra mostrar o sistema de tipos.',
      en: 'Scala has rich types: Int, Double, Boolean, String, Char. Declare variables of each type with explicit annotations to show the type system.',
    },
    code: `val age: Int = 25
val price: Double = 19.99
val active: Boolean = true
val initial: Char = 'S'`,
  },
  {
    id: 'scala-017',
    concept: { pt: 'Array e Seq', en: 'Array and Seq' },
    difficulty: 'easy',
    slot: 'var-array',
    prompt: {
      pt: 'Scala usa List, Vector e Array como coleções sequenciais. Crie uma List, acesse por índice e use :+ pra adicionar ao final (retornando nova lista).',
      en: 'Scala uses List, Vector and Array as sequential collections. Create a List, access by index and use :+ to append (returning a new list).',
    },
    code: `val langs = List("Scala", "Kotlin", "Java")
val first = langs(0)
val updated = langs :+ "Rust"
println(updated)`,
  },
  {
    id: 'scala-018',
    concept: { pt: 'Destructuring', en: 'Destructuring' },
    difficulty: 'medium',
    slot: 'var-destructure',
    prompt: {
      pt: 'Pattern matching no val desestrutura tuplas e case classes diretamente. Extraia campos de uma tupla e de uma case class em vals separados.',
      en: 'Pattern matching on val destructures tuples and case classes directly. Extract fields from a tuple and a case class into separate vals.',
    },
    code: `val (x, y, z) = (1, 2, 3)
case class Point(a: Int, b: Int)
val Point(px, py) = Point(10, 20)
println(s"$x $y $z $px $py")`,
  },
  {
    id: 'scala-019',
    concept: { pt: 'Função Básica', en: 'Basic Function' },
    difficulty: 'easy',
    slot: 'fn-basic',
    prompt: {
      pt: 'Funções em Scala são definidas com def, com tipos explícitos nos parâmetros. Crie uma função add que soma dois Ints e retorna o resultado.',
      en: 'Scala functions are defined with def, with explicit parameter types. Create an add function that sums two Ints and returns the result.',
    },
    code: `def add(a: Int, b: Int): Int = a + b

val result = add(3, 4)
println(s"Sum: $result")`,
  },
  {
    id: 'scala-020',
    concept: { pt: 'Função Anônima', en: 'Anonymous Function' },
    difficulty: 'easy',
    slot: 'fn-arrow',
    prompt: {
      pt: 'Funções anônimas (lambdas) em Scala usam a sintaxe "=>" ou o placeholder "_". Crie lambdas pra dobrar e somar, e aplique numa lista.',
      en: 'Anonymous functions (lambdas) in Scala use the "=>" syntax or the "_" placeholder. Create lambdas to double and sum, then apply them to a list.',
    },
    code: `val double = (x: Int) => x * 2
val nums = List(1, 2, 3, 4)
val result = nums.map(double)
println(result)`,
  },
  {
    id: 'scala-021',
    concept: { pt: 'Função de Ordem Superior', en: 'Higher-Order Function' },
    difficulty: 'medium',
    slot: 'fn-callback',
    prompt: {
      pt: 'Funções de alta ordem recebem ou retornam funções. Crie apply que recebe um valor e uma função, e passe diferentes lambdas como argumento.',
      en: 'Higher-order functions accept or return functions. Create apply that takes a value and a function, and pass different lambdas as argument.',
    },
    code: `def apply(x: Int, f: Int => Int): Int = f(x)

val doubled = apply(5, _ * 2)
val squared = apply(5, n => n * n)
println(s"$doubled $squared")`,
  },
  {
    id: 'scala-022',
    concept: { pt: 'Clausura', en: 'Closure' },
    difficulty: 'medium',
    slot: 'fn-closure',
    prompt: {
      pt: 'Closures capturam variáveis do escopo de fora. Crie uma função que retorna outra função que soma um valor capturado ao argumento.',
      en: 'Closures capture variables from the outer scope. Create a function that returns another function which adds a captured value to the argument.',
    },
    code: `def adder(n: Int): Int => Int = (x: Int) => x + n

val add5 = adder(5)
val add10 = adder(10)
println(s"\${add5(3)} \${add10(3)}")`,
  },
  {
    id: 'scala-023',
    concept: { pt: 'Parâmetros Padrão', en: 'Default Parameters' },
    difficulty: 'easy',
    slot: 'fn-default-params',
    prompt: {
      pt: 'Parâmetros com valor padrão evitam sobrecarga de métodos. Defina greet com um parâmetro greeting que tem valor padrão "Hello".',
      en: 'Default parameter values avoid method overloading. Define greet with a greeting parameter that defaults to "Hello".',
    },
    code: `def greet(name: String, greeting: String = "Hello"): String =
  s"$greeting, $name!"

println(greet("Alice"))
println(greet("Bob", "Hi"))`,
  },
  {
    id: 'scala-024',
    concept: { pt: 'Laço For Numérico', en: 'Numeric For Loop' },
    difficulty: 'easy',
    slot: 'loop-for',
    prompt: {
      pt: 'O for em Scala com range itera sobre intervalos numéricos. Use "1 to 5" pra iterar e acumular a soma em uma var.',
      en: 'Scala for with range iterates over numeric intervals. Use "1 to 5" to iterate and accumulate the sum in a var.',
    },
    code: `var sum = 0
for (i <- 1 to 5) {
  sum += i
}
println(s"Sum: $sum")`,
  },
  {
    id: 'scala-025',
    concept: { pt: 'Laço While', en: 'While Loop' },
    difficulty: 'easy',
    slot: 'loop-while',
    prompt: {
      pt: 'While em Scala repete enquanto a condição for verdadeira. Use while pra contar de 0 até um limite, incrementando a cada iteração.',
      en: 'While in Scala repeats as long as the condition is true. Use while to count from 0 to a limit, incrementing each iteration.',
    },
    code: `var count = 0
while (count < 5) {
  println(s"Count: $count")
  count += 1
}`,
  },
  {
    id: 'scala-026',
    concept: { pt: 'Range com Until', en: 'Range with Until' },
    difficulty: 'easy',
    slot: 'loop-range',
    prompt: {
      pt: 'Scala tem "to" (inclusive) e "until" (exclusive) pra criar ranges, com "by" pra definir o step. Demonstre os três pra iterar de formas diferentes.',
      en: 'Scala has "to" (inclusive) and "until" (exclusive) to create ranges, with "by" to set the step. Demonstrate all three for different iteration styles.',
    },
    code: `val r1 = (1 to 10).toList
val r2 = (0 until 5).toList
val r3 = (0 to 20 by 5).toList
println(s"$r1 $r2 $r3")`,
  },
  {
    id: 'scala-027',
    concept: { pt: 'Objeto Companion', en: 'Companion Object' },
    difficulty: 'medium',
    slot: 'obj-create',
    prompt: {
      pt: 'Companion objects em Scala são o equivalente a membros estáticos. Crie Circle com um companion object que tem um factory method apply.',
      en: 'Companion objects in Scala are the equivalent of static members. Create Circle with a companion object that has a factory method apply.',
    },
    code: `class Circle(val radius: Double) {
  def area: Double = math.Pi * radius * radius
}

object Circle {
  def apply(r: Double) = new Circle(r)
}

val c = Circle(5.0)`,
  },
  {
    id: 'scala-028',
    concept: { pt: 'Métodos de Objeto', en: 'Object Methods' },
    difficulty: 'medium',
    slot: 'obj-methods',
    prompt: {
      pt: 'Objetos em Scala podem ter métodos definidos diretamente. Crie um object MathUtils com métodos utilitários pra cálculos comuns.',
      en: 'Scala objects can have methods defined directly. Create a MathUtils object with utility methods for common calculations.',
    },
    code: `object MathUtils {
  def square(x: Double): Double = x * x
  def clamp(v: Double, lo: Double, hi: Double): Double =
    math.max(lo, math.min(hi, v))
}

println(MathUtils.square(4))`,
  },
  {
    id: 'scala-029',
    concept: { pt: 'Trait como Interface', en: 'Trait as Interface' },
    difficulty: 'medium',
    slot: 'obj-interface',
    prompt: {
      pt: 'Traits em Scala funcionam como interfaces, permitindo que múltiplas classes implementem o mesmo contrato. Defina Drawable e implemente em duas classes.',
      en: 'Scala traits work as interfaces, letting multiple classes implement the same contract. Define Drawable and implement it in two classes.',
    },
    code: `trait Drawable {
  def draw(): String
}

class Square extends Drawable {
  def draw() = "[Square]"
}

class Star extends Drawable {
  def draw() = "*Star*"
}`,
  },
  {
    id: 'scala-030',
    concept: { pt: 'Objeto Aninhado', en: 'Nested Object' },
    difficulty: 'medium',
    slot: 'obj-nested',
    prompt: {
      pt: 'Case classes podem ser aninhadas pra modelar dados compostos. Crie Address dentro de Company pra representar uma estrutura hierárquica.',
      en: 'Case classes can be nested to model composite data. Create Address inside Company to represent a hierarchical structure.',
    },
    code: `case class Address(city: String, zip: String)
case class Company(name: String, hq: Address)

val co = Company("Acme", Address("SP", "01000"))
println(s"\${co.name} in \${co.hq.city}")`,
  },
  {
    id: 'scala-031',
    concept: { pt: 'Herança de Classe', en: 'Class Inheritance' },
    difficulty: 'medium',
    slot: 'class-inherit',
    prompt: {
      pt: 'Classes em Scala herdam com extends e chamam o construtor pai diretamente. Crie Animal como superclasse e Dog estendendo-a.',
      en: 'Scala classes inherit with extends and call the parent constructor directly. Create Animal as a superclass and Dog extending it.',
    },
    code: `class Animal(val name: String) {
  def speak(): String = s"$name makes a sound"
}

class Dog(name: String) extends Animal(name) {
  override def speak() = s"$name barks!"
}`,
  },
  {
    id: 'scala-032',
    concept: { pt: 'Override de Método', en: 'Method Override' },
    difficulty: 'medium',
    slot: 'class-override',
    prompt: {
      pt: 'Scala exige a keyword "override" pra sobrescrever métodos. Sobrescreva toString e um método de trait em classes concretas.',
      en: 'Scala requires the "override" keyword to override methods. Override toString and a trait method in concrete classes.',
    },
    code: `trait Shape {
  def area: Double
}

class Rect(val w: Double, val h: Double) extends Shape {
  override def area: Double = w * h
  override def toString = s"Rect(\${w}x\${h})"
}`,
  },
  {
    id: 'scala-033',
    concept: { pt: 'Try/Catch', en: 'Try/Catch' },
    difficulty: 'medium',
    slot: 'err-try-catch',
    prompt: {
      pt: 'try/catch em Scala usa pattern matching nos blocos catch. Capture exceções específicas com "case e: TipoExceção =>".',
      en: 'try/catch in Scala uses pattern matching in catch blocks. Capture specific exceptions with "case e: ExceptionType =>".',
    },
    code: `import scala.util.{Try, Success, Failure}

val result = Try("42x".toInt) match {
  case Success(n) => s"Parsed: $n"
  case Failure(e) => s"Error: \${e.getMessage}"
}`,
  },
  {
    id: 'scala-034',
    concept: { pt: 'Exceção Personalizada', en: 'Custom Exception' },
    difficulty: 'medium',
    slot: 'err-custom',
    prompt: {
      pt: 'Exceções customizadas estendem Exception. Crie ValidationError e lance-a quando uma validação falhar.',
      en: 'Custom exceptions extend Exception. Create ValidationError and throw it when a validation fails.',
    },
    code: `class ValidationError(msg: String)
  extends Exception(msg)

def validate(age: Int): Int =
  if (age < 0) throw new ValidationError("negative age")
  else age`,
  },
  {
    id: 'scala-035',
    concept: { pt: 'Finally', en: 'Finally' },
    difficulty: 'medium',
    slot: 'err-finally',
    prompt: {
      pt: 'O bloco finally garante execução independente de exceções. Use try/catch/finally pra abrir, usar e fechar um recurso.',
      en: 'The finally block guarantees execution regardless of exceptions. Use try/catch/finally to open, use and close a resource.',
    },
    code: `var resource: String = null
try {
  resource = "open"
  println(resource.toUpperCase)
} catch {
  case e: Exception => println(e.getMessage)
} finally {
  resource = null
  println("Cleaned up")
}`,
  },
  {
    id: 'scala-036',
    concept: { pt: 'Tipo Union', en: 'Union Type' },
    difficulty: 'hard',
    slot: 'type-union',
    prompt: {
      pt: 'Scala 3 tem union types com "|" pra representar que um valor pode ser de múltiplos tipos. Use um tipo union com pattern matching pra tratar cada caso.',
      en: 'Scala 3 has union types with "|" to represent that a value can be one of multiple types. Use a union type with pattern matching to handle each case.',
    },
    code: `type StringOrInt = String | Int

def show(value: StringOrInt): String = value match {
  case s: String => s"String: $s"
  case n: Int    => s"Int: $n"
}`,
  },
  {
    id: 'scala-037',
    concept: { pt: 'Tipo com Constraint', en: 'Type Constraint' },
    difficulty: 'hard',
    slot: 'type-constraint',
    prompt: {
      pt: 'Upper type bounds (<:) restringem parâmetros genéricos a subtipos. Crie uma função que aceita apenas subtipos de Comparable.',
      en: 'Upper type bounds (<:) constrain generic parameters to subtypes. Create a function that accepts only subtypes of Comparable.',
    },
    code: `def maxOf[T <: Comparable[T]](a: T, b: T): T =
  if (a.compareTo(b) >= 0) a else b

val bigger = maxOf("apple", "banana")
println(bigger)`,
  },
  {
    id: 'scala-038',
    concept: { pt: 'Tipo Utilitário', en: 'Utility Type' },
    difficulty: 'hard',
    slot: 'type-utility',
    prompt: {
      pt: 'Type aliases e opaque types organizam tipos complexos. Crie aliases pra simplificar assinaturas e melhorar a legibilidade.',
      en: 'Type aliases and opaque types organize complex types. Create aliases to simplify signatures and improve readability.',
    },
    code: `type UserId = Int
type UserMap = Map[UserId, String]

val users: UserMap = Map(
  1 -> "Alice", 2 -> "Bob"
)
def find(id: UserId): Option[String] = users.get(id)`,
  },
  {
    id: 'scala-039',
    concept: { pt: 'Casamento Avançado', en: 'Advanced Pattern Matching' },
    difficulty: 'hard',
    slot: 'adv-pattern',
    prompt: {
      pt: 'Pattern matching em sealed traits cobre todos os casos de forma exaustiva. Use uma sealed trait com case objects/classes e faça match com extração.',
      en: 'Pattern matching on sealed traits covers all cases exhaustively. Use a sealed trait with case objects/classes and match with extraction.',
    },
    code: `sealed trait Expr
case class Num(n: Double) extends Expr
case class Add(a: Expr, b: Expr) extends Expr

def eval(e: Expr): Double = e match {
  case Num(n)    => n
  case Add(a, b) => eval(a) + eval(b)
}`,
  },
  {
    id: 'scala-040',
    concept: { pt: 'Macro Inline', en: 'Inline Macro' },
    difficulty: 'hard',
    slot: 'adv-macro',
    prompt: {
      pt: 'Scala 3 usa "inline" pra avaliação em tempo de compilação. Use inline def e inline if pra criar código que o compilador expande e otimiza.',
      en: 'Scala 3 uses "inline" for compile-time evaluation. Use inline def and inline if to create code that the compiler expands and optimizes.',
    },
    code: `inline def power(x: Double, inline n: Int): Double =
  inline if (n == 0) 1.0
  else x * power(x, n - 1)

val r = power(2.0, 3)`,
  },
  {
    id: 'scala-041',
    concept: { pt: 'Concorrência com Future', en: 'Concurrency with Future' },
    difficulty: 'hard',
    slot: 'adv-concurrent',
    prompt: {
      pt: 'Future.sequence transforma uma lista de Futures em um Future de lista, executando tudo em paralelo. Combine múltiplas chamadas assíncronas e aguarde todas.',
      en: 'Future.sequence transforms a list of Futures into a Future of a list, running everything in parallel. Combine multiple async calls and await all.',
    },
    code: `import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val tasks = List(1, 2, 3).map(n => Future(n * 10))
val all = Future.sequence(tasks)
all.foreach(println)`,
  },
  // ── Algoritmos & Estruturas de Dados ──────────────────────
  {
    id: 'scala-042',
    concept: { pt: 'Notação Big O', en: 'Big O Notation' },
    difficulty: 'easy',
    prompt: { pt: 'Big O descreve a complexidade de tempo. Demonstre O(1), O(n) e O(n²) em Scala.', en: 'Big O describes time complexity. Demonstrate O(1), O(n), and O(n²) in Scala.' },
    code: `// O(1) -- acesso direto
val first = arr(0)

// O(n) -- percorrer tudo
def contains(arr: List[Int], target: Int): Boolean =
  arr.exists(_ == target)

// O(n²) -- loop aninhado
def hasDuplicate(arr: List[Int]): Boolean =
  arr.indices.exists(i =>
    (i + 1 until arr.length).exists(j => arr(i) == arr(j)))`,
  },
  {
    id: 'scala-043',
    concept: { pt: 'Busca Binária', en: 'Binary Search' },
    difficulty: 'medium',
    prompt: { pt: 'Busca binária divide o array ordenado ao meio -- O(log n).', en: 'Binary search halves a sorted array -- O(log n).' },
    code: `def binarySearch(arr: Array[Int], target: Int): Int = {
  var left = 0
  var right = arr.length - 1
  while (left <= right) {
    val mid = left + (right - left) / 2
    if (arr(mid) == target) return mid
    if (arr(mid) < target) left = mid + 1
    else right = mid - 1
  }
  -1
}`,
  },
  {
    id: 'scala-044',
    concept: { pt: 'Bubble Sort', en: 'Bubble Sort' },
    difficulty: 'easy',
    prompt: { pt: 'Bubble Sort compara pares adjacentes e troca -- O(n²).', en: 'Bubble Sort compares adjacent pairs and swaps -- O(n²).' },
    code: `def bubbleSort(arr: Array[Int]): Array[Int] = {
  val a = arr.clone()
  for (i <- 0 until a.length - 1) {
    var swapped = false
    for (j <- 0 until a.length - 1 - i) {
      if (a(j) > a(j + 1)) {
        val tmp = a(j); a(j) = a(j + 1); a(j + 1) = tmp
        swapped = true
      }
    }
    if (!swapped) return a
  }
  a
}`,
  },
  {
    id: 'scala-045',
    concept: { pt: 'Merge Sort', en: 'Merge Sort' },
    difficulty: 'hard',
    prompt: { pt: 'Merge Sort divide recursivamente e intercala -- O(n log n). Use estilo funcional com List.', en: 'Merge Sort recursively splits and merges -- O(n log n). Use functional style with List.' },
    code: `def mergeSort(xs: List[Int]): List[Int] = xs match {
  case Nil | _ :: Nil => xs
  case _ =>
    val (left, right) = xs.splitAt(xs.length / 2)
    merge(mergeSort(left), mergeSort(right))
}

def merge(a: List[Int], b: List[Int]): List[Int] = (a, b) match {
  case (Nil, _) => b
  case (_, Nil) => a
  case (x :: xs, y :: ys) =>
    if (x <= y) x :: merge(xs, b) else y :: merge(a, ys)
}`,
  },
  {
    id: 'scala-046',
    concept: { pt: 'Quick Sort', en: 'Quick Sort' },
    difficulty: 'hard',
    prompt: { pt: 'Quick Sort particiona em torno de um pivô -- O(n log n) médio.', en: 'Quick Sort partitions around a pivot -- O(n log n) average.' },
    code: `def quickSort(xs: List[Int]): List[Int] = xs match {
  case Nil | _ :: Nil => xs
  case _ =>
    val pivot = xs.last
    val rest = xs.init
    val (left, right) = rest.partition(_ < pivot)
    quickSort(left) ::: pivot :: quickSort(right)
}`,
  },
  {
    id: 'scala-047',
    concept: { pt: 'Pilha (Stack)', en: 'Stack' },
    difficulty: 'easy',
    prompt: { pt: 'mutable.Stack oferece LIFO com push, pop e top em Scala.', en: 'mutable.Stack provides LIFO with push, pop, and top in Scala.' },
    code: `import scala.collection.mutable

val stack = mutable.Stack[Int]()
stack.push(1)
stack.push(2)
stack.push(3)

val top = stack.top  // 3
val removed = stack.pop() // 3
val empty = stack.isEmpty`,
  },
  {
    id: 'scala-048',
    concept: { pt: 'Fila (Queue)', en: 'Queue' },
    difficulty: 'easy',
    prompt: { pt: 'mutable.Queue oferece FIFO com enqueue, dequeue e front em Scala.', en: 'mutable.Queue provides FIFO with enqueue, dequeue, and front in Scala.' },
    code: `import scala.collection.mutable

val queue = mutable.Queue[String]()
queue.enqueue("A")
queue.enqueue("B")
queue.enqueue("C")

val front = queue.front  // "A"
val removed = queue.dequeue() // "A"
val size = queue.size`,
  },
  {
    id: 'scala-049',
    concept: { pt: 'Lista Ligada', en: 'Linked List' },
    difficulty: 'medium',
    prompt: { pt: 'Uma lista ligada em Scala usa sealed trait e case class.', en: 'A linked list in Scala uses sealed trait and case class.' },
    code: `sealed trait LinkedList[+A]
case object Empty extends LinkedList[Nothing]
case class Cons[A](head: A, tail: LinkedList[A]) extends LinkedList[A]

def prepend[A](list: LinkedList[A], value: A): LinkedList[A] =
  Cons(value, list)

def toList[A](ll: LinkedList[A]): List[A] = ll match {
  case Empty => Nil
  case Cons(h, t) => h :: toList(t)
}`,
  },
  {
    id: 'scala-050',
    concept: { pt: 'Árvore Binária de Busca', en: 'Binary Search Tree' },
    difficulty: 'medium',
    prompt: { pt: 'Uma BST em Scala usa case class com Option pra filhos.', en: 'A BST in Scala uses case class with Option for children.' },
    code: `case class TreeNode(val: Int, var left: Option[TreeNode] = None, var right: Option[TreeNode] = None)

def insert(node: Option[TreeNode], v: Int): TreeNode = node match {
  case None => TreeNode(v)
  case Some(n) =>
    if (v < n.val) n.copy(left = Some(insert(n.left, v)))
    else n.copy(right = Some(insert(n.right, v)))
}

def search(node: Option[TreeNode], v: Int): Boolean = node match {
  case None => false
  case Some(n) if v == n.val => true
  case Some(n) => if (v < n.val) search(n.left, v) else search(n.right, v)
}`,
  },
  {
    id: 'scala-051',
    concept: { pt: 'BFS (Busca em Largura)', en: 'BFS (Breadth-First Search)' },
    difficulty: 'hard',
    prompt: { pt: 'BFS explora nível por nível com mutable.Queue e mutable.Set.', en: 'BFS explores level by level with mutable.Queue and mutable.Set.' },
    code: `import scala.collection.mutable

def bfs(graph: Map[String, List[String]], start: String): List[String] = {
  val visited = mutable.Set(start)
  val queue = mutable.Queue(start)
  val result = mutable.ListBuffer[String]()
  while (queue.nonEmpty) {
    val node = queue.dequeue()
    result += node
    for (nb <- graph.getOrElse(node, Nil) if visited.add(nb))
      queue.enqueue(nb)
  }
  result.toList
}`,
  },
  {
    id: 'scala-052',
    concept: { pt: 'DFS (Busca em Profundidade)', en: 'DFS (Depth-First Search)' },
    difficulty: 'hard',
    prompt: { pt: 'DFS explora o mais fundo possível com mutable.Stack.', en: 'DFS explores as deep as possible with mutable.Stack.' },
    code: `def dfs(graph: Map[String, List[String]], start: String): List[String] = {
  val visited = mutable.Set[String]()
  val stack = mutable.Stack(start)
  val result = mutable.ListBuffer[String]()
  while (stack.nonEmpty) {
    val node = stack.pop()
    if (visited.add(node)) {
      result += node
      graph.getOrElse(node, Nil).reverse.foreach(nb =>
        if (!visited.contains(nb)) stack.push(nb))
    }
  }
  result.toList
}`,
  },
  {
    id: 'scala-053',
    concept: { pt: 'Hash Map', en: 'Hash Map' },
    difficulty: 'medium',
    prompt: { pt: 'mutable.HashMap é o hash map do Scala com acesso O(1) médio.', en: 'mutable.HashMap is Scala\'s hash map with O(1) average access.' },
    code: `import scala.collection.mutable

val scores = mutable.HashMap("Alice" -> 95, "Bob" -> 87, "Carol" -> 92)

val alice = scores("Alice")
val hasBob = scores.contains("Bob")
val dave = scores.getOrElse("Dave", 0)

scores.foreach { case (name, score) => println(s"$name: $score") }`,
  },
]
