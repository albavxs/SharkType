import { Snippet } from '@/lib/types'

// ── Nmap (Red Team) ──────────────────────────────────────────────────────
export const nmapSnippets: Snippet[] = [
  {
    id: 'sec-001',
    concept: { pt: 'Varredura Nmap Básica', en: 'Basic Nmap Scan' },
    difficulty: 'easy',
    prompt: {
      pt: 'Escaneia um host, uma sub-rede inteira e faz descoberta de hosts sem scan de portas.',
      en: 'Scan a single host, an entire subnet, and do host discovery without port scanning.',
    },
    code: `nmap 192.168.1.1
nmap 192.168.1.0/24
nmap -sn 192.168.1.0/24`,
  },
  {
    id: 'sec-002',
    concept: { pt: 'Padrão de Varredura Recon', en: 'Recon Scan Pattern' },
    difficulty: 'medium',
    prompt: {
      pt: 'Roda um scan com scripts padrão e detecção de versão, depois um completo em todas as portas salvando num arquivo.',
      en: 'Run a scan with default scripts and version detection, then a full all-ports scan saving output to a file.',
    },
    code: `nmap -sC -sV -T4 192.168.1.1
nmap -sC -sV -p- -T4 192.168.1.1 -oN scan.txt`,
  },
  {
    id: 'sec-003',
    concept: { pt: 'Tipos de Varredura', en: 'Scan Types' },
    difficulty: 'medium',
    prompt: {
      pt: 'Roda os quatro tipos principais de scan: SYN stealth, TCP connect, UDP e ACK.',
      en: 'Run the four main scan types: SYN stealth, TCP connect, UDP, and ACK.',
    },
    code: `nmap -sS 192.168.1.1   # SYN scan (stealthy)
nmap -sT 192.168.1.1   # TCP connect scan
nmap -sU 192.168.1.1   # UDP scan
nmap -sA 192.168.1.1   # ACK scan`,
  },
  {
    id: 'sec-004',
    concept: { pt: 'Portas Específicas', en: 'Specific Ports' },
    difficulty: 'easy',
    prompt: {
      pt: 'Escaneia portas específicas, um range, todas as 65535 e as 100 mais comuns.',
      en: 'Scan specific ports, a range, all 65535, and the top 100 most common.',
    },
    code: `nmap -p 22,80,443 192.168.1.1
nmap -p 1-1000 192.168.1.1
nmap -p- 192.168.1.1
nmap --top-ports 100 192.168.1.1`,
  },
  {
    id: 'sec-005',
    concept: { pt: 'Detecção de SO e Versão', en: 'OS and Version Detection' },
    difficulty: 'medium',
    prompt: {
      pt: 'Detecta o sistema operacional, as versões dos serviços e roda o scan agressivo completo.',
      en: 'Detect the operating system, service versions, and run the full aggressive scan.',
    },
    code: `nmap -O 192.168.1.1
nmap -sV 192.168.1.1
nmap -A 192.168.1.1   # OS + version + scripts + traceroute`,
  },
  {
    id: 'sec-006',
    concept: { pt: 'Saída e Evasão', en: 'Output and Evasion' },
    difficulty: 'hard',
    prompt: {
      pt: 'Salva os resultados em texto e XML, pula descoberta de host e usa decoys pra dificultar a detecção.',
      en: 'Save results as text and XML, skip host discovery, and use decoys to evade detection.',
    },
    code: `nmap -oN normal.txt 192.168.1.1
nmap -oX scan.xml 192.168.1.1
nmap -Pn 192.168.1.1   # pular descoberta de host
nmap -D RND:10 192.168.1.1   # decoys`,
  },
]

