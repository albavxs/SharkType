import { Snippet } from '@/lib/types'

export const kotlinSnippets: Snippet[] = [
  {
    id: 'kotlin-001',
    concept: { pt: 'Data Class', en: 'Data Class' },
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
  },
  {
    id: 'kotlin-003',
    concept: { pt: 'String Template', en: 'String Template' },
    difficulty: 'easy',
    prompt: {
      pt: 'Kotlin tem dois estilos de template string: $variável pra valores simples e ${expressão} pra expressões. Use os dois pra montar duas mensagens sobre linguagem e versão, uma delas com chamada de método.',
      en: 'Kotlin has two string template styles: $variable for simple values and ${expression} for expressions. Use both to build two messages about language and version, one with a method call.',
    },
    code: `val language = "Kotlin"
val version = 2.0
println("$language $version foi lançado!")
println("\${language.uppercase()} é incrível.")`,
  },
  {
    id: 'kotlin-004',
    concept: { pt: 'Null Safety', en: 'Null Safety' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Kotlin, null safety é garantido pelo sistema de tipos. Use safe-call (?.) pra acessar .length e .uppercase() numa String? sem NullPointerException, e o operador Elvis (?:) pra dar valores padrão.',
      en: 'In Kotlin, null safety is enforced by the type system. Use the safe-call operator (?.) to access .length and .uppercase() on a String? without NullPointerException, and the Elvis operator (?:) to provide default values.',
    },
    code: `val name: String? = null
val length = name?.length ?: 0
val upper = name?.uppercase() ?: "N/A"
println("Length: $length, Upper: $upper")`,
  },
  {
    id: 'kotlin-005',
    concept: { pt: 'Extension Function', en: 'Extension Function' },
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
    concept: { pt: 'Sealed Class', en: 'Sealed Class' },
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
  },
  {
    id: 'kotlin-007',
    concept: { pt: 'Lambda e Higher-Order', en: 'Lambda and Higher-Order' },
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
  },
  {
    id: 'kotlin-008',
    concept: { pt: 'Companion Object', en: 'Companion Object' },
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
  },
  {
    id: 'kotlin-009',
    concept: { pt: 'Coroutine', en: 'Coroutine' },
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
  },
  {
    id: 'kotlin-010',
    concept: { pt: 'Generics e Variance', en: 'Generics and Variance' },
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
  },
]
