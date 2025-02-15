# TIERHELDEN-APP

## Setup

This project requires API keys for several services (such as Clerk, UploadThing, etc.) in order to run the local environment.

> *Note:* Our long-term goal is to bypass or stub these services during local development, enabling you to work without an active internet connection.

Create the required environment file for your setup:
   - The `.env.example` file provides all values required for deployment within the infrastructure.
   - The `.env.local.example` file provides all values required during local development.

Duplicate one of the two files and rename it, removing the `.example` suffix to use as a template.

For local development, the `.env.local` file should already contain most values required to get started.
However, to use the online services that don't have an offline version, you may need to fill in the API keys.

## Development Environment

The entire development environment is containerized using Docker. This means that:
   - All development dependencies (Node.js, build tools, etc.) are installed inside Docker containers rather than on your host computer.
   - Your workspace (including the application code) is mounted into the container, while dependencies like node_modules are managed by Docker volumes.
   - Reproducibility: You can recreate or remove containers and volumes at any time to start completely from scratch.

> *NOTE:* Once you switch to Docker and you don't have any other local projects that require NodeJS, you can uninstall those runtimes from your host machine.

### Prerequisites

Download and install [Docker Desktop](https://www.docker.com/).
This is available for macOS, Windows, and Linux (with alternative installation methods).

> *Note:* If you’re on Windows, you might need to enable Hyper-V or use WSL2. See the [Docker Desktop Windows installation guide](https://docs.docker.com/desktop/setup/install/windows-install/) for details.

### Running the Containers

Once Docker is installed, open your terminal, navigate to the project directory, and run:

```bash
docker-compose up --build
```

> *TIP:* To run the containers in the background (detached mode), use: `docker-compose up -d --build`

This command will:
   - Build and start your Next.js app (in dev mode) on http://localhost:3000.
   - Spin up a PostgreSQL instance (available on port 5432).
   - Start Adminer for DB management on http://localhost:8080.

> *Important:* If you update your .env.local file during development, you may need to restart the containers for the changes to take effect.

### Using Development Containers in VS Code

You can also run your entire IDE setup inside a Docker container using VS Code Dev Containers.
This approach encapsulates your code, dependencies, and even VS Code extensions for a unified development experience throughout the entire team.

   1.	Install the [Visual Studio Code Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.
   2.	Open the Project in a Dev Container using the `Reopen in Container` command from the VSCode Command Palette.

VS Code will use the configuration in the .devcontainer folder (which references the Docker Compose setup) to start the container and attach your IDE to it.

## Database Updates

When you need to update your database schema:

   1. Modify `/prisma/schema.prisma` as required.
   2. Generate the Prisma Client via `prisma generate`.
   3. Synchronize the local database schema with your changes `npx prisma migrate dev`.
   4. Once verified, commit and push your updates to GitHub.

