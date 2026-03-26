import { Snippet } from '@/lib/types'

export const kotlinSnippets: Snippet[] = [
  {
    id: 'kotlin-001',
    concept: 'Data Class',
    difficulty: 'easy',
    prompt: 'Data classes geram automaticamente equals, hashCode, toString e copy. Defina User com tres propriedades val (imutaveis): name, age e email. Em seguida, instancie alice com os valores de exemplo.',
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
    prompt: 'A expressao when substitui o switch com muito mais poder: pode verificar tipos, valores e expressoes. Implemente describe usando when com "is Int" e "is String" para verificar o tipo de x, trate o caso null e use else como fallback.',
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
    prompt: 'Kotlin tem dois estilos de template string: $variavel para valores simples e ${expressao} para expressoes. Use ambos para construir duas mensagens sobre linguagem e versao, uma com chamada de metodo.',
    code: `val language = "Kotlin"
val version = 2.0
println("$language $version foi lançado!")
println("\${language.uppercase()} é incrível.")`,
  },
  {
    id: 'kotlin-004',
    concept: 'Null Safety',
    difficulty: 'easy',
    prompt: 'Em Kotlin, null safety e garantido pelo sistema de tipos. Use o operador safe-call (?.) para acessar .length e .uppercase() em uma String? sem NullPointerException, e o operador Elvis (?:) para fornecer valores padrao.',
    code: `val name: String? = null
val length = name?.length ?: 0
val upper = name?.uppercase() ?: "N/A"
println("Length: $length, Upper: $upper")`,
  },
  {
    id: 'kotlin-005',
    concept: 'Extension Function',
    difficulty: 'medium',
    prompt: 'Extension functions adicionam metodos a qualquer classe sem heranca ou modificar o codigo original. Adicione isPalindrome() a String (que limpa e compara com reversed) e secondOrNull() a List<Int> (que usa getOrNull(1)).',
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
    prompt: 'Sealed classes restringem as subclasses possiveis, criando um tipo fechado ideal para modelar estados. Defina Result<T> com tres subclasses: Success (com data), Error (com message) e o singleton Loading.',
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
    prompt: 'Funcoes de ordem superior recebem outras funcoes como parametro. Implemente customFilter como extension function de List<T> que aceita um predicado lambda (T) -> Boolean, itera a lista e retorna uma nova com os elementos que passam.',
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
    prompt: 'Companion objects sao o equivalente de membros estaticos em Kotlin. Implemente o padrao Singleton em ApiClient: constructor privado, instancia nullable no companion object e getInstance que cria a instancia lazily com also.',
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
    prompt: 'Coroutines sao o mecanismo nativo de concorrencia do Kotlin. Use runBlocking como raiz, async para lancar cada busca em paralelo e awaitAll() para aguardar todos os resultados antes de imprimir.',
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
    prompt: '"out T" torna um generico covariante: um Repository<User> pode ser tratado como Repository<Any>. Defina a interface Repository<out T> com dois metodos e implemente UserRepository mantendo uma lista mutavel interna.',
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
