#!/bin/bash

# Colors for better UI
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Store process IDs
LARAVEL_PID=""
QUEUE_PID=""
SCHEDULER_PID=""
FLUTTER_PID=""
FRONTEND_PID=""

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on a port
kill_port() {
    lsof -ti :$1 | xargs kill -9 2>/dev/null
}

# Function to start Laravel backend
start_laravel() {
    echo -e "${GREEN}Starting Laravel backend...${NC}"
    cd backend
    php artisan serve > /dev/null 2>&1 &
    LARAVEL_PID=$!
    echo -e "${GREEN}Laravel started with PID: ${LARAVEL_PID}${NC}"
    cd ..
}

# Function to start Laravel queue worker
start_queue() {
    echo -e "${GREEN}Starting queue worker...${NC}"
    cd backend
    php artisan queue:work --tries=3 > storage/logs/queue.log 2>&1 &
    QUEUE_PID=$!
    echo -e "${GREEN}Queue worker started with PID: ${QUEUE_PID}${NC}"
    cd ..
}

# Function to start Laravel scheduler
start_scheduler() {
    echo -e "${GREEN}Setting up Laravel scheduler...${NC}"
    cd backend
    (
        while true; do
            php artisan schedule:run >> storage/logs/schedule.log 2>&1
            sleep 60
        done
    ) &
    SCHEDULER_PID=$!
    echo -e "${GREEN}Scheduler started with PID: ${SCHEDULER_PID}${NC}"
    cd ..
}

# Function to start Flutter admin
start_flutter() {
    echo -e "${GREEN}Starting Flutter admin...${NC}"
    cd admin
    flutter run > flutter.log 2>&1 &
    FLUTTER_PID=$!
    echo -e "${GREEN}Flutter started with PID: ${FLUTTER_PID}${NC}"
    cd ..
}

# Function to restart Flutter admin
restart_flutter() {
    echo -e "${YELLOW}Restarting Flutter admin...${NC}"
    if [ -n "$FLUTTER_PID" ]; then
        kill $FLUTTER_PID 2>/dev/null
        wait $FLUTTER_PID 2>/dev/null
    fi
    start_flutter
    echo -e "${GREEN}Flutter restarted successfully!${NC}"
}

# Function to start Frontend
start_frontend() {
    echo -e "${GREEN}Starting Frontend...${NC}"
    cd frontend
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}Frontend started with PID: ${FRONTEND_PID}${NC}"
    cd ..
}

# Function to stop all services
stop_all() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    
    if [ -n "$LARAVEL_PID" ]; then
        kill $LARAVEL_PID 2>/dev/null
        echo -e "${RED}Laravel stopped${NC}"
    fi
    
    if [ -n "$QUEUE_PID" ]; then
        kill $QUEUE_PID 2>/dev/null
        echo -e "${RED}Queue worker stopped${NC}"
    fi
    
    if [ -n "$SCHEDULER_PID" ]; then
        kill $SCHEDULER_PID 2>/dev/null
        echo -e "${RED}Scheduler stopped${NC}"
    fi
    
    if [ -n "$FLUTTER_PID" ]; then
        kill $FLUTTER_PID 2>/dev/null
        echo -e "${RED}Flutter stopped${NC}"
    fi
    
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${RED}Frontend stopped${NC}"
    fi
    
    # Additional cleanup of any processes on our ports
    kill_port 8000
    kill_port 3000
    kill_port 5173
    
    echo -e "${GREEN}All services stopped successfully!${NC}"
}

# Function to show help menu
show_help() {
    echo -e "${BLUE}=== ElkaAvie Development Environment Controls ===${NC}"
    echo -e "${YELLOW}Available commands:${NC}"
    echo -e "  ${GREEN}r${NC} - Restart Flutter"
    echo -e "  ${GREEN}f${NC} - View Flutter logs"
    echo -e "  ${GREEN}l${NC} - View Laravel logs"
    echo -e "  ${GREEN}q${NC} - View Queue worker logs"
    echo -e "  ${GREEN}s${NC} - Status of all services"
    echo -e "  ${GREEN}h${NC} - Show this help menu"
    echo -e "  ${RED}x${NC} - Stop all services and exit"
    echo
    echo -e "To run any command, just type the letter and press enter"
}

# Function to show status
show_status() {
    echo -e "${BLUE}=== Services Status ===${NC}"
    
    if [ -n "$LARAVEL_PID" ] && kill -0 $LARAVEL_PID 2>/dev/null; then
        echo -e "${GREEN}Laravel backend: Running (PID: $LARAVEL_PID)${NC}"
    else
        echo -e "${RED}Laravel backend: Not running${NC}"
    fi
    
    if [ -n "$QUEUE_PID" ] && kill -0 $QUEUE_PID 2>/dev/null; then
        echo -e "${GREEN}Queue worker: Running (PID: $QUEUE_PID)${NC}"
    else
        echo -e "${RED}Queue worker: Not running${NC}"
    fi
    
    if [ -n "$SCHEDULER_PID" ] && kill -0 $SCHEDULER_PID 2>/dev/null; then
        echo -e "${GREEN}Scheduler: Running (PID: $SCHEDULER_PID)${NC}"
    else
        echo -e "${RED}Scheduler: Not running${NC}"
    fi
    
    if [ -n "$FLUTTER_PID" ] && kill -0 $FLUTTER_PID 2>/dev/null; then
        echo -e "${GREEN}Flutter admin: Running (PID: $FLUTTER_PID)${NC}"
    else
        echo -e "${RED}Flutter admin: Not running${NC}"
    fi
    
    if [ -n "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${GREEN}Frontend: Running (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${RED}Frontend: Not running${NC}"
    fi
}

# Function to view logs
view_logs() {
    local log_file=$1
    if [ -f "$log_file" ]; then
        tail -n 50 "$log_file"
    else
        echo -e "${RED}Log file not found: $log_file${NC}"
    fi
}

# Main function
main() {
    # Kill existing processes on required ports
    echo -e "${YELLOW}Cleaning up existing processes...${NC}"
    kill_port 8000  # Laravel
    kill_port 3000  # Frontend
    kill_port 5173  # Frontend (alternate port)
    
    # Start all services
    start_laravel
    start_queue
    start_scheduler
    start_flutter
    start_frontend
    
    # Show help menu initially
    echo
    show_help
    
    # Interactive loop
    while true; do
        echo
        echo -e "${YELLOW}Enter command (h for help):${NC} "
        read -n 1 cmd
        echo
        
        case $cmd in
            r)
                restart_flutter
                ;;
            f)
                echo -e "${BLUE}=== Flutter Logs ===${NC}"
                view_logs "admin/flutter.log"
                ;;
            l)
                echo -e "${BLUE}=== Laravel Logs ===${NC}"
                view_logs "backend/storage/logs/laravel.log"
                ;;
            q)
                echo -e "${BLUE}=== Queue Worker Logs ===${NC}"
                view_logs "backend/storage/logs/queue.log"
                ;;
            s)
                show_status
                ;;
            h)
                show_help
                ;;
            x)
                stop_all
                echo -e "${GREEN}Exiting...${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid command. Type 'h' for help.${NC}"
                ;;
        esac
    done
}

# Trap Ctrl+C to cleanup before exit
trap stop_all EXIT

# Run the main function
main 