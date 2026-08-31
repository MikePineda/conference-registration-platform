# Conference registration platform


## Deployment URL
- Frontend: [http://54.79.183.14/](http://54.79.183.14/)
- Backend: [http://54.79.183.14/api](http://54.79.183.14/api)

## Architecture Summary
Simple application running under NGINX + Docker. Node/Typescript for the backend. Please see /docs/diagrams to check the full architecture summary

## Tech stack
- Frontend: Angular
- Backend: AdonisJS (Node)
- Database: MySQL
- Programming Language: Typescript
- Reverse Proxy: NGINX

## Environment Variables

### Frontend
You can find the environment variables in `apps/frontend/src/environments/`

```typescript
export const environment = {
    apiUrl: 'http://54.79.183.14/api',
};

```

### Backend
Please see .env.example to see which environment variables does the backend expect. Example below (reference only, please refer to `apps/backend/.env.example` for the up-to-date version)
```
# Node
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development

# App
LOG_LEVEL=info
# node ace generate:key
APP_KEY=
APP_URL=http://${HOST}:${PORT}

# Session
SESSION_DRIVER=cookie

#--------------------------------------------------------------------
# CORS (configure allowed origins for API access)
#--------------------------------------------------------------------
CORS_ORIGIN=http://localhost:4200


# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_DATABASE=conference-registration-platform
```

## Initial Server setup
- Install node
- Install Docker
- Clone the repo
- Install NGINX
- Install MySQL
- Configure nginx

### MySQL
Please ensure the database you set on your .env exists
```
CREATE DATABASE IF NOT EXISTS conference-registration-platform
```
Also, ensure you have a user with permissions
```
CREATE USER IF NOT EXISTS 'user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON conference-registration-platform.* TO 'user'@'localhost';

```

### NGINX
For nginx, you need to enable and configure the site. Here's the servers settings to serve the frontend and backend under port 80
```
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/conference;
    index index.html;

    # Frontend: Angular SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend: Docker (port 3333)
    location /api/ {
        proxy_pass http://127.0.0.1:3333/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```
The project is cloned under `/home/ubuntu/conference-registration-platform`. There's a symlink between `/var/www/conference` and `/home/ubuntu/conference-registration-platform/apps/frontend/dist/frontend/browser` in order to server the newest builds without the need to move files

## Deploy/ redeploy procedure
```
cd ~/conference-registration-platform && git pull

# frontend:
cd apps/frontend && npm run build

# backend:
cd ~/conference-registration-platform && docker build -t conference-api -f apps/backend/Dockerfile .

docker rm -f conference-api
docker run -d --name conference-api --restart unless-stopped --network host --env-file ~/conference-registration-platform/apps/backend/.env conference-api
```

## Run database migrations
```
cd ~/conference-registration-platform/apps/backend
npm run migration:run -- --force
```


## Known limitations

The current iteration (`v1.0.0`) is the submitted release for Sprint 2 and intentionally does not include:
- Email notifications
- Payment gateway
- Attendee-side flows beyond public view
- Desktop layouts
- There's a slight downtime everytime we run the deployment steps (5 seconds)
- If the ec2 gets deleted, the data gets deleted as well since everything is living in the EC2