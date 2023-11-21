# Fragments

Working with expressjs for cloud-based microservices

# Getting Started

## Prerequisites

This application requires the following:

- Node.js (prefer latest LTS version) and npm installed in your development environment.
- A git client.

## Installation

1. Clone this repository to your local machine:

```
git clone https://github.com/Carmen-Git-It/fragments.git
```

2. Navigate to the project directory:

```bash
cd fragments
```

3. Install project dependencies:

```bash
npm install
```

## Docker Image

If you would rather use Docker, follow the steps below.

1. Install Docker on your local machine, Docker Desktop is an easy way to do this https://www.docker.com/products/docker-desktop/

2. Clone this repository to your local machine:

```
git clone https://github.com/Carmen-Git-It/fragments.git
```

3. Navigate to the project directory:

```bash
cd fragments
```

4. Build the Docker image:

```
docker build -t fragments:latest .
```

5. Run the image in detached mode:

```
docker run --rm --name fragments --env-file .env -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest
```

# Usage

## Starting in Production Mode

Run the basic start script in the project root:

```bash
npm run start
```

## Starting in Debug Mode

Run the debug script in the project root:

```bash
npm run debug
```

This allows for the VSCode debugger to attach to the node inspector on port **9229**.

## Starting in Development Mode

Run the dev script in the project root:

```bash
npm run dev
```

Running the application in development mode provides formatted logging.

## Test that the Service is Running

To connect to the service you can do one of the following:

1. Connect via a browser by navigating to **'localhost:8080'** in your address bar
2. Execute the following in a bash terminal:

```bash
curl localhost:8080
```

3. If you are on Windows and do not have access to a bash terminal, execute the following in Power Shell:

```bash
curl.exe localhost:8080
```

If the service is functional you should receive a valid JSON response that looks similar to the following:

```json
{
  "status": "ok",
  "author": "Carmen-Git-It",
  "githubUrl": "https://github.com/Carmen-Git-It/fragments",
  "version": "0.0.1"
}
```

## Lint the Code

To lint the code via ESLint, run the lint script in the project root:

```bash
npm run lint
```

## Testing

-To run the jest tests, run the following in the project root:

```bash
npm run test
```

-To keep the tests running, and re-run tests on changes to the codebase, run:

```bash
npm run test:watch
```

-To test while collecting coverage information:

```bash
npm run coverage
```

---

## Packages Used

Dev Dependencies:

- eslint (linter)
- nodemon (monitors code and automatically restarts the application on change)
- prettier (code formatter)

Dependencies:

- aws-jwt-verify (auth)
- compression (Middleware to compress responses)
- content-type (for parsing request content-type)
- cors (middleware that manages cross-origin requests)
- dotenv (accessing .env files)
- express (application framework)
- helmet (middleware that secures the application by adding response headers)
- http-auth (auth)
- http-auth-passport (auth)
- markdown-it (converting markdown into html for server fragments)
- passport (auth)
- passport-http-bearer (auth)
- pino (logger)
- pino-http (http logger)
- pino-pretty (formats logs)
- stoppable (enables clean stopping)
