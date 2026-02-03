# Zwiggy - Food Delivery Platform

Zwiggy is a full-stack food delivery application built with Spring Boot and React offering a seamless experience for customers, administrators, and restaurants.

## 🌐 Live Deployment

- **Frontend**: [https://zwiggy-flax.vercel.app/](https://zwiggy-flax.vercel.app/)
- **Backend API**: [https://food-delivery-backend-ckyd.onrender.com](https://food-delivery-backend-ckyd.onrender.com)
- **API Documentation (Swagger)**: [https://food-delivery-backend-ckyd.onrender.com/swagger-ui/index.html](https://food-delivery-backend-ckyd.onrender.com/swagger-ui/index.html)

## 🚀 Features

### Customer
- **Authentication**: Secure Login/Register with JWT
- **Browse**: View restaurants and filter by cuisine/rating
- **Cart**: Add/remove items, view subtotal
- **Order Tracking**: Real-time order status updates
- **Payments**: Razorpay integration for secure transactions

### Admin
- **Analytics Dashboard**: Overview of revenue, orders and popular items
- **Rate Limiting**: Protection against API abuse
- **Management**: Oversee restaurants and user data

### Technical Highlights
- **Architecture**: Layered architecture (Controller, Service, Repository)
- **Security**: Role-Based Access Control (RBAC)
- **Performance**: Bucket4j Rate Limiting, Lazy Loading handling
- **Storage**: PostgreSQL database with JPA/Hibernate

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17+
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL (H2 for dev)
- **Payment**: Razorpay SDK
- **Rate Limiting**: Bucket4j + Caffeine
- **Documentation**: Swagger UI / OpenAPI

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

## 📦 Installation & Setup

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL (optional, can use H2)
- Razorpay Account (Key ID & Secret)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd FoodDeliveryBackend
   ```
2. Configure `application.yaml` with your DB and Razorpay credentials.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   Server starts at `http://localhost:8080`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd FoodDeliveryFrontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

## 📚 API Documentation

- **Swagger UI**: Visit `http://localhost:8080/swagger-ui.html` for interactive API docs.
- **Postman**: Import `Zwiggy_API.postman_collection.json` for ready-to-use requests.

## 📊 Analytics & Rate Limits

The platform includes a robust analytics engine for admins:
- **Dashboard**: `GET /api/analytics/dashboard`
- **Revenue**: `GET /api/analytics/revenue`

**Rate Limits (buckets per minute):**
- Public: 100
- Auth: 10
- Authenticated: 60
- Admin: 120

## 📝 License
This project is open source and available under the MIT License.

