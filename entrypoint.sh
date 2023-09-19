# npm install -g json
date=$(date +%d.%m.%Y)
echo "checking out to dev branch"
git checkout dev
echo "Date"  $date
echo "Version: " $date
json -I -f package.json -e "this.version=\"$date\""
echo "Build complete"
echo "Pushing to docker hub"
docker build -t hiijitesh/spam-blocker:$date .
docker push hiijitesh/spam-blocker:$date
echo "start docker-compose"
docker-compose down && docker-compose up -d