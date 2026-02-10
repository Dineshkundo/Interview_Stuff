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

```

---

### 🔥 LinkedIn Caption (Optional – Copy/Paste)

> 🚀 Built a full-stack application on Kubernetes using GitHub Codespaces!  
>  
> Deployed React + Spring Boot with internal services and exposed them securely via NGINX Ingress.  
>  
> This project focuses on **real Kubernetes concepts** like Deployments, Services, Ingress, and production-style routing — not just a demo.  
>  
> #Kubernetes #DevOps #CloudNative #GitHubCodespaces #Ingress #React #SpringBoot


