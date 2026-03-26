import { Snippet } from '@/lib/types'

export const cppSnippets: Snippet[] = [
  {
    id: 'cpp-001',
    concept: 'Template Function',
    difficulty: 'medium',
    prompt: 'Templates permitem escrever codigo generico que funciona com qualquer tipo em C++. Escreva max<T> com template<typename T>: receba dois parametros do mesmo tipo e retorne o maior usando o operador > com operador ternario.',
    code: `template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
  },
  {
    id: 'cpp-002',
    concept: 'Smart Pointer',
    difficulty: 'medium',
    prompt: 'Smart pointers gerenciam o ciclo de vida de objetos automaticamente, eliminando raw pointers e memory leaks. Use make_unique para propriedade exclusiva (destruido ao sair do escopo) e make_shared para propriedade compartilhada por referencia.',
    code: `auto ptr = std::make_unique<User>("Alice", 30);
auto shared = std::make_shared<User>("Bob", 25);`,
  },
  {
    id: 'cpp-003',
    concept: 'Lambda',
    difficulty: 'medium',
    prompt: 'Lambdas em C++ capturam o ambiente e podem ser passadas como callbacks. Crie um comparador lambda com "const auto&" para aceitar qualquer tipo e use-o como terceiro argumento de std::sort para ordenar usuarios por nome.',
    code: `auto compare = [](const auto& a, const auto& b) {
    return a.name < b.name;
};
std::sort(users.begin(), users.end(), compare);`,
  },
  {
    id: 'cpp-004',
    concept: 'Range-Based For',
    difficulty: 'easy',
    prompt: 'Range-based for (C++11) simplifica a iteracao sobre qualquer container. Use "for (const auto& n : nums)" para iterar com seguranca sobre um vector<int> sem indices manuais, e imprima cada valor com cout.',
    code: `std::vector<int> nums = {1, 2, 3, 4, 5};
for (const auto& n : nums) {
    std::cout << n << " ";
}`,
  },
  {
    id: 'cpp-005',
    concept: 'Auto Type',
    difficulty: 'easy',
    prompt: '"auto" infere o tipo da variavel em tempo de compilacao. Use-o para o iterador retornado por .find(), depois acesse o resultado com structured binding (auto& [k, v]) para desestruturar o par sem usar .first e .second.',
    code: `auto it = container.find(key);
if (it != container.end()) {
    auto& [k, v] = *it;
    std::cout << k << ": " << v;
}`,
  },
  {
    id: 'cpp-006',
    concept: 'Struct with Methods',
    difficulty: 'easy',
    prompt: 'Structs em C++ moderno podem ter metodos membros como classes. Defina Point com campos double x e y, e adicione o metodo distance() marcado como "const" (nao modifica o objeto) que calcula a norma com std::sqrt.',
    code: `struct Point {
    double x, y;

    double distance() const {
        return std::sqrt(x * x + y * y);
    }
};`,
  },
  {
    id: 'cpp-007',
    concept: 'Namespace',
    difficulty: 'easy',
    prompt: 'Namespaces agrupam declaracoes para evitar colisoes de nomes entre bibliotecas. Crie o namespace "math" contendo PI como constexpr double (avaliado em compile-time) e a funcao area que calcula a area de um circulo.',
    code: `namespace math {
    constexpr double PI = 3.14159265358979;

    double area(double radius) {
        return PI * radius * radius;
    }
}`,
  },
  {
    id: 'cpp-008',
    concept: 'Vector Operations',
    difficulty: 'medium',
    prompt: 'std::vector e o array dinamico da STL. Adicione um elemento com push_back, ordene com std::sort e remova duplicatas com o idioma erase-unique: primeiro std::unique (move duplicatas para o final) e depois erase.',
    code: `std::vector<int> v = {3, 1, 4, 1, 5};
v.push_back(9);
std::sort(v.begin(), v.end());
v.erase(std::unique(v.begin(), v.end()), v.end());`,
  },
  {
    id: 'cpp-009',
    concept: 'Structured Bindings',
    difficulty: 'medium',
    prompt: 'Structured bindings (C++17) desestruturao pares e tuplas diretamente. Ao iterar um std::map, use "const auto& [name, score]" para acessar chave e valor sem precisar de .first/.second — mais legivel e menos propenso a erro.',
    code: `std::map<std::string, int> scores = {{"Alice", 95}};
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << "\\n";
}`,
  },
  {
    id: 'cpp-010',
    concept: 'Optional',
    difficulty: 'hard',
    prompt: 'std::optional<T> representa um valor que pode ou nao estar presente, sem usar ponteiros nulos. Implemente find(id): use um if com inicializador (if (auto it = db.find(id); it != db.end())) e retorne nullopt quando nao encontrar.',
    code: `std::optional<User> find(int id) {
    if (auto it = db.find(id); it != db.end()) {
        return it->second;
    }
    return std::nullopt;
}`,
  },
]
