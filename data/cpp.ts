import { Snippet } from '@/lib/types'

export const cppSnippets: Snippet[] = [
  {
    id: 'cpp-001',
    concept: { pt: 'Template Function', en: 'Template Function' },
    difficulty: 'medium',
    prompt: {
      pt: 'Templates permitem escrever código genérico que funciona com qualquer tipo em C++. Escreva max<T> com template<typename T>: receba dois parâmetros do mesmo tipo e retorne o maior usando o operador > com operador ternário.',
      en: 'Templates let you write generic code that works with any type in C++. Write max<T> with template<typename T>: take two parameters of the same type and return the larger one using the > operator with a ternary.',
    },
    code: `template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
  },
  {
    id: 'cpp-002',
    concept: { pt: 'Smart Pointer', en: 'Smart Pointer' },
    difficulty: 'medium',
    prompt: {
      pt: 'Smart pointers gerenciam o ciclo de vida de objetos automaticamente, eliminando raw pointers e memory leaks. Use make_unique para propriedade exclusiva (destruído ao sair do escopo) e make_shared para propriedade compartilhada por referência.',
      en: 'Smart pointers manage object lifetimes automatically, eliminating raw pointers and memory leaks. Use make_unique for exclusive ownership (destroyed when leaving scope) and make_shared for reference-counted shared ownership.',
    },
    code: `auto ptr = std::make_unique<User>("Alice", 30);
auto shared = std::make_shared<User>("Bob", 25);`,
  },
  {
    id: 'cpp-003',
    concept: { pt: 'Lambda', en: 'Lambda' },
    difficulty: 'medium',
    prompt: {
      pt: 'Lambdas em C++ capturam o ambiente e podem ser passadas como callbacks. Crie um comparador lambda com "const auto&" para aceitar qualquer tipo e use-o como terceiro argumento de std::sort para ordenar usuarios por nome.',
      en: 'C++ lambdas capture the surrounding environment and can be passed as callbacks. Create a comparator lambda with "const auto&" to accept any type and use it as the third argument to std::sort to sort users by name.',
    },
    code: `auto compare = [](const auto& a, const auto& b) {
    return a.name < b.name;
};
std::sort(users.begin(), users.end(), compare);`,
  },
  {
    id: 'cpp-004',
    concept: { pt: 'Range-Based For', en: 'Range-Based For' },
    difficulty: 'easy',
    prompt: {
      pt: 'Range-based for (C++11) simplifica a iteração sobre qualquer container. Use "for (const auto& n : nums)" para iterar com segurança sobre um vector<int> sem índices manuais, e imprima cada valor com cout.',
      en: 'Range-based for (C++11) simplifies iteration over any container. Use "for (const auto& n : nums)" to safely iterate over a vector<int> without manual indices, and print each value with cout.',
    },
    code: `std::vector<int> nums = {1, 2, 3, 4, 5};
for (const auto& n : nums) {
    std::cout << n << " ";
}`,
  },
  {
    id: 'cpp-005',
    concept: { pt: 'Auto Type', en: 'Auto Type' },
    difficulty: 'easy',
    prompt: {
      pt: '"auto" infere o tipo da variável em tempo de compilação. Use-o para o iterador retornado por .find(), depois acesse o resultado com structured binding (auto& [k, v]) para desestruturar o par sem usar .first e .second.',
      en: '"auto" infers the variable type at compile time. Use it for the iterator returned by .find(), then access the result with structured binding (auto& [k, v]) to destructure the pair without using .first and .second.',
    },
    code: `auto it = container.find(key);
if (it != container.end()) {
    auto& [k, v] = *it;
    std::cout << k << ": " << v;
}`,
  },
  {
    id: 'cpp-006',
    concept: { pt: 'Struct com Métodos', en: 'Struct with Methods' },
    difficulty: 'easy',
    prompt: {
      pt: 'Structs em C++ moderno podem ter métodos membros como classes. Defina Point com campos double x e y, e adicione o método distance() marcado como "const" (não modifica o objeto) que calcula a norma com std::sqrt.',
      en: 'Modern C++ structs can have member methods just like classes. Define Point with double x and y fields, and add the distance() method marked as "const" (doesn\'t modify the object) that computes the norm with std::sqrt.',
    },
    code: `struct Point {
    double x, y;

    double distance() const {
        return std::sqrt(x * x + y * y);
    }
};`,
  },
  {
    id: 'cpp-007',
    concept: { pt: 'Namespace', en: 'Namespace' },
    difficulty: 'easy',
    prompt: {
      pt: 'Namespaces agrupam declarações para evitar colisões de nomes entre bibliotecas. Crie o namespace "math" contendo PI como constexpr double (avaliado em compile-time) e a função area que calcula a área de um círculo.',
      en: 'Namespaces group declarations to avoid name collisions between libraries. Create the "math" namespace containing PI as a constexpr double (evaluated at compile-time) and an area function that calculates a circle\'s area.',
    },
    code: `namespace math {
    constexpr double PI = 3.14159265358979;

    double area(double radius) {
        return PI * radius * radius;
    }
}`,
  },
  {
    id: 'cpp-008',
    concept: { pt: 'Operações com Vector', en: 'Vector Operations' },
    difficulty: 'medium',
    prompt: {
      pt: 'std::vector é o array dinâmico da STL. Adicione um elemento com push_back, ordene com std::sort e remova duplicatas com o idioma erase-unique: primeiro std::unique (move duplicatas para o final) e depois erase.',
      en: 'std::vector is the STL\'s dynamic array. Add an element with push_back, sort with std::sort and remove duplicates with the erase-unique idiom: first std::unique (moves duplicates to the end) then erase.',
    },
    code: `std::vector<int> v = {3, 1, 4, 1, 5};
v.push_back(9);
std::sort(v.begin(), v.end());
v.erase(std::unique(v.begin(), v.end()), v.end());`,
  },
  {
    id: 'cpp-009',
    concept: { pt: 'Structured Bindings', en: 'Structured Bindings' },
    difficulty: 'medium',
    prompt: {
      pt: 'Structured bindings (C++17) desestruturão pares e tuplas diretamente. Ao iterar um std::map, use "const auto& [name, score]" para acessar chave e valor sem precisar de .first/.second — mais legível e menos propenso a erro.',
      en: 'Structured bindings (C++17) destructure pairs and tuples directly. When iterating a std::map, use "const auto& [name, score]" to access key and value without .first/.second — more readable and less error-prone.',
    },
    code: `std::map<std::string, int> scores = {{"Alice", 95}};
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << "\\n";
}`,
  },
  {
    id: 'cpp-010',
    concept: { pt: 'Optional', en: 'Optional' },
    difficulty: 'hard',
    prompt: {
      pt: 'std::optional<T> representa um valor que pode ou não estar presente, sem usar ponteiros nulos. Implemente find(id): use um if com inicializador (if (auto it = db.find(id); it != db.end())) e retorne nullopt quando não encontrar.',
      en: 'std::optional<T> represents a value that may or may not be present, without using null pointers. Implement find(id): use an if with initializer (if (auto it = db.find(id); it != db.end())) and return nullopt when not found.',
    },
    code: `std::optional<User> find(int id) {
    if (auto it = db.find(id); it != db.end()) {
        return it->second;
    }
    return std::nullopt;
}`,
  },
]
