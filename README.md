# URL Shortener App

This is a URL shortener web application where users can shorten long URLs and view their shortened URL history after logging in. The application uses JWT (JSON Web Token) authentication for user authentication.

## Features

- User Authentication: Users can sign up, log in, and log out securely using JWT authentication.
- URL Shortening: Authenticated users can shorten long URLs into unique short URLs.
- Shortened URL History: Users can view their previously shortened URLs along with visit counts.
- Security: JWT authentication ensures secure user authentication and authorization.

## Technologies Used

- Node.js: Backend server environment
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for storing user data and URL records
- JSON Web Tokens (JWT): Authentication mechanism for securing user sessions
- Shortid: Library for generating unique short IDs for shortened URLs

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your_username/url-shortener-app.git
    ```

2. **Install dependencies:**

    ```bash
    cd url-shortener-app
    npm install
    ```

3. **Set up environment variables:**

    ```bash
    cp .env.example .env
    ```

    Edit the `.env` file and provide values for environment variables such as MongoDB URI, JWT secret key, etc.

4. **Start the server:**

    ```bash
    npm start
    ```

## Usage

1. **Sign Up**: Create a new account by providing your username, email, and password.
2. **Log In**: Log in with your registered email and password.
3. **Shorten URL**: After logging in, enter a long URL in the input field and click "Shorten" to generate a shortened URL.
4. **View History**: Click on the "History" tab to view your previously shortened URLs along with visit counts.
5. **Log Out**: Click on the "Log Out" button to securely log out of your account.

## Contributors

- [Anuj Gill](https://github.com/anujgill)

## License

This project is licensed under the MIT License.