// ── Web Recon (Red Team) ─────────────────────────────────────────────────
export const webReconSnippets: Snippet[] = [
  {
    id: 'sec-017',
    concept: { pt: 'Teste de Endpoints com curl', en: 'curl Endpoint Testing' },
    difficulty: 'easy',
    prompt: {
      pt: 'Pega só os headers, busca o header do servidor, testa o método OPTIONS e força resolução DNS local.',
      en: 'Fetch headers only, grab the server header, test OPTIONS method, and force local DNS resolution.',
    },
    code: `curl -I https://example.com
curl -sk https://example.com | grep -i "server"
curl -X OPTIONS https://example.com -v
curl --resolve example.com:443:127.0.0.1 https://example.com`,
  },
  {
    id: 'sec-018',
    concept: { pt: 'Reconhecimento com whois e dig', en: 'whois and dig Recon' },
    difficulty: 'easy',
    prompt: {
      pt: 'Consulta dados WHOIS, resolve DNS com dig, busca registros MX e A e usa nslookup com DNS alternativo.',
      en: 'Look up WHOIS data, resolve DNS with dig, query MX and A records, and use nslookup with an alternate DNS.',
    },
    code: `whois example.com
dig example.com
dig example.com MX
dig +short example.com A
nslookup example.com 8.8.8.8`,
  },
  {
    id: 'sec-019',
    concept: { pt: 'Enumeração de Subdomínios', en: 'Subdomain Enumeration' },
    difficulty: 'medium',
    prompt: {
      pt: 'Use ferramentas de DNS pra descobrir subdomínios de um alvo. Combine dig, host e transferência de zona.',
      en: 'Use DNS tools to discover subdomains of a target. Combine dig, host, and zone transfer.',
    },
    code: `dig +short example.com NS
dig axfr example.com @ns1.example.com
host -t ns example.com
dig +short -f subdomains.txt example.com

for sub in www mail api dev staging; do
  host "$sub.example.com" | grep "has address"
done`,
  },
  {
    id: 'sec-020',
    concept: { pt: 'Análise de Headers HTTP', en: 'HTTP Header Analysis' },
    difficulty: 'medium',
    prompt: {
      pt: 'Analise headers de segurança HTTP pra identificar configurações fracas. Verifique CORS, CSP e cookies.',
      en: 'Analyze HTTP security headers to identify weak configurations. Check CORS, CSP, and cookies.',
    },
    code: `curl -sI https://example.com | grep -iE "x-frame|x-content|strict|content-security|x-xss"
curl -sI https://example.com | grep -i "set-cookie"
curl -sI https://example.com | grep -i "access-control"

curl -sk -o /dev/null -w "%{http_code}" https://example.com
curl -X TRACE https://example.com -v 2>&1 | grep "HTTP/"`,
  },
  {
    id: 'sec-021',
    concept: { pt: 'Enumeração de Diretórios', en: 'Directory Enumeration' },
    difficulty: 'hard',
    prompt: {
      pt: 'Busque arquivos e diretórios expostos no servidor web usando curl e wordlists comuns.',
      en: 'Search for exposed files and directories on the web server using curl and common wordlists.',
    },
    code: `for path in robots.txt sitemap.xml .env .git/HEAD wp-login.php; do
  code=$(curl -sk -o /dev/null -w "%{http_code}" "https://example.com/$path")
  echo "$code -- /$path"
done

curl -sk https://example.com/robots.txt
curl -sk https://example.com/.well-known/security.txt`,
  },
]

// ── Firewall (Blue Team) ─────────────────────────────────────────────────
export const firewallSnippets: Snippet[] = [
  {
    id: 'sec-007',
    concept: { pt: 'Firewall UFW', en: 'UFW Firewall' },
    difficulty: 'easy',
    prompt: {
      pt: 'Confere o status do UFW, ativa, libera SSH e HTTP, bloqueia telnet e remove uma regra.',
      en: 'Check UFW status, enable it, allow SSH and HTTP, block telnet, and delete a rule.',
    },
    code: `sudo ufw status
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw deny 23
sudo ufw delete allow 80/tcp`,
  },
  {
    id: 'sec-008',
    concept: { pt: 'Regras iptables', en: 'iptables Rules' },
    difficulty: 'hard',
    prompt: {
      pt: 'Lista as regras detalhadas, libera SSH e HTTP, bloqueia todo o resto e seta a política padrão como DROP.',
      en: 'List verbose rules, allow SSH and HTTP, drop everything else, and set the default INPUT policy to DROP.',
    },
    code: `sudo iptables -L -v
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -j DROP
sudo iptables -P INPUT DROP`,
  },
  {
    id: 'sec-022',
    concept: { pt: 'UFW Avançado', en: 'Advanced UFW' },
    difficulty: 'medium',
    prompt: {
      pt: 'Configure regras UFW avançadas com rate limiting, ranges de portas e regras por IP específico.',
      en: 'Configure advanced UFW rules with rate limiting, port ranges, and IP-specific rules.',
    },
    code: `sudo ufw limit ssh/tcp
sudo ufw allow from 192.168.1.0/24 to any port 3306
sudo ufw allow 6000:6007/tcp
sudo ufw deny from 10.0.0.5

sudo ufw logging on
sudo ufw status verbose
sudo ufw show added`,
  },
  {
    id: 'sec-023',
    concept: { pt: 'nftables (Sucessor do iptables)', en: 'nftables (iptables Successor)' },
    difficulty: 'hard',
    prompt: {
      pt: 'nftables é o substituto moderno do iptables. Configure uma tabela com chain de input permitindo SSH e HTTP.',
      en: 'nftables is the modern iptables replacement. Configure a table with an input chain allowing SSH and HTTP.',
    },
    code: `sudo nft add table inet filter
sudo nft add chain inet filter input { type filter hook input priority 0 \\; policy drop \\; }

sudo nft add rule inet filter input ct state established,related accept
sudo nft add rule inet filter input iif lo accept
sudo nft add rule inet filter input tcp dport 22 accept
sudo nft add rule inet filter input tcp dport { 80, 443 } accept

sudo nft list ruleset
sudo nft list table inet filter`,
  },
  {
    id: 'sec-024',
    concept: { pt: 'Fail2Ban', en: 'Fail2Ban' },
    difficulty: 'medium',
    prompt: {
      pt: 'Fail2Ban bane IPs após falhas de autenticação repetidas. Configure jail pra SSH com tempos e limites customizados.',
      en: 'Fail2Ban bans IPs after repeated authentication failures. Configure SSH jail with custom times and limits.',
    },
    code: `# /etc/fail2ban/jail.local
[sshd]
enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 3600
findtime = 600

# Comandos
sudo systemctl start fail2ban
sudo fail2ban-client status sshd
sudo fail2ban-client set sshd unbanip 192.168.1.50`,
  },
]

