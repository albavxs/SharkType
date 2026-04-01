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
  {
    id: 'test-007',
    concept: { pt: 'Teste E2E com Cypress', en: 'E2E Test with Cypress' },
    difficulty: 'hard',
    prompt: {
      pt: 'Cypress simula um usuário real navegando no browser. Escreva um teste e2e que faz login, navega até o dashboard e verifica que os dados carregaram.',
      en: 'Cypress simulates a real user browsing. Write an e2e test that logs in, navigates to the dashboard, and verifies data loaded.',
    },
    code: `describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-cy="email"]').type('user@test.com');
    cy.get('[data-cy="password"]').type('secret123');
    cy.get('[data-cy="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should display user projects', () => {
    cy.get('[data-cy="project-list"]').should('be.visible');
    cy.get('[data-cy="project-card"]').should('have.length.at.least', 1);
  });

  it('should create a new project', () => {
    cy.get('[data-cy="new-project"]').click();
    cy.get('[data-cy="project-name"]').type('Meu Projeto');
    cy.get('[data-cy="save"]').click();
    cy.contains('Meu Projeto').should('exist');
  });
});`,
  },
  {
    id: 'test-008',
    concept: { pt: 'Setup e Teardown', en: 'Setup and Teardown' },
    difficulty: 'easy',
    prompt: {
      pt: 'beforeEach executa antes de cada teste e afterEach depois, garantindo estado limpo. Use setup/teardown pra inicializar e limpar um banco de dados de teste.',
      en: 'beforeEach runs before each test and afterEach after, ensuring clean state. Use setup/teardown to initialize and clean up a test database.',
    },
    code: `import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createTestDb, destroyTestDb } from './test-helpers'

let db;

beforeEach(async () => {
  db = await createTestDb();
  await db.seed([
    { id: 1, name: 'Item A' },
    { id: 2, name: 'Item B' },
  ]);
});

afterEach(async () => {
  await destroyTestDb(db);
});

describe('database queries', () => {
  it('should find all items', async () => {
    const items = await db.findAll();
    expect(items).toHaveLength(2);
  });
});`,
  },
  {
    id: 'test-009',
    concept: { pt: 'Teste de Snapshot', en: 'Snapshot Testing' },
    difficulty: 'easy',
    prompt: {
      pt: 'Snapshots capturam a saída de um componente e comparam com versões anteriores pra detectar mudanças inesperadas. Crie um snapshot de um componente renderizado.',
      en: 'Snapshots capture a component\'s output and compare with previous versions to detect unexpected changes. Create a snapshot of a rendered component.',
    },
    code: `import { render } from '@testing-library/react'
import { expect, it } from 'vitest'
import UserCard from './UserCard'

it('should match snapshot', () => {
  const { container } = render(
    <UserCard
      name="Paulo"
      role="Developer"
      avatar="/img/paulo.jpg"
    />
  );

  expect(container.firstChild).toMatchSnapshot();
});`,
  },
  {
    id: 'test-010',
    concept: { pt: 'Ciclo TDD', en: 'TDD Cycle' },
    difficulty: 'hard',
    prompt: {
      pt: 'TDD segue o ciclo Red-Green-Refactor: escreva um teste que falha, implemente o mínimo pra passar, depois refatore. Demonstre o ciclo completo com uma função de validação.',
      en: 'TDD follows the Red-Green-Refactor cycle: write a failing test, implement the minimum to pass, then refactor. Demonstrate the full cycle with a validation function.',
    },
    code: `// 1. RED -- escreva o teste primeiro
describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });
  it('should reject email without @', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
  it('should reject email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });
});

// 2. GREEN -- implemente o mínimo
function validateEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

// 3. REFACTOR -- extraia e melhore
const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const validateEmail = (email) => EMAIL_REGEX.test(email);`,
  },
]
