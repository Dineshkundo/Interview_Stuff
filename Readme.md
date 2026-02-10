# 🚀 Kubernetes Full-Stack Application on GitHub Codespaces

This project demonstrates a **production-style Kubernetes setup** using **GitHub Codespaces + KIND**, deploying a **React frontend** and **Spring Boot backend**, exposed securely using an **NGINX Ingress Controller**.

The goal is to show **real-world Kubernetes concepts**, not just a demo.

---

## 🧱 Architecture Overview

```

Browser (Codespaces URL)
|
v
NGINX Ingress Controller
|
|-- "/"     → Frontend Service (React + Nginx)
|
|-- "/api"  → Backend Service (Spring Boot)

```

All services are **internal (ClusterIP)**.  
Ingress acts as the **single entry point**, just like in cloud environments (EKS / GKE / AKS).

---

## 🛠 Tech Stack

- **Kubernetes** (KIND – Kubernetes in Docker)
- **React** (Vite + Nginx)
- **Spring Boot** (REST API)
- **NGINX Ingress Controller**
- **GitHub Codespaces**
- **Docker**

---

## 📁 Project Structure

```

k8-proj/
├── backend/          # Spring Boot application
├── frontend/         # React application
└── k8s/              # Kubernetes manifests
├── backend-deployment.yaml
├── backend-service.yaml
├── frontend-deployment.yaml
├── frontend-service.yaml
└── app-ingress.yaml

````

---

## ⚙️ Step-by-Step Setup

## 🧰 Kubernetes Setup from Scratch (GitHub Codespaces)

This section documents how Kubernetes was set up **from zero** inside **GitHub Codespaces**, without relying on any preinstalled tooling.

The goal was to create a **real Kubernetes cluster**, not a mock or simulator.

---

## 🖥 Environment

- GitHub Codespaces (Linux)
- Docker-in-Docker supported
- No Kubernetes tools preinstalled

---

## 1️⃣ Install Docker (Verify)

Docker is required because **KIND runs Kubernetes inside Docker containers**.

Check Docker:

```bash
docker version
````

If Docker is not running:

```bash
sudo service docker start
```

---

## 2️⃣ Install kubectl (Kubernetes CLI)

`kubectl` is the command-line tool used to interact with the Kubernetes API server.

### Install kubectl (Pinned Version – Best Practice)

```bash
curl -L -o kubectl https://dl.k8s.io/release/v1.29.2/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
```

Verify:

```bash
kubectl version --client
```

📌 **Why version pinning matters**

* Prevents breaking changes
* Ensures reproducible environments
* Standard practice in production setups

---

## 3️⃣ Install KIND (Kubernetes in Docker)

KIND allows running a **fully conformant Kubernetes cluster locally**, using Docker containers as nodes.

### Install KIND

```bash
curl -L -o kind https://kind.sigs.k8s.io/dl/v0.22.0/kind-linux-amd64
chmod +x kind
sudo mv kind /usr/local/bin/kind
```

Verify:

```bash
kind version
```

---

## 4️⃣ Create Kubernetes Cluster

Create a local Kubernetes cluster named `prod-cluster`:

```bash
kind create cluster --name prod-cluster
```

Verify cluster and node:

```bash
kubectl get nodes
```

Expected output:

```
prod-cluster-control-plane   Ready
```

At this point:

* Kubernetes control plane is running
* kubeconfig is automatically configured
* Cluster is ready for workloads

---

## 5️⃣ Set Namespace (Production Practice)

Create and switch to a dedicated namespace:

```bash
kubectl create namespace prod
kubectl config set-context --current --namespace=prod
```

📌 **Why namespaces**

* Logical isolation
* Cleaner resource management
* Matches real production clusters

---

## 6️⃣ Verify Cluster Health

Run:

```bash
kubectl get all
```

You should see:

* No errors
* Cluster responding correctly

---

## 7️⃣ Install NGINX Ingress Controller

Ingress Controller is required to expose services **without using NodePort or LoadBalancer directly**.

For KIND:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

Wait for controller to be ready:

```bash
kubectl get pods -n ingress-nginx
```

Expected:

```
ingress-nginx-controller   1/1   Running
```

---

## ⚠️ Important Note (Codespaces Networking)

In GitHub Codespaces:

* `LoadBalancer` services do **not** receive external IPs
* Ingress must be accessed via:

  * Port-forwarding **or**
  * Codespaces forwarded URL

This is a **platform limitation**, not a Kubernetes issue.

---

## ✅ Kubernetes Cluster Ready

At this stage, the environment includes:

* ✔ Docker
* ✔ kubectl
* ✔ KIND Kubernetes cluster
* ✔ Namespace isolation
* ✔ NGINX Ingress Controller

The cluster is now ready to deploy:

* Backend services
* Frontend applications
* Ingress routing

#➡️ The next sections deploy the **Spring Boot backend** and **React frontend** on top of this foundation.


### 1️⃣ Create Kubernetes Cluster (KIND)

```bash
kind create cluster --name prod-cluster
````

KIND allows running a **real Kubernetes cluster locally**, ideal for demos and learning.

---

### 2️⃣ Deploy Backend (Spring Boot)

* Deployed as a **Deployment** (2 replicas)
* Exposed internally using a **ClusterIP Service**
* Health checks via `/actuator/health`

```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
```

✅ Backend is **not publicly exposed**.

---

### 3️⃣ Deploy Frontend (React + Nginx)

* React app is built into static files
* Served via **Nginx**
* Deployed as a **Deployment**
* Exposed internally using a **ClusterIP Service**

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

Frontend calls backend using **relative paths (`/api`)**, making it environment-agnostic.

---

### 4️⃣ Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

Ingress Controller is responsible for:

* Handling incoming HTTP traffic
* Routing requests to internal services

---

### 5️⃣ Configure Ingress (Single Entry Point)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: nginx
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend
                port:
                  number: 8080
```

This enables:

* `/` → React frontend
* `/api` → Spring Boot backend

---

### 6️⃣ Access Application (GitHub Codespaces)

In Codespaces, the Ingress is accessed via the forwarded URL:

```
https://<codespaces-url>-8080.app.github.dev
```

🎉 **Result:**

* Frontend loads successfully
* Backend API responds
* UI shows: `Backend Health: UP`

---

## 🔑 Kubernetes Concepts Demonstrated

* **Deployments** – scalability & rolling updates
* **Services (ClusterIP)** – internal communication
* **Ingress Controller** – single entry point
* **Path-based routing** – frontend & backend separation
* **Health checks** – production readiness
* **No hardcoded URLs** – environment-agnostic design

---

## 🎯 Why This Matters

This setup closely mirrors **real production Kubernetes architectures**, except:

* KIND instead of managed Kubernetes
* Port-forward / Codespaces URL instead of cloud LoadBalancer

The same manifests work on **EKS, GKE, or AKS** with minimal changes.

---

## 📌 Future Enhancements

* PostgreSQL (StatefulSet + PVC)
* ConfigMaps & Secrets
* HPA (Autoscaling)
* TLS with cert-manager
* CI/CD with GitHub Actions
* Helm chart packaging

---

## 🙌 Final Note

This project was built **step-by-step**, debugging real issues such as:

* Ingress host matching
* Codespaces networking limitations
* Docker build compatibility
* Frontend–backend routing

It’s a **hands-on demonstration of real Kubernetes engineering**.

---

⭐ If you like this project, feel free to star the repo and connect on LinkedIn!



