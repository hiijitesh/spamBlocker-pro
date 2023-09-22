# npm install -g json
date=$(date +%d.%m.%Y)
echo "Building..."
echo "checking out to dev branch"
git checkout dev
echo "Version: " $date
echo "Docker Build Started"
json -I -f package.json -e "this.version=\"$date\""
echo "Docker Build complete"
echo "Pushing image to Dockerhub"
docker build -t hiijitesh/spam-blocker:$date .
docker push hiijitesh/spam-blocker:$date
echo "Docker Push complete"
echo "Deploying the container"
echo "start docker-compose"
docker-compose down && docker-compose up -d
echo "Deployment finished"