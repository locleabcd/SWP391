# Koi Care System
The **Koi Care System** is a web-based platform designed to manage and care for Koi fish in a pond. The system allows users to create accounts, add their Koi fish, and manage them effectively. It also provides functionality for shop owners to list and sell products related to Koi fish care.
## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Roles](#roles)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
## Features
- **User Authentication**: Supports JWT-based authentication, with roles such as Guest, Member, Shop, and Admin.
- **Role Management**: Assigns default roles on registration, with different permissions for each role.
- **Koi Fish Management**: Members can create, add, or remove Koi fish in the pond.
- **Shop Functionality**: Users with the "Shop" role can post products for sale, and perform CRUD operations on tags and blogs.
- **Google & GitHub Login**: OAuth2 integration for Google and GitHub login.
- **Email Verification**: Upon registration, users must verify their email before becoming a full Member.
## Technologies
- **Backend**: Spring Boot 3, Spring Security, Spring Data JPA
- **Frontend**: React
- **Database**: SQLServer
- **Authentication**: JWT, OAuth2 (Google and GitHub)
- **Email**: Spring Mail (Gmail)
- **Cloud**: Azure
## Setup
1. Clone the repository:
    ```bash
    git clone [https://github.com/yourusername/koi-care-system.git](https://github.com/locleabcd/SWP391.git)
    ```
2. Navigate to the project directory:
    ```bash
    cd koi-care-system
    ```
3. Set up the MySQL database:
    - Create a database named `koi-care-system`.
    - Configure the database connection in `application.properties`:
      ```properties
      spring.datasource.url=${DB_URL}
      spring.datasource.username=${DB_NAME}
      spring.datasource.password=${DB_PASSWORD}
      ```
4. Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
## Usage
- Visit the application at [`http://localhost:8080/api`](https://koi-care-system.vercel.app/).
- Register as a new user or log in with Google/GitHub.
- Explore features based on your role (Guest, Member, Shop, Admin).
## Database Schema
The system uses a relational database schema with the following main tables:
- `users` (id, username, email, password, role)
- `koi_fish` (id, name, weight, user_id)
- `products` (id, name, description, price, shop_id)
## Roles
- **Guest**: Default role for new users.
- **Member**: Users who have verified their email can manage their Koi fish.
- **Shop**: Users with the "Shop" role can list products, and manage tags and blogs.
- **Admin**: Admins have full control over all operations in the system.
## API Endpoints
| Method | Endpoint                    | Description                         |
|--------|------------------------------|-------------------------------------|
| POST   | `/api/auth/register`          | Register a new user                |
| POST   | `/api/auth/login`             | Log in a user                      |
| GET    | `/api/koi`                    | Get all Koi fish for the logged-in user |
| POST   | `/api/koi`                    | Add a new Koi fish                 |
| PUT    | `/api/koi/{id}`               | Update a Koi fish by ID            |
| DELETE | `/api/koi/{id}`               | Remove a Koi fish by ID            |
| POST   | `/api/shop/products`          | Add a new product (Shop role only) |
| GET    | `/api/shop/products`          | Get all products                   |
### Our Contributors ✨

<a href="https://github.com/locleabcd/SWP391/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=locleabcd/SWP391" />
</a>

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
