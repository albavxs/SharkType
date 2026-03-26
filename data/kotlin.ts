import { Snippet } from '@/lib/types'

export const kotlinSnippets: Snippet[] = [
  {
    id: 'kotlin-001',
    concept: 'Data Class',
    difficulty: 'easy',
    prompt: 'Defina uma data class User com campos name, age e email e crie uma instancia.',
    code: `data class User(
    val name: String,
    val age: Int,
    val email: String,
)

val alice = User("Alice", 30, "alice@example.com")`,
  },
  {
    id: 'kotlin-002',
    concept: 'When Expression',
    difficulty: 'easy',
    prompt: 'Use expressao when para descrever um valor de qualquer tipo com verificacoes is Int, is String e null.',
    code: `fun describe(x: Any): String = when (x) {
    is Int    -> "integer: $x"
    is String -> "string of length \${x.length}"
    null      -> "null"
    else      -> "unknown"
}`,
  },
  {
    id: 'kotlin-003',
    concept: 'String Template',
    difficulty: 'easy',
    prompt: 'Construa mensagens usando string templates com variavel simples ($var) e expressao (${expr}).',
    code: `val language = "Kotlin"
val version = 2.0
println("$language $version foi lançado!")
println("\${language.uppercase()} é incrível.")`,
  },
  {
    id: 'kotlin-004',
    concept: 'Null Safety',
    difficulty: 'easy',
    prompt: 'Use o operador safe-call (?.) e elvis (?:) para acessar propriedades de uma variavel nullable.',
    code: `val name: String? = null
val length = name?.length ?: 0
val upper = name?.uppercase() ?: "N/A"
println("Length: $length, Upper: $upper")`,
  },
  {
    id: 'kotlin-005',
    concept: 'Extension Function',
    difficulty: 'medium',
    prompt: 'Adicione metodos a tipos existentes: isPalindrome em String e secondOrNull em List<Int>.',
    code: `fun String.isPalindrome(): Boolean {
    val clean = filter { it.isLetterOrDigit() }.lowercase()
    return clean == clean.reversed()
}

fun List<Int>.secondOrNull(): Int? = getOrNull(1)`,
  },
  {
    id: 'kotlin-006',
    concept: 'Sealed Class',
    difficulty: 'medium',
    prompt: 'Defina uma sealed class Result com variantes Success, Error e Loading para modelar estados de UI.',
    code: `sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
}`,
  },
  {
    id: 'kotlin-007',
    concept: 'Lambda e Higher-Order',
    difficulty: 'medium',
    prompt: 'Implemente customFilter como funcao de ordem superior que aceita um predicado lambda.',
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
    concept: 'Companion Object',
    difficulty: 'medium',
    prompt: 'Use companion object para implementar o padrao Singleton com construtor privado e lazy initialization.',
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
    concept: 'Coroutine',
    difficulty: 'hard',
    prompt: 'Use async/awaitAll para buscar multiplos usuarios em paralelo com coroutines Kotlin.',
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
    concept: 'Generics e Variance',
    difficulty: 'hard',
    prompt: 'Defina uma interface Repository com out-variance e implemente uma versao concreta para User.',
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
