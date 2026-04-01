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
  {
    id: 'tf-007',
    concept: { pt: 'Locals e Expressões', en: 'Locals and Expressions' },
    difficulty: 'medium',
    prompt: {
      pt: 'locals definem valores computados reutilizáveis dentro do módulo. Use locals com condicionais e merge de tags.',
      en: 'locals define computed reusable values within a module. Use locals with conditionals and tag merging.',
    },
    code: `locals {
  env    = terraform.workspace
  is_prod = local.env == "production"

  common_tags = {
    Project     = var.project_name
    Environment = local.env
    ManagedBy   = "terraform"
  }

  instance_type = local.is_prod ? "t3.large" : "t3.micro"
  replicas      = local.is_prod ? 3 : 1
}

resource "aws_instance" "app" {
  count         = local.replicas
  instance_type = local.instance_type
  ami           = data.aws_ami.ubuntu.id
  tags          = merge(local.common_tags, { Name = "app-\${count.index}" })
}`,
  },
  {
    id: 'tf-008',
    concept: { pt: 'Backend Remoto S3', en: 'S3 Remote Backend' },
    difficulty: 'hard',
    prompt: {
      pt: 'O backend remoto armazena o state no S3 com lock via DynamoDB, permitindo colaboração em equipe.',
      en: 'The remote backend stores state in S3 with DynamoDB locking, enabling team collaboration.',
    },
    code: `terraform {
  backend "s3" {
    bucket         = "meu-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}`,
  },
  {
    id: 'tf-009',
    concept: { pt: 'for_each e count', en: 'for_each and count' },
    difficulty: 'hard',
    prompt: {
      pt: 'for_each cria múltiplos recursos a partir de um map ou set, mais flexível que count. Use pra criar múltiplos buckets S3.',
      en: 'for_each creates multiple resources from a map or set, more flexible than count. Use it to create multiple S3 buckets.',
    },
    code: `variable "buckets" {
  type = map(object({
    versioning = bool
  }))
  default = {
    logs    = { versioning = false }
    backups = { versioning = true }
    assets  = { versioning = true }
  }
}

resource "aws_s3_bucket" "this" {
  for_each = var.buckets
  bucket   = "\${var.project}-\${each.key}"

  tags = {
    Name = each.key
  }
}

resource "aws_s3_bucket_versioning" "this" {
  for_each = { for k, v in var.buckets : k => v if v.versioning }
  bucket   = aws_s3_bucket.this[each.key].id

  versioning_configuration {
    status = "Enabled"
  }
}`,
  },
  {
    id: 'tf-010',
    concept: { pt: 'Security Group', en: 'Security Group' },
    difficulty: 'medium',
    prompt: {
      pt: 'Security Groups controlam tráfego de rede na AWS. Crie um SG que libera HTTP, HTTPS e SSH, bloqueando o resto.',
      en: 'Security Groups control network traffic in AWS. Create an SG that allows HTTP, HTTPS, and SSH, blocking everything else.',
    },
    code: `resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = module.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_ip]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`,
  },
  {
    id: 'tf-011',
    concept: { pt: 'Provisioners', en: 'Provisioners' },
    difficulty: 'hard',
    prompt: {
      pt: 'Provisioners executam comandos na máquina após criação. Use remote-exec pra configurar uma instância e local-exec pra salvar o IP.',
      en: 'Provisioners run commands on the machine after creation. Use remote-exec to configure an instance and local-exec to save the IP.',
    },
    code: `resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = var.key_name

  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install -y nginx",
      "sudo systemctl start nginx",
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file(var.private_key_path)
      host        = self.public_ip
    }
  }

  provisioner "local-exec" {
    command = "echo \${self.public_ip} >> hosts.txt"
  }
}`,
  },
  {
    id: 'tf-012',
    concept: { pt: 'Import e State', en: 'Import and State' },
    difficulty: 'hard',
    prompt: {
      pt: 'terraform import traz recursos existentes pro state, e state list/show permitem inspecionar o estado atual.',
      en: 'terraform import brings existing resources into state, and state list/show let you inspect the current state.',
    },
    code: `terraform import aws_instance.web i-0abc123def456
terraform state list
terraform state show aws_instance.web
terraform state rm aws_instance.old
terraform state mv aws_instance.web aws_instance.app`,
  },
]
