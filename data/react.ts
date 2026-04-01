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
  {
    id: 'react-007',
    concept: { pt: 'Custom Hook', en: 'Custom Hook' },
    difficulty: 'hard',
    prompt: {
      pt: 'Custom hooks extraem lógica com estado reutilizável em funções useXxx. Crie um useLocalStorage que sincroniza estado com o localStorage do browser.',
      en: 'Custom hooks extract reusable stateful logic into useXxx functions. Create a useLocalStorage that syncs state with the browser\'s localStorage.',
    },
    code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Uso:
const [theme, setTheme] = useLocalStorage('theme', 'dark');`,
  },
  {
    id: 'react-008',
    concept: { pt: 'Error Boundary', en: 'Error Boundary' },
    difficulty: 'hard',
    prompt: {
      pt: 'Error Boundaries capturam erros de renderização nos filhos sem quebrar o app inteiro. Implemente um class component que exibe uma UI de fallback.',
      en: 'Error Boundaries catch rendering errors in children without crashing the entire app. Implement a class component that displays a fallback UI.',
    },
    code: `import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Algo deu errado.</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}`,
  },
  {
    id: 'react-009',
    concept: { pt: 'Renderização Condicional', en: 'Conditional Rendering' },
    difficulty: 'easy',
    prompt: {
      pt: 'JSX permite renderização condicional com operador ternário, && e early return. Mostre diferentes UIs baseado em estado de loading, erro e dados.',
      en: 'JSX allows conditional rendering with ternary operator, &&, and early return. Show different UIs based on loading, error, and data state.',
    },
    code: `function DataView({ loading, error, data }) {
  if (loading) return <Spinner />;
  if (error) return <p className="error">{error.message}</p>;
  if (!data) return null;

  return (
    <div>
      <h2>{data.title}</h2>
      {data.subtitle && <h3>{data.subtitle}</h3>}
      {data.items.length > 0 ? (
        <ul>{data.items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
      ) : (
        <p>Nenhum item encontrado.</p>
      )}
    </div>
  );
}`,
  },
  {
    id: 'react-010',
    concept: { pt: 'Renderização de Lista com key', en: 'List Rendering with key' },
    difficulty: 'easy',
    prompt: {
      pt: 'Ao renderizar listas, cada item precisa de uma key única pra que o React identifique mudanças de forma eficiente. Use map com key estável.',
      en: 'When rendering lists, each item needs a unique key so React can efficiently identify changes. Use map with a stable key.',
    },
    code: `function UserTable({ users }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
  },
  {
    id: 'react-011',
    concept: { pt: 'useReducer', en: 'useReducer' },
    difficulty: 'medium',
    prompt: {
      pt: 'useReducer gerencia estado complexo com um reducer puro, sendo alternativa ao useState pra lógica de estado mais elaborada. Implemente um gerenciador de formulário.',
      en: 'useReducer manages complex state with a pure reducer, being an alternative to useState for more elaborate state logic. Implement a form manager.',
    },
    code: `import { useReducer } from 'react';

const initialState = { name: '', email: '', errors: {} };

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.msg } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setField = (field, value) =>
    dispatch({ type: 'SET_FIELD', field, value });

  return (
    <input value={state.name} onChange={e => setField('name', e.target.value)} />
  );
}`,
  },
  {
    id: 'react-012',
    concept: { pt: 'React.memo', en: 'React.memo' },
    difficulty: 'medium',
    prompt: {
      pt: 'React.memo evita re-renderizações de componentes quando as props não mudaram. Use pra otimizar componentes pesados que recebem as mesmas props frequentemente.',
      en: 'React.memo prevents component re-renders when props haven\'t changed. Use it to optimize heavy components that frequently receive the same props.',
    },
    code: `import { memo } from 'react';

const ExpensiveChart = memo(function ExpensiveChart({ data, title }) {
  console.log('Chart rendered');
  return (
    <div className="chart">
      <h3>{title}</h3>
      <svg viewBox="0 0 400 200">
        {data.map((point, i) => (
          <rect
            key={i}
            x={i * 40}
            y={200 - point.value}
            width={30}
            height={point.value}
            fill={point.color}
          />
        ))}
      </svg>
    </div>
  );
});

export default ExpensiveChart;`,
  },
]
