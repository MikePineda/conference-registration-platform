# Conference registration platform


## Perform a manual deployment in the EC2
```
cd ~/conference-registration-platform && git pull

# frontend:
cd apps/frontend && npm run build

# backend:
cd ~/conference-registration-platform && docker build -t conference-api -f apps/backend/Dockerfile .

docker rm -f conference-api
docker run -d --name conference-api --restart unless-stopped --network host --env-file ~/conference-registration-platform/apps/backend/.env conference-api
```