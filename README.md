# 💬 Real-Time Chat Application (Kubernetes Deployment)

A full-stack real-time chat application built with **React**, **Node.js**, **MongoDB**, and deployed using **Kubernetes** on a local development environment via Docker Desktop.

---

## 📦 Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express + Socket.IO
- **Database**: MongoDB
- **DevOps**: Docker, Kubernetes (local), kubectl

---

## 📁 Project Structure

chat-app/
├── backend/ # Node.js backend
├── frontend/ # React frontend
└── k8s/ # Kubernetes manifests


---

## 🚀 Getting Started

### 1. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with **Kubernetes enabled**
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Docker Hub account (or your own container registry)

---

### 2. Clone the Repository

```bash
git clone https://github.com/manikantadakarapu/messaging-app.git
cd messaging-app

# Frontend
docker build -t yourusername/chat-frontend ./frontend
docker push yourusername/chat-frontend

# Backend
docker build -t yourusername/chat-backend ./backend
docker push yourusername/chat-backend

# Kubernetes Secrets
kubectl create secret generic chat-secrets \
  --from-literal=MONGO_URI="mongodb://mongo-service:27017/chatdb" \
  --from-literal=JWT_SECRET="supersecurejwtsecret"

#Apply 
kubectl apply -f k8s/

# Access app
kubectl get svc chat-frontend-service

⚙️ Environment Variables
The backend expects the following environment variables from Kubernetes secrets:

MONGO_URI — MongoDB connection string (use Kubernetes service name)

JWT_SECRET — Secret used for signing JWTs

🧪 Development Tips
Use kubectl logs and kubectl describe for debugging.

Make sure the frontend connects to the backend using the service name inside the cluster:
http://chat-backend-service:5000

🔐 Future Improvements
Ingress + TLS

Production deployment (Cloud + Helm)

GitHub Actions CI/CD

MongoDB external persistence (Cloud)

📄 License
This project is for educational use. You may modify and use it freely.

🙌 Acknowledgments
Built and maintained by Veera Manikanta Sai Dakarapu