// ── Network Analysis (Blue Team) ─────────────────────────────────────────
export const networkAnalysisSnippets: Snippet[] = [
  {
    id: 'sec-009',
    concept: { pt: 'Captura de Pacotes com tcpdump', en: 'tcpdump Packet Capture' },
    difficulty: 'medium',
    prompt: {
      pt: 'Captura pacotes numa interface, salva em arquivo, filtra por host e porta e lê uma captura salva.',
      en: 'Capture packets on an interface, save to file, filter by host and port, and read a saved capture.',
    },
    code: `sudo tcpdump -i eth0
sudo tcpdump -w capture.pcap -i eth0
sudo tcpdump host 192.168.1.1
sudo tcpdump port 80
sudo tcpdump -r capture.pcap`,
  },
  {
    id: 'sec-010',
    concept: { pt: 'Portas Abertas com ss/netstat', en: 'Open Ports with ss/netstat' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lista as portas abertas com ss e netstat, filtrando pelas conexões em LISTEN e pela porta 80.',
      en: 'List open ports with ss and netstat, filtering for listening connections and port 80.',
    },
    code: `ss -tuln
ss -tulnp | grep LISTEN
netstat -tuln
netstat -tulnp | grep :80`,
  },
  {
    id: 'sec-025',
    concept: { pt: 'Análise de Tráfego com tcpdump Avançado', en: 'Advanced tcpdump Traffic Analysis' },
    difficulty: 'hard',
    prompt: {
      pt: 'Filtre tráfego com expressões complexas do tcpdump pra capturar pacotes SYN, DNS e tráfego HTTP.',
      en: 'Filter traffic with complex tcpdump expressions to capture SYN packets, DNS, and HTTP traffic.',
    },
    code: `sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0'
sudo tcpdump -i eth0 port 53 -n
sudo tcpdump -i eth0 'tcp port 80 and host 192.168.1.1'
sudo tcpdump -i eth0 -A 'tcp port 80' | grep "GET\\|POST"

sudo tcpdump -i eth0 -c 1000 -w capture.pcap 'not port 22'`,
  },
  {
    id: 'sec-026',
    concept: { pt: 'Monitoramento com iftop e nethogs', en: 'Monitoring with iftop and nethogs' },
    difficulty: 'medium',
    prompt: {
      pt: 'iftop mostra conexões por bandwidth e nethogs mostra tráfego por processo. Use ambos pra identificar consumo anormal.',
      en: 'iftop shows connections by bandwidth and nethogs shows traffic per process. Use both to identify abnormal consumption.',
    },
    code: `sudo iftop -i eth0
sudo iftop -i eth0 -f "port 443"
sudo iftop -i eth0 -n -P

sudo nethogs eth0
sudo nethogs -d 5 eth0

sudo lsof -i :80
sudo lsof -i -P -n | grep LISTEN`,
  },
  {
    id: 'sec-027',
    concept: { pt: 'Análise de Conexões Ativas', en: 'Active Connection Analysis' },
    difficulty: 'medium',
    prompt: {
      pt: 'Analise conexões ativas pra detectar comportamento suspeito -- muitas conexões de um IP, estados incomuns.',
      en: 'Analyze active connections to detect suspicious behavior -- many connections from one IP, unusual states.',
    },
    code: `ss -tan state established | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head
ss -tan state time-wait | wc -l
ss -tan state syn-recv | wc -l

watch -n 2 'ss -s'
cat /proc/net/nf_conntrack | wc -l`,
  },
]

