import { Snippet } from '@/lib/types'

export const terraformSnippets: Snippet[] = [
  {
    id: 'tf-001',
    concept: { pt: 'Comandos Básicos', en: 'Basic Commands' },
    difficulty: 'medium',
    prompt: {
      pt: 'Inicialize o projeto, gere o plano de execução, aplique as mudanças, destrua tudo e valide a configuração.',
      en: 'Initialize the project, generate the execution plan, apply changes, destroy everything, and validate the config.',
    },
    code: `terraform init
terraform plan -out=tfplan
terraform apply tfplan
terraform destroy
terraform validate`,
  },
  {
    id: 'tf-002',
    concept: { pt: 'Provider e Recurso AWS', en: 'Provider and AWS Resource' },
    difficulty: 'medium',
    prompt: {
      pt: 'Configure o provider AWS com versão mínima, defina a região via variável e crie uma instância EC2 com tag.',
      en: 'Set up the AWS provider with a minimum version, define the region via variable, and create a tagged EC2 instance.',
    },
    code: `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  tags = {
    Name = "app-server"
  }
}`,
  },
  {
    id: 'tf-003',
    concept: { pt: 'Variáveis e Outputs', en: 'Variables and Outputs' },
    difficulty: 'medium',
    prompt: {
      pt: 'Declare uma variável de região com valor padrão e exporte o IP público da instância como output.',
      en: 'Declare a region variable with a default value and export the instance public IP as an output.',
    },
    code: `variable "region" {
  type    = string
  default = "us-east-1"
}

output "instance_ip" {
  value = aws_instance.app.public_ip
}`,
  },
  {
    id: 'tf-004',
    concept: { pt: 'Workspaces', en: 'Workspaces' },
    difficulty: 'hard',
    prompt: {
      pt: 'Crie um workspace de staging, alterne pra produção e liste todos os workspaces disponíveis.',
      en: 'Create a staging workspace, switch to production, and list all available workspaces.',
    },
    code: `terraform workspace new staging
terraform workspace select production
terraform workspace list`,
  },
]
