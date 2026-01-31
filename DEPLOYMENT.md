# Render Deployment Guide

This guide describes how to deploy the Zwiggy Food Delivery backend to Render using the `render.yaml` blueprint.

## Prerequisites
- A [Render](https://render.com/) account.
- The project repository connected to your Render account (GitHub/GitLab).
- The Docker image pushed to Docker Hub: `14ankit/fooddelivery-backend:latest` (Already done).

## Steps

1.  **Dashboard**: Go to the [Render Dashboard](https://dashboard.render.com/).
2.  **New Blueprint**: Click **New +** and select **Blueprint**.
3.  **Connect Repo**: Connect the repository containing this code (`d:/Projects/FoodDelivery` pushed to your remote).
4.  **Confirm Blueprint**: Render will automatically detect the `render.yaml` file.
5.  **Configure Secrets**:
    You will be prompted to enter values for the environment variables marked as sensitive in `render.yaml`. Use the values from your local `.env` file (or generate new production keys):
    - `JWT_SECRET`: (Paste your secure JWT secret)
    - `RAZORPAY_KEY_ID`: (Your Razorpay Key ID)
    - `RAZORPAY_KEY_SECRET`: (Your Razorpay Key Secret)
    - `RAZORPAY_WEBHOOK_SECRET`: (Your Razorpay Webhook Secret)
6.  **Apply**: Click **Apply** to start the deployment.

## What Happens Next
- **Database**: Render will provision a new PostgreSQL database.
- **Backend**: Render will pull your Docker image `14ankit/fooddelivery-backend:latest` and start the container.
- **Connection**: The blueprint automatically injects the database connection details into the backend service using the environment variables `DB_HOST`, `DB_PORT`, etc., which Spring Boot constructs into the JDBC URL.

## Verification
Once deployed, the service will provide a public URL (e.g., `https://food-delivery-backend.onrender.com`).
You can verify it by visiting:
- `https://<YOUR-URL>/swagger-ui/index.html`
- `https://<YOUR-URL>/actuator/health`
