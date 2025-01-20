
# Bizaway Test

`bizaway-test` is a Node.js application created as a test solution for the selection process of Pablo Murillo Dávila at Bizaway. This application can be run either using Docker Compose or directly on your local machine with Node.js and MongoDB provided by the user.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup with Docker Compose](#setup-with-docker-compose)
3. [Setup without Docker Compose (Node.js)](#setup-without-docker-compose-nodejs)
4. [Usage](#usage)
5. [Configuration](#configuration)
6. [License](#license)

## Prerequisites

Before setting up the application, make sure you have the following installed:

- Docker & Docker Compose (for Docker setup)
- Node.js (for direct setup)
- MongoDB (for direct setup)

## Setup with Docker Compose

To build and run the application using Docker Compose, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repository/bizaway-test.git
   cd bizaway-test
   ```

2. Make sure `docker` and `docker-compose` are installed on your machine.

3. Create a `.env.docker` file in the project root and fill it as in the `.env.sample` example file.

4. Start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images and start the application, including the MongoDB container. The app will be accessible at `http://localhost:8080`.

5. To stop the application:

   ```bash
   docker-compose down
   ```

## Setup without Docker Compose (direct setup)

If you prefer to run the application without Docker Compose, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repository/bizaway-test.git
   cd bizaway-test
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Set up MongoDB locally:

   You can either install MongoDB on your machine or use a cloud-based instance. You may need to create a database named as the environment variable `DB_NAME`. If you're using a local MongoDB instance, make sure it’s running and accessible.

4. Create a `.env` file in the project root and fill it as in the `.env.sample` example file. Adjust the `DB_CONN_STRING` and `DB_NAME` if you're using a different MongoDB configuration.

5. Start the application:

   ```bash
   npm start
   ```

   The application will now be running at `http://localhost:8080`.

6. To stop the application, simply press `CTRL+C` in the terminal.

## Usage

Once the application is running, you can access its swagger UI in your browser at:

```
http://localhost:8080/api-docs
```

or you can use it directly by calling any of the API endpoints under:

```
http://localhost:8080/
```

### API Endpoints

Here are the available API endpoints:

- **GET /trips**  
  Returns a list of trips from the external service.  
  **Response:**  
  - `200 OK`: List of items in JSON format.

- **GET /trips/saved**  
  Returns a list of previously saved trips.  
  **Response:**  
  - `200 OK`: The item data in JSON format.  

- **POST /trips/saved**  
  Saves a new trip in the database.  
  **Request Body fields (JSON):**  
  - `origin` (string): IATA 3 letter code of the origin.  
  - `destination` (string): IATA 3 letter code of the destination.
  - `cost` (number): Cost of the trip.
  - `duration` (number): Duration of the trip.
  - `type` (string): Trip type.
  - `id` (string): Unique trip identifier.
  - `display_name` (string): Trip name.

  **Response:**  
  - `201 Created`: The created trip in JSON format.

- **DELETE /trips/saved/:id**  
  Deletes a previously saved trip by its ID.  
  **Response:**  
  - `204 No Content`: If the item was deleted successfully.  
  - `404 Not Found`: If the item does not exist.

## Configuration

You can configure the app parameters by adjusting the fields in the `.env` or `.env.docker` file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
