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
- [Monitoring — Prometheus, Node Exporter & Grafana](#-monitoring--prometheus-node-exporter--grafana)
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
| **Prometheus** | Metrics collection and monitoring |
| **Node Exporter** | System-level metrics exposure |
| **Grafana** | Metrics visualization and dashboards |
| **OpenSSL** | TLS certificate generation |
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
                    │
                    │  Node Exporter (port 9100)
                    │  exposes system metrics
                    │
                    ▼
 ┌─────────────────────────────────────────┐
 │         Local Machine                   │
 │                                         │
 │  Prometheus ◄── scrapes EC2 + Local     │
 │      │                                  │
 │      │  feeds metrics                   │
 │      ▼                                  │
 │  Grafana                                │
 │  (Custom Dashboards via PromQL)         │
 │  CPU % | Memory % | Disk % |            │
 │  Uptime | Network In/Out                │
 └─────────────────────────────────────────┘
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
├── install.sh                      # EC2 bootstrap script (installs Docker & Jenkins)
├── LICENSE                         # MIT License
└── README.md                       # Project documentation
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

## 📊 Monitoring — Prometheus, Node Exporter & Grafana

> The monitoring stack runs on the **local machine** (not on EC2) due to EC2's 2GB RAM constraint. Node Exporter runs on EC2 and exposes metrics, which Prometheus scrapes remotely. This mirrors real-world production monitoring architecture where the monitoring stack is always separate from the workloads it observes.

---

### 🏗️ Monitoring Architecture

```
Local Machine                          AWS EC2 Instance
┌──────────────────────────┐           ┌─────────────────────────┐
│  Prometheus               │           │  Node Exporter           │
│  (scrapes targets)   ─────┼──────────►│  (exposes metrics)       │
│                           │           │  Port: 9100              │
│  Grafana                  │           │  (no TLS / no auth)      │
│  (visualizes metrics) ◄───┤           └─────────────────────────┘
│                           │
│  Node Exporter            │           Local Machine (self)
│  (local metrics)    ◄─────┤           ┌─────────────────────────┐
└──────────────────────────┘           │  Node Exporter           │
                                        │  (exposes metrics)       │
                                        │  Port: 9100              │
                                        │  TLS + Basic Auth        │
                                        └─────────────────────────┘
```

---

### 🔒 Security

The **local machine Node Exporter** endpoint is secured with:

- **TLS encryption** — self-signed certificates generated using OpenSSL
- **Basic Authentication** — password hashing using `apache2-utils` (htpasswd)

> ℹ️ The **EC2 Node Exporter** does not use TLS or basic auth.

---

### ⚙️ Components

| Component | Where it Runs | Purpose |
|---|---|---|
| **Prometheus** | Local Machine | Scrapes and stores time-series metrics from all targets |
| **Node Exporter** | EC2 Instance | Exposes EC2 system metrics (CPU, memory, disk, network) |
| **Node Exporter** | Local Machine | Exposes local system metrics |
| **Grafana** | Local Machine | Visualizes metrics from Prometheus via dashboards |

---

### 🖥️ Node Exporter on EC2 (Automated)

Node Exporter installation and configuration on EC2 is fully automated via a shell script. It handles:

- Downloading and installing Node Exporter
- Configuring and starting Node Exporter as a systemd service

---

### 🎯 Prometheus Scrape Targets

Prometheus scrapes metrics from multiple sources:

| Target | Address | Security |
|---|---|---|
| Local Machine | `localhost:9100` | TLS + Basic Auth |
| EC2 Instance | `<elastic_ip>:9100` | No auth |

---

### 📈 Grafana Dashboards

Grafana is connected to Prometheus as a datasource and includes:

**Pre-built Dashboard (Imported)**
- Node Exporter Full dashboard (Grafana Dashboard ID: 1860)

**Custom Dashboard (Built with PromQL)**

| Panel | PromQL Metric |
|---|---|
| CPU Usage % | `100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` |
| Memory Usage % | `100 - ((node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100)` |
| Storage Usage % | `100 - ((node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100)` |
| System Uptime | `node_time_seconds - node_boot_time_seconds` |
| Network In | `rate(node_network_receive_bytes_total[5m])` |
| Network Out | `rate(node_network_transmit_bytes_total[5m])` |

---

### 🚀 Setup Prometheus (Local Machine)

**Step 1 — Install Prometheus**

```bash
wget https://github.com/prometheus/prometheus/releases/download/v3.5.3/prometheus-3.5.3.linux-amd64.tar.gz
tar xvf prometheus-3.5.3.linux-amd64.tar.gz
cd prometheus-3.5.3.linux-amd64/
sudo mv prometheus /usr/local/bin/
sudo mv promtool /usr/local/bin/
sudo mkdir /etc/prometheus
sudo mv prometheus.yml /etc/prometheus/
```

---

**Step 2 — Give Permissions**

Create a dedicated system user and group for Prometheus, then assign ownership:

```bash
sudo groupadd --system prometheus
sudo useradd -s /sbin/nologin --system -g prometheus prometheus
sudo chown -R prometheus:prometheus /etc/prometheus
sudo chown prometheus:prometheus /usr/local/bin/prometheus
sudo chown prometheus:prometheus /usr/local/bin/promtool
```

---

**Step 3 — Configure prometheus.yml**

Edit the config file:

```bash
sudo vi /etc/prometheus/prometheus.yml
```

Add your scrape targets — local machine uses TLS and basic auth, EC2 uses plain HTTP:

```yaml
scrape_configs:
  - job_name: 'node-local'
    scheme: https
    tls_config:
      ca_file: /etc/prometheus/certs/ca.crt
      insecure_skip_verify: true
    basic_auth:
      username: your_username
      password: your_password
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'node-ec2'
    scheme: http
    static_configs:
      - targets: ['<elastic_ip>:9100']
```

---

**Step 4 — Add as a systemd Service**

Create the service file:

```bash
sudo touch /etc/systemd/system/prometheus.service
sudo vi /etc/systemd/system/prometheus.service
```

Paste the following content:

```ini
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus

[Install]
WantedBy=multi-user.target
```

Create the data directory and set ownership:

```bash
sudo mkdir -p /var/lib/prometheus
sudo chown -R prometheus:prometheus /var/lib/prometheus
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
sudo systemctl status prometheus
```

Prometheus will be available at `http://localhost:9090`

---

### 🔧 Setup Node Exporter (Local Machine)

**Step 1 — Install Node Exporter**

```bash
wget https://github.com/prometheus/node_exporter/releases/latest/download/node_exporter-*.linux-amd64.tar.gz
tar xvf node_exporter-*.linux-amd64.tar.gz
cd node_exporter-*/
sudo mv node_exporter /usr/local/bin/
```

---

**Step 2 — Give Permissions**

Create a dedicated system user and assign ownership:

```bash
sudo groupadd --system node_exporter
sudo useradd -rs /bin/false --system -g node_exporter node_exporter
sudo chown node_exporter:node_exporter /usr/local/bin/node_exporter
```

---

**Step 3 — Setup TLS and Basic Auth (OpenSSL + apache2-utils)**

Install required tools:

```bash
sudo apt-get install -y openssl apache2-utils
```

Create a directory to store certificates:

```bash
sudo mkdir /etc/node_exporter
sudo chown node_exporter:node_exporter /etc/node_exporter
```

Generate a self-signed TLS certificate using OpenSSL:

```bash
sudo openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 \
  -keyout /etc/node_exporter/node_exporter.key \
  -out /etc/node_exporter/node_exporter.crt \
  -subj "/CN=localhost"
```

Generate a hashed password using apache2-utils:

```bash
htpasswd -nBC 12 "" | tr -d ':\n'
```

Copy the output hash — you will use it in the web config file below.

Create the web config file for Node Exporter:

```bash
sudo vi /etc/node_exporter/web-config.yml
```

Paste the following content:

```yaml
tls_server_config:
  cert_file: /etc/node_exporter/node_exporter.crt
  key_file: /etc/node_exporter/node_exporter.key

basic_auth_users:
  your_username: <paste_hashed_password_here>
```

Set ownership on the config directory:

```bash
sudo chown -R node_exporter:node_exporter /etc/node_exporter
```

---

**Step 4 — Add as a systemd Service**

Create the service file:

```bash
sudo touch /etc/systemd/system/node_exporter.service
sudo vi /etc/systemd/system/node_exporter.service
```

Paste the following content:

```ini
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter \
  --web.config.file=/etc/node_exporter/web-config.yml

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
sudo systemctl status node_exporter
```

Node Exporter will be available at `https://localhost:9100/metrics`

---



### 🚀 Setup Grafana (Local Machine)

**Step 1 — Install Grafana**

```bash
sudo apt-get install -y grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

**Step 2 — Access Grafana**

```
http://localhost:3000
```

Default credentials: `admin / admin` (change on first login)

**Step 3 — Add Prometheus as Datasource**

1. Go to **Connections → Data Sources**
2. Click **Add data source**
3. Select **Prometheus**
4. Set URL to `http://localhost:9090`
5. Click **Save & Test**

**Step 4 — Import Pre-built Dashboard**

1. Go to **Dashboards → Import**
2. Enter dashboard ID: `1860`
3. Select your Prometheus datasource
4. Click **Import**

**Step 5 — Build Custom Dashboard**

1. Go to **Dashboards → New Dashboard**
2. Click **Add visualization**
3. Select Prometheus as the datasource
4. Enter PromQL queries from the table above for each panel

---

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

- [ ] Migrate from Docker Compose to full **Kubernetes on EKS**
- [ ] Add **HTTPS / SSL** using Let's Encrypt or AWS ACM
- [ ] Set up **log management** with ELK Stack or Loki
- [ ] Add **Alertmanager** for Prometheus alerting (email / Slack notifications)
- [ ] Get **AWS Solutions Architect Associate (SAA-C03)** certification

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