// ── Hardening (Blue Team) ────────────────────────────────────────────────
export const hardeningSnippets: Snippet[] = [
  {
    id: 'sec-014',
    concept: { pt: 'Auditoria de Permissões', en: 'Permission Audit' },
    difficulty: 'medium',
    prompt: {
      pt: 'Encontra binários com SUID e SGID no sistema, confere as permissões do shadow e os detalhes do passwd.',
      en: 'Find SUID and SGID binaries on the system, check shadow permissions, and inspect passwd details.',
    },
    code: `find / -perm -4000 2>/dev/null   # SUID bits
find / -perm -2000 2>/dev/null   # SGID bits
ls -la /etc/shadow
stat /etc/passwd`,
  },
  {
    id: 'sec-015',
    concept: { pt: 'Monitoramento de Logs de Segurança', en: 'Security Log Monitoring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Fica acompanhando o auth.log em tempo real, filtra tentativas de senha errada e vê os últimos logins.',
      en: 'Tail the auth log in real time, filter failed password attempts, and check recent logins.',
    },
    code: `sudo tail -f /var/log/auth.log
sudo grep "Failed password" /var/log/auth.log
sudo lastlog
sudo last -n 20`,
  },
  {
    id: 'sec-016',
    concept: { pt: 'Usuários e sudo', en: 'Users and sudo' },
    difficulty: 'medium',
    prompt: {
      pt: 'Cria um usuário deploy, adiciona no grupo sudo, desabilita login do root, confere o ID e edita o sudoers.',
      en: 'Create a deploy user, add to sudo group, disable root login, check the user ID, and edit sudoers.',
    },
    code: `sudo adduser deploy
sudo usermod -aG sudo deploy
sudo passwd -l root   # desabilitar login root
id deploy
sudo visudo`,
  },
  {
    id: 'sec-028',
    concept: { pt: 'Hardening do SSH', en: 'SSH Hardening' },
    difficulty: 'medium',
    prompt: {
      pt: 'Configure o SSH pra desabilitar root login, forçar autenticação por chave e limitar tentativas de acesso.',
      en: 'Configure SSH to disable root login, enforce key authentication, and limit access attempts.',
    },
    code: `# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
LoginGraceTime 30
AllowUsers deploy admin

# Aplicar e testar
sudo sshd -t
sudo systemctl restart sshd`,
  },
  {
    id: 'sec-029',
    concept: { pt: 'Auditoria com Lynis', en: 'Lynis Security Audit' },
    difficulty: 'hard',
    prompt: {
      pt: 'Lynis faz auditoria de segurança completa no sistema. Execute o scan e analise os resultados.',
      en: 'Lynis performs a comprehensive security audit. Run the scan and analyze results.',
    },
    code: `sudo lynis audit system
sudo lynis audit system --quick

sudo cat /var/log/lynis.log
sudo grep "warning" /var/log/lynis-report.dat
sudo grep "suggestion" /var/log/lynis-report.dat`,
  },
  {
    id: 'sec-030',
    concept: { pt: 'Integridade de Arquivos', en: 'File Integrity' },
    difficulty: 'hard',
    prompt: {
      pt: 'Verifique a integridade de arquivos críticos do sistema usando checksums e monitoramento de mudanças.',
      en: 'Verify the integrity of critical system files using checksums and change monitoring.',
    },
    code: `sha256sum /etc/passwd /etc/shadow /etc/sudoers > /root/checksums.txt
sha256sum -c /root/checksums.txt

find /etc -type f -mtime -1 -ls
find /usr/bin -type f -newer /etc/passwd

sudo debsums -c 2>/dev/null
sudo rpm -Va 2>/dev/null`,
  },
]

