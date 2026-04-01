import { Snippet } from '@/lib/types'

export const kubernetesSnippets: Snippet[] = [
  {
    id: 'k8s-001',
    concept: { pt: 'Comandos Básicos do kubectl', en: 'Basic kubectl Commands' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lista os pods de produção, os services de todos os namespaces, descreve um pod e fica acompanhando os logs dele.',
      en: 'List production pods, services across all namespaces, describe a pod, and tail its logs.',
    },
    code: `kubectl get pods -n production
kubectl get services --all-namespaces
kubectl describe pod api-7d9f4b -n production
kubectl logs -f api-7d9f4b --tail=100`,
  },
  {
    id: 'k8s-002',
    concept: { pt: 'YAML de Implantação', en: 'Deployment YAML' },
    difficulty: 'medium',
    prompt: {
      pt: 'Monta um manifesto de Deployment com 3 réplicas pra uma API na porta 3000, no namespace de produção.',
      en: 'Write a Deployment manifest with 3 replicas for an API running on port 3000 in the production namespace.',
    },
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: minha-app:1.0
          ports:
            - containerPort: 3000`,
  },
  {
    id: 'k8s-003',
    concept: { pt: 'YAML de Serviço', en: 'Service YAML' },
    difficulty: 'hard',
    prompt: {
      pt: 'Define um Service do tipo ClusterIP que roteia o tráfego da porta 80 pra 3000 nos pods da API.',
      en: 'Define a ClusterIP Service that routes traffic from port 80 to port 3000 on the API pods.',
    },
    code: `apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP`,
  },
  {
    id: 'k8s-004',
    concept: { pt: 'Aplicar e Reverter', en: 'Apply and Rollback' },
    difficulty: 'medium',
    prompt: {
      pt: 'Aplica um deployment, acompanha o rollout, faz rollback se der ruim e atualiza a imagem direto pela CLI.',
      en: 'Apply a deployment, watch the rollout status, undo it if needed, and update the image via CLI.',
    },
    code: `kubectl apply -f deployment.yaml
kubectl rollout status deployment/api
kubectl rollout undo deployment/api
kubectl set image deployment/api api=minha-app:1.1`,
  },
  {
    id: 'k8s-005',
    concept: { pt: 'ConfigMap e Segredo', en: 'ConfigMap and Secret' },
    difficulty: 'hard',
    prompt: {
      pt: 'Cria um ConfigMap a partir de variáveis e de um arquivo, e um Secret genérico com a senha do banco.',
      en: 'Create a ConfigMap from literals and a file, plus a generic Secret with a database password.',
    },
    code: `kubectl create configmap app-config \\
  --from-literal=NODE_ENV=production \\
  --from-file=config.yaml

kubectl create secret generic db-secret \\
  --from-literal=password=s3cr3t`,
  },
  {
    id: 'k8s-006',
    concept: { pt: 'Escalar e Autoescalar', en: 'Scale and Autoscale' },
    difficulty: 'hard',
    prompt: {
      pt: 'Escala um deployment na mão pra 5 réplicas e configura autoscaling baseado em CPU.',
      en: 'Manually scale a deployment to 5 replicas and set up CPU-based autoscaling.',
    },
    code: `kubectl scale deployment api --replicas=5
kubectl autoscale deployment api \\
  --min=2 --max=10 --cpu-percent=70`,
  },
  {
    id: 'k8s-007',
    concept: { pt: 'Ingress', en: 'Ingress' },
    difficulty: 'hard',
    prompt: {
      pt: 'Ingress expõe serviços HTTP/HTTPS com roteamento por host e path. Configure um Ingress com TLS e múltiplas rotas.',
      en: 'Ingress exposes HTTP/HTTPS services with host and path routing. Configure an Ingress with TLS and multiple routes.',
    },
    code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
    - hosts:
        - app.example.com
      secretName: tls-secret
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80`,
  },
  {
    id: 'k8s-008',
    concept: { pt: 'PersistentVolumeClaim', en: 'PersistentVolumeClaim' },
    difficulty: 'hard',
    prompt: {
      pt: 'PVC requisita armazenamento persistente pro pod. Crie um PVC e monte-o num pod de banco de dados.',
      en: 'PVC requests persistent storage for a pod. Create a PVC and mount it on a database pod.',
    },
    code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: pg-data
      volumes:
        - name: pg-data
          persistentVolumeClaim:
            claimName: postgres-pvc`,
  },
  {
    id: 'k8s-009',
    concept: { pt: 'Liveness e Readiness Probes', en: 'Liveness and Readiness Probes' },
    difficulty: 'medium',
    prompt: {
      pt: 'Probes monitoram a saúde dos containers. livenessProbe reinicia se falhar, readinessProbe remove do balanceador.',
      en: 'Probes monitor container health. livenessProbe restarts on failure, readinessProbe removes from the load balancer.',
    },
    code: `containers:
  - name: api
    image: minha-app:1.0
    ports:
      - containerPort: 3000
    livenessProbe:
      httpGet:
        path: /health
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 15
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 3000
      initialDelaySeconds: 5
      periodSeconds: 5
    resources:
      requests:
        memory: "128Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"
        cpu: "500m"`,
  },
  {
    id: 'k8s-010',
    concept: { pt: 'Namespaces', en: 'Namespaces' },
    difficulty: 'easy',
    prompt: {
      pt: 'Namespaces isolam recursos dentro do cluster. Crie, liste e troque entre namespaces.',
      en: 'Namespaces isolate resources within the cluster. Create, list, and switch between namespaces.',
    },
    code: `kubectl create namespace staging
kubectl create namespace production

kubectl get namespaces
kubectl get pods -n staging
kubectl get all -n production

kubectl config set-context --current --namespace=staging`,
  },
  {
    id: 'k8s-011',
    concept: { pt: 'Jobs e CronJobs', en: 'Jobs and CronJobs' },
    difficulty: 'medium',
    prompt: {
      pt: 'Jobs executam tarefas até conclusão e CronJobs agendam execuções periódicas. Crie um CronJob de backup.',
      en: 'Jobs run tasks to completion and CronJobs schedule periodic runs. Create a backup CronJob.',
    },
    code: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: postgres:16
              command:
                - /bin/sh
                - -c
                - pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > /backup/dump.sql
              envFrom:
                - secretRef:
                    name: db-secret
          restartPolicy: OnFailure`,
  },
  {
    id: 'k8s-012',
    concept: { pt: 'Depuração de Pods', en: 'Pod Debugging' },
    difficulty: 'medium',
    prompt: {
      pt: 'Comandos essenciais pra depurar pods com problemas: logs, exec, port-forward e eventos.',
      en: 'Essential commands to debug problematic pods: logs, exec, port-forward, and events.',
    },
    code: `kubectl logs api-7d9f4b -n production --previous
kubectl logs -f deployment/api --all-containers

kubectl exec -it api-7d9f4b -- /bin/sh
kubectl exec api-7d9f4b -- env

kubectl port-forward svc/api-service 8080:80

kubectl get events -n production --sort-by='.lastTimestamp'
kubectl top pods -n production`,
  },
]
