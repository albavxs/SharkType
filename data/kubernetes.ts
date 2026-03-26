import { Snippet } from '@/lib/types'

export const kubernetesSnippets: Snippet[] = [
  {
    id: 'k8s-001',
    concept: { pt: 'Comandos kubectl Básicos', en: 'Basic kubectl Commands' },
    difficulty: 'easy',
    prompt: {
      pt: 'Liste pods de produção, serviços de todos os namespaces, descreva um pod e acompanhe seus logs.',
      en: 'List production pods, services across all namespaces, describe a pod, and tail its logs.',
    },
    code: `kubectl get pods -n production
kubectl get services --all-namespaces
kubectl describe pod api-7d9f4b -n production
kubectl logs -f api-7d9f4b --tail=100`,
  },
  {
    id: 'k8s-002',
    concept: { pt: 'Deployment YAML', en: 'Deployment YAML' },
    difficulty: 'medium',
    prompt: {
      pt: 'Crie um manifesto de Deployment com 3 réplicas pra uma API rodando na porta 3000 no namespace de produção.',
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
    concept: { pt: 'Service YAML', en: 'Service YAML' },
    difficulty: 'hard',
    prompt: {
      pt: 'Defina um Service ClusterIP que roteia tráfego da porta 80 pra porta 3000 dos pods da API.',
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
    concept: { pt: 'Apply e Rollback', en: 'Apply and Rollback' },
    difficulty: 'medium',
    prompt: {
      pt: 'Aplique um deployment, acompanhe o rollout, desfaça se der ruim e atualize a imagem direto pela CLI.',
      en: 'Apply a deployment, watch the rollout status, undo it if needed, and update the image via CLI.',
    },
    code: `kubectl apply -f deployment.yaml
kubectl rollout status deployment/api
kubectl rollout undo deployment/api
kubectl set image deployment/api api=minha-app:1.1`,
  },
  {
    id: 'k8s-005',
    concept: { pt: 'ConfigMap e Secret', en: 'ConfigMap and Secret' },
    difficulty: 'hard',
    prompt: {
      pt: 'Crie um ConfigMap com variáveis e arquivo, e um Secret genérico com senha pra banco de dados.',
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
    concept: { pt: 'Scale e Autoscale', en: 'Scale and Autoscale' },
    difficulty: 'hard',
    prompt: {
      pt: 'Escale um deployment manualmente pra 5 réplicas e configure autoscaling baseado em CPU.',
      en: 'Manually scale a deployment to 5 replicas and set up CPU-based autoscaling.',
    },
    code: `kubectl scale deployment api --replicas=5
kubectl autoscale deployment api \\
  --min=2 --max=10 --cpu-percent=70`,
  },
]