// ── Cryptography ─────────────────────────────────────────────────────────
export const cryptoSnippets: Snippet[] = [
  {
    id: 'sec-011',
    concept: { pt: 'Certificado SSL Autoassinado', en: 'Self-signed Certificate' },
    difficulty: 'medium',
    prompt: {
      pt: 'Gera um certificado autoassinado RSA 4096 bits válido por 1 ano, sem passphrase na chave privada.',
      en: 'Generate a self-signed RSA 4096-bit certificate valid for 1 year, with no passphrase on the private key.',
    },
    code: `openssl req -x509 -newkey rsa:4096 \\
  -keyout key.pem \\
  -out cert.pem \\
  -days 365 \\
  -nodes`,
  },
  {
    id: 'sec-012',
    concept: { pt: 'Inspecionar Certificado SSL', en: 'Inspect Certificate' },
    difficulty: 'medium',
    prompt: {
      pt: 'Mostra os detalhes de um certificado local, conecta num servidor pra ver o cert remoto e verifica a cadeia de confiança.',
      en: 'Display details of a local certificate, connect to a server to view the remote cert, and verify the trust chain.',
    },
    code: `openssl x509 -in cert.pem -text -noout
openssl s_client -connect example.com:443
openssl verify -CAfile ca.pem cert.pem`,
  },
  {
    id: 'sec-013',
    concept: { pt: 'Gerenciamento de Chave SSH', en: 'SSH Key Management' },
    difficulty: 'medium',
    prompt: {
      pt: 'Gera uma chave ed25519, copia pro servidor remoto, adiciona no authorized_keys e ajusta as permissões.',
      en: 'Generate an ed25519 key, copy it to the remote server, add it to authorized_keys, and fix permissions.',
    },
    code: `ssh-keygen -t ed25519 -C "voce@email.com"
ssh-copy-id user@192.168.1.10
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys`,
  },
  {
    id: 'sec-031',
    concept: { pt: 'Hash e Verificação de Integridade', en: 'Hashing and Integrity Verification' },
    difficulty: 'easy',
    prompt: {
      pt: 'Use openssl pra gerar hashes MD5, SHA256 e SHA512 de arquivos, e pra verificar a integridade de downloads.',
      en: 'Use openssl to generate MD5, SHA256, and SHA512 hashes of files, and to verify download integrity.',
    },
    code: `openssl dgst -sha256 arquivo.tar.gz
openssl dgst -sha512 arquivo.tar.gz
openssl dgst -md5 arquivo.tar.gz

sha256sum arquivo.tar.gz > checksum.txt
sha256sum -c checksum.txt`,
  },
  {
    id: 'sec-032',
    concept: { pt: 'Criptografia de Arquivos', en: 'File Encryption' },
    difficulty: 'medium',
    prompt: {
      pt: 'Use openssl pra criptografar e descriptografar arquivos com AES-256. Proteja backups e dados sensíveis.',
      en: 'Use openssl to encrypt and decrypt files with AES-256. Protect backups and sensitive data.',
    },
    code: `openssl enc -aes-256-cbc -salt -pbkdf2 \\
  -in backup.sql -out backup.sql.enc

openssl enc -aes-256-cbc -d -pbkdf2 \\
  -in backup.sql.enc -out backup.sql

openssl rand -base64 32 > secret.key
openssl enc -aes-256-cbc -salt -pbkdf2 \\
  -pass file:secret.key -in data.txt -out data.txt.enc`,
  },
  {
    id: 'sec-033',
    concept: { pt: 'CSR e Cadeia de Certificados', en: 'CSR and Certificate Chain' },
    difficulty: 'hard',
    prompt: {
      pt: 'Gere um CSR pra solicitar certificado a uma CA, e verifique a cadeia de confiança de um certificado SSL.',
      en: 'Generate a CSR to request a certificate from a CA, and verify the trust chain of an SSL certificate.',
    },
    code: `openssl genrsa -out server.key 4096
openssl req -new -key server.key -out server.csr \\
  -subj "/CN=example.com/O=Minha Empresa/C=BR"

openssl req -in server.csr -text -noout

openssl s_client -connect example.com:443 -showcerts
openssl verify -CAfile ca-bundle.crt server.crt`,
  },
]

// ── Combined export (backwards compat) ───────────────────────────────────
export const cybersecSnippets: Snippet[] = [
  ...nmapSnippets,
  ...webReconSnippets,
  ...firewallSnippets,
  ...networkAnalysisSnippets,
  ...hardeningSnippets,
  ...cryptoSnippets,
]
