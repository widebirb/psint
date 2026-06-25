# PSINT 

A job application tracker designed to help you organize and analyze your job search. Track applications seamlessly from a centralized dashboard and capture postings directly from any job board with our Chrome extension.

## Features
- **Analytics Dashboard**: View key metrics and see recent applications at a glance.
- **Chrome Extension**: Save new job listings from any job board directly into your tracker.
- **Job Tracking**: Search, filter, sort, and paginate through your entire application history.
- **Secure Google Authentication**: Sign in securely via Google OAuth 2.0 with instant JWT generation.
- **Responsive Layout**: Clean desktop and mobile layouts.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TanStack Query (React Query), Axios
- **Backend API**: .NET 10 Minimal API, Entity Framework Core (EF Core)
- **Database**: PostgreSQL 15
- **Authentication**: Google OAuth 2.0, JSON Web Tokens (JWT)
- **Chrome Extension**: Chrome MV3, HTML, CSS, JavaScript
- **Infrastructure & Hosting**: Docker, AWS ECS Fargate, AWS RDS, AWS S3 + CloudFront, GitHub Actions CI/CD (deployment in progress)

## Local Development

### Prerequisites
- Docker & Docker Compose
- .NET 10 SDK
- Node.js (v18+)

### Steps

1. **Database**: Spin up the local PostgreSQL database using Docker:
   ```bash
   cd backend
   docker compose up -d
   ```

2. **Backend**: Setup your environment variables in `backend/JobTracker.Api/.env` and launch the API server:
   ```bash
   cd JobTracker.Api
   dotnet run
   ```

3. **Frontend**: Install dependencies, configure your `frontend/.env.local`, and run the frontend Vite dev server:
   ```bash
   cd ../../frontend
   npm install
   npm run dev
   ```

4. **Chrome Extension**: 
   - Open Chrome and navigate to `chrome://extensions`.
   - Enable **Developer mode** in the top right.
   - Click **Load unpacked** and select the `extension` folder in this repository.
   - In the web app, click **Copy Token** in the sidebar, paste it into the extension's Settings tab.

## Running Tests

Integration tests use Testcontainers to spin up a temporary PostgreSQL instance. To run the backend tests:
```bash
cd backend
dotnet test --logger "console;verbosity=normal"
```

## License
Licensed under the [MIT License](LICENSE).
