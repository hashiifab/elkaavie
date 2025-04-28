#!/bin/bash

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on a port
kill_port() {
    lsof -ti :$1 | xargs kill -9 2>/dev/null
}

# Kill existing processes on required ports
echo "Cleaning up existing processes..."
kill_port 8000  # Laravel
kill_port 3000  # Frontend
kill_port 5173  # Frontend (alternate port)

# Start Backend (Laravel)
echo "Starting Laravel backend..."
cd backend
php artisan serve &

# Start queue worker with proper output
echo "Starting queue worker..."
php artisan queue:work --tries=3 > storage/logs/queue.log 2>&1 &

# Set up scheduler to run every minute for automatic tasks
echo "Setting up Laravel scheduler..."
while true; do
    php artisan schedule:run >> storage/logs/schedule.log 2>&1
    sleep 60
done &

# Start Admin (Flutter)
echo "Starting Flutter admin..."
cd ../admin
flutter run &

# Start Frontend
echo "Starting Frontend..."
cd ../frontend
npm run dev &

# Wait for all background processes
wait 