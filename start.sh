#!/bin/bash

echo "Starting MPMT application with Docker..."

# Build and start all containers
docker-compose up -d --build

echo "Containers are starting..."
echo "- Frontend will be available at http://localhost:8081"
echo "- Backend API will be available at http://localhost:8080"
echo "- MySQL database is accessible at localhost:3306"
echo "- phpMyAdmin is available at http://localhost:8082"
echo ""
echo "You can connect with credentials:"
echo " - MySQL: root / root"
echo " - phpMyAdmin: root / root"
echo " - frontend: nathan@gmail.com / Password"
echo ""
echo "To view logs use: docker-compose logs -f [service_name]"
echo "To stop all services use: docker-compose down"
