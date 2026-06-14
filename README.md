# 💰 cash-tracker

A personal **microservice-based Cash Tracking application** built to manage and monitor personal finances — containerized with Docker, deployed on AWS, and shipped via a fully automated Jenkins CI/CD pipeline provisioned through Terraform.

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Tech Stack](#️-tech-stack)
- [Architecture Overview](#️-architecture-overview)
- [AWS Infrastructure](#️-aws-infrastructure)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deploy on AWS — Step by Step](#️-deploy-on-aws--step-by-step)
- [Docker & DockerHub](#-docker--dockerhub)
- [Kubernetes (Local - Minikube)](#️-kubernetes-local---minikube)
- [Future Improvements](#-future-improvements)

---

## 📖 About the Project

**cash-tracker** is a personal finance tracking tool built as a microservice application. It helps you keep track of your daily cash flow — income, expenses, and balances — all in one place.

The project was built not just as a functional app, but as a **complete DevOps showcase** — covering infrastructure provisioning, containerization, and automated CI/CD deployment on real AWS cloud infrastructure.

---

## 🛠️ Tech Stack

### Application
| Layer | Technology |
|---|---|
| Frontend | React.js, Nginx |
| Backend | Node.js, Express.js |
| Containerization | Docker, Docker Compose |
| Image Registry | DockerHub |

### DevOps & Infrastructure
| Tool | Purpose |
|---|---|
| **Terraform** | AWS infrastructure provisioning (IaC) |
| **Jenkins** | CI/CD pipeline automation |
| **Docker & Docker Compose** | Container build, run, and orchestration |
| **AWS EC2** | Cloud compute instance |
| **AWS VPC** | Isolated network environment |
| **Elastic IP** | Static public IP for EC2 |
| **Security Groups** | Firewall / inbound-outbound rules |
| **Key Pairs** | Secure SSH access to EC2 |
| **Kubernetes (Minikube)** | Local container orchestration |
| **Helm** | Kubernetes package management |
| **Shell Script** | Environment automation |
| **Git & GitHub** | Version control |
| **Ubuntu 24.04 LTS** | EC2 operating system |

---

## 🏗️ Architecture Overview

```
Developer (Local)
      │
      │  git push
      ▼
  GitHub Repo
      │
      │  Webhook / Manual Trigger
      ▼
 Jenkins Server (EC2)
      │
      ├── Checkout Code
      ├── Install Frontend Dependencies
      ├── Install Backend Dependencies
      ├── Build Docker Images (Docker Compose)
      ├── Push Images → DockerHub
      └── Deploy via Docker Compose (EC2)
                    │
                    ▼
          Live App on AWS EC2
          (Ubuntu 24.04 LTS | t3.small | 30GB)
```

---

## ☁️ AWS Infrastructure

All AWS infrastructure is provisioned using **Terraform** (Infrastructure as Code).

### Resources Created via Terraform

| Resource | Details |
|---|---|
| **EC2 Instance** | `t3.small`, Ubuntu 24.04 LTS, 30 GB EBS storage |
| **Elastic IP** | Static public IP attached to EC2 |
| **VPC** | Custom Virtual Private Cloud |
| **Subnets** | Public subnet within the VPC |
| **Security Groups** | Inbound rules for HTTP, HTTPS, SSH, Jenkins, App ports |
| **Key Pair** | SSH key for secure EC2 access |

### Terraform Structure

Terraform files live in the root of the repository (no separate directory):

```
cash-tracker/
├── main.tf          # AWS resource definitions (EC2, VPC, Subnets, SG, EIP, Key Pair)
└── install.sh       # EC2 bootstrapping script (Docker, Jenkins installation)
```

### Apply Infrastructure

> 💡 Since `main.tf` is in the root of the repository, all Terraform commands should be run from the project root directory — no need to `cd` into any subfolder.

```bash
terraform init
terraform plan
terraform apply
```

> ⚠️ Make sure your AWS credentials are exported as environment variables before running Terraform (see [Deploy on AWS](#deploy-on-aws--step-by-step) below).

> 📝 **Note for other users:** The `main.tf` file has a hardcoded `ami` and `instance_type` that were set for a specific AWS region. Before running `terraform apply`, open `main.tf` and update these values to match your own AWS region and available AMI:
> - **`ami`** — Find the correct Ubuntu 24.04 LTS AMI ID for your region from the [AWS AMI Catalog](https://console.aws.amazon.com/ec2/v2/home#AMICatalog)
> - **`instance_type`** — Change to any instance type available in your region (e.g. `t2.micro` for free tier, `t3.small` etc.)

---

## 🔁 CI/CD Pipeline

The entire deployment lifecycle is automated using a **Jenkinsfile** with parameterized builds.

### Jenkins Pipeline Stages

```
┌─────────────────────────────────────────────────────┐
│                  JENKINS PIPELINE                   │
├──────────────┬──────────────────────────────────────┤
│  Stage 1     │  Checkout Code from GitHub           │
│  Stage 2     │  Install Frontend Dependencies       │
│  Stage 3     │  Install Backend Dependencies        │
│  Stage 4     │  Build Docker Images (Compose)       │
│  Stage 5     │  Push Images to DockerHub            │
│  Stage 6     │  Run App via Docker Compose          │
└──────────────┴──────────────────────────────────────┘
```

### Pipeline Parameters

The pipeline uses **string parameters** for flexible builds:

| Parameter | Description |
|---|---|
| `DOCKER_FRONT_IMAGE` | Docker frontend image name |
| `IMAGE_TAG_FRONT` | Docker frontend image tag / version |
| `DOCKER_BACK_IMAGE` | Docker backend image name |
| `IMAGE_TAG_BACK` | Docker backend image tag / version | |

### Jenkinsfile Location

```
Jenkinsfile   ← root of the repository
```

---

## 📁 Project Structure

```
cash-tracker/
├── backend/                        # Backend microservice (Node.js)
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                   # Express server entry point
│   ├── models/
│   │   └── Transaction.js          # Transaction data model
│   └── routes/
│       └── transactions.js         # API routes for transactions
├── frontend/                       # Frontend microservice (React + Nginx)
│   ├── Dockerfile
│   ├── nginx.conf                  # Nginx configuration
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
├── cash-tracker-chart/             # Helm chart for Kubernetes (Minikube)
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       └── service.yaml
├── docker-compose.yml              # Multi-service container orchestration
├── Jenkinsfile                     # Jenkins CI/CD pipeline definition
├── main.tf                         # Terraform — AWS infrastructure (EC2, VPC, SG, EIP, Key Pair)
└── install.sh                      # EC2 bootstrap script (installs Docker & Jenkins)
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Terraform](https://developer.hashicorp.com/terraform/install)
- [Git](https://git-scm.com/)
- An active **AWS Account** with `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

### Clone the Repository

```bash
git clone https://github.com/Apu133/cash-tracker.git
cd cash-tracker
```

### Run Locally with Docker Compose

```bash
docker compose up
```

The app will be available at `http://localhost:3000`

---

## ☁️ Deploy on AWS — Step by Step

Follow these steps to provision infrastructure and deploy the application on AWS from scratch.

### Step 1 — Export AWS Credentials

Open your terminal and export your AWS credentials as environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_access_key_id
export AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

> ⚠️ Never commit or share your AWS credentials. Keep them secure.

---

### Step 2 — Provision AWS Infrastructure with Terraform

```bash
# Initialize Terraform
terraform init

# Preview what will be created
terraform plan

# Provision the infrastructure
terraform apply
```

Once `terraform apply` completes, it will output your **Elastic IP address**. Copy it — you'll need it in the next steps.

```
Outputs:
elastic_ip = "x.x.x.x"   ← Copy this
```

---

### Step 3 — Open Jenkins

Paste the Elastic IP into your browser with port `8080`:

```
http://<elastic_ip>:8080
```

This will open the Jenkins setup page.

---

### Step 4 — Configure Jenkins

1. Complete the Jenkins initial setup wizard
2. Install the suggested plugins when prompted
3. Create your admin user account

---

### Step 5 — Install Node.js Plugin

1. Go to **Manage Jenkins → Plugins → Available Plugins**
2. Search for **NodeJS**
3. Install it and restart Jenkins if prompted

---

### Step 6 — Configure Node.js in Jenkins Tools

1. Go to **Manage Jenkins → Tools**
2. Scroll to the **NodeJS** section
3. Click **Add NodeJS**
4. Set the name as exactly: `nodejs`
5. Click **Apply** and **Save**

---

### Step 7 — Add DockerHub Credentials

1. Go to **Manage Jenkins → Credentials → System → Global credentials**
2. Click **Add Credentials**
3. Choose **Username with password**
4. Enter your DockerHub username and password
5. Set the ID as exactly: `dockerhub-creds`
6. Click **Create**

---

### Step 8 — Create & Run the Jenkins Pipeline

1. Click **New Item** on the Jenkins dashboard
2. Enter a name and select **Pipeline**
3. Under **Pipeline Definition**, select **Pipeline script from SCM**
4. Choose **Git** as the SCM
5. Enter your repository URL: `https://github.com/Apu133/cash-tracker.git`
6. Set the branch to `main` (or your default branch)
7. Click **Save**, then click **Build with Parameters** to start the pipeline

---

### Step 9 — Access the Application

Once the pipeline completes successfully, open your browser and navigate to:

```
http://<elastic_ip>:3000
```

Your **cash-tracker** application will be live and running! 🎉

---

### Step 10 — Destroy AWS Infrastructure (When Done)

> ⚠️ **Important:** If you are on the AWS Free Tier, always destroy your infrastructure when you are not using it. Leaving EC2 instances running will consume your free tier hours and may result in unexpected charges.

**Destroy all provisioned AWS resources:**

```bash
terraform destroy
```

Terraform will show you a list of all resources it will delete. Type `yes` when prompted to confirm.

```
Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes   ← type this
```

Once complete, all AWS resources (EC2, Elastic IP, VPC, Subnets, Security Groups, Key Pair) will be permanently removed and billing will stop.

> 💡 You can re-provision everything from scratch anytime by running `terraform apply` again.

---

## 🐳 Docker & DockerHub

### Build Images Manually

```bash
docker compose build
```

### Push to DockerHub

```bash
docker login
docker compose push
```

### Pull & Run from DockerHub

```bash
docker pull apu133/cash-tracker-frontend:latest
docker pull apu133/cash-tracker-backend:latest
docker compose up
```

---

## ☸️ Kubernetes (Local - Minikube)

> This runs the cash-tracker application locally using Minikube and Helm.

### Prerequisites
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed
- [Helm](https://helm.sh/docs/intro/install/) installed

---

### ▶️ Start the Application

**Step 1 — Start Minikube**

```bash
minikube start
```

**Step 2 — Deploy using Helm**

```bash
helm install cash-tracker ./cash-tracker-chart
```

**Step 3 — Verify Pods are Running**

```bash
kubectl get pods
```

All pods should show `Running` status before proceeding.

**Step 4 — Get Minikube IP**

```bash
minikube ip
```

Copy the IP address shown in the output.

**Step 5 — Access the Application**

Paste the Minikube IP into your browser with port `30001`:

```
http://<minikube-ip>:30001
```

The **cash-tracker** application will be visible and running in your browser. 🎉

---

### ⏹️ Stop the Application

**Step 1 — Navigate to the chart directory**

```bash
cd cash-tracker-chart
```

**Step 2 — Uninstall the Helm release**

```bash
helm uninstall cash-tracker
```

This will stop and remove all pods and resources created by the Helm chart.

---

## 🔮 Future Improvements

- [ ] Add **Prometheus + Grafana** for real-time monitoring and dashboards
- [ ] Migrate from Docker Compose to full **Kubernetes on EKS**
- [ ] Add **HTTPS / SSL** using Let's Encrypt or AWS ACM
- [ ] Set up **log management** with ELK Stack or Loki

---

## 👤 Author

**Arpit Suren**
- GitHub: [@Apu133](https://github.com/Apu133)
- Email: surenarpit133@gmail.com
- Location: Chaibasa, Jharkhand, India

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> ⭐ If you find this project useful or interesting, consider giving it a star on GitHub!
