import { Snippet } from '@/lib/types'

export const kotlinSnippets: Snippet[] = [
  {
    id: 'kotlin-001',
    concept: { pt: 'Classe de Dados', en: 'Data Class' },
    difficulty: 'easy',
    prompt: {
      pt: 'Data classes já vêm com equals, hashCode, toString e copy de graça. Defina User com três propriedades val (imutáveis): name, age e email. Depois, instancie alice com os valores de exemplo.',
      en: 'Data classes auto-generate equals, hashCode, toString and copy. Define User with three val (immutable) properties: name, age and email. Then instantiate alice with the example values.',
    },
    code: `data class User(
    val name: String,
    val age: Int,
    val email: String,
)

val alice = User("Alice", 30, "alice@example.com")`,
    slot: 'class-basic',
  },
  {
    id: 'kotlin-002',
    concept: { pt: 'Expressão When', en: 'When Expression' },
    difficulty: 'easy',
    prompt: {
      pt: 'A expressão when é o switch turbinado do Kotlin: checa tipos, valores e expressões. Monte describe usando when com "is Int" e "is String" pra verificar o tipo de x, trate o caso null e use else como fallback.',
      en: 'The when expression replaces switch with much more power: it can check types, values and expressions. Implement describe using when with "is Int" and "is String" to check the type of x, handle the null case and use else as fallback.',
    },
    code: `fun describe(x: Any): String = when (x) {
    is Int    -> "integer: $x"
    is String -> "string of length \${x.length}"
    null      -> "null"
    else      -> "unknown"
}`,
    slot: 'cond-switch',
  },
  {
    id: 'kotlin-003',
    concept: { pt: 'Template de String', en: 'String Template' },
    difficulty: 'easy',
    prompt: {
      pt: 'Kotlin tem dois estilos de template string: $variável pra valores simples e ${expressão} pra expressões. Use os dois pra montar duas mensagens sobre linguagem e versão, uma delas com chamada de método.',
      en: 'Kotlin has two string template styles: $variable for simple values and ${expression} for expressions. Use both to build two messages about language and version, one with a method call.',
    },
    code: `val language = "Kotlin"
val version = 2.0
println("$language $version foi lançado!")
println("\${language.uppercase()} é incrível.")`,
    slot: 'var-interpolation',
  },
  {
    id: 'kotlin-004',
    concept: { pt: 'Segurança contra Nulo', en: 'Null Safety' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Kotlin, null safety é garantido pelo sistema de tipos. Use safe-call (?.) pra acessar .length e .uppercase() numa String? sem NullPointerException, e o operador Elvis (?:) pra dar valores padrão.',
      en: 'In Kotlin, null safety is enforced by the type system. Use the safe-call operator (?.) to access .length and .uppercase() on a String? without NullPointerException, and the Elvis operator (?:) to provide default values.',
    },
    code: `val name: String? = null
val length = name?.length ?: 0
val upper = name?.uppercase() ?: "N/A"
println("Length: $length, Upper: $upper")`,
    slot: 'type-utility',
  },
  {
    id: 'kotlin-005',
    concept: { pt: 'Função de Extensão', en: 'Extension Function' },
    difficulty: 'medium',
    prompt: {
      pt: 'Extension functions colam métodos em qualquer classe sem herança nem mexer no código original. Adicione isPalindrome() a String (limpa e compara com reversed) e secondOrNull() a List<Int> (usa getOrNull(1)).',
      en: 'Extension functions add methods to any class without inheritance or modifying the original code. Add isPalindrome() to String (that cleans and compares with reversed) and secondOrNull() to List<Int> (that uses getOrNull(1)).',
    },
    code: `fun String.isPalindrome(): Boolean {
    val clean = filter { it.isLetterOrDigit() }.lowercase()
    return clean == clean.reversed()
}

fun List<Int>.secondOrNull(): Int? = getOrNull(1)`,
  },
  {
    id: 'kotlin-006',
    concept: { pt: 'Classe Selada', en: 'Sealed Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Sealed classes limitam quais subclasses podem existir, criando um tipo fechado perfeito pra modelar estados. Defina Result<T> com três subclasses: Success (com data), Error (com message) e o singleton Loading.',
      en: 'Sealed classes restrict possible subclasses, creating a closed type ideal for modeling states. Define Result<T> with three subclasses: Success (with data), Error (with message) and the Loading singleton.',
    },
    code: `sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
}`,
    slot: 'type-union',
  },
  {
    id: 'kotlin-007',
    concept: { pt: 'Lambda e Ordem Superior', en: 'Lambda and Higher-Order' },
    difficulty: 'medium',
    prompt: {
      pt: 'Funções de ordem superior recebem outras funções como parâmetro. Crie customFilter como extension function de List<T> que aceita um predicado lambda (T) -> Boolean, percorre a lista e devolve uma nova só com os elementos que passaram.',
      en: 'Higher-order functions take other functions as parameters. Implement customFilter as a List<T> extension function that accepts a lambda predicate (T) -> Boolean, iterates the list and returns a new one with elements that pass.',
    },
    code: `fun <T> List<T>.customFilter(predicate: (T) -> Boolean): List<T> {
    val result = mutableListOf<T>()
    for (item in this) {
        if (predicate(item)) result.add(item)
    }
    return result
}

val evens = listOf(1, 2, 3, 4, 5).customFilter { it % 2 == 0 }`,
    slot: 'fn-callback',
  },
  {
    id: 'kotlin-008',
    concept: { pt: 'Objeto Companheiro', en: 'Companion Object' },
    difficulty: 'medium',
    prompt: {
      pt: 'Companion objects fazem o papel de membros estáticos em Kotlin. Monte o padrão Singleton em ApiClient: constructor privado, instância nullable no companion object e getInstance que cria a instância de forma lazy com also.',
      en: 'Companion objects are Kotlin\'s equivalent of static members. Implement the Singleton pattern in ApiClient: private constructor, nullable instance in the companion object and getInstance that lazily creates the instance with also.',
    },
    code: `class ApiClient private constructor(val baseUrl: String) {
    companion object {
        private var instance: ApiClient? = null
        fun getInstance(url: String): ApiClient =
            instance ?: ApiClient(url).also { instance = it }
    }
}`,
    slot: 'obj-methods',
  },
  {
    id: 'kotlin-009',
    concept: { pt: 'Corrotina', en: 'Coroutine' },
    difficulty: 'hard',
    prompt: {
      pt: 'Coroutines são o jeito nativo do Kotlin de fazer concorrência. Use runBlocking como raiz, async pra disparar cada busca em paralelo e awaitAll() pra esperar todos os resultados antes de imprimir.',
      en: 'Coroutines are Kotlin\'s native concurrency mechanism. Use runBlocking as the root, async to launch each fetch in parallel and awaitAll() to wait for all results before printing.',
    },
    code: `import kotlinx.coroutines.*

suspend fun fetchUser(id: Int): String {
    delay(100)
    return "User-$id"
}

fun main() = runBlocking {
    val users = (1..5).map { id ->
        async { fetchUser(id) }
    }.awaitAll()
    println(users)
}`,
    slot: 'adv-concurrent',
  },
  {
    id: 'kotlin-010',
    concept: { pt: 'Genéricos e Variância', en: 'Generics and Variance' },
    difficulty: 'hard',
    prompt: {
      pt: '"out T" torna o genérico covariante: um Repository<User> pode ser tratado como Repository<Any>. Defina a interface Repository<out T> com dois métodos e crie UserRepository mantendo uma lista mutável interna.',
      en: '"out T" makes a generic covariant: a Repository<User> can be treated as Repository<Any>. Define the Repository<out T> interface with two methods and implement UserRepository keeping an internal mutable list.',
    },
    code: `interface Repository<out T> {
    fun getAll(): List<T>
    fun getById(id: Int): T?
}

class UserRepository : Repository<User> {
    private val users = mutableListOf<User>()
    override fun getAll() = users.toList()
    override fun getById(id: Int) = users.find { it.age == id }
}`,
    slot: 'type-generic',
  },
  // ── NEW SNIPPETS ──
  {
    id: 'kotlin-011',
    concept: { pt: 'If e Else', en: 'If and Else' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Kotlin, "if" é uma expressão que retorna valor. Use if pra checar se um número é positivo e imprima o resultado.',
      en: 'In Kotlin, "if" is an expression that returns a value. Use if to check whether a number is positive and print the result.',
    },
    code: `val n = 42
if (n > 0) {
    println("positivo")
}`,
    slot: 'cond-basic-if',
  },
  {
    id: 'kotlin-012',
    concept: { pt: 'If-Else como Expressão', en: 'If-Else Expression' },
    difficulty: 'easy',
    prompt: {
      pt: 'Como "if" é expressão em Kotlin, dá pra atribuir o resultado direto a uma variável. Use if-else pra classificar um número como "par" ou "ímpar".',
      en: 'Since "if" is an expression in Kotlin, you can assign its result directly to a variable. Use if-else to classify a number as "even" or "odd".',
    },
    code: `val n = 7
val label = if (n % 2 == 0) "par" else "ímpar"
println("$n é $label")`,
    slot: 'cond-if-else',
  },
  {
    id: 'kotlin-013',
    concept: { pt: 'Operador Ternário (If Inline)', en: 'Ternary (Inline If)' },
    difficulty: 'easy',
    prompt: {
      pt: 'Kotlin não tem operador ternário (?:), mas o if-else inline faz o mesmo papel. Use pra escolher entre dois textos com base numa condição.',
      en: 'Kotlin has no ternary operator (?:), but inline if-else serves the same purpose. Use it to pick between two texts based on a condition.',
    },
    code: `val age = 20
val status = if (age >= 18) "adulto" else "menor"`,
    slot: 'cond-ternary',
  },
  {
    id: 'kotlin-014',
    concept: { pt: 'Guard com Require', en: 'Guard with Require' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Kotlin, "require" age como guard clause: se a condição for falsa, lança IllegalArgumentException. Use pra validar parâmetros no início da função.',
      en: 'In Kotlin, "require" acts as a guard clause: if the condition is false, it throws IllegalArgumentException. Use it to validate parameters at the start of a function.',
    },
    code: `fun withdraw(amount: Double, balance: Double): Double {
    require(amount > 0) { "Valor deve ser positivo" }
    require(amount <= balance) { "Saldo insuficiente" }
    return balance - amount
}`,
    slot: 'cond-guard',
  },
  {
    id: 'kotlin-015',
    concept: { pt: 'Declaração de Variáveis', en: 'Variable Declaration' },
    difficulty: 'easy',
    prompt: {
      pt: '"val" cria uma referência imutável e "var" uma mutável. Declare variáveis dos dois tipos com inferência de tipo e tipo explícito.',
      en: '"val" creates an immutable reference and "var" a mutable one. Declare variables of both kinds with type inference and explicit type.',
    },
    code: `val name = "Kotlin"
var counter = 0
val pi: Double = 3.14
counter += 1`,
    slot: 'var-declare',
  },
  {
    id: 'kotlin-016',
    concept: { pt: 'Constante em Tempo de Compilação', en: 'Compile-Time Constant' },
    difficulty: 'easy',
    prompt: {
      pt: '"const val" define constantes resolvidas em tempo de compilação (só tipos primitivos e String). Declare uma constante e uma val normal pra comparar.',
      en: '"const val" defines compile-time constants (only primitive types and String). Declare a constant and a regular val for comparison.',
    },
    code: `const val MAX_RETRIES = 3
val timeout = 5000L`,
    slot: 'var-const',
  },
  {
    id: 'kotlin-017',
    concept: { pt: 'Tipos Básicos', en: 'Basic Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'Kotlin tem tipos numéricos explícitos (Int, Long, Double, Float) e conversão deve ser feita manualmente. Declare variáveis de tipos diferentes e converta entre elas.',
      en: 'Kotlin has explicit numeric types (Int, Long, Double, Float) and conversion must be done manually. Declare variables of different types and convert between them.',
    },
    code: `val count: Int = 42
val big: Long = count.toLong()
val ratio: Double = 3.14
val label: String = "total: $count"`,
    slot: 'var-types',
  },
  {
    id: 'kotlin-018',
    concept: { pt: 'Array e Lista', en: 'Array and List' },
    difficulty: 'easy',
    prompt: {
      pt: 'listOf cria uma lista imutável e mutableListOf uma mutável. Crie as duas, adicione um elemento na mutável e acesse por índice.',
      en: 'listOf creates an immutable list and mutableListOf a mutable one. Create both, add an element to the mutable one and access by index.',
    },
    code: `val fruits = listOf("apple", "banana", "cherry")
val nums = mutableListOf(1, 2, 3)
nums.add(4)
println(fruits[0])`,
    slot: 'var-array',
  },
  {
    id: 'kotlin-019',
    concept: { pt: 'Desestruturação', en: 'Destructuring' },
    difficulty: 'medium',
    prompt: {
      pt: 'Data classes suportam desestruturação automática em Kotlin. Extraia as propriedades de um par e de uma data class em variáveis separadas.',
      en: 'Data classes support automatic destructuring in Kotlin. Extract properties from a pair and a data class into separate variables.',
    },
    code: `val (first, second) = Pair("Kotlin", 2.0)
data class Point(val x: Int, val y: Int)
val (x, y) = Point(3, 7)
println("$first $second at ($x, $y)")`,
    slot: 'var-destructure',
  },
  {
    id: 'kotlin-020',
    concept: { pt: 'Função Básica', en: 'Basic Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Funções em Kotlin são declaradas com "fun". Crie uma que receba dois inteiros e retorne a soma, usando tanto a forma de bloco quanto a forma de expressão.',
      en: 'Functions in Kotlin are declared with "fun". Create one that takes two integers and returns the sum, using both block form and expression form.',
    },
    code: `fun add(a: Int, b: Int): Int {
    return a + b
}

fun multiply(a: Int, b: Int) = a * b`,
    slot: 'fn-basic',
  },
  {
    id: 'kotlin-021',
    concept: { pt: 'Lambda (Função Anônima)', en: 'Lambda (Anonymous Function)' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lambdas em Kotlin são blocos { params -> corpo }. Atribua uma lambda a uma variável tipada e a invoque.',
      en: 'Kotlin lambdas are blocks { params -> body }. Assign a lambda to a typed variable and invoke it.',
    },
    code: `val square: (Int) -> Int = { n -> n * n }
val result = square(5)
println(result)`,
    slot: 'fn-arrow',
  },
  {
    id: 'kotlin-022',
    concept: { pt: 'Closure', en: 'Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Closures capturam variáveis do escopo externo. Crie uma função que retorne um contador como closure, acumulando chamadas.',
      en: 'Closures capture variables from the outer scope. Create a function that returns a counter as a closure, accumulating calls.',
    },
    code: `fun counter(start: Int): () -> Int {
    var count = start
    return { count++ }
}

val next = counter(0)
println(next())
println(next())`,
    slot: 'fn-closure',
  },
  {
    id: 'kotlin-023',
    concept: { pt: 'Parâmetros Padrão', en: 'Default Parameters' },
    difficulty: 'easy',
    prompt: {
      pt: 'Parâmetros com valor padrão evitam sobrecarga de funções. Defina greet com um parâmetro opcional e chame de duas formas.',
      en: 'Default parameter values avoid function overloading. Define greet with an optional parameter and call it both ways.',
    },
    code: `fun greet(name: String, greeting: String = "Olá") {
    println("$greeting, $name!")
}

greet("Ana")
greet("Ana", "Bom dia")`,
    slot: 'fn-default-params',
  },
  {
    id: 'kotlin-024',
    concept: { pt: 'Loop For com Range', en: 'For Loop with Range' },
    difficulty: 'easy',
    prompt: {
      pt: 'O for em Kotlin itera sobre ranges com ".." (inclusivo) e "until" (exclusivo). Use as duas formas e step pra controlar o incremento.',
      en: 'Kotlin for iterates over ranges with ".." (inclusive) and "until" (exclusive). Use both forms and step to control the increment.',
    },
    code: `for (i in 1..5) {
    print("$i ")
}
for (i in 0 until 10 step 2) {
    print("$i ")
}`,
    slot: 'loop-for',
  },
  {
    id: 'kotlin-025',
    concept: { pt: 'Loop While', en: 'While Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'While repete enquanto a condição for verdadeira. Conte de 1 até 5 usando while com um contador.',
      en: 'While repeats as long as the condition is true. Count from 1 to 5 using while with a counter.',
    },
    code: `var i = 1
while (i <= 5) {
    println(i)
    i++
}`,
    slot: 'loop-while',
  },
  {
    id: 'kotlin-026',
    concept: { pt: 'ForEach', en: 'ForEach' },
    difficulty: 'easy',
    prompt: {
      pt: 'forEach é uma alternativa funcional ao for-in. Use forEach com lambda em uma lista de nomes pra imprimir cada um.',
      en: 'forEach is a functional alternative to for-in. Use forEach with a lambda on a list of names to print each one.',
    },
    code: `val names = listOf("Ana", "Bruno", "Clara")
names.forEach { name ->
    println("Olá, $name!")
}`,
    slot: 'loop-foreach',
  },
  {
    id: 'kotlin-027',
    concept: { pt: 'Filter e Map', en: 'Filter and Map' },
    difficulty: 'easy',
    prompt: {
      pt: 'filter seleciona elementos e map os transforma. Filtre os pares de uma lista e dobre cada um.',
      en: 'filter selects elements and map transforms them. Filter the even numbers from a list and double each one.',
    },
    code: `val nums = listOf(1, 2, 3, 4, 5, 6)
val result = nums.filter { it % 2 == 0 }.map { it * 2 }
println(result)`,
    slot: 'loop-filter',
  },
  {
    id: 'kotlin-028',
    concept: { pt: 'Range e Progressão', en: 'Range and Progression' },
    difficulty: 'easy',
    prompt: {
      pt: 'Ranges em Kotlin são objetos que representam intervalos. Use downTo pra contar regressivamente e toList() pra materializar o range.',
      en: 'Kotlin ranges are objects representing intervals. Use downTo to count backwards and toList() to materialize the range.',
    },
    code: `val ascending = (1..5).toList()
val descending = (10 downTo 1 step 3).toList()
println(ascending)
println(descending)`,
    slot: 'loop-range',
  },
  {
    id: 'kotlin-029',
    concept: { pt: 'Criação de Objeto', en: 'Object Creation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Kotlin não existe "new". Crie uma classe simples com propriedades, instancie e acesse seus campos.',
      en: 'In Kotlin there is no "new" keyword. Create a simple class with properties, instantiate it and access its fields.',
    },
    code: `class Car(val brand: String, var speed: Int)

val car = Car("Tesla", 0)
car.speed = 100
println("\${car.brand}: \${car.speed} km/h")`,
    slot: 'obj-create',
  },
  {
    id: 'kotlin-030',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'medium',
    prompt: {
      pt: 'Interfaces em Kotlin podem ter métodos abstratos e implementações padrão. Defina uma interface com ambos e implemente numa classe.',
      en: 'Kotlin interfaces can have abstract methods and default implementations. Define an interface with both and implement it in a class.',
    },
    code: `interface Drawable {
    fun draw()
    fun description() = "Drawable element"
}

class Circle(val r: Double) : Drawable {
    override fun draw() = println("Drawing circle r=$r")
}`,
    slot: 'obj-interface',
  },
  {
    id: 'kotlin-031',
    concept: { pt: 'Objeto Aninhado', en: 'Nested Object' },
    difficulty: 'medium',
    prompt: {
      pt: 'Objetos podem ser aninhados dentro de classes em Kotlin. Use um map mutável dentro de uma classe pra criar uma estrutura aninhada de configuração.',
      en: 'Objects can be nested within classes in Kotlin. Use a mutable map inside a class to create a nested configuration structure.',
    },
    code: `class Config(val env: String) {
    val db = Database()
    inner class Database {
        var host = "localhost"
        var port = if (env == "prod") 5432 else 5433
    }
}`,
    slot: 'obj-nested',
  },
  {
    id: 'kotlin-032',
    concept: { pt: 'Herança de Classe', en: 'Class Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: 'Classes em Kotlin são final por padrão. Use "open" pra permitir herança e "override" pra sobrescrever métodos.',
      en: 'Kotlin classes are final by default. Use "open" to allow inheritance and "override" to override methods.',
    },
    code: `open class Animal(val name: String) {
    open fun sound() = "..."
}

class Dog(name: String) : Animal(name) {
    override fun sound() = "Woof!"
}`,
    slot: 'class-inherit',
  },
  {
    id: 'kotlin-033',
    concept: { pt: 'Sobrescrita de Método', en: 'Method Override' },
    difficulty: 'medium',
    prompt: {
      pt: 'Override permite especializar comportamento herdado. Sobrescreva toString() e um método "open" da classe base numa subclasse.',
      en: 'Override lets you specialize inherited behavior. Override toString() and an "open" method from the base class in a subclass.',
    },
    code: `open class Shape(val name: String) {
    open fun area(): Double = 0.0
    override fun toString() = name
}

class Square(val side: Double) : Shape("Square") {
    override fun area() = side * side
}`,
    slot: 'class-override',
  },
  {
    id: 'kotlin-034',
    concept: { pt: 'Classe Abstrata', en: 'Abstract Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Classes abstratas podem ter membros abstratos (sem corpo) e concretos. Defina uma classe abstrata com um método abstrato e um concreto.',
      en: 'Abstract classes can have abstract members (no body) and concrete ones. Define an abstract class with one abstract and one concrete method.',
    },
    code: `abstract class Logger {
    abstract fun write(msg: String)
    fun log(msg: String) {
        write("[LOG] $msg")
    }
}

class ConsoleLogger : Logger() {
    override fun write(msg: String) = println(msg)
}`,
    slot: 'class-abstract',
  },
  {
    id: 'kotlin-035',
    concept: { pt: 'Try-Catch', en: 'Try-Catch' },
    difficulty: 'easy',
    prompt: {
      pt: 'try-catch captura exceções em Kotlin e pode ser usado como expressão. Tente converter uma string em número e trate a exceção.',
      en: 'try-catch catches exceptions in Kotlin and can be used as an expression. Try converting a string to a number and handle the exception.',
    },
    code: `val input = "abc"
val number = try {
    input.toInt()
} catch (e: NumberFormatException) {
    -1
}
println(number)`,
    slot: 'err-try-catch',
  },
  {
    id: 'kotlin-036',
    concept: { pt: 'Exceção Personalizada', en: 'Custom Exception' },
    difficulty: 'medium',
    prompt: {
      pt: 'Crie uma exceção personalizada estendendo Exception e lance-a com throw numa função de validação.',
      en: 'Create a custom exception extending Exception and throw it in a validation function.',
    },
    code: `class ValidationError(msg: String) : Exception(msg)

fun validateAge(age: Int): Int {
    if (age < 0) throw ValidationError("Idade negativa")
    return age
}`,
    slot: 'err-custom',
  },
  {
    id: 'kotlin-037',
    concept: { pt: 'Resultado com Sealed Class', en: 'Result with Sealed Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Use sealed class pra modelar sucesso/falha sem exceções, similar ao Result de Rust. Crie uma função que retorne Success ou Failure.',
      en: 'Use sealed class to model success/failure without exceptions, similar to Rust Result. Create a function that returns Success or Failure.',
    },
    code: `sealed class Outcome<out T> {
    data class Success<T>(val value: T) : Outcome<T>()
    data class Failure(val error: String) : Outcome<Nothing>()
}

fun divide(a: Int, b: Int): Outcome<Double> =
    if (b != 0) Outcome.Success(a.toDouble() / b)
    else Outcome.Failure("Divisão por zero")`,
    slot: 'err-result',
  },
  {
    id: 'kotlin-038',
    concept: { pt: 'Finally', en: 'Finally' },
    difficulty: 'easy',
    prompt: {
      pt: 'O bloco "finally" sempre executa, independente de exceção. Use try-catch-finally pra garantir limpeza de recurso.',
      en: 'The "finally" block always runs regardless of exceptions. Use try-catch-finally to guarantee resource cleanup.',
    },
    code: `fun readFile(path: String): String {
    val reader = java.io.File(path).bufferedReader()
    try {
        return reader.readText()
    } catch (e: Exception) {
        return "Erro: \${e.message}"
    } finally {
        reader.close()
    }
}`,
    slot: 'err-finally',
  },
  {
    id: 'kotlin-039',
    concept: { pt: 'Constraint de Tipo', en: 'Type Constraint' },
    difficulty: 'hard',
    prompt: {
      pt: 'Use "where" pra aplicar múltiplas constraints a um tipo genérico, exigindo que implemente várias interfaces.',
      en: 'Use "where" to apply multiple constraints to a generic type, requiring it to implement multiple interfaces.',
    },
    code: `fun <T> sortAndPrint(list: List<T>) where T : Comparable<T>, T : Any {
    list.sorted().forEach { println(it) }
}`,
    slot: 'type-constraint',
  },
  {
    id: 'kotlin-040',
    concept: { pt: 'Async/Await', en: 'Async/Await' },
    difficulty: 'hard',
    prompt: {
      pt: 'suspend functions são a base de async/await em Kotlin. Use withContext pra trocar de dispatcher e simular uma operação assíncrona.',
      en: 'Suspend functions are the foundation of async/await in Kotlin. Use withContext to switch dispatchers and simulate an async operation.',
    },
    code: `import kotlinx.coroutines.*

suspend fun loadData(): String = withContext(Dispatchers.IO) {
    delay(500)
    "dados carregados"
}

fun main() = runBlocking {
    val data = loadData()
    println(data)
}`,
    slot: 'adv-async',
  },
  {
    id: 'kotlin-041',
    concept: { pt: 'Pattern Matching com When', en: 'Pattern Matching with When' },
    difficulty: 'hard',
    prompt: {
      pt: 'When em Kotlin pode fazer pattern matching avançado com ranges, tipos e condições. Use vários estilos de branch numa mesma expressão when.',
      en: 'When in Kotlin can do advanced pattern matching with ranges, types and conditions. Use various branch styles in a single when expression.',
    },
    code: `fun classify(value: Any): String = when (value) {
    is String -> "texto: $value"
    in 1..10 -> "número pequeno"
    is Int -> "inteiro: $value"
    else -> "desconhecido"
}`,
    slot: 'adv-pattern',
  },
  {
    id: 'kotlin-042',
    concept: { pt: 'Delegação de Propriedade', en: 'Property Delegation' },
    difficulty: 'hard',
    prompt: {
      pt: 'Delegação com "by" permite reutilizar lógica de propriedade. Use lazy pra inicialização preguiçosa e observable pra reagir a mudanças.',
      en: 'Delegation with "by" allows property logic reuse. Use lazy for lazy initialization and observable to react to changes.',
    },
    code: `import kotlin.properties.Delegates

val config: String by lazy {
    println("carregando...")
    "valor pesado"
}

var name: String by Delegates.observable("inicial") { _, old, new ->
    println("$old -> $new")
}`,
    slot: 'adv-macro',
  },
  // ── Algoritmos & Estruturas de Dados ──────────────────────
  {
    id: 'kotlin-043',
    concept: { pt: 'Notação Big O', en: 'Big O Notation' },
    difficulty: 'easy',
    prompt: { pt: 'Big O descreve a complexidade de tempo. Demonstre O(1), O(n) e O(n²) em Kotlin.', en: 'Big O describes time complexity. Demonstrate O(1), O(n), and O(n²) in Kotlin.' },
    code: `// O(1) -- acesso direto
val first = arr[0]

// O(n) -- percorrer tudo
fun contains(arr: List<Int>, target: Int): Boolean =
    arr.any { it == target }

// O(n²) -- loop aninhado
fun hasDuplicate(arr: List<Int>): Boolean {
    for (i in arr.indices)
        for (j in i + 1 until arr.size)
            if (arr[i] == arr[j]) return true
    return false
}`,
  },
  {
    id: 'kotlin-044',
    concept: { pt: 'Busca Binária', en: 'Binary Search' },
    difficulty: 'medium',
    prompt: { pt: 'Busca binária divide a lista ordenada ao meio -- O(log n).', en: 'Binary search halves a sorted list -- O(log n).' },
    code: `fun binarySearch(arr: List<Int>, target: Int): Int {
    var left = 0
    var right = arr.size - 1
    while (left <= right) {
        val mid = left + (right - left) / 2
        when {
            arr[mid] == target -> return mid
            arr[mid] < target -> left = mid + 1
            else -> right = mid - 1
        }
    }
    return -1
}`,
  },
  {
    id: 'kotlin-045',
    concept: { pt: 'Bubble Sort', en: 'Bubble Sort' },
    difficulty: 'easy',
    prompt: { pt: 'Bubble Sort compara pares adjacentes e troca -- O(n²).', en: 'Bubble Sort compares adjacent pairs and swaps -- O(n²).' },
    code: `fun bubbleSort(arr: MutableList<Int>): List<Int> {
    val a = arr.toMutableList()
    for (i in 0 until a.size - 1) {
        var swapped = false
        for (j in 0 until a.size - 1 - i) {
            if (a[j] > a[j + 1]) {
                a[j] = a[j + 1].also { a[j + 1] = a[j] }
                swapped = true
            }
        }
        if (!swapped) break
    }
    return a
}`,
  },
  {
    id: 'kotlin-046',
    concept: { pt: 'Merge Sort', en: 'Merge Sort' },
    difficulty: 'hard',
    prompt: { pt: 'Merge Sort divide recursivamente e intercala -- O(n log n).', en: 'Merge Sort recursively splits and merges -- O(n log n).' },
    code: `fun mergeSort(arr: List<Int>): List<Int> {
    if (arr.size <= 1) return arr
    val mid = arr.size / 2
    val left = mergeSort(arr.subList(0, mid))
    val right = mergeSort(arr.subList(mid, arr.size))
    return merge(left, right)
}

fun merge(a: List<Int>, b: List<Int>): List<Int> {
    val result = mutableListOf<Int>()
    var i = 0; var j = 0
    while (i < a.size && j < b.size)
        if (a[i] <= b[j]) result.add(a[i++]) else result.add(b[j++])
    result.addAll(a.subList(i, a.size))
    result.addAll(b.subList(j, b.size))
    return result
}`,
  },
  {
    id: 'kotlin-047',
    concept: { pt: 'Quick Sort', en: 'Quick Sort' },
    difficulty: 'hard',
    prompt: { pt: 'Quick Sort particiona em torno de um pivô -- O(n log n) médio.', en: 'Quick Sort partitions around a pivot -- O(n log n) average.' },
    code: `fun quickSort(arr: List<Int>): List<Int> {
    if (arr.size <= 1) return arr
    val pivot = arr.last()
    val rest = arr.dropLast(1)
    val left = rest.filter { it < pivot }
    val right = rest.filter { it >= pivot }
    return quickSort(left) + pivot + quickSort(right)
}`,
  },
  {
    id: 'kotlin-048',
    concept: { pt: 'Pilha (Stack)', en: 'Stack' },
    difficulty: 'easy',
    prompt: { pt: 'ArrayDeque funciona como pilha em Kotlin com addLast, removeLast e last.', en: 'ArrayDeque works as a stack in Kotlin with addLast, removeLast, and last.' },
    code: `val stack = ArrayDeque<Int>()
stack.addLast(1)
stack.addLast(2)
stack.addLast(3)

val top = stack.last()
val removed = stack.removeLast()
val empty = stack.isEmpty()`,
  },
  {
    id: 'kotlin-049',
    concept: { pt: 'Fila (Queue)', en: 'Queue' },
    difficulty: 'easy',
    prompt: { pt: 'ArrayDeque funciona como fila com addLast e removeFirst.', en: 'ArrayDeque works as a queue with addLast and removeFirst.' },
    code: `val queue = ArrayDeque<String>()
queue.addLast("A")
queue.addLast("B")
queue.addLast("C")

val front = queue.first()
val removed = queue.removeFirst()
val size = queue.size`,
  },
  {
    id: 'kotlin-050',
    concept: { pt: 'Lista Ligada', en: 'Linked List' },
    difficulty: 'medium',
    prompt: { pt: 'Uma lista ligada usa data class com referência ao próximo nó.', en: 'A linked list uses data class with reference to next node.' },
    code: `data class Node(val value: Int, var next: Node? = null)

class LinkedList {
    var head: Node? = null

    fun prepend(value: Int) {
        head = Node(value, head)
    }

    fun toList(): List<Int> {
        val result = mutableListOf<Int>()
        var curr = head
        while (curr != null) { result.add(curr.value); curr = curr.next }
        return result
    }
}`,
  },
  {
    id: 'kotlin-051',
    concept: { pt: 'Árvore Binária de Busca', en: 'Binary Search Tree' },
    difficulty: 'medium',
    prompt: { pt: 'Uma BST mantém menores à esquerda e maiores à direita.', en: 'A BST keeps smaller left and larger right.' },
    code: `class TreeNode(val value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun insert(node: TreeNode?, value: Int): TreeNode {
    if (node == null) return TreeNode(value)
    if (value < node.value) node.left = insert(node.left, value)
    else node.right = insert(node.right, value)
    return node
}

fun search(node: TreeNode?, value: Int): Boolean {
    if (node == null) return false
    if (value == node.value) return true
    return if (value < node.value) search(node.left, value) else search(node.right, value)
}`,
  },
  {
    id: 'kotlin-052',
    concept: { pt: 'BFS (Busca em Largura)', en: 'BFS (Breadth-First Search)' },
    difficulty: 'hard',
    prompt: { pt: 'BFS explora nível por nível com ArrayDeque e mutableSetOf.', en: 'BFS explores level by level with ArrayDeque and mutableSetOf.' },
    code: `fun bfs(graph: Map<String, List<String>>, start: String): List<String> {
    val visited = mutableSetOf(start)
    val queue = ArrayDeque<String>()
    queue.addLast(start)
    val result = mutableListOf<String>()
    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        result.add(node)
        for (nb in graph[node].orEmpty()) {
            if (visited.add(nb)) queue.addLast(nb)
        }
    }
    return result
}`,
  },
  {
    id: 'kotlin-053',
    concept: { pt: 'DFS (Busca em Profundidade)', en: 'DFS (Depth-First Search)' },
    difficulty: 'hard',
    prompt: { pt: 'DFS explora o mais fundo possível com pilha.', en: 'DFS explores as deep as possible with a stack.' },
    code: `fun dfs(graph: Map<String, List<String>>, start: String): List<String> {
    val visited = mutableSetOf<String>()
    val stack = ArrayDeque<String>()
    stack.addLast(start)
    val result = mutableListOf<String>()
    while (stack.isNotEmpty()) {
        val node = stack.removeLast()
        if (!visited.add(node)) continue
        result.add(node)
        for (nb in graph[node].orEmpty().reversed()) {
            if (nb !in visited) stack.addLast(nb)
        }
    }
    return result
}`,
  },
  {
    id: 'kotlin-054',
    concept: { pt: 'Hash Map', en: 'Hash Map' },
    difficulty: 'medium',
    prompt: { pt: 'mutableMapOf é o hash map do Kotlin com acesso O(1) médio.', en: 'mutableMapOf is Kotlin\'s hash map with O(1) average access.' },
    code: `val scores = mutableMapOf(
    "Alice" to 95,
    "Bob" to 87,
    "Carol" to 92,
)

val alice = scores["Alice"]
val hasBob = "Bob" in scores
val dave = scores.getOrDefault("Dave", 0)

for ((name, score) in scores) {
    println("$name: $score")
}`,
  },
]
