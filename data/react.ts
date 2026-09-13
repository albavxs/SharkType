import { Snippet } from '@/lib/types'

export const reactSnippets: Snippet[] = [
  {
    id: 'react-001',
    concept: { pt: 'Componente Funcional com JSX', en: 'Functional Component with JSX' },
    difficulty: 'easy',
    prompt: {
      pt: 'Componentes funcionais são funções que retornam JSX. Crie um componente Greeting que recebe name via props e renderiza uma saudação.',
      en: 'Functional components are functions that return JSX. Create a Greeting component that receives name via props and renders a greeting.',
    },
    code: `function Greeting({ name, role = 'dev' }) {
  return (
    <div className="greeting">
      <h1>Olá, {name}!</h1>
      <p>Role: {role}</p>
    </div>
  );
}

export default Greeting;`,
  },
  {
    id: 'react-002',
    concept: { pt: 'useState Hook', en: 'useState Hook' },
    difficulty: 'easy',
    prompt: {
      pt: 'useState declara estado local num componente funcional, retornando o valor e um setter. Crie um contador com botões de incrementar e decrementar.',
      en: 'useState declares local state in a functional component, returning the value and a setter. Create a counter with increment and decrement buttons.',
    },
    code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
  },
  {
    id: 'react-003',
    concept: { pt: 'useEffect Hook', en: 'useEffect Hook' },
    difficulty: 'medium',
    prompt: {
      pt: 'useEffect executa efeitos colaterais após a renderização -- como chamadas HTTP, timers ou subscrições. Busque dados de uma API quando o componente montar.',
      en: 'useEffect runs side effects after render -- like HTTP calls, timers, or subscriptions. Fetch data from an API when the component mounts.',
    },
    code: `import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/users', { signal: controller.signal })
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <p>Carregando...</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`,
  },
  {
    id: 'react-004',
    concept: { pt: 'useContext e createContext', en: 'useContext and createContext' },
    difficulty: 'medium',
    prompt: {
      pt: 'Context evita prop drilling ao compartilhar estado por toda a árvore de componentes. Crie um ThemeContext com provider e consuma com useContext.',
      en: 'Context avoids prop drilling by sharing state across the component tree. Create a ThemeContext with provider and consume it with useContext.',
    },
    code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeButton() {
  const { theme, toggle } = useContext(ThemeContext);
  return <button onClick={toggle}>Tema: {theme}</button>;
}`,
  },
  {
    id: 'react-005',
    concept: { pt: 'useMemo', en: 'useMemo' },
    difficulty: 'medium',
    prompt: {
      pt: 'useMemo memoriza o resultado de um cálculo caro, recalculando só quando as dependências mudam. Use pra filtrar e ordenar uma lista grande.',
      en: 'useMemo memoizes the result of an expensive computation, recalculating only when dependencies change. Use it to filter and sort a large list.',
    },
    code: `import { useMemo, useState } from 'react';

function ProductList({ products }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filtered = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1);
  }, [products, search, sortBy]);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}`,
  },
  {
    id: 'react-006',
    concept: { pt: 'useCallback', en: 'useCallback' },
    difficulty: 'medium',
    prompt: {
      pt: 'useCallback memoriza uma função pra evitar que componentes filhos re-renderizem desnecessariamente. Use com React.memo num componente filho.',
      en: 'useCallback memoizes a function to prevent unnecessary child re-renders. Use it with React.memo on a child component.',
    },
    code: `import { useState, useCallback, memo } from 'react';

const TodoItem = memo(({ todo, onToggle }) => {
  console.log('Rendering:', todo.text);
  return (
    <li onClick={() => onToggle(todo.id)}>
      {todo.done ? '✓' : '○'} {todo.text}
    </li>
  );
});

function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleToggle = useCallback((id) => {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }, []);

  return <ul>{todos.map(t => (
    <TodoItem key={t.id} todo={t} onToggle={handleToggle} />
  ))}</ul>;
}`,
  },
]
