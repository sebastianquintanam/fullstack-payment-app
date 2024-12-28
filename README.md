# fullstack-payment-app
This project integrates a payment gateway to allow users to purchase products through a complete payment flow.

## Technologies Used
- **Frontend**: ReactJS with Redux for state management. Responsive design using Flexbox and Material-UI.
- **Backend**: Nest.js with Hexagonal Architecture (Ports & Adapters), PostgreSQL database.
- **Testing**: Jest with over 80% coverage for both frontend and backend.
- **Deployment**: AWS (S3, Lambda, RDS, CloudFront) for frontend and backend.

## Key Features
### 1. Product Display
- Shows the available inventory with name, description, price, and stock units.

### 2. Payment Checkout
- Modal for entering credit card information and shipping address.
- Fake card data validation with logo detection (Visa/MasterCard).

### 3. Payment Processing
- Transactions are created with a "PENDING" status and updated with the payment result.

### 4. Stock Update
- Reduces inventory after a successful purchase.

### 5. Responsive Design
- Optimized for mobile devices (minimum resolution: iPhone SE 2020).

## Purpose
The goal of this project is to showcase skills in:
- Developing RESTful APIs with best practices.
- Implementing dynamic and adaptive user interfaces.
- Managing global state with Redux.
- Writing unit tests with high code coverage.
- Using cloud services for deploying applications.

## Setup and Execution Instructions
For details on how to run this project, refer to the [README.md](./README.md) section in the `/frontend` and `/backend` folders.
