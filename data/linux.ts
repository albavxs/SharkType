import { Snippet } from '@/lib/types'

export const linuxSnippets: Snippet[] = [
  {
    id: 'linux-001',
    concept: { pt: 'Navegação', en: 'Navigation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Liste tudo (incluindo ocultos) com permissões em /var/log, entre em /etc/nginx e mostre onde você tá.',
      en: 'List all files (including hidden) with permissions in /var/log, navigate to /etc/nginx, and print the current path.',
    },
    code: `ls -la /var/log
cd /etc/nginx
pwd`,
  },
  {
    id: 'linux-002',
    concept: { pt: 'Operações com Arquivos', en: 'File Operations' },
    difficulty: 'easy',
    prompt: {
      pt: 'Copie um diretório inteiro, renomeie um arquivo e apague uma pasta de cache com tudo dentro.',
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
      pt: 'Crie uma estrutura de pastas aninhada, crie arquivos de config vazios e veja as infos do sistema.',
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
      pt: 'Procure TODOs nos arquivos TypeScript, ache logs com mais de 7 dias e encontre arquivos grandes em /var.',
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
      pt: 'Deixe um script executável, defina permissões de leitura pros arquivos web e passe a ownership pro usuário do server.',
      en: 'Make a script executable, set read permissions for web files, and transfer ownership to the web server user.',
    },
    code: `chmod 755 deploy.sh
chmod -R 644 /var/www/html
chown -R www-data:www-data /var/www`,
  },
  {
    id: 'linux-006',
    concept: { pt: 'Processos', en: 'Processes' },
    difficulty: 'medium',
    prompt: {
      pt: 'Ache o processo do nginx, mate pelo PID, reinicie o serviço e acompanhe os logs em tempo real.',
      en: 'Find the nginx process, kill it by PID, restart the service, and follow its logs in real time.',
    },
    code: `ps aux | grep nginx
kill -9 1234
systemctl restart nginx
journalctl -u nginx -f`,
  },
  {
    id: 'linux-007',
    concept: { pt: 'Compactação', en: 'Archives' },
    difficulty: 'medium',
    prompt: {
      pt: 'Compacte um diretório em .tar.gz, extraia em outro lugar e crie um .zip ignorando source maps.',
      en: 'Compress a directory into .tar.gz, extract it elsewhere, and create a .zip excluding source maps.',
    },
    code: `tar -czf backup.tar.gz /var/www
tar -xzf backup.tar.gz -C /restore
zip -r dist.zip dist/ -x "*.map"`,
  },
  {
    id: 'linux-008',
    concept: { pt: 'Rede', en: 'Network' },
    difficulty: 'medium',
    prompt: {
      pt: 'Mande um POST com JSON pra uma API e baixe um arquivo de uma URL remota.',
      en: 'Send a JSON POST request to an API and download a file from a remote URL.',
    },
    code: `curl -X POST https://api.example.com/data \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
wget -O file.zip https://example.com/file.zip`,
  },
  {
    id: 'linux-009',
    concept: { pt: 'Processamento de Texto', en: 'Text Processing' },
    difficulty: 'hard',
    prompt: {
      pt: 'Some uma coluna numérica com awk, troque uma variável de ambiente com sed e liste os usuários do sistema.',
      en: 'Sum a numeric column with awk, replace an env variable with sed, and list unique system users.',
    },
    code: `awk '{sum += $3} END {print sum}' access.log
sed -i 's/localhost/production.db/g' .env
cut -d: -f1 /etc/passwd | sort | uniq`,
  },
  {
    id: 'linux-010',
    concept: { pt: 'Pipelines', en: 'Pipelines' },
    difficulty: 'hard',
    prompt: {
      pt: 'Descubra os IPs com mais erros no log e liste os diretórios que mais ocupam espaço.',
      en: 'Find the IPs with the most errors in the log and list the directories consuming the most disk space.',
    },
    code: `cat access.log | grep "ERROR" | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
du -sh */ | sort -rh | head -10`,
  },
  {
    id: 'linux-011',
    concept: { pt: 'Serviços Systemd', en: 'Systemd Services' },
    difficulty: 'medium',
    prompt: {
      pt: 'Suba o nginx, habilite na inicialização, confira o status, reinicie e acompanhe os logs.',
      en: 'Start nginx, enable it on boot, check its status, restart it, and follow its logs.',
    },
    code: `sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
sudo systemctl restart nginx
sudo journalctl -u nginx -f`,
  },
  {
    id: 'linux-012',
    concept: { pt: 'Variáveis de Ambiente', en: 'Environment Variables' },
    difficulty: 'easy',
    prompt: {
      pt: 'Exporte uma variável de banco, veja o PATH, filtre variáveis do Node e recarregue o bashrc.',
      en: 'Export a database URL, print the PATH, filter Node-related env vars, and reload bashrc.',
    },
    code: `export DATABASE_URL="postgresql://localhost/mydb"
echo $PATH
printenv | grep NODE
source ~/.bashrc`,
  },
  {
    id: 'linux-013',
    concept: { pt: 'Agendamento com Cron', en: 'Cron Scheduling' },
    difficulty: 'medium',
    prompt: {
      pt: 'Edite a crontab e agende um backup diário às 2h e um healthcheck a cada 5 minutos.',
      en: 'Edit the crontab and schedule a daily backup at 2 AM and a healthcheck every 5 minutes.',
    },
    code: `crontab -e
# Formato: minuto hora dia mes diasemana comando
0 2 * * * /opt/scripts/backup.sh
*/5 * * * * /opt/scripts/healthcheck.sh`,
  },
  {
    id: 'linux-014',
    concept: { pt: 'SSH e Cópia Segura', en: 'SSH & Secure Copy' },
    difficulty: 'medium',
    prompt: {
      pt: 'Conecte via SSH por IP e por chave, copie uma pasta pro servidor e envie um arquivo com chave .pem.',
      en: 'SSH by IP and by key, copy a folder to the server, and send a file using a .pem key.',
    },
    code: `ssh ubuntu@192.168.1.10
ssh -i ~/.ssh/id_rsa user@server.com
scp -r ./dist user@server:/var/www/html
scp -i key.pem file.txt ubuntu@ip:/home/ubuntu/`,
  },
  {
    id: 'linux-015',
    concept: { pt: 'Curl para APIs', en: 'Curl for APIs' },
    difficulty: 'medium',
    prompt: {
      pt: 'Faça um GET simples, um POST com JSON e baixe um arquivo direto pela URL.',
      en: 'Make a simple GET, a JSON POST request, and download a file directly by URL.',
    },
    code: `curl https://api.exemplo.com/users
curl -X POST https://api.exemplo.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice"}'
curl -o arquivo.zip https://example.com/file.zip`,
  },
  {
    id: 'linux-016',
    concept: { pt: 'Uso de Disco e Memória', en: 'Disk & Memory Usage' },
    difficulty: 'easy',
    prompt: {
      pt: 'Veja o espaço em disco geral e do /home, confira a memória livre e descubra o tamanho dos logs.',
      en: 'Check overall and /home disk space, view free memory, and find log directory sizes.',
    },
    code: `df -h
df -h /home
free -h
du -sh /var/log/*`,
  },
  {
    id: 'linux-017',
    concept: { pt: 'Grep Avançado', en: 'Advanced Grep' },
    difficulty: 'medium',
    prompt: {
      pt: 'Busque erros no log, procure TODOs recursivamente no src, filtre warnings e remova linhas de debug.',
      en: 'Search for errors in logs, recursively find TODOs in src, filter warnings, and strip debug lines.',
    },
    code: `grep "ERROR" /var/log/app.log
grep -r "TODO" ./src
grep -i "warning" app.log | tail -n 50
grep -v "DEBUG" app.log > filtered.log`,
  },
]
