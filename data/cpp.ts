import { Snippet } from '@/lib/types'

export const cppSnippets: Snippet[] = [
  {
    id: 'cpp-001',
    concept: { pt: 'Funcao Template', en: 'Template Function' },
    difficulty: 'medium',
    prompt: {
      pt: 'Templates sao o jeito do C++ de escrever codigo generico pra qualquer tipo. Monte max<T> com template<typename T>: receba dois parametros do mesmo tipo e devolva o maior usando o operador > com ternario.',
      en: 'Templates let you write generic code that works with any type in C++. Write max<T> with template<typename T>: take two parameters of the same type and return the larger one using the > operator with a ternary.',
    },
    code: `template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
    slot: 'type-generic',
  },
  {
    id: 'cpp-002',
    concept: { pt: 'Ponteiro Inteligente', en: 'Smart Pointer' },
    difficulty: 'medium',
    prompt: {
      pt: 'Smart pointers cuidam da vida dos objetos automaticamente, sem precisar de raw pointers nem se preocupar com memory leaks. Use make_unique pra ownership exclusivo (destruido ao sair do escopo) e make_shared pra ownership compartilhado por referencia.',
      en: 'Smart pointers manage object lifetimes automatically, eliminating raw pointers and memory leaks. Use make_unique for exclusive ownership (destroyed when leaving scope) and make_shared for reference-counted shared ownership.',
    },
    code: `auto ptr = std::make_unique<User>("Alice", 30);
auto shared = std::make_shared<User>("Bob", 25);`,
    slot: 'adv-pattern',
  },
  {
    id: 'cpp-003',
    concept: { pt: 'Lambda', en: 'Lambda' },
    difficulty: 'medium',
    prompt: {
      pt: 'Lambdas em C++ capturam variaveis do escopo ao redor e servem como callbacks. Crie um comparador lambda com "const auto&" pra aceitar qualquer tipo e passe como terceiro argumento de std::sort pra ordenar usuarios por nome.',
      en: 'C++ lambdas capture the surrounding environment and can be passed as callbacks. Create a comparator lambda with "const auto&" to accept any type and use it as the third argument to std::sort to sort users by name.',
    },
    code: `auto compare = [](const auto& a, const auto& b) {
    return a.name < b.name;
};
std::sort(users.begin(), users.end(), compare);`,
    slot: 'fn-arrow',
  },
  {
    id: 'cpp-004',
    concept: { pt: 'For Baseado em Intervalo', en: 'Range-Based For' },
    difficulty: 'easy',
    prompt: {
      pt: 'Range-based for (C++11) deixa a iteracao em qualquer container bem mais limpa. Use "for (const auto& n : nums)" pra percorrer um vector<int> sem ficar mexendo com indice, e imprima cada valor com cout.',
      en: 'Range-based for (C++11) simplifies iteration over any container. Use "for (const auto& n : nums)" to safely iterate over a vector<int> without manual indices, and print each value with cout.',
    },
    code: `std::vector<int> nums = {1, 2, 3, 4, 5};
for (const auto& n : nums) {
    std::cout << n << " ";
}`,
    slot: 'loop-foreach',
  },
  {
    id: 'cpp-005',
    concept: { pt: 'Tipo Auto', en: 'Auto Type' },
    difficulty: 'easy',
    prompt: {
      pt: '"auto" deixa o compilador inferir o tipo da variavel pra voce. Use pra pegar o iterador que .find() retorna, depois acesse com structured binding (auto& [k, v]) pra desestruturar o par sem precisar de .first e .second.',
      en: '"auto" infers the variable type at compile time. Use it for the iterator returned by .find(), then access the result with structured binding (auto& [k, v]) to destructure the pair without using .first and .second.',
    },
    code: `auto it = container.find(key);
if (it != container.end()) {
    auto& [k, v] = *it;
    std::cout << k << ": " << v;
}`,
    slot: 'var-destructure',
  },
  {
    id: 'cpp-006',
    concept: { pt: 'Struct com Metodos', en: 'Struct with Methods' },
    difficulty: 'easy',
    prompt: {
      pt: 'No C++ moderno, structs podem ter metodos igualzinho a classes. Defina Point com campos double x e y, e crie o metodo distance() marcado como "const" (nao altera o objeto) que calcula a norma com std::sqrt.',
      en: 'Modern C++ structs can have member methods just like classes. Define Point with double x and y fields, and add the distance() method marked as "const" (doesn\'t modify the object) that computes the norm with std::sqrt.',
    },
    code: `struct Point {
    double x, y;

    double distance() const {
        return std::sqrt(x * x + y * y);
    }
};`,
    slot: 'obj-methods',
  },
  {
    id: 'cpp-007',
    concept: { pt: 'Espaco de Nomes', en: 'Namespace' },
    difficulty: 'easy',
    prompt: {
      pt: 'Namespaces servem pra organizar declaracoes e evitar conflito de nomes entre libs. Crie o namespace "math" com PI como constexpr double (resolvido em compile-time) e uma funcao area que calcula a area de um circulo.',
      en: 'Namespaces group declarations to avoid name collisions between libraries. Create the "math" namespace containing PI as a constexpr double (evaluated at compile-time) and an area function that calculates a circle\'s area.',
    },
    code: `namespace math {
    constexpr double PI = 3.14159265358979;

    double area(double radius) {
        return PI * radius * radius;
    }
}`,
    slot: 'var-const',
  },
  {
    id: 'cpp-008',
    concept: { pt: 'Operacoes com Vector', en: 'Vector Operations' },
    difficulty: 'medium',
    prompt: {
      pt: 'std::vector e o array dinamico da STL. Adicione um elemento com push_back, ordene com std::sort e tire as duplicatas com o idioma erase-unique: primeiro std::unique (joga duplicatas pro final) e depois erase.',
      en: 'std::vector is the STL\'s dynamic array. Add an element with push_back, sort with std::sort and remove duplicates with the erase-unique idiom: first std::unique (moves duplicates to the end) then erase.',
    },
    code: `std::vector<int> v = {3, 1, 4, 1, 5};
v.push_back(9);
std::sort(v.begin(), v.end());
v.erase(std::unique(v.begin(), v.end()), v.end());`,
    slot: 'var-array',
  },
  {
    id: 'cpp-009',
    concept: { pt: 'Vinculos Estruturados', en: 'Structured Bindings' },
    difficulty: 'medium',
    prompt: {
      pt: 'Structured bindings (C++17) desestruturaram pares e tuplas direto. Quando for iterar um std::map, use "const auto& [name, score]" pra pegar chave e valor sem .first/.second -- fica muito mais legivel e menos propenso a erro.',
      en: 'Structured bindings (C++17) destructure pairs and tuples directly. When iterating a std::map, use "const auto& [name, score]" to access key and value without .first/.second -- more readable and less error-prone.',
    },
    code: `std::map<std::string, int> scores = {{"Alice", 95}};
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << "\\n";
}`,
    slot: 'loop-range',
  },
  {
    id: 'cpp-010',
    concept: { pt: 'Opcional', en: 'Optional' },
    difficulty: 'hard',
    prompt: {
      pt: 'std::optional<T> representa um valor que pode ou nao existir, sem precisar de ponteiro nulo. Monte find(id): use um if com inicializador (if (auto it = db.find(id); it != db.end())) e retorne nullopt quando nao achar.',
      en: 'std::optional<T> represents a value that may or may not be present, without using null pointers. Implement find(id): use an if with initializer (if (auto it = db.find(id); it != db.end())) and return nullopt when not found.',
    },
    code: `std::optional<User> find(int id) {
    if (auto it = db.find(id); it != db.end()) {
        return it->second;
    }
    return std::nullopt;
}`,
    slot: 'err-result',
  },
  // ── If e Else ──────────────────────────────────────────────
  {
    id: 'cpp-011',
    concept: { pt: 'If Simples', en: 'Basic If' },
    difficulty: 'easy',
    prompt: {
      pt: 'If em C++ usa parenteses na condicao. Verifique se age e maior ou igual a 18 e imprima com std::cout.',
      en: 'If in C++ uses parentheses for the condition. Check if age is 18 or older and print with std::cout.',
    },
    code: `if (age >= 18) {
    std::cout << "You are an adult" << std::endl;
}`,
    slot: 'cond-basic-if',
  },
  {
    id: 'cpp-012',
    concept: { pt: 'If-Else', en: 'If-Else' },
    difficulty: 'easy',
    prompt: {
      pt: 'If-else em C++ permite dois caminhos de execucao. Classifique score como "Pass" ou "Fail" usando std::string.',
      en: 'If-else in C++ allows two execution paths. Classify score as "Pass" or "Fail" using std::string.',
    },
    code: `std::string result;
if (score >= 70) {
    result = "Pass";
} else {
    result = "Fail";
}`,
    slot: 'cond-if-else',
  },
  {
    id: 'cpp-013',
    concept: { pt: 'Operador Ternario', en: 'Ternary Operator' },
    difficulty: 'easy',
    prompt: {
      pt: 'O operador ternario em C++ condensa if-else em uma expressao. Use pra classificar idade em "adult" ou "minor".',
      en: 'The ternary operator in C++ condenses if-else into an expression. Use it to classify age as "adult" or "minor".',
    },
    code: `std::string status = (age >= 18) ? "adult" : "minor";`,
    slot: 'cond-ternary',
  },
  {
    id: 'cpp-014',
    concept: { pt: 'Switch', en: 'Switch' },
    difficulty: 'easy',
    prompt: {
      pt: 'Switch em C++ compara uma expressao inteira ou enum contra cases. Use pra mapear um codigo numerico a uma mensagem de erro.',
      en: 'Switch in C++ compares an integer or enum expression against cases. Use it to map a numeric code to an error message.',
    },
    code: `switch (code) {
    case 200: msg = "OK"; break;
    case 404: msg = "Not Found"; break;
    case 500: msg = "Server Error"; break;
    default:  msg = "Unknown";
}`,
    slot: 'cond-switch',
  },
  {
    id: 'cpp-015',
    concept: { pt: 'If com Inicializador', en: 'If with Initializer' },
    difficulty: 'medium',
    prompt: {
      pt: 'C++17 permite declaracao no if antes da condicao, limitando o escopo da variavel ao bloco. Use pra buscar num map e verificar se encontrou.',
      en: 'C++17 allows a declaration in if before the condition, limiting the variable\'s scope to the block. Use it to search a map and check if found.',
    },
    code: `if (auto it = cache.find(key); it != cache.end()) {
    return it->second;
} else {
    return compute(key);
}`,
    slot: 'cond-guard',
  },
  // ── Variaveis ──────────────────────────────────────────────
  {
    id: 'cpp-016',
    concept: { pt: 'Declaracao de Variavel', en: 'Variable Declaration' },
    difficulty: 'easy',
    prompt: {
      pt: 'C++ oferece varios jeitos de declarar variaveis: tipo explicito, auto, e inicializacao uniforme com {}. Declare uma string, um int e use auto.',
      en: 'C++ offers several ways to declare variables: explicit type, auto, and uniform initialization with {}. Declare a string, an int, and use auto.',
    },
    code: `std::string name = "Alice";
int age{25};
auto score = 95.5;`,
    slot: 'var-declare',
  },
  {
    id: 'cpp-017',
    concept: { pt: 'Tipos Basicos', en: 'Basic Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'C++ tem tipos primitivos e tipos da STL. Declare variaveis de varios tipos incluindo string, int, double e bool.',
      en: 'C++ has primitive types and STL types. Declare variables of various types including string, int, double, and bool.',
    },
    code: `int count = 42;
double price = 9.99;
bool active = true;
std::string label = "item";`,
    slot: 'var-types',
  },
  {
    id: 'cpp-018',
    concept: { pt: 'Interpolacao com Format', en: 'String Formatting' },
    difficulty: 'medium',
    prompt: {
      pt: 'C++20 introduziu std::format similar ao Python. Use pra construir uma string formatada com placeholders {}.',
      en: 'C++20 introduced std::format similar to Python. Use it to build a formatted string with {} placeholders.',
    },
    code: `std::string name = "Alice";
int age = 30;
auto msg = std::format("Hello, {}! You are {}.", name, age);`,
    slot: 'var-interpolation',
  },
  // ── Funcoes ────────────────────────────────────────────────
  {
    id: 'cpp-019',
    concept: { pt: 'Funcao Simples', en: 'Simple Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Funcoes em C++ declaram tipo de retorno, nome e parametros. Crie add que recebe dois inteiros e retorna a soma.',
      en: 'Functions in C++ declare return type, name, and parameters. Create add that takes two ints and returns the sum.',
    },
    code: `int add(int a, int b) {
    return a + b;
}`,
    slot: 'fn-basic',
  },
  {
    id: 'cpp-020',
    concept: { pt: 'Callback com std::function', en: 'Callback with std::function' },
    difficulty: 'medium',
    prompt: {
      pt: 'std::function permite passar callbacks tipados em C++. Crie uma funcao que aceita um callback e o executa com um valor.',
      en: 'std::function allows passing typed callbacks in C++. Create a function that accepts a callback and executes it with a value.',
    },
    code: `void process(int value, std::function<void(int)> callback) {
    callback(value * 2);
}

process(5, [](int result) {
    std::cout << "Result: " << result << std::endl;
});`,
    slot: 'fn-callback',
  },
  {
    id: 'cpp-021',
    concept: { pt: 'Closure', en: 'Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Lambdas em C++ capturam variaveis do escopo externo com [&] ou [=]. Crie um contador com captura por referencia que incrementa a cada chamada.',
      en: 'C++ lambdas capture outer scope variables with [&] or [=]. Create a counter with reference capture that increments on each call.',
    },
    code: `int count = 0;
auto increment = [&count]() {
    return ++count;
};
increment();
increment();`,
    slot: 'fn-closure',
  },
  {
    id: 'cpp-022',
    concept: { pt: 'Parametros Default', en: 'Default Parameters' },
    difficulty: 'easy',
    prompt: {
      pt: 'C++ suporta parametros default nativamente -- os ultimos parametros podem ter valores padrao. Crie greet com titulo default "Mr.".',
      en: 'C++ supports native default parameters -- trailing parameters can have default values. Create greet with default title "Mr.".',
    },
    code: `std::string greet(const std::string& name,
                   const std::string& title = "Mr.") {
    return "Hello, " + title + " " + name;
}`,
    slot: 'fn-default-params',
  },
  // ── Loops ──────────────────────────────────────────────────
  {
    id: 'cpp-023',
    concept: { pt: 'For Classico', en: 'Classic For' },
    difficulty: 'easy',
    prompt: {
      pt: 'O for classico em C++ tem inicializador, condicao e incremento. Use pra imprimir de 0 a 4 com std::cout.',
      en: 'The classic for loop in C++ has initializer, condition, and increment. Use it to print 0 through 4 with std::cout.',
    },
    code: `for (int i = 0; i < 5; i++) {
    std::cout << i << std::endl;
}`,
    slot: 'loop-for',
  },
  {
    id: 'cpp-024',
    concept: { pt: 'While', en: 'While' },
    difficulty: 'easy',
    prompt: {
      pt: 'While em C++ repete enquanto a condicao for verdadeira. Use pra ler linhas de std::cin ate EOF.',
      en: 'While in C++ repeats while the condition is true. Use it to read lines from std::cin until EOF.',
    },
    code: `std::string line;
while (std::getline(std::cin, line)) {
    std::cout << line << std::endl;
}`,
    slot: 'loop-while',
  },
  {
    id: 'cpp-025',
    concept: { pt: 'Filtrar com Algorithm', en: 'Filter with Algorithm' },
    difficulty: 'medium',
    prompt: {
      pt: 'C++20 introduziu std::ranges pra operacoes funcionais em containers. Use ranges::copy_if pra filtrar elementos pares de um vector.',
      en: 'C++20 introduced std::ranges for functional operations on containers. Use ranges::copy_if to filter even elements from a vector.',
    },
    code: `std::vector<int> nums = {1, 2, 3, 4, 5, 6};
std::vector<int> evens;
std::ranges::copy_if(nums, std::back_inserter(evens),
    [](int n) { return n % 2 == 0; });`,
    slot: 'loop-filter',
  },
  // ── Objetos ────────────────────────────────────────────────
  {
    id: 'cpp-026',
    concept: { pt: 'Criacao de Struct', en: 'Struct Creation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Structs em C++ podem ter constructors e inicializacao designada (C++20). Crie User com constructor e instancie com inicializacao designada.',
      en: 'C++ structs can have constructors and designated initialization (C++20). Create User with a constructor and instantiate with designated init.',
    },
    code: `struct User {
    std::string name;
    int age;
};

User alice{.name = "Alice", .age = 30};`,
    slot: 'obj-create',
  },
  {
    id: 'cpp-027',
    concept: { pt: 'Classe com Interface Virtual', en: 'Virtual Interface Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Interfaces em C++ sao classes com metodos virtuais puros (= 0). Defina Printable com print() e format() virtuais.',
      en: 'Interfaces in C++ are classes with pure virtual methods (= 0). Define Printable with virtual print() and format().',
    },
    code: `class Printable {
public:
    virtual void print() const = 0;
    virtual std::string format() const = 0;
    virtual ~Printable() = default;
};`,
    slot: 'obj-interface',
  },
  {
    id: 'cpp-028',
    concept: { pt: 'Objeto Aninhado', en: 'Nested Object' },
    difficulty: 'medium',
    prompt: {
      pt: 'Composicao em C++ significa um objeto conter outro como membro. Crie Company com um Address embutido como campo.',
      en: 'Composition in C++ means an object contains another as a member. Create Company with an embedded Address field.',
    },
    code: `struct Address {
    std::string city, state;
};

struct Company {
    std::string name;
    Address address;
};`,
    slot: 'obj-nested',
  },
  // ── Classes ────────────────────────────────────────────────
  {
    id: 'cpp-029',
    concept: { pt: 'Classe Basica', en: 'Basic Class' },
    difficulty: 'easy',
    prompt: {
      pt: 'Classes em C++ encapsulam estado com campos privados e construtores. Defina User com campos private e constructor publico.',
      en: 'C++ classes encapsulate state with private fields and constructors. Define User with private fields and a public constructor.',
    },
    code: `class User {
    std::string name_;
    int age_;
public:
    User(std::string name, int age)
        : name_(std::move(name)), age_(age) {}
    const std::string& name() const { return name_; }
};`,
    slot: 'class-basic',
  },
  {
    id: 'cpp-030',
    concept: { pt: 'Heranca', en: 'Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: 'Heranca em C++ usa ":" com especificador de acesso. Crie Employee que herda publicamente de Person e adiciona role.',
      en: 'Inheritance in C++ uses ":" with an access specifier. Create Employee that publicly inherits from Person and adds role.',
    },
    code: `class Person {
protected:
    std::string name_;
public:
    Person(std::string name) : name_(std::move(name)) {}
};

class Employee : public Person {
    std::string role_;
public:
    Employee(std::string name, std::string role)
        : Person(std::move(name)), role_(std::move(role)) {}
};`,
    slot: 'class-inherit',
  },
  {
    id: 'cpp-031',
    concept: { pt: 'Sobrescrita de Metodo', en: 'Method Override' },
    difficulty: 'medium',
    prompt: {
      pt: 'Override em C++ redefine um metodo virtual da classe base. Use a keyword "override" pra garantir que a assinatura bate.',
      en: 'Override in C++ redefines a virtual method from the base class. Use the "override" keyword to ensure the signature matches.',
    },
    code: `class Animal {
public:
    virtual std::string speak() const { return "..."; }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    std::string speak() const override { return "Woof!"; }
};`,
    slot: 'class-override',
  },
  {
    id: 'cpp-032',
    concept: { pt: 'Classe Abstrata', en: 'Abstract Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Classes abstratas em C++ tem pelo menos um metodo virtual puro (= 0). Defina Shape com area() puro e implemente Circle.',
      en: 'Abstract classes in C++ have at least one pure virtual method (= 0). Define Shape with pure area() and implement Circle.',
    },
    code: `class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius_;
public:
    Circle(double r) : radius_(r) {}
    double area() const override {
        return 3.14159 * radius_ * radius_;
    }
};`,
    slot: 'class-abstract',
  },
  // ── Erros ──────────────────────────────────────────────────
  {
    id: 'cpp-033',
    concept: { pt: 'Try-Catch', en: 'Try-Catch' },
    difficulty: 'easy',
    prompt: {
      pt: 'Try-catch em C++ captura excecoes por tipo. Capture std::exception por referencia constante e acesse a mensagem com .what().',
      en: 'Try-catch in C++ catches exceptions by type. Catch std::exception by const reference and access the message with .what().',
    },
    code: `try {
    auto result = riskyOperation();
} catch (const std::exception& e) {
    std::cerr << "Error: " << e.what() << std::endl;
}`,
    slot: 'err-try-catch',
  },
  {
    id: 'cpp-034',
    concept: { pt: 'Excecao Customizada', en: 'Custom Exception' },
    difficulty: 'medium',
    prompt: {
      pt: 'Excecoes customizadas em C++ herdam de std::exception e sobrescrevem what(). Crie ValidationError com campo e mensagem.',
      en: 'Custom exceptions in C++ inherit from std::exception and override what(). Create ValidationError with field and message.',
    },
    code: `class ValidationError : public std::runtime_error {
    std::string field_;
public:
    ValidationError(std::string field, const std::string& msg)
        : std::runtime_error(msg), field_(std::move(field)) {}
    const std::string& field() const { return field_; }
};`,
    slot: 'err-custom',
  },
  {
    id: 'cpp-035',
    concept: { pt: 'RAII como Finally', en: 'RAII as Finally' },
    difficulty: 'medium',
    prompt: {
      pt: 'C++ nao tem finally, mas RAII garante cleanup no destrutor. Crie um guard que executa uma funcao ao sair do escopo.',
      en: 'C++ has no finally, but RAII ensures cleanup in the destructor. Create a guard that runs a function when leaving scope.',
    },
    code: `class ScopeGuard {
    std::function<void()> cleanup_;
public:
    ScopeGuard(std::function<void()> fn)
        : cleanup_(std::move(fn)) {}
    ~ScopeGuard() { cleanup_(); }
};`,
    slot: 'err-finally',
  },
  // ── Tipos ──────────────────────────────────────────────────
  {
    id: 'cpp-036',
    concept: { pt: 'Union com Variant', en: 'Union with Variant' },
    difficulty: 'hard',
    prompt: {
      pt: 'std::variant (C++17) e uma union type-safe. Crie um Result que pode ser um valor ou uma mensagem de erro.',
      en: 'std::variant (C++17) is a type-safe union. Create a Result that can be either a value or an error message.',
    },
    code: `using Result = std::variant<int, std::string>;

