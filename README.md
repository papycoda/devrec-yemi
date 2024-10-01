# devrec-yemi


# Trells Project

This project consists of a Django backend and a React frontend.

## Prerequisites

- Python 3.11
- Node.js and npm (or yarn)
- pip (Python package manager)

## Getting Started

### Backend (Django)

1. Navigate to the backend directory:
   ```
   cd trells
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

5. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Load initial data:
   ```
   python manage.py load_data
   ```
    create superuser to see loaded data. other users can be created on the fe

7. Start the Django development server:
   ```
   python manage.py runserver
   ```

The backend should now be running at `http://localhost:8000`.

### Frontend (React)

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required packages:
   ```
   npm install
   ```
   or if you're using yarn:
   ```
   yarn install
   ```

3. Start the React development server:
   ```
   npm start
   ```
   or with yarn:
   ```
   yarn start
   ```

The frontend should now be running at `http://localhost:3000`.

## Development

- Make sure both the backend and frontend servers are running for full functionality.
- The backend API will be accessible at `http://localhost:8000/api/`.
- You can now start developing your Django backend and React frontend!





docker
# Trells Project

This project consists of a Django backend (Trells) and a React frontend, containerized using Docker for easy development and deployment.

## Project Structure

- `trells/`: Django backend application
- `frontend/`: React frontend application
- `data/`: Data directory (mounted as a volume)

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Create a `.env` file in the project root and add your environment variables:
   ```
   DEBUG=1
   SECRET_KEY=your_secret_key_here
   DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
   ```

3. Build and start the containers:
   ```
   docker-compose up --build
   ```

4. Access the applications:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000

## Services

### Trells (Backend)

- Built from Python 3.11 image
- Runs Django application
- Exposes port 8000
- Automatically runs migrations and loads initial data

### Frontend

- Built from Node 14 image
- Runs React application
- Exposes port 3000

## Development

- Backend code is located in the `trells/` directory
- Frontend code is located in the `frontend/` directory
- Both directories are mounted as volumes, allowing for live code reloading

## Commands

- Start the services: `docker-compose up`
- Rebuild the services: `docker-compose up --build`
- Stop the services: `docker-compose down`
- View logs: `docker-compose logs`

