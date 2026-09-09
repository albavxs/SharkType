import { Snippet } from '@/lib/types'

export const testingSnippets: Snippet[] = [
  {
    id: 'test-001',
    concept: { pt: 'Teste básico com Jest', en: 'Basic Jest Test' },
    difficulty: 'easy',
    prompt: {
      pt: 'describe agrupa testes relacionados e it define um caso de teste individual. Escreva um teste que verifica se uma função soma retorna o valor correto.',
      en: 'describe groups related tests and it defines an individual test case. Write a test that verifies a sum function returns the correct value.',
    },
    code: `describe('sum', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });

  it('should return 0 for no arguments', () => {
    expect(sum()).toBe(0);
  });
});`,
  },
  {
    id: 'test-002',
    concept: { pt: 'Teste básico com Vitest', en: 'Basic Vitest Test' },
    difficulty: 'easy',
    prompt: {
      pt: 'Vitest usa a mesma API do Jest mas é nativo de ESM e integra com Vite. Escreva testes pra uma função de formatação de moeda com expect e matchers.',
      en: 'Vitest uses the same API as Jest but is ESM-native and integrates with Vite. Write tests for a currency formatting function with expect and matchers.',
    },
    code: `import { describe, it, expect } from 'vitest'
import { formatCurrency } from './utils'

describe('formatCurrency', () => {
  it('should format BRL correctly', () => {
    expect(formatCurrency(1234.5, 'BRL')).toBe('R$ 1.234,50');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0, 'BRL')).toBe('R$ 0,00');
  });
});`,
  },
  {
    id: 'test-003',
    concept: { pt: 'Mock de Função', en: 'Mock Function' },
    difficulty: 'medium',
    prompt: {
      pt: 'vi.fn() cria uma função mock que rastreia chamadas e permite definir retornos. Use mocks pra isolar a unidade testada de suas dependências.',
      en: 'vi.fn() creates a mock function that tracks calls and lets you define returns. Use mocks to isolate the unit under test from its dependencies.',
    },
    code: `import { describe, it, expect, vi } from 'vitest'
import { processOrder } from './order'

describe('processOrder', () => {
  it('should call payment gateway with correct amount', async () => {
    const mockPay = vi.fn().mockResolvedValue({ success: true });

    const result = await processOrder(
      { items: [{ price: 50, qty: 2 }] },
      mockPay
    );

    expect(mockPay).toHaveBeenCalledWith(100);
    expect(mockPay).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
  });
});`,
  },
  {
    id: 'test-004',
    concept: { pt: 'Spy em Módulo', en: 'Module Spy' },
    difficulty: 'medium',
    prompt: {
      pt: 'vi.spyOn observa chamadas a métodos de um objeto sem substituir a implementação original. Use spyOn pra verificar que console.error foi chamado durante um erro.',
      en: 'vi.spyOn watches method calls on an object without replacing the original implementation. Use spyOn to verify console.error was called during an error.',
    },
    code: `import { describe, it, expect, vi } from 'vitest'
import { fetchUser } from './api'

describe('fetchUser', () => {
  it('should log error on failure', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = vi.fn().mockRejectedValue(new Error('Network'));

    await fetchUser(1);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Network')
    );
    spy.mockRestore();
  });
});`,
  },
  {
    id: 'test-005',
    concept: { pt: 'Testando Código Assíncrono', en: 'Testing Async Code' },
    difficulty: 'medium',
    prompt: {
      pt: 'Funções async em testes precisam de await pra que as assertions executem após a resolução da promise. Teste uma função que busca dados de uma API.',
      en: 'Async functions in tests need await so assertions run after the promise resolves. Test a function that fetches data from an API.',
    },
    code: `import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUsers } from './api'

describe('getUsers', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: 'Ana' }]),
    });
  });

  it('should return parsed users', async () => {
    const users = await getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('Ana');
  });

  it('should call the correct endpoint', async () => {
    await getUsers();
    expect(fetch).toHaveBeenCalledWith('/api/users');
  });
});`,
  },
  {
    id: 'test-006',
    concept: { pt: 'Testing Library', en: 'Testing Library' },
    difficulty: 'medium',
    prompt: {
      pt: 'Testing Library testa componentes pela perspectiva do usuário, usando queries como getByRole e getByText. Renderize um componente e simule interação.',
      en: 'Testing Library tests components from the user\'s perspective, using queries like getByRole and getByText. Render a component and simulate interaction.',
    },
    code: `import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

describe('Counter', () => {
  it('should increment on button click', () => {
    render(<Counter />);

    const button = screen.getByRole('button', { name: /increment/i });
    const display = screen.getByText('0');

    fireEvent.click(button);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should show reset after 10', () => {
    render(<Counter initial={10} />);
    expect(screen.getByRole('button', { name: /reset/i })).toBeVisible();
  });
});`,
  },
]