Result divide(int a, int b) {
    if (b == 0) return std::string("division by zero");
    return a / b;
}`,
    slot: 'type-union',
  },
  {
    id: 'cpp-037',
    concept: { pt: 'Constraint com Concepts', en: 'Constraint with Concepts' },
    difficulty: 'hard',
    prompt: {
      pt: 'Concepts (C++20) restringem templates com requisitos semanticos. Crie um concept Addable e use numa funcao template.',
      en: 'Concepts (C++20) constrain templates with semantic requirements. Create an Addable concept and use it in a template function.',
    },
    code: `template <typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::convertible_to<T>;
};

template <Addable T>
T sum(T a, T b) {
    return a + b;
}`,
    slot: 'type-constraint',
  },
  {
    id: 'cpp-038',
    concept: { pt: 'Tipo Utilitario', en: 'Utility Type' },
    difficulty: 'hard',
    prompt: {
      pt: 'Templates permitem criar tipos utilitarios reutilizaveis em C++. Crie um Pair generico com dois tipos diferentes.',
      en: 'Templates allow creating reusable utility types in C++. Create a generic Pair with two different types.',
    },
    code: `template <typename A, typename B>
struct Pair {
    A first;
    B second;

    auto operator<=>(const Pair&) const = default;
};`,
    slot: 'type-utility',
  },
  // ── Avancado ───────────────────────────────────────────────
  {
    id: 'cpp-039',
    concept: { pt: 'Threads', en: 'Threads' },
    difficulty: 'hard',
    prompt: {
      pt: 'C++ usa std::thread e std::async pra concorrencia. Lance uma tarefa assincrona com std::async e pegue o resultado com .get().',
      en: 'C++ uses std::thread and std::async for concurrency. Launch an async task with std::async and get the result with .get().',
    },
    code: `auto future = std::async(std::launch::async, []() {
    return heavyComputation();
});
auto result = future.get();`,
    slot: 'adv-async',
  },
  {
    id: 'cpp-040',
    concept: { pt: 'Macro e Constexpr', en: 'Macro and Constexpr' },
    difficulty: 'hard',
    prompt: {
      pt: 'C++ moderno prefere constexpr a macros pra computacao em compile-time. Crie uma funcao constexpr que calcula fatorial em tempo de compilacao.',
      en: 'Modern C++ prefers constexpr over macros for compile-time computation. Create a constexpr function that computes factorial at compile time.',
    },
    code: `constexpr int factorial(int n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

constexpr int result = factorial(10);`,
    slot: 'adv-macro',
  },
  {
    id: 'cpp-041',
    concept: { pt: 'Concorrencia com Mutex', en: 'Concurrency with Mutex' },
    difficulty: 'hard',
    prompt: {
      pt: 'std::mutex protege dados compartilhados entre threads. Use lock_guard pra garantir que o mutex e liberado automaticamente.',
      en: 'std::mutex protects shared data between threads. Use lock_guard to ensure the mutex is automatically released.',
    },
    code: `std::mutex mtx;
int counter = 0;

void increment() {
    std::lock_guard<std::mutex> lock(mtx);
    counter++;
}`,
    slot: 'adv-concurrent',
  },
  // ── Algoritmos & Estruturas de Dados ──────────────────────
  {
    id: 'cpp-042',
    concept: { pt: 'Notação Big O', en: 'Big O Notation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Big O descreve a complexidade de tempo. Demonstre O(1), O(n) e O(n²) com operações em C++.',
      en: 'Big O describes time complexity. Demonstrate O(1), O(n), and O(n²) with C++ operations.',
    },
    code: `// O(1) -- acesso direto
auto first = vec[0];

// O(n) -- percorrer tudo
bool contains(const std::vector<int>& v, int target) {
    for (auto x : v) if (x == target) return true;
    return false;
}

// O(n²) -- loop aninhado
bool hasDuplicate(const std::vector<int>& v) {
    for (size_t i = 0; i < v.size(); i++)
        for (size_t j = i + 1; j < v.size(); j++)
            if (v[i] == v[j]) return true;
    return false;
}`,
  },
  {
    id: 'cpp-043',
    concept: { pt: 'Busca Binária', en: 'Binary Search' },
    difficulty: 'medium',
    prompt: {
      pt: 'Busca binária divide o vetor ordenado ao meio -- O(log n). Implemente de forma iterativa.',
      en: 'Binary search halves a sorted vector -- O(log n). Implement it iteratively.',
    },
    code: `int binarySearch(const std::vector<int>& v, int target) {
    int left = 0, right = v.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (v[mid] == target) return mid;
        if (v[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  {
    id: 'cpp-044',
    concept: { pt: 'Bubble Sort', en: 'Bubble Sort' },
    difficulty: 'easy',
    prompt: {
      pt: 'Bubble Sort compara pares adjacentes e troca -- O(n²). Implemente com std::swap e parada antecipada.',
      en: 'Bubble Sort compares adjacent pairs and swaps -- O(n²). Implement with std::swap and early stop.',
    },
    code: `void bubbleSort(std::vector<int>& v) {
    for (size_t i = 0; i < v.size() - 1; i++) {
        bool swapped = false;
        for (size_t j = 0; j < v.size() - 1 - i; j++) {
            if (v[j] > v[j + 1]) {
                std::swap(v[j], v[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  },
  {
    id: 'cpp-045',
    concept: { pt: 'Merge Sort', en: 'Merge Sort' },
    difficulty: 'hard',
    prompt: {
      pt: 'Merge Sort divide recursivamente e intercala -- O(n log n). Implemente com vetores auxiliares.',
      en: 'Merge Sort recursively splits and merges -- O(n log n). Implement with auxiliary vectors.',
    },
    code: `std::vector<int> mergeSort(std::vector<int> v) {
    if (v.size() <= 1) return v;
    auto mid = v.begin() + v.size() / 2;
    auto left = mergeSort({v.begin(), mid});
    auto right = mergeSort({mid, v.end()});
    std::vector<int> result;
    std::merge(left.begin(), left.end(),
               right.begin(), right.end(),
               std::back_inserter(result));
    return result;
}`,
  },
  {
    id: 'cpp-046',
    concept: { pt: 'Quick Sort', en: 'Quick Sort' },
    difficulty: 'hard',
    prompt: {
      pt: 'Quick Sort particiona em torno de um pivô -- O(n log n) médio. Implemente com iteradores.',
      en: 'Quick Sort partitions around a pivot -- O(n log n) average. Implement with iterators.',
    },
    code: `void quickSort(std::vector<int>& v, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = v[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (v[j] < pivot) std::swap(v[i++], v[j]);
    }
    std::swap(v[i], v[hi]);
    quickSort(v, lo, i - 1);
    quickSort(v, i + 1, hi);
}`,
  },
  {
    id: 'cpp-047',
    concept: { pt: 'Pilha (Stack)', en: 'Stack' },
    difficulty: 'easy',
    prompt: {
      pt: 'std::stack oferece LIFO com push, top e pop. Use pra empilhar e desempilhar valores.',
      en: 'std::stack provides LIFO with push, top, and pop. Use it to push and pop values.',
    },
    code: `std::stack<int> s;
s.push(1);
s.push(2);
s.push(3);

int top = s.top(); // 3
s.pop();
bool empty = s.empty();
size_t sz = s.size();`,
  },
  {
    id: 'cpp-048',
    concept: { pt: 'Fila (Queue)', en: 'Queue' },
    difficulty: 'easy',
    prompt: {
      pt: 'std::queue oferece FIFO com push, front e pop. Use pra enfileirar e desenfileirar.',
      en: 'std::queue provides FIFO with push, front, and pop. Use it to enqueue and dequeue.',
    },
    code: `std::queue<std::string> q;
q.push("A");
q.push("B");
q.push("C");

auto front = q.front(); // "A"
q.pop();
auto sz = q.size();`,
  },
  {
    id: 'cpp-049',
    concept: { pt: 'Lista Ligada', en: 'Linked List' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma lista ligada usa nós com ponteiros. Implemente com struct e inserção no início.',
      en: 'A linked list uses nodes with pointers. Implement with struct and head insertion.',
    },
    code: `struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

class LinkedList {
    Node* head = nullptr;
public:
    void prepend(int v) {
        auto* n = new Node(v);
        n->next = head;
        head = n;
    }
    void print() {
        for (auto* n = head; n; n = n->next)
            std::cout << n->value << " -> ";
        std::cout << "null\\n";
    }
};`,
  },
  {
    id: 'cpp-050',
    concept: { pt: 'Árvore Binária de Busca', en: 'Binary Search Tree' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma BST mantém menores à esquerda e maiores à direita. Implemente com unique_ptr.',
      en: 'A BST keeps smaller left and larger right. Implement with unique_ptr.',
    },
    code: `struct TreeNode {
    int val;
    std::unique_ptr<TreeNode> left, right;
    TreeNode(int v) : val(v) {}
};

void insert(std::unique_ptr<TreeNode>& node, int val) {
    if (!node) { node = std::make_unique<TreeNode>(val); return; }
    if (val < node->val) insert(node->left, val);
    else insert(node->right, val);
}

bool search(const std::unique_ptr<TreeNode>& node, int val) {
    if (!node) return false;
    if (val == node->val) return true;
    return val < node->val ? search(node->left, val) : search(node->right, val);
}`,
  },
  {
    id: 'cpp-051',
    concept: { pt: 'BFS (Busca em Largura)', en: 'BFS (Breadth-First Search)' },
    difficulty: 'hard',
    prompt: {
      pt: 'BFS explora nível por nível usando uma fila. Implemente com queue e unordered_set.',
      en: 'BFS explores level by level using a queue. Implement with queue and unordered_set.',
    },
    code: `std::vector<std::string> bfs(
    const std::unordered_map<std::string, std::vector<std::string>>& graph,
    const std::string& start) {
    std::vector<std::string> result;
    std::unordered_set<std::string> visited;
    std::queue<std::string> q;
    q.push(start); visited.insert(start);
    while (!q.empty()) {
        auto node = q.front(); q.pop();
        result.push_back(node);
        if (graph.count(node))
            for (auto& nb : graph.at(node))
                if (visited.insert(nb).second) q.push(nb);
    }
    return result;
}`,
  },
  {
    id: 'cpp-052',
    concept: { pt: 'DFS (Busca em Profundidade)', en: 'DFS (Depth-First Search)' },
    difficulty: 'hard',
    prompt: {
      pt: 'DFS explora o mais fundo possível usando uma pilha. Implemente iterativamente.',
      en: 'DFS explores as deep as possible using a stack. Implement it iteratively.',
    },
    code: `std::vector<std::string> dfs(
    const std::unordered_map<std::string, std::vector<std::string>>& graph,
    const std::string& start) {
    std::vector<std::string> result;
    std::unordered_set<std::string> visited;
    std::stack<std::string> s;
    s.push(start);
    while (!s.empty()) {
        auto node = s.top(); s.pop();
        if (!visited.insert(node).second) continue;
        result.push_back(node);
        if (graph.count(node)) {
            auto& nb = graph.at(node);
            for (auto it = nb.rbegin(); it != nb.rend(); ++it)
                if (!visited.count(*it)) s.push(*it);
        }
    }
    return result;
}`,
  },
  {
    id: 'cpp-053',
    concept: { pt: 'Hash Map', en: 'Hash Map' },
    difficulty: 'medium',
    prompt: {
      pt: 'unordered_map armazena pares chave-valor com acesso O(1) médio. Use insert, find e iteração.',
      en: 'unordered_map stores key-value pairs with O(1) average access. Use insert, find, and iteration.',
    },
    code: `std::unordered_map<std::string, int> scores;
scores["Alice"] = 95;
scores["Bob"] = 87;
scores.insert({"Carol", 92});

auto it = scores.find("Alice");
if (it != scores.end())
    std::cout << it->second << "\\n";

for (const auto& [name, score] : scores)
    std::cout << name << ": " << score << "\\n";`,
  },
]
