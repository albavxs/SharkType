import { Snippet } from '@/lib/types'

export const javaSnippets: Snippet[] = [
  {
    id: 'java-001',
    concept: 'Class',
    difficulty: 'easy',
    prompt: 'Classes em Java encapsulam estado com campos privados e expoe comportamento com metodos publicos. Defina User com dois campos private (name e age) e um constructor publico que os inicializa usando "this.campo = parametro".',
    code: `public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}`,
  },
  {
    id: 'java-002',
    concept: 'Interface',
    difficulty: 'easy',
    prompt: 'Interfaces Java definem contratos; metodos default fornecem implementacoes opcionais para retrocompatibilidade. Declare Printable com o metodo abstrato print() e um metodo default format() que simplesmente chama toString().',
    code: `public interface Printable {
    void print();
    default String format() {
        return toString();
    }
}`,
  },
  {
    id: 'java-003',
    concept: 'Generics',
    difficulty: 'medium',
    prompt: 'Metodos genericos em Java aceitam qualquer tipo que satisfaca a constraint. Implemente max<T extends Comparable<T>>: receba dois objetos do mesmo tipo comparavel e retorne o maior usando .compareTo() >= 0.',
    code: `public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}`,
  },
  {
    id: 'java-004',
    concept: 'Stream API',
    difficulty: 'medium',
    prompt: 'Stream API e o padrao funcional de Java para processar colecoes de forma declarativa. Filtre os usuarios com mais de 18 anos, mapeie para nomes com referencia de metodo (User::getName), ordene e colete em uma List.',
    code: `List<String> names = users.stream()
    .filter(u -> u.getAge() > 18)
    .map(User::getName)
    .sorted()
    .collect(Collectors.toList());`,
  },
  {
    id: 'java-005',
    concept: 'Lambda',
    difficulty: 'easy',
    prompt: 'Expressoes lambda substituem instancias de interfaces funcionais com uma sintaxe concisa. Crie um Comparator<User> que ordena por idade usando Integer.compare — sem precisar declarar uma classe anonima inteira.',
    code: `Comparator<User> byAge = (a, b) ->
    Integer.compare(a.getAge(), b.getAge());`,
  },
  {
    id: 'java-006',
    concept: 'Optional',
    difficulty: 'medium',
    prompt: 'Optional<T> evita NullPointerException ao representar explicitamente a ausencia de valor. Busque um usuario por id, mapeie para o nome com .map(User::getName) e forneca "Unknown" como fallback com .orElse.',
    code: `Optional<User> user = findById(id);
String name = user
    .map(User::getName)
    .orElse("Unknown");`,
  },
  {
    id: 'java-007',
    concept: 'Record',
    difficulty: 'easy',
    prompt: 'Records (Java 14+) sao classes imutaveis de dados com constructor, getters, equals e toString gerados automaticamente. Declare Point com coordenadas x e y, e adicione um metodo de instancia distance() calculando a distancia da origem.',
    code: `public record Point(double x, double y) {
    public double distance() {
        return Math.sqrt(x * x + y * y);
    }
}`,
  },
  {
    id: 'java-008',
    concept: 'Switch Expression',
    difficulty: 'medium',
    prompt: 'Switch expressions (Java 14+) retornam um valor e usam -> eliminando break e fall-through. Mapeie valores do enum "day" para strings usando a nova sintaxe, agrupando casos com virgula quando mapeiam para o mesmo resultado.',
    code: `String label = switch (day) {
    case MONDAY, FRIDAY -> "Work";
    case SATURDAY, SUNDAY -> "Rest";
    default -> "Midweek";
};`,
  },
  {
    id: 'java-009',
    concept: 'Try-With-Resources',
    difficulty: 'medium',
    prompt: 'Try-with-resources garante o fechamento automatico de qualquer Closeable ao sair do bloco. Declare o BufferedReader na clausula try(...) — ele sera fechado automaticamente, mesmo que uma excecao ocorra durante a leitura.',
    code: `try (var reader = new BufferedReader(
        new FileReader("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
}`,
  },
  {
    id: 'java-010',
    concept: 'Pattern Matching',
    difficulty: 'hard',
    prompt: 'Pattern matching com instanceof (Java 16+) verifica o tipo e faz o cast em uma unica expressao. Verifique se "obj" e uma String, atribua-o a "s" na mesma linha e combine com && para testar comprimento — sem cast separado.',
    code: `if (obj instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase());
}`,
  },
]
