# 📌 Product Requirements Document (PRD)

## Project Name: **Zwiggy**

### Version: 1.0

### Author: Ankit

### Tech Stack: Spring Boot + REST APIs

### Target Platform: Web / Mobile (Backend-first)

---

## 1. Product Overview

**FoodFlow** is a food delivery platform similar to Swiggy/Zomato that enables users to browse restaurants, order food, make online payments, and track orders in real time. The system supports multiple user roles (Admin, Customer, Restaurant Partner, Delivery Partner) and provides analytics, notifications, and secure payment processing.

---

## 2. Goals & Objectives

### Primary Goals

* Build a **scalable, secure, production-grade backend**
* Demonstrate **clean architecture & best practices**
* Implement **real-world features** like payments, caching, analytics, and notifications

### Success Metrics

* All APIs documented via Swagger
* Secure role-based access
* High performance with caching & pagination
* Clean code adhering to layered architecture

---

## 3. Target Users & Roles

| Role                 | Description                                        |
| -------------------- | -------------------------------------------------- |
| **Customer**         | Browses restaurants, places orders, makes payments |
| **Admin**            | Manages users, restaurants, categories, analytics  |
| **Restaurant**       | Manages menu items, availability, order status     |
| **Delivery Partner** | Views assigned orders, updates delivery status     |

---

## 4. Technical Stack (Mandatory)

| Component       | Technology                                |
| --------------- | ----------------------------------------- |
| Backend         | Spring Boot                               |
| Database        | PostgreSQL / MySQL (preferred) or MongoDB |
| Authentication  | JWT                                       |
| API Style       | REST                                      |
| Validation      | Jakarta Validation                        |
| Documentation   | Swagger / OpenAPI                         |
| Version Control | GitHub                                    |

---

## 5. Backend Architecture (Mandatory)

```
controller/     → API layer (request/response only)
service/        → Business logic
repository/     → DB access (JPA / MongoRepository)
model/          → Entities
dto/             → Request / Response DTOs
config/          → Security, Swagger, Cache, Rate limit
exception/       → Custom & global exceptions
util/            → Helpers, constants
```

🚫 **No business logic inside controllers**

---

## 6. Functional Requirements

---

## 6.1 User Management

### Features

* User registration
* Login with JWT authentication
* Role-based authorization
* Secure password hashing
* Token validation & refresh

### APIs

* `POST /auth/register`
* `POST /auth/login`
* `GET /auth/me`
* `POST /auth/refresh-token`

---

## 6.2 Core Domain Modules

### 6.2.1 Restaurant Management

* Create restaurant (Admin)
* Update restaurant details
* Enable/disable restaurant
* Fetch restaurant by ID
* List restaurants (pagination, sorting, filtering)

**Filters**

* Cuisine
* Rating
* Open/Closed
* City

---

### 6.2.2 Menu & Food Items

* Add food item to restaurant
* Update price & availability
* Delete item
* Upload food images
* List items by restaurant/category

---

### 6.2.3 Orders

* Create order
* Update order status
* Cancel order
* Fetch order by ID
* List orders (User/Admin/Restaurant)

**Order States**

```
PLACED → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
```

---

### 6.2.4 Payments (Razorpay Integration)

* Create payment order
* Verify payment signature
* Store transaction details
* Link payment to order

**Payment Status**

* CREATED
* SUCCESS
* FAILED
* REFUNDED

---

## 6.3 Advanced Features (Compulsory)

| Feature                   | Implementation                    |
| ------------------------- | --------------------------------- |
| Complex queries           | Custom JPA queries / Criteria API |
| Pagination & sorting      | Pageable                          |
| Filtering                 | Specification / Query params      |
| Caching                   | Redis / Spring Cache              |
| File upload               | Multipart (food images)           |
| Email notifications       | SMTP (order confirmation)         |
| API rate limiting         | Bucket4j / Filter                 |
| Analytics APIs            | Orders, revenue, top restaurants  |
| Global exception handling | @ControllerAdvice                 |
| Input validation          | Jakarta Validation                |
| Swagger docs              | OpenAPI 3                         |

---

## 6.4 External Integrations (Mandatory)

### Razorpay Payment Gateway

* Order creation
* Payment verification
* Webhook handling (optional)

**Optional**

* Email SMTP (Gmail / SendGrid)
* SMS (mock allowed)

---

## 6.5 Bonus Features ⭐

| Feature        | Description                 |
| -------------- | --------------------------- |
| Kafka / Events | Order status events         |
| Frontend UI    | React / Flutter             |
| Docker         | Dockerfile + docker-compose |
| Cloud          | AWS / Railway / Render      |

---

## 7. Non-Functional Requirements

* Clean, readable code
* Layered architecture
* No hardcoded secrets
* Environment-based configs
* Secure endpoints
* Proper HTTP status codes
* Meaningful error messages
* Modular & testable code

---

## 8. Security Requirements

* JWT authentication
* Role-based access control
* Password hashing (BCrypt)
* API rate limiting
* CORS configuration
* Secure payment verification

---

## 9. API Documentation

* Swagger UI available at:

```
/swagger-ui.html
```

* All endpoints documented with:

  * Request DTOs
  * Response schemas
  * Error responses

---

## 10. Deployment & DevOps (Optional but Recommended)

* Dockerized services
* CI/CD via GitHub Actions
* Environment configs
* Cloud deployment

---

## 11. Future Enhancements

* Live order tracking
* Recommendation system
* Loyalty & coupons
* Multi-language support
* Real-time notifications (WebSockets)

---

## 12. GitHub Repository Structure (Expected)

```
foodflow-backend/
├── controller/
├── service/
├── repository/
├── model/
├── dto/
├── config/
├── exception/
├── util/
├── resources/
│   ├── application.yml
│   └── application-prod.yml
```

---

## 🔥 Why This PRD Is Strong

* Matches **enterprise backend standards**
* Covers **all mandatory & advanced features**
* Easy to defend in **interviews, reviews & demos**
* Perfect base for **resume & GitHub showcase**

---

If you want next:

* ✅ **DB schema (ER diagram)**
* ✅ **Exact API contract (Swagger-ready)**
* ✅ **Spring Security + JWT flow**
* ✅ **Razorpay integration code**
* ✅ **Kafka event design**
* ✅ **Admin analytics queries**