import { Snippet } from '@/lib/types'

export const terraformSnippets: Snippet[] = [
  {
    id: 'tf-001',
    concept: { pt: 'Comandos Básicos', en: 'Basic Commands' },
    difficulty: 'medium',
    prompt: {
      pt: 'Inicializa o projeto, gera o plano de execução, aplica as mudanças, destrói tudo e valida a config.',
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
    concept: { pt: 'Provedor e Recurso AWS', en: 'Provider and AWS Resource' },
    difficulty: 'medium',
    prompt: {
      pt: 'Configura o provider da AWS com versão mínima, define a região via variável e sobe uma instância EC2 com tag.',
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
    concept: { pt: 'Variáveis e Saídas', en: 'Variables and Outputs' },
    difficulty: 'medium',
    prompt: {
      pt: 'Declara uma variável de região com valor padrão e exporta o IP público da instância como output.',
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
    concept: { pt: 'Espaços de Trabalho', en: 'Workspaces' },
    difficulty: 'hard',
    prompt: {
      pt: 'Cria um workspace de staging, troca pra produção e lista todos os workspaces disponíveis.',
      en: 'Create a staging workspace, switch to production, and list all available workspaces.',
    },
    code: `terraform workspace new staging
terraform workspace select production
terraform workspace list`,
  },
  {
    id: 'tf-005',
    concept: { pt: 'Módulo Reutilizável', en: 'Reusable Module' },
    difficulty: 'medium',
    prompt: {
      pt: 'Módulos agrupam recursos reutilizáveis. Crie um módulo de VPC e chame-o do projeto principal passando variáveis.',
      en: 'Modules group reusable resources. Create a VPC module and call it from the main project passing variables.',
    },
    code: `# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block = var.cidr

  tags = {
    Name = var.name
  }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = var.public_subnet_cidr

  tags = {
    Name = "\${var.name}-public"
  }
}

# main.tf
module "vpc" {
  source             = "./modules/vpc"
  cidr               = "10.0.0.0/16"
  name               = "production"
  public_subnet_cidr = "10.0.1.0/24"
}`,
  },
  {
    id: 'tf-006',
    concept: { pt: 'Data Sources', en: 'Data Sources' },
    difficulty: 'medium',
    prompt: {
      pt: 'Data sources consultam dados existentes na infra sem criar recursos. Use pra buscar a AMI mais recente e a conta AWS atual.',
      en: 'Data sources query existing infrastructure data without creating resources. Use them to find the latest AMI and the current AWS account.',
    },
    code: `data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-amd64-server-*"]
  }

  owners = ["099720109477"]
}

data "aws_caller_identity" "current" {}

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}`,
  },
]
