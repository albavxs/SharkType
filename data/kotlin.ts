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
]
