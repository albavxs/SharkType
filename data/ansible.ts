import { Snippet } from '@/lib/types'

export const ansibleSnippets: Snippet[] = [
  {
    id: 'ans-001',
    concept: { pt: 'Playbook Básico', en: 'Basic Playbook' },
    difficulty: 'medium',
    prompt: {
      pt: 'Monta um playbook que atualiza os pacotes, instala o nginx e garante que o serviço tá rodando e habilitado no boot.',
      en: 'Write a playbook that updates packages, installs nginx, and ensures the service is running and enabled on boot.',
    },
    code: `- hosts: webservers
  become: yes
  tasks:
    - name: Atualizar pacotes
      apt:
        update_cache: yes
        upgrade: dist

    - name: Instalar nginx
      apt:
        name: nginx
        state: present

    - name: Iniciar nginx
      service:
        name: nginx
        state: started
        enabled: yes`,
  },
  {
    id: 'ans-002',
    concept: { pt: 'Inventário e Variáveis', en: 'Inventory and Variables' },
    difficulty: 'medium',
    prompt: {
      pt: 'Monta um inventário INI com dois servidores web, setando o usuário SSH e a chave privada como variáveis do grupo.',
      en: 'Set up an INI inventory with two web servers, defining the SSH user and private key as group variables.',
    },
    code: `# inventory/hosts.ini
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[webservers:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa`,
  },
  {
    id: 'ans-003',
    concept: { pt: 'Comandos ansible-playbook', en: 'ansible-playbook Commands' },
    difficulty: 'easy',
    prompt: {
      pt: 'Roda um playbook com inventário customizado, faz dry-run, filtra por tag e testa a conectividade com ping.',
      en: 'Run a playbook with a custom inventory, do a dry run, filter by tag, and test connectivity with ping.',
    },
    code: `ansible-playbook -i inventory/hosts.ini playbook.yml
ansible-playbook playbook.yml --check
ansible-playbook playbook.yml --tags "nginx"
ansible all -m ping`,
  },
  {
    id: 'ans-004',
    concept: { pt: 'Handlers e Notificações', en: 'Handlers and Notifications' },
    difficulty: 'medium',
    prompt: {
      pt: 'Handlers executam tarefas somente quando notificados por uma mudança. Use notify pra reiniciar o nginx quando a config mudar.',
      en: 'Handlers run tasks only when notified by a change. Use notify to restart nginx when the config changes.',
    },
    code: `- hosts: webservers
  become: yes
  tasks:
    - name: Copiar config do nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: Reiniciar nginx

    - name: Copiar site config
      copy:
        src: site.conf
        dest: /etc/nginx/sites-available/default
      notify: Reiniciar nginx

  handlers:
    - name: Reiniciar nginx
      service:
        name: nginx
        state: restarted`,
  },
  {
    id: 'ans-005',
    concept: { pt: 'Template Jinja2', en: 'Jinja2 Template' },
    difficulty: 'medium',
    prompt: {
      pt: 'O módulo template renderiza arquivos Jinja2 com variáveis do Ansible. Crie um template de config do nginx com variáveis dinâmicas.',
      en: 'The template module renders Jinja2 files with Ansible variables. Create an nginx config template with dynamic variables.',
    },
    code: `# templates/nginx.conf.j2
server {
    listen {{ http_port }};
    server_name {{ server_name }};

    location / {
        proxy_pass http://127.0.0.1:{{ app_port }};
        proxy_set_header Host $host;
    }

    {% if ssl_enabled %}
    listen 443 ssl;
    ssl_certificate {{ ssl_cert_path }};
    ssl_certificate_key {{ ssl_key_path }};
    {% endif %}
}`,
  },
  {
    id: 'ans-006',
    concept: { pt: 'Condicionais com when', en: 'Conditionals with when' },
    difficulty: 'medium',
    prompt: {
      pt: 'when executa uma tarefa somente se a condição for verdadeira. Use condicionais pra instalar pacotes diferentes por distribuição.',
      en: 'when runs a task only if the condition is true. Use conditionals to install different packages per distribution.',
    },
    code: `- hosts: all
  become: yes
  tasks:
    - name: Instalar no Debian/Ubuntu
      apt:
        name: "{{ item }}"
        state: present
      loop:
        - nginx
        - curl
        - git
      when: ansible_os_family == "Debian"

    - name: Instalar no RedHat/CentOS
      yum:
        name: "{{ item }}"
        state: present
      loop:
        - nginx
        - curl
        - git
      when: ansible_os_family == "RedHat"`,
  },
  {
    id: 'ans-007',
    concept: { pt: 'Loops com loop', en: 'Loops with loop' },
    difficulty: 'medium',
    prompt: {
      pt: 'loop itera sobre uma lista de itens na tarefa. Use pra criar múltiplos usuários com grupos e shells diferentes.',
      en: 'loop iterates over a list of items in a task. Use it to create multiple users with different groups and shells.',
    },
    code: `- hosts: all
  become: yes
  vars:
    users:
      - { name: "deploy", groups: "sudo", shell: "/bin/bash" }
      - { name: "app", groups: "www-data", shell: "/bin/sh" }
      - { name: "monitor", groups: "adm", shell: "/usr/sbin/nologin" }

  tasks:
    - name: Criar usuarios
      user:
        name: "{{ item.name }}"
        groups: "{{ item.groups }}"
        shell: "{{ item.shell }}"
        state: present
      loop: "{{ users }}"`,
  },
  {
    id: 'ans-008',
    concept: { pt: 'Roles', en: 'Roles' },
    difficulty: 'hard',
    prompt: {
      pt: 'Roles organizam playbooks em estrutura padronizada com tasks, handlers, templates e defaults. Monte a estrutura e use no playbook.',
      en: 'Roles organize playbooks into a standardized structure with tasks, handlers, templates, and defaults. Set up the structure and use it in a playbook.',
    },
    code: `# roles/nginx/tasks/main.yml
- name: Instalar nginx
  apt:
    name: nginx
    state: present

- name: Copiar config
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Reiniciar nginx

# roles/nginx/defaults/main.yml
http_port: 80
server_name: localhost

# roles/nginx/handlers/main.yml
- name: Reiniciar nginx
  service:
    name: nginx
    state: restarted

# site.yml
- hosts: webservers
  become: yes
  roles:
    - nginx`,
  },
  {
    id: 'ans-009',
    concept: { pt: 'Register e Debug', en: 'Register and Debug' },
    difficulty: 'medium',
    prompt: {
      pt: 'register salva a saída de uma tarefa numa variável, e debug exibe valores pra depuração. Capture a saída de um comando e exiba.',
      en: 'register saves a task\'s output to a variable, and debug displays values for debugging. Capture a command\'s output and display it.',
    },
    code: `- hosts: all
  tasks:
    - name: Verificar espaco em disco
      command: df -h /
      register: disk_usage

    - name: Exibir resultado
      debug:
        var: disk_usage.stdout_lines

    - name: Alerta se disco cheio
      debug:
        msg: "ALERTA: disco quase cheio!"
      when: disk_usage.stdout is search("9[0-9]%")`,
  },
  {
    id: 'ans-010',
    concept: { pt: 'Vault (Criptografia de Segredos)', en: 'Vault (Secret Encryption)' },
    difficulty: 'hard',
    prompt: {
      pt: 'ansible-vault criptografa arquivos de variáveis com segredos. Crie, edite e use um arquivo vault num playbook.',
      en: 'ansible-vault encrypts variable files with secrets. Create, edit, and use a vault file in a playbook.',
    },
    code: `ansible-vault create secrets.yml
ansible-vault edit secrets.yml
ansible-vault view secrets.yml

ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file .vault_pass

# secrets.yml (antes de criptografar)
db_password: "s3cr3t_p4ss"
api_key: "abc123def456"
ssl_passphrase: "minha_senha"`,
  },
  {
    id: 'ans-011',
    concept: { pt: 'Tags e Limites', en: 'Tags and Limits' },
    difficulty: 'easy',
    prompt: {
      pt: 'Tags filtram quais tarefas executar e --limit restringe pra hosts específicos. Use tags pra organizar tarefas por função.',
      en: 'Tags filter which tasks to run and --limit restricts to specific hosts. Use tags to organize tasks by function.',
    },
    code: `- hosts: webservers
  become: yes
  tasks:
    - name: Instalar dependencias
      apt:
        name: "{{ item }}"
        state: present
      loop: [nginx, certbot]
      tags: [install, setup]

    - name: Deploy da aplicacao
      copy:
        src: app/
        dest: /var/www/app/
      tags: [deploy]

    - name: Reiniciar servicos
      service:
        name: nginx
        state: restarted
      tags: [deploy, restart]

# ansible-playbook site.yml --tags "deploy"
# ansible-playbook site.yml --limit "web1"`,
  },
  {
    id: 'ans-012',
    concept: { pt: 'Gerenciamento de Serviços', en: 'Service Management' },
    difficulty: 'easy',
    prompt: {
      pt: 'Os módulos service e systemd controlam serviços do sistema. Gerencie nginx, PostgreSQL e uma app custom.',
      en: 'The service and systemd modules control system services. Manage nginx, PostgreSQL, and a custom app.',
    },
    code: `- hosts: all
  become: yes
  tasks:
    - name: Garantir nginx rodando
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Reiniciar PostgreSQL
      systemd:
        name: postgresql
        state: restarted
        daemon_reload: yes

    - name: Parar app antiga
      service:
        name: myapp
        state: stopped
      ignore_errors: yes`,
  },
]
