import { Snippet } from '@/lib/types'

export const javaSnippets: Snippet[] = [
  {
    id: 'java-001',
    concept: { pt: 'Classe', en: 'Class' },
    difficulty: 'easy',
    prompt: {
      pt: 'Classe em Java encapsula estado com campos privados e expoe comportamento com métodos publicos. Defina User com dois campos private (name e age) e um constructor publico que inicializa eles com "this.campo = parâmetro".',
      en: 'Classes in Java encapsulate state with private fields and expose behavior through public methods. Define User with two private fields (name and age) and a public constructor that initializes them using "this.field = parameter".',
    },
    code: `public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}`,
    slot: 'class-basic',
  },
  {
    id: 'java-002',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interface em Java define um contrato; métodos default oferecem implementacao opcional pra manter retrocompatibilidade. Declare Printable com o método abstrato print() e um método default format() que so chama toString().',
      en: 'Java interfaces define contracts; default methods provide optional implementations for backward compatibility. Declare Printable with the abstract method print() and a default format() method that simply calls toString().',
    },
    code: `public interface Printable {
    void print();
    default String format() {
        return toString();
    }
}`,
    slot: 'obj-interface',
  },
  {
    id: 'java-003',
    concept: { pt: 'Genéricos', en: 'Generics' },
    difficulty: 'medium',
    prompt: {
      pt: 'Método genérico em Java aceita qualquer tipo que bata com a constraint. Implemente max<T extends Comparable<T>>: receba dois objetos do mesmo tipo comparavel e retorne o maior usando .compareTo() >= 0.',
      en: 'Generic methods in Java accept any type that satisfies the constraint. Implement max<T extends Comparable<T>>: take two objects of the same comparable type and return the greater one using .compareTo() >= 0.',
    },
    code: `public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}`,
    slot: 'type-generic',
  },
  {
    id: 'java-004',
    concept: { pt: 'API de Fluxo', en: 'Stream API' },
    difficulty: 'medium',
    prompt: {
      pt: 'Stream API e o jeito funcional do Java de processar colecoes de forma declarativa. Filtre os usuarios maiores de 18, mapeie pra nome com method reference (User::getName), ordene e colete numa List.',
      en: 'Stream API is Java\'s functional pattern for processing collections declaratively. Filter users over 18, map to names with a method reference (User::getName), sort, and collect into a List.',
    },
    code: `List<String> names = users.stream()
    .filter(u -> u.getAge() > 18)
    .map(User::getName)
    .sorted()
    .collect(Collectors.toList());`,
    slot: 'loop-filter',
  },
  {
    id: 'java-005',
    concept: { pt: 'Lambda', en: 'Lambda' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lambda substitui instancia de interface funcional com uma sintaxe enxuta. Crie um Comparator<User> que ordena por idade usando Integer.compare -- sem precisar criar uma classe anônima inteira.',
      en: 'Lambda expressions replace functional interface instances with concise syntax. Create a Comparator<User> that sorts by age using Integer.compare -- no need to declare an entire anonymous class.',
    },
    code: `Comparator<User> byAge = (a, b) ->
    Integer.compare(a.getAge(), b.getAge());`,
    slot: 'fn-arrow',
  },
  {
    id: 'java-006',
    concept: { pt: 'Opcional', en: 'Optional' },
    difficulty: 'medium',
    prompt: {
      pt: 'Optional<T> evita NullPointerException representando a ausencia de valor de forma explicita. Busque um usuario por id, mapeie pro nome com .map(User::getName) e de "Unknown" como fallback com .orElse.',
      en: 'Optional<T> prevents NullPointerException by explicitly representing the absence of a value. Look up a user by id, map to the name with .map(User::getName), and provide "Unknown" as a fallback with .orElse.',
    },
    code: `Optional<User> user = findById(id);
String name = user
    .map(User::getName)
    .orElse("Unknown");`,
    slot: 'err-result',
  },
]
