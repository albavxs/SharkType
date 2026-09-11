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
]
