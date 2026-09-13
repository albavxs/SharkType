import { Snippet } from '@/lib/types'

export const linuxSnippets: Snippet[] = [
  {
    id: 'linux-001',
    concept: { pt: 'Navegação de Arquivos', en: 'Navigation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lista tudo com permissões em /var/log (inclusive os ocultos), entra em /etc/nginx e mostra o caminho atual.',
      en: 'List all files (including hidden) with permissions in /var/log, navigate to /etc/nginx, and print the current path.',
    },
    code: `ls -la /var/log
cd /etc/nginx
pwd`,
  },
  {
    id: 'linux-002',
    concept: { pt: 'Gerenciamento de Arquivos', en: 'File Operations' },
    difficulty: 'easy',
    prompt: {
      pt: 'Copia um diretório inteiro, renomeia um arquivo e apaga uma pasta de cache com tudo dentro.',
      en: 'Recursively copy a directory, rename a file, and remove a cache folder with all its contents.',
    },
    code: `cp -r src/ backup/
mv old_name.txt new_name.txt
rm -rf /tmp/cache`,
  },
  {
    id: 'linux-003',
    concept: { pt: 'Criar & Visualizar', en: 'Create & View' },
    difficulty: 'easy',
    prompt: {
      pt: 'Cria uma estrutura de pastas aninhada, cria uns arquivos de config vazios e mostra as infos do sistema operacional.',
      en: 'Create a nested directory structure, create empty config files, and display OS information.',
    },
    code: `mkdir -p projects/api/src
touch .env .gitignore
cat /etc/os-release`,
  },
  {
    id: 'linux-004',
    concept: { pt: 'Busca', en: 'Search' },
    difficulty: 'easy',
    prompt: {
      pt: 'Procura TODOs nos arquivos TypeScript, acha logs com mais de 7 dias e encontra arquivos grandes em /var.',
      en: 'Search for TODOs in TypeScript files, find logs older than 7 days, and locate large files under /var.',
    },
    code: `grep -r "TODO" src/ --include="*.ts"
find . -name "*.log" -mtime +7
find /var -size +100M -type f`,
  },
  {
    id: 'linux-005',
    concept: { pt: 'Permissões', en: 'Permissions' },
    difficulty: 'medium',
    prompt: {
      pt: 'Deixa um script executável, seta permissões de leitura pros arquivos web e passa o ownership pro usuário do server.',
      en: 'Make a script executable, set read permissions for web files, and transfer ownership to the web server user.',
    },
    code: `chmod 755 deploy.sh
chmod -R 644 /var/www/html
chown -R www-data:www-data /var/www`,
  },
  {
    id: 'linux-006',
    concept: { pt: 'Gerenciamento de Processos', en: 'Processes' },
    difficulty: 'medium',
    prompt: {
      pt: 'Acha o processo do nginx, mata pelo PID, restarta o serviço e fica acompanhando os logs em tempo real.',
      en: 'Find the nginx process, kill it by PID, restart the service, and follow its logs in real time.',
    },
    code: `ps aux | grep nginx
kill -9 1234
systemctl restart nginx
journalctl -u nginx -f`,
  },
]
