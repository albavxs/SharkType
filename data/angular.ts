import { Snippet } from '@/lib/types'

export const angularSnippets: Snippet[] = [
  {
    id: 'angular-001',
    concept: { pt: 'Componente Standalone', en: 'Standalone Component' },
    difficulty: 'easy',
    prompt: {
      pt: 'Componentes Angular modernos sao standalone por padrao. Crie um componente simples com selector, template inline e styles locais.',
      en: 'Modern Angular components are standalone by default. Create a simple component with a selector, inline template, and local styles.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: \`
    <h1>Hello, {{ name }}</h1>
    <p>Welcome to Angular.</p>
  \`,
  styles: ['h1 { color: #dd0031; }'],
})
export class GreetingComponent {
  name = 'Ana';
}`,
  },
  {
    id: 'angular-002',
    concept: { pt: 'Selector e Template', en: 'Selector and Template' },
    difficulty: 'easy',
    prompt: {
      pt: 'O selector define como o componente aparece no HTML. Crie um card de perfil usado pela tag app-profile-card.',
      en: 'The selector defines how the component appears in HTML. Create a profile card used with the app-profile-card tag.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  template: \`
    <article>
      <h2>{{ user.name }}</h2>
      <span>{{ user.role }}</span>
    </article>
  \`,
})
export class ProfileCardComponent {
  user = {
    name: 'Bianca',
    role: 'Frontend Dev',
  };
}`,
  },
  {
    id: 'angular-003',
    concept: { pt: 'Interpolacao', en: 'Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interpolacao exibe valores da classe no template. Mostre titulo, usuario e status calculado.',
      en: 'Interpolation displays class values in the template. Show a title, user, and calculated status.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-title',
  template: \`
    <h1>{{ title }}</h1>
    <p>{{ user }} has {{ taskCount }} open tasks.</p>
    <strong>{{ taskCount > 0 ? 'Active' : 'Done' }}</strong>
  \`,
})
export class DashboardTitleComponent {
  title = 'Sprint Board';
  user = 'Carlos';
  taskCount = 7;
}`,
  },
  {
    id: 'angular-004',
    concept: { pt: 'Property Binding', en: 'Property Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'Property binding conecta atributos do DOM a valores da classe. Controle src, alt e disabled pelo estado do componente.',
      en: 'Property binding connects DOM properties to class values. Control src, alt, and disabled from component state.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: \`
    <img [src]="avatarUrl" [alt]="avatarAlt" />
    <button [disabled]="isSaving">Save</button>
  \`,
})
export class AvatarComponent {
  avatarUrl = '/assets/avatar.png';
  avatarAlt = 'User avatar';
  isSaving = false;
}`,
  },
  {
    id: 'angular-005',
    concept: { pt: 'Event Binding', en: 'Event Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'Event binding chama metodos da classe a partir de eventos do template. Crie um contador com cliques.',
      en: 'Event binding calls class methods from template events. Create a click counter.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-click-counter',
  template: \`
    <button (click)="increment()">Clicked {{ count }} times</button>
    <button (click)="reset()">Reset</button>
  \`,
})
export class ClickCounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  reset() {
    this.count = 0;
  }
}`,
  },
  {
    id: 'angular-006',
    concept: { pt: 'Two-Way Binding', en: 'Two-Way Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'FormsModule habilita ngModel para ligacao bidirecional. Crie um campo de busca que atualiza a preview em tempo real.',
      en: 'FormsModule enables ngModel for two-way binding. Create a search field that updates a preview in real time.',
    },
    code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule],
  template: \`
    <input [(ngModel)]="query" placeholder="Search" />
    <p>Searching for: {{ query }}</p>
  \`,
})
export class SearchBoxComponent {
  query = '';
}`,
  },
  {
    id: 'angular-007',
    concept: { pt: 'Controle @if', en: '@if Control Flow' },
    difficulty: 'easy',
    prompt: {
      pt: '@if mostra ou esconde blocos sem ngIf. Renderize estados de carregamento, erro e sucesso.',
      en: '@if shows or hides blocks without ngIf. Render loading, error, and success states.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-load-state',
  template: \`
    @if (loading) {
      <p>Loading...</p>
    } @else if (error) {
      <p role="alert">{{ error }}</p>
    } @else {
      <p>Ready: {{ message }}</p>
    }
  \`,
})
export class LoadStateComponent {
  loading = false;
  error = '';
  message = 'Data loaded';
}`,
  },
  {
    id: 'angular-008',
    concept: { pt: 'Controle @for', en: '@for Control Flow' },
    difficulty: 'easy',
    prompt: {
      pt: '@for renderiza listas e usa track para estabilidade. Liste tarefas usando o id como chave.',
      en: '@for renders lists and uses track for stability. List tasks using the id as the key.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-task-list',
  template: \`
    <ul>
      @for (task of tasks; track task.id) {
        <li>{{ task.title }}</li>
      } @empty {
        <li>No tasks yet.</li>
      }
    </ul>
  \`,
})
export class TaskListComponent {
  tasks = [
    { id: 1, title: 'Create component' },
    { id: 2, title: 'Wire template' },
  ];
}`,
  },
  {
    id: 'angular-009',
    concept: { pt: 'Pipes no Template', en: 'Template Pipes' },
    difficulty: 'easy',
    prompt: {
      pt: 'Pipes formatam dados no template. Use date, currency e uppercase em uma linha de pedido.',
      en: 'Pipes format data in the template. Use date, currency, and uppercase in an order row.',
    },
    code: `import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-order-row',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe],
  template: \`
    <p>{{ order.customer | uppercase }}</p>
    <time>{{ order.createdAt | date:'shortDate' }}</time>
    <strong>{{ order.total | currency:'USD' }}</strong>
  \`,
})
export class OrderRowComponent {
  order = {
    customer: 'marina',
    createdAt: new Date(),
    total: 129.9,
  };
}`,
  },
  {
    id: 'angular-010',
    concept: { pt: 'Classes Dinamicas', en: 'Dynamic Classes' },
    difficulty: 'easy',
    prompt: {
      pt: 'Class binding aplica classes conforme o estado. Mostre um badge ativo ou inativo.',
      en: 'Class binding applies classes based on state. Show an active or inactive badge.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: \`
    <span
      class="badge"
      [class.badge-active]="active"
      [class.badge-muted]="!active"
    >
      {{ active ? 'Active' : 'Inactive' }}
    </span>
  \`,
})
export class StatusBadgeComponent {
  active = true;
}`,
  },
  {
    id: 'angular-011',
    concept: { pt: 'Input de Componente', en: 'Component Input' },
    difficulty: 'easy',
    prompt: {
      pt: 'input() recebe dados do componente pai. Crie um card de produto com valores obrigatorios e opcionais.',
      en: 'input() receives data from the parent component. Create a product card with required and optional values.',
    },
    code: `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: \`
    <article>
      <h2>{{ name() }}</h2>
      <p>{{ price() | currency:'USD' }}</p>
      <small>{{ category() }}</small>
    </article>
  \`,
})
export class ProductCardComponent {
  name = input.required<string>();
  price = input.required<number>();
  category = input('general');
}`,
  },
  {
    id: 'angular-012',
    concept: { pt: 'Output de Componente', en: 'Component Output' },
    difficulty: 'easy',
    prompt: {
      pt: 'output() emite eventos para o componente pai. Crie um botao de remover que envia o id do item.',
      en: 'output() emits events to the parent component. Create a remove button that sends the item id.',
    },
    code: `import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  template: \`
    <span>{{ label() }}</span>
    <button (click)="remove.emit(id())">Remove</button>
  \`,
})
export class CartItemComponent {
  id = input.required<number>();
  label = input.required<string>();
  remove = output<number>();
}`,
  },
  {
    id: 'angular-013',
    concept: { pt: 'Lifecycle Basico', en: 'Basic Lifecycle' },
    difficulty: 'easy',
    prompt: {
      pt: 'ngOnInit roda quando o componente inicializa e ngOnDestroy limpa recursos. Controle um intervalo simples.',
      en: 'ngOnInit runs when the component initializes and ngOnDestroy cleans resources. Manage a simple interval.',
    },
    code: `import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  template: '<p>{{ seconds }}s</p>',
})
export class TimerComponent implements OnInit, OnDestroy {
  seconds = 0;
  private intervalId?: number;

  ngOnInit() {
    this.intervalId = window.setInterval(() => this.seconds++, 1000);
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalId);
  }
}`,
  },
  {
    id: 'angular-014',
    concept: { pt: 'Service Simples', en: 'Simple Service' },
    difficulty: 'easy',
    prompt: {
      pt: 'Services isolam logica reutilizavel. Crie um servico de formatacao e injete no componente.',
      en: 'Services isolate reusable logic. Create a formatting service and inject it into a component.',
    },
    code: `import { Component, Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TitleFormatter {
  format(value: string) {
    return value.trim().replaceAll('-', ' ').toUpperCase();
  }
}

@Component({
  selector: 'app-title-preview',
  template: '<h1>{{ title }}</h1>',
})
export class TitlePreviewComponent {
  private formatter = inject(TitleFormatter);
  title = this.formatter.format('angular-services');
}`,
  },
  {
    id: 'angular-015',
    concept: { pt: 'Injecao de Dependencia', en: 'Dependency Injection' },
    difficulty: 'easy',
    prompt: {
      pt: 'inject() solicita dependencias ao injetor do Angular. Use um token simples de configuracao.',
      en: 'inject() asks Angular injector for dependencies. Use a simple configuration token.',
    },
    code: `import { Component, InjectionToken, inject } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'https://api.example.com',
});

@Component({
  selector: 'app-api-label',
  template: '<code>{{ apiUrl }}</code>',
})
export class ApiLabelComponent {
  apiUrl = inject(API_URL);
}`,
  },
  {
    id: 'angular-016',
    concept: { pt: 'HttpClient Basico', en: 'Basic HttpClient' },
    difficulty: 'easy',
    prompt: {
      pt: 'HttpClient busca dados tipados do backend. Crie um componente que carrega usuarios.',
      en: 'HttpClient fetches typed data from the backend. Create a component that loads users.',
    },
    code: `import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-users',
  template: \`
    @for (user of users; track user.id) {
      <p>{{ user.name }}</p>
    }
  \`,
})
export class UsersComponent {
  private http = inject(HttpClient);
  users: User[] = [];

  ngOnInit() {
    this.http.get<User[]>('/api/users')
      .subscribe(users => this.users = users);
  }
}`,
  },
  {
    id: 'angular-017',
    concept: { pt: 'Formulario Simples', en: 'Simple Form' },
    difficulty: 'easy',
    prompt: {
      pt: 'ReactiveFormsModule cria controles explicitos. Monte um login com email e senha.',
      en: 'ReactiveFormsModule creates explicit controls. Build a login form with email and password.',
    },
    code: `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email" type="email" />
      <input formControlName="password" type="password" />
      <button>Sign in</button>
    </form>
  \`,
})
export class LoginFormComponent {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    console.log(this.form.value);
  }
}`,
  },
  {
    id: 'angular-018',
    concept: { pt: 'Rotas Basicas', en: 'Basic Routes' },
    difficulty: 'easy',
    prompt: {
      pt: 'Routes mapeiam paths para componentes. Defina home, about e fallback.',
      en: 'Routes map paths to components. Define home, about, and a fallback.',
    },
    code: `import { Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AboutPage } from './about.page';
import { NotFoundPage } from './not-found.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'about', component: AboutPage },
  { path: '**', component: NotFoundPage },
];`,
  },
  {
    id: 'angular-019',
    concept: { pt: 'Navegacao', en: 'Navigation' },
    difficulty: 'easy',
    prompt: {
      pt: 'RouterLink cria navegacao declarativa. Monte um menu simples e marque o link ativo.',
      en: 'RouterLink creates declarative navigation. Build a simple menu and mark the active link.',
    },
    code: `import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: \`
    <nav>
      <a routerLink="/" routerLinkActive="active">Home</a>
      <a routerLink="/about" routerLinkActive="active">About</a>
    </nav>
    <router-outlet />
  \`,
})
export class ShellComponent {}`,
  },
  {
    id: 'angular-020',
    concept: { pt: 'CLI e Estrutura', en: 'CLI and Structure' },
    difficulty: 'easy',
    prompt: {
      pt: 'Angular CLI padroniza geracao de arquivos. Use comandos para criar componente, service e build.',
      en: 'Angular CLI standardizes file generation. Use commands to create a component, service, and build.',
    },
    code: `# Create a new workspace
ng new shark-admin --routing --style=scss

# Generate feature pieces
ng generate component features/users/user-list
ng generate service features/users/users

# Run and build
ng serve
ng build`,
  },
  {
    id: 'angular-021',
    concept: { pt: 'Signal de Estado', en: 'State Signal' },
    difficulty: 'medium',
    prompt: {
      pt: 'signal() cria estado reativo local. Modele uma lista de filtros com update e set.',
      en: 'signal() creates local reactive state. Model a filter list with update and set.',
    },
    code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  template: \`
    <button (click)="toggle('active')">Active</button>
    <button (click)="clear()">Clear</button>
    <pre>{{ filters() | json }}</pre>
  \`,
})
export class FilterPanelComponent {
  filters = signal<string[]>([]);

  toggle(filter: string) {
    this.filters.update(items =>
      items.includes(filter)
        ? items.filter(item => item !== filter)
        : [...items, filter]
    );
  }

  clear() {
    this.filters.set([]);
  }
}`,
  },
  {
    id: 'angular-022',
    concept: { pt: 'Computed Signal', en: 'Computed Signal' },
    difficulty: 'medium',
    prompt: {
      pt: 'computed() deriva estado memoizado de signals. Calcule total, itens pagos e pendentes.',
      en: 'computed() derives memoized state from signals. Calculate total, paid items, and pending items.',
    },
    code: `import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-invoice-summary',
  template: \`
    <p>Total: {{ total() }}</p>
    <p>Paid: {{ paidCount() }}</p>
    <p>Pending: {{ pendingCount() }}</p>
  \`,
})
export class InvoiceSummaryComponent {
  invoices = signal([
    { id: 1, total: 200, paid: true },
    { id: 2, total: 140, paid: false },
  ]);

  total = computed(() =>
    this.invoices().reduce((sum, item) => sum + item.total, 0)
  );
  paidCount = computed(() => this.invoices().filter(i => i.paid).length);
  pendingCount = computed(() => this.invoices().length - this.paidCount());
}`,
  },
  {
    id: 'angular-023',
    concept: { pt: 'Effect', en: 'Effect' },
    difficulty: 'medium',
    prompt: {
      pt: 'effect() reage a mudancas de signals para sincronizar APIs externas. Salve preferencia de tema no localStorage.',
      en: 'effect() reacts to signal changes to synchronize external APIs. Save a theme preference in localStorage.',
    },
    code: `import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  template: \`
    <button (click)="toggle()">Theme: {{ theme() }}</button>
  \`,
})
export class ThemeToggleComponent {
  theme = signal<'light' | 'dark'>('dark');

  constructor() {
    effect(() => {
      localStorage.setItem('theme', this.theme());
      document.documentElement.dataset.theme = this.theme();
    });
  }

  toggle() {
    this.theme.update(value => value === 'dark' ? 'light' : 'dark');
  }
}`,
  },
  {
    id: 'angular-024',
    concept: { pt: 'Signal Inputs', en: 'Signal Inputs' },
    difficulty: 'medium',
    prompt: {
      pt: 'Signal inputs podem ser usados em computed. Crie um item de carrinho com subtotal derivado.',
      en: 'Signal inputs can be used in computed. Create a cart item with a derived subtotal.',
    },
    code: `import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-cart-line',
  template: \`
    <span>{{ name() }}</span>
    <strong>{{ subtotal() | currency:'USD' }}</strong>
  \`,
})
export class CartLineComponent {
  name = input.required<string>();
  unitPrice = input.required<number>();
  quantity = input(1);

  subtotal = computed(() => this.unitPrice() * this.quantity());
}`,
  },
  {
    id: 'angular-025',
    concept: { pt: 'Composicao de Componentes', en: 'Component Composition' },
    difficulty: 'medium',
    prompt: {
      pt: 'Componentes standalone importam outros componentes diretamente. Monte um painel com header e lista.',
      en: 'Standalone components import other components directly. Build a panel with a header and list.',
    },
    code: `import { Component } from '@angular/core';
import { PanelHeaderComponent } from './panel-header.component';
import { TaskListComponent } from './task-list.component';

@Component({
  selector: 'app-task-panel',
  imports: [PanelHeaderComponent, TaskListComponent],
  template: \`
    <section>
      <app-panel-header title="Tasks" />
      <app-task-list [items]="tasks" />
    </section>
  \`,
})
export class TaskPanelComponent {
  tasks = [
    { id: 1, title: 'Review PR' },
    { id: 2, title: 'Ship release' },
  ];
}`,
  },
  {
    id: 'angular-026',
    concept: { pt: 'Reactive Forms Tipados', en: 'Typed Reactive Forms' },
    difficulty: 'medium',
    prompt: {
      pt: 'NonNullableFormBuilder cria formularios tipados. Modele um form de perfil com validadores.',
      en: 'NonNullableFormBuilder creates typed forms. Model a profile form with validators.',
    },
    code: `import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form">
      <input formControlName="name" />
      <input formControlName="email" />
    </form>
  \`,
})
export class ProfileFormComponent {
  private fb = inject(NonNullableFormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });
}`,
  },
  {
    id: 'angular-027',
    concept: { pt: 'Validador Customizado', en: 'Custom Validator' },
    difficulty: 'medium',
    prompt: {
      pt: 'Validadores customizados encapsulam regra de dominio. Crie um validator para username sem espacos.',
      en: 'Custom validators encapsulate domain rules. Create a validator for usernames without spaces.',
    },
    code: `import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noSpaces(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const hasSpace = /\\s/.test(control.value ?? '');
    return hasSpace ? { noSpaces: true } : null;
  };
}

// Usage
username: ['', [Validators.required, noSpaces()]]`,
  },
  {
    id: 'angular-028',
    concept: { pt: 'Parametros de Rota', en: 'Route Params' },
    difficulty: 'medium',
    prompt: {
      pt: 'ActivatedRoute le parametros dinamicos. Carregue um produto pelo id da URL.',
      en: 'ActivatedRoute reads dynamic parameters. Load a product from the URL id.',
    },
    code: `import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-page',
  template: '<h1>{{ product?.name }}</h1>',
})
export class ProductPage {
  private route = inject(ActivatedRoute);
  private products = inject(ProductService);
  product = this.products.empty();

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.products.findById(id).subscribe(product => {
      this.product = product;
    });
  }
}`,
  },
  {
    id: 'angular-029',
    concept: { pt: 'Route Guard', en: 'Route Guard' },
    difficulty: 'medium',
    prompt: {
      pt: 'CanActivateFn protege rotas com uma funcao. Redirecione usuarios anonimos para login.',
      en: 'CanActivateFn protects routes with a function. Redirect anonymous users to login.',
    },
    code: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};`,
  },
  {
    id: 'angular-030',
    concept: { pt: 'Resolver de Dados', en: 'Data Resolver' },
    difficulty: 'medium',
    prompt: {
      pt: 'ResolveFn carrega dados antes da rota renderizar. Resolva um usuario pelo parametro id.',
      en: 'ResolveFn loads data before the route renders. Resolve a user from the id parameter.',
    },
    code: `import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService, User } from './user.service';

export const userResolver: ResolveFn<User> = (route) => {
  const users = inject(UserService);
  const id = Number(route.paramMap.get('id'));
  return users.getUser(id);
};

export const routes = [
  {
    path: 'users/:id',
    loadComponent: () => import('./user.page').then(m => m.UserPage),
    resolve: { user: userResolver },
  },
];`,
  },
  {
    id: 'angular-031',
    concept: { pt: 'Lazy Loading', en: 'Lazy Loading' },
    difficulty: 'medium',
    prompt: {
      pt: 'loadComponent e loadChildren reduzem o bundle inicial. Defina rotas lazy para admin.',
      en: 'loadComponent and loadChildren reduce the initial bundle. Define lazy routes for admin.',
    },
    code: `import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.page').then(m => m.ProfilePage),
  },
];`,
  },
  {
    id: 'angular-032',
    concept: { pt: 'HTTP Interceptor', en: 'HTTP Interceptor' },
    difficulty: 'medium',
    prompt: {
      pt: 'HttpInterceptorFn altera requests. Inclua um token bearer quando existir.',
      en: 'HttpInterceptorFn changes requests. Include a bearer token when it exists.',
    },
    code: `import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (!token) return next(req);

  return next(req.clone({
    setHeaders: {
      Authorization: \`Bearer \${token}\`,
    },
  }));
};`,
  },
  {
    id: 'angular-033',
    concept: { pt: 'Erros HTTP', en: 'HTTP Error Handling' },
    difficulty: 'medium',
    prompt: {
      pt: 'catchError transforma falhas em estado controlado. Retorne lista vazia e registre o erro.',
      en: 'catchError turns failures into controlled state. Return an empty list and log the error.',
    },
    code: `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private http = inject(HttpClient);

  listReports() {
    return this.http.get<Report[]>('/api/reports').pipe(
      catchError(error => {
        console.error('Failed to load reports', error);
        return of([]);
      })
    );
  }
}`,
  },
  {
    id: 'angular-034',
    concept: { pt: 'Interop RxJS', en: 'RxJS Interop' },
    difficulty: 'medium',
    prompt: {
      pt: 'toSignal converte Observables para signals. Mostre dados HTTP como signal no template.',
      en: 'toSignal converts Observables to signals. Show HTTP data as a signal in the template.',
    },
    code: `import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-metrics',
  template: \`
    @if (metrics(); as data) {
      <strong>{{ data.activeUsers }}</strong>
    }
  \`,
})
export class MetricsComponent {
  private http = inject(HttpClient);

  metrics = toSignal(
    this.http.get<{ activeUsers: number }>('/api/metrics'),
    { initialValue: { activeUsers: 0 } }
  );
}`,
  },
  {
    id: 'angular-035',
    concept: { pt: 'Service com Estado', en: 'Stateful Service' },
    difficulty: 'medium',
    prompt: {
      pt: 'Um service pode expor state readonly e metodos de mutacao. Crie uma store simples de carrinho.',
      en: 'A service can expose readonly state and mutation methods. Create a simple cart store.',
    },
    code: `import { Injectable, computed, signal } from '@angular/core';

interface CartItem {
  id: number;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price, 0)
  );

  add(item: CartItem) {
    this._items.update(items => [...items, item]);
  }

  remove(id: number) {
    this._items.update(items => items.filter(item => item.id !== id));
  }
}`,
  },
  {
    id: 'angular-036',
    concept: { pt: 'Diretiva Customizada', en: 'Custom Directive' },
    difficulty: 'medium',
    prompt: {
      pt: 'Diretivas adicionam comportamento a elementos. Crie uma diretiva que destaca no hover.',
      en: 'Directives add behavior to elements. Create a directive that highlights on hover.',
    },
    code: `import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appHoverHighlight]',
})
export class HoverHighlightDirective {
  private el = inject(ElementRef<HTMLElement>);

  @HostListener('mouseenter')
  enter() {
    this.el.nativeElement.style.background = '#fff3cd';
  }

  @HostListener('mouseleave')
  leave() {
    this.el.nativeElement.style.background = '';
  }
}`,
  },
  {
    id: 'angular-037',
    concept: { pt: 'Pipe Customizado', en: 'Custom Pipe' },
    difficulty: 'medium',
    prompt: {
      pt: 'Pipes customizados mantem transformacoes reutilizaveis no template. Formate iniciais de um nome.',
      en: 'Custom pipes keep reusable transformations in the template. Format initials from a name.',
    },
    code: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split(' ')
      .filter(Boolean)
      .map(part => part[0]?.toUpperCase())
      .join('');
  }
}`,
  },
  {
    id: 'angular-038',
    concept: { pt: 'Content Projection', en: 'Content Projection' },
    difficulty: 'medium',
    prompt: {
      pt: 'ng-content permite slots reutilizaveis. Crie um modal com header, body e actions.',
      en: 'ng-content enables reusable slots. Create a modal with header, body, and actions.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-frame',
  template: \`
    <section role="dialog" aria-modal="true">
      <header>
        <ng-content select="[modal-title]" />
      </header>
      <main>
        <ng-content />
      </main>
      <footer>
        <ng-content select="[modal-actions]" />
      </footer>
    </section>
  \`,
})
export class ModalFrameComponent {}`,
  },
  {
    id: 'angular-039',
    concept: { pt: 'Teste de Componente', en: 'Component Test' },
    difficulty: 'medium',
    prompt: {
      pt: 'TestBed cria o componente em um ambiente de teste. Verifique renderizacao e clique.',
      en: 'TestBed creates the component in a test environment. Verify rendering and click behavior.',
    },
    code: `import { TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  it('increments when clicked', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1');
  });
});`,
  },
  {
    id: 'angular-040',
    concept: { pt: 'Arquitetura por Feature', en: 'Feature Architecture' },
    difficulty: 'medium',
    prompt: {
      pt: 'Organize codigo por dominio e exponha rotas da feature. Crie um arquivo users.routes.ts.',
      en: 'Organize code by domain and expose feature routes. Create a users.routes.ts file.',
    },
    code: `import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/users-list.page').then(m => m.UsersListPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/user-detail.page').then(m => m.UserDetailPage),
  },
];

// features/users/
// pages/  data-access/  ui/  users.routes.ts`,
  },
  {
    id: 'angular-041',
    concept: { pt: 'Estado Derivado com Signals', en: 'Derived Signal State' },
    difficulty: 'hard',
    prompt: {
      pt: 'Combine signals e computed para filtros complexos sem duplicar estado. Modele uma tabela filtravel.',
      en: 'Combine signals and computed for complex filters without duplicating state. Model a filterable table.',
    },
    code: `import { computed, signal } from '@angular/core';

interface Ticket {
  id: number;
  status: 'open' | 'closed';
  priority: 'low' | 'high';
}

export class TicketState {
  tickets = signal<Ticket[]>([]);
  status = signal<'all' | Ticket['status']>('all');
  highOnly = signal(false);

  visibleTickets = computed(() => {
    const status = this.status();
    const highOnly = this.highOnly();

    return this.tickets().filter(ticket => {
      const statusMatch = status === 'all' || ticket.status === status;
      const priorityMatch = !highOnly || ticket.priority === 'high';
      return statusMatch && priorityMatch;
    });
  });
}`,
  },
  {
    id: 'angular-042',
    concept: { pt: 'Recurso Assincrono', en: 'Async Resource' },
    difficulty: 'hard',
    prompt: {
      pt: 'resource conecta signals a carregamento assincrono. Carregue detalhes quando o id mudar.',
      en: 'resource connects signals to async loading. Load details when the id changes.',
    },
    code: `import { Component, resource, signal } from '@angular/core';

@Component({
  selector: 'app-user-resource',
  template: \`
    @if (user.isLoading()) {
      <p>Loading...</p>
    } @else if (user.value(); as data) {
      <h1>{{ data.name }}</h1>
    }
  \`,
})
export class UserResourceComponent {
  userId = signal(1);

  user = resource({
    request: () => ({ id: this.userId() }),
    loader: ({ request }) =>
      fetch(\`/api/users/\${request.id}\`).then(res => res.json()),
  });
}`,
  },
  {
    id: 'angular-043',
    concept: { pt: 'Performance em Listas', en: 'List Performance' },
    difficulty: 'hard',
    prompt: {
      pt: 'Listas grandes precisam de track estavel e renderizacao minima. Renderize logs por id.',
      en: 'Large lists need stable tracking and minimal rendering. Render logs by id.',
    },
    code: `import { Component, signal } from '@angular/core';

interface LogRow {
  id: string;
  message: string;
  level: 'info' | 'warn' | 'error';
}

@Component({
  selector: 'app-log-table',
  template: \`
    <table>
      @for (row of rows(); track row.id) {
        <tr [class.error]="row.level === 'error'">
          <td>{{ row.level }}</td>
          <td>{{ row.message }}</td>
        </tr>
      }
    </table>
  \`,
})
export class LogTableComponent {
  rows = signal<LogRow[]>([]);
}`,
  },
  {
    id: 'angular-044',
    concept: { pt: 'Deferred Loading', en: 'Deferred Loading' },
    difficulty: 'hard',
    prompt: {
      pt: '@defer atrasa UI pesada ate uma condicao. Carregue um grafico quando entrar no viewport.',
      en: '@defer delays heavy UI until a condition. Load a chart when it enters the viewport.',
    },
    code: `import { Component } from '@angular/core';
import { SalesChartComponent } from './sales-chart.component';

@Component({
  selector: 'app-analytics-page',
  imports: [SalesChartComponent],
  template: \`
    <h1>Analytics</h1>

    @defer (on viewport) {
      <app-sales-chart />
    } @placeholder {
      <div class="chart-skeleton">Chart loading...</div>
    } @loading {
      <p>Preparing chart...</p>
    }
  \`,
})
export class AnalyticsPage {}`,
  },
  {
    id: 'angular-045',
    concept: { pt: 'Change Detection', en: 'Change Detection' },
    difficulty: 'hard',
    prompt: {
      pt: 'ChangeDetectionStrategy.OnPush reduz verificacoes desnecessarias. Combine OnPush com inputs imutaveis.',
      en: 'ChangeDetectionStrategy.OnPush reduces unnecessary checks. Combine OnPush with immutable inputs.',
    },
    code: `import { ChangeDetectionStrategy, Component, input } from '@angular/core';

interface Activity {
  id: number;
  label: string;
}

@Component({
  selector: 'app-activity-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    @for (activity of activities(); track activity.id) {
      <p>{{ activity.label }}</p>
    }
  \`,
})
export class ActivityFeedComponent {
  activities = input.required<readonly Activity[]>();
}`,
  },
  {
    id: 'angular-046',
    concept: { pt: 'SSR e Hydration', en: 'SSR and Hydration' },
    difficulty: 'hard',
    prompt: {
      pt: 'Codigo SSR-safe evita acessar window antes do browser. Use PLATFORM_ID para proteger APIs do DOM.',
      en: 'SSR-safe code avoids accessing window before the browser. Use PLATFORM_ID to guard DOM APIs.',
    },
    code: `import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-viewport-size',
  template: '<p>{{ width() }}px</p>',
})
export class ViewportSizeComponent {
  private platformId = inject(PLATFORM_ID);
  width = signal(0);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.width.set(window.innerWidth);
    }
  }
}`,
  },
  {
    id: 'angular-047',
    concept: { pt: 'Interceptor Avancado', en: 'Advanced Interceptor' },
    difficulty: 'hard',
    prompt: {
      pt: 'Interceptors podem medir latencia e enriquecer respostas. Registre tempo de cada request.',
      en: 'Interceptors can measure latency and enrich responses. Record each request duration.',
    },
    code: `import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

export const timingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = performance.now();

  return next(req).pipe(
    finalize(() => {
      const duration = Math.round(performance.now() - started);
      console.debug(req.method, req.urlWithParams, duration + 'ms');
    })
  );
};`,
  },
  {
    id: 'angular-048',
    concept: { pt: 'Providers por Rota', en: 'Route-Level Providers' },
    difficulty: 'hard',
    prompt: {
      pt: 'Providers por rota criam escopo para uma feature lazy. Configure uma store isolada para admin.',
      en: 'Route-level providers create scope for a lazy feature. Configure an isolated admin store.',
    },
    code: `import { Routes } from '@angular/router';
import { AdminStore } from './data-access/admin.store';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    providers: [AdminStore],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin-home.page').then(m => m.AdminHomePage),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin-users.page').then(m => m.AdminUsersPage),
      },
    ],
  },
];`,
  },
  {
    id: 'angular-049',
    concept: { pt: 'Arquitetura Escalavel', en: 'Scalable Architecture' },
    difficulty: 'hard',
    prompt: {
      pt: 'Separe UI, data-access e paginas para reduzir acoplamento. Exporte uma API publica da feature.',
      en: 'Separate UI, data access, and pages to reduce coupling. Export a public API for the feature.',
    },
    code: `// features/billing/index.ts
export * from './billing.routes';
export * from './data-access/invoices.service';
export * from './ui/invoice-status.pipe';

// features/billing/billing.routes.ts
export const BILLING_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/invoices.page').then(m => m.InvoicesPage),
  },
];`,
  },
  {
    id: 'angular-050',
    concept: { pt: 'Design System', en: 'Design System' },
    difficulty: 'hard',
    prompt: {
      pt: 'Componentes de design system devem ter API pequena e previsivel. Crie um botao com variants tipadas.',
      en: 'Design system components should have a small predictable API. Create a button with typed variants.',
    },
    code: `import { Component, computed, input } from '@angular/core';

type ButtonVariant = 'primary' | 'ghost' | 'danger';

@Component({
  selector: 'ui-button',
  template: \`
    <button [class]="classes()" [disabled]="disabled()">
      <ng-content />
    </button>
  \`,
})
export class UiButtonComponent {
  variant = input<ButtonVariant>('primary');
  disabled = input(false);

  classes = computed(() => [
    'ui-button',
    \`ui-button--\${this.variant()}\`,
  ].join(' '));
}`,
  },
  {
    id: 'angular-051',
    concept: { pt: 'Acessibilidade', en: 'Accessibility' },
    difficulty: 'hard',
    prompt: {
      pt: 'Componentes interativos precisam de roles, labels e foco previsivel. Crie um toggle acessivel.',
      en: 'Interactive components need roles, labels, and predictable focus. Create an accessible toggle.',
    },
    code: `import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  template: \`
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="label()"
      (click)="changed.emit(!checked())"
    >
      {{ checked() ? 'On' : 'Off' }}
    </button>
  \`,
})
export class ToggleComponent {
  checked = input(false);
  label = input.required<string>();
  changed = output<boolean>();
}`,
  },
  {
    id: 'angular-052',
    concept: { pt: 'Seguranca e Sanitizacao', en: 'Security and Sanitization' },
    difficulty: 'hard',
    prompt: {
      pt: 'Evite bypassSecurityTrustHtml para conteudo externo. Prefira texto ou HTML sanitizado pelo Angular.',
      en: 'Avoid bypassSecurityTrustHtml for external content. Prefer text or Angular-sanitized HTML.',
    },
    code: `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-safe-comment',
  template: \`
    <article>
      <h2>{{ author() }}</h2>
      <p>{{ body() }}</p>
    </article>
  \`,
})
export class SafeCommentComponent {
  author = input.required<string>();
  body = input.required<string>();
}`,
  },
  {
    id: 'angular-053',
    concept: { pt: 'Teste de Routing', en: 'Routing Test' },
    difficulty: 'hard',
    prompt: {
      pt: 'RouterTestingHarness testa navegacao real. Verifique uma rota protegida ou parametrizada.',
      en: 'RouterTestingHarness tests real navigation. Verify a protected or parameterized route.',
    },
    code: `import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('routes', () => {
  it('renders the user page', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/users/42');

    expect(harness.routeNativeElement?.textContent)
      .toContain('User 42');
  });
});`,
  },
  {
    id: 'angular-054',
    concept: { pt: 'Component Harness', en: 'Component Harness' },
    difficulty: 'hard',
    prompt: {
      pt: 'Harnesses tornam testes menos acoplados ao DOM. Crie um harness para um botao do design system.',
      en: 'Harnesses make tests less coupled to the DOM. Create a harness for a design system button.',
    },
    code: `import { ComponentHarness } from '@angular/cdk/testing';

export class UiButtonHarness extends ComponentHarness {
  static hostSelector = 'ui-button';

  private button = this.locatorFor('button');

  async click() {
    return (await this.button()).click();
  }

  async text() {
    return (await this.button()).text();
  }

  async isDisabled() {
    return (await this.button()).getProperty<boolean>('disabled');
  }
}`,
  },
  {
    id: 'angular-055',
    concept: { pt: 'Refactor de Modulos', en: 'Module Refactor' },
    difficulty: 'hard',
    prompt: {
      pt: 'Migracoes incrementais podem importar componentes standalone em NgModules legados. Isole a mudanca.',
      en: 'Incremental migrations can import standalone components into legacy NgModules. Isolate the change.',
    },
    code: `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegacyPageComponent } from './legacy-page.component';
import { UserCardComponent } from '../users/user-card.component';

@NgModule({
  declarations: [LegacyPageComponent],
  imports: [
    CommonModule,
    UserCardComponent,
  ],
})
export class LegacyFeatureModule {}`,
  },
  {
    id: 'angular-056',
    concept: { pt: 'Boundaries de Dominio', en: 'Domain Boundaries' },
    difficulty: 'hard',
    prompt: {
      pt: 'Use tipos e portas para separar dominio de infraestrutura. Defina um contrato para repositorio de usuarios.',
      en: 'Use types and ports to separate domain from infrastructure. Define a user repository contract.',
    },
    code: `export interface User {
  id: string;
  name: string;
  email: string;
}

export abstract class UserRepository {
  abstract findById(id: string): Promise<User>;
  abstract search(query: string): Promise<User[]>;
}

export class LoadUserProfile {
  constructor(private users: UserRepository) {}

  execute(id: string) {
    return this.users.findById(id);
  }
}`,
  },
  {
    id: 'angular-057',
    concept: { pt: 'Cache de Dados', en: 'Data Cache' },
    difficulty: 'hard',
    prompt: {
      pt: 'Cache em service evita requests repetidos e permite invalidacao explicita. Guarde usuarios por id.',
      en: 'Service-level cache avoids repeated requests and allows explicit invalidation. Store users by id.',
    },
    code: `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserCache {
  private http = inject(HttpClient);
  private cache = new Map<string, ReturnType<UserCache['request']>>();

  get(id: string) {
    if (!this.cache.has(id)) {
      this.cache.set(id, this.request(id));
    }
    return this.cache.get(id)!;
  }

  invalidate(id: string) {
    this.cache.delete(id);
  }

  private request(id: string) {
    return this.http.get<User>(\`/api/users/\${id}\`).pipe(shareReplay(1));
  }
}`,
  },
  {
    id: 'angular-058',
    concept: { pt: 'Build e Deploy', en: 'Build and Deploy' },
    difficulty: 'hard',
    prompt: {
      pt: 'Builds de producao devem usar budgets para detectar regressao de bundle. Configure limites no angular.json.',
      en: 'Production builds should use budgets to detect bundle regressions. Configure limits in angular.json.',
    },
    code: `{
  "configurations": {
    "production": {
      "optimization": true,
      "sourceMap": false,
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kb",
          "maximumError": "1mb"
        },
        {
          "type": "anyComponentStyle",
          "maximumWarning": "6kb"
        }
      ]
    }
  }
}`,
  },
  {
    id: 'angular-059',
    concept: { pt: 'Observabilidade', en: 'Observability' },
    difficulty: 'hard',
    prompt: {
      pt: 'Registre erros globais com ErrorHandler customizado. Envie contexto para uma ferramenta externa.',
      en: 'Record global errors with a custom ErrorHandler. Send context to an external tool.',
    },
    code: `import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: unknown) {
    const payload = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      path: location.pathname,
    };

    navigator.sendBeacon('/api/client-errors', JSON.stringify(payload));
    console.error(error);
  }
}`,
  },
  {
    id: 'angular-060',
    concept: { pt: 'Padrao Enterprise', en: 'Enterprise Pattern' },
    difficulty: 'hard',
    prompt: {
      pt: 'Fachadas escondem detalhes de estado, HTTP e roteamento. Exponha uma API simples para a pagina.',
      en: 'Facades hide state, HTTP, and routing details. Expose a simple API for the page.',
    },
    code: `import { Injectable, computed, inject, signal } from '@angular/core';
import { OrdersApi } from './orders.api';

@Injectable()
export class OrdersFacade {
  private api = inject(OrdersApi);
  private readonly _orders = signal<Order[]>([]);

  readonly orders = this._orders.asReadonly();
  readonly openOrders = computed(() =>
    this._orders().filter(order => order.status === 'open')
  );

  load() {
    this.api.list().subscribe(orders => this._orders.set(orders));
  }

  approve(id: string) {
    this.api.approve(id).subscribe(updated => {
      this._orders.update(orders =>
        orders.map(order => order.id === id ? updated : order)
      );
    });
  }
}`,
  },
]
