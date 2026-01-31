#!/bin/bash

# Zwiggy Food Delivery - Startup Script
# Starts both frontend and backend services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/FoodDeliveryFrontend"
BACKEND_DIR="$SCRIPT_DIR/FoodDeliveryBackend"

# PID files to track processes
FRONTEND_PID_FILE="$SCRIPT_DIR/.frontend.pid"
BACKEND_PID_FILE="$SCRIPT_DIR/.backend.pid"

# Log files
FRONTEND_LOG="$SCRIPT_DIR/frontend.log"
BACKEND_LOG="$SCRIPT_DIR/backend.log"

print_header() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                    🍕 Zwiggy Startup                      ║"
    echo "║              Food Delivery Application                    ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    
    if [ -f "$FRONTEND_PID_FILE" ]; then
        FRONTEND_PID=$(cat "$FRONTEND_PID_FILE")
        if kill -0 "$FRONTEND_PID" 2>/dev/null; then
            kill "$FRONTEND_PID" 2>/dev/null || true
            echo -e "${GREEN}✓ Frontend stopped${NC}"
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi
    
    if [ -f "$BACKEND_PID_FILE" ]; then
        BACKEND_PID=$(cat "$BACKEND_PID_FILE")
        if kill -0 "$BACKEND_PID" 2>/dev/null; then
            kill "$BACKEND_PID" 2>/dev/null || true
            echo -e "${GREEN}✓ Backend stopped${NC}"
        fi
        rm -f "$BACKEND_PID_FILE"
    fi
    
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js is not installed. Please install Node.js first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}✗ npm is not installed. Please install npm first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ npm $(npm --version)${NC}"
    
    # Check Java
    if ! command -v java &> /dev/null; then
        echo -e "${RED}✗ Java is not installed. Please install Java 17+ first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Java $(java --version 2>&1 | head -n 1)${NC}"
    
    echo ""
}

start_backend() {
    echo -e "${YELLOW}Starting Backend (Spring Boot)...${NC}"
    
    cd "$BACKEND_DIR"
    
    # Install dependencies and start
    if [ -f "./mvnw" ]; then
        chmod +x ./mvnw
        ./mvnw spring-boot:run > "$BACKEND_LOG" 2>&1 &
    else
        echo -e "${RED}✗ Maven wrapper not found. Please run from the project root.${NC}"
        exit 1
    fi
    
    BACKEND_PID=$!
    echo "$BACKEND_PID" > "$BACKEND_PID_FILE"
    
    echo -e "${GREEN}✓ Backend starting on http://localhost:8080${NC}"
    echo -e "${BLUE}  Log file: $BACKEND_LOG${NC}"
}

start_frontend() {
    echo -e "${YELLOW}Starting Frontend (Vite + React)...${NC}"
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}  Installing npm dependencies...${NC}"
        npm install
    fi
    
    # Start the dev server
    npm run dev > "$FRONTEND_LOG" 2>&1 &
    
    FRONTEND_PID=$!
    echo "$FRONTEND_PID" > "$FRONTEND_PID_FILE"
    
    echo -e "${GREEN}✓ Frontend starting on http://localhost:5173${NC}"
    echo -e "${BLUE}  Log file: $FRONTEND_LOG${NC}"
}

wait_for_services() {
    echo ""
    echo -e "${YELLOW}Waiting for services to be ready...${NC}"
    
    # Wait for backend
    echo -n "  Backend: "
    for i in {1..60}; do
        if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1 || curl -s http://localhost:8080 > /dev/null 2>&1; then
            echo -e "${GREEN}Ready!${NC}"
            break
        fi
        if [ $i -eq 60 ]; then
            echo -e "${YELLOW}Taking longer than expected (check $BACKEND_LOG)${NC}"
        fi
        sleep 1
        echo -n "."
    done
    
    # Wait for frontend
    echo -n "  Frontend: "
    for i in {1..30}; do
        if curl -s http://localhost:5173 > /dev/null 2>&1; then
            echo -e "${GREEN}Ready!${NC}"
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${YELLOW}Taking longer than expected (check $FRONTEND_LOG)${NC}"
        fi
        sleep 1
        echo -n "."
    done
    
    echo ""
}

show_status() {
    echo -e "${GREEN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                  🚀 Services Running                      ║"
    echo "╠═══════════════════════════════════════════════════════════╣"
    echo "║  Frontend:  http://localhost:5173                         ║"
    echo "║  Backend:   http://localhost:8080                         ║"
    echo "║  Swagger:   http://localhost:8080/swagger-ui.html         ║"
    echo "╠═══════════════════════════════════════════════════════════╣"
    echo "║  Press Ctrl+C to stop all services                        ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

main() {
    print_header
    check_dependencies
    start_backend
    start_frontend
    wait_for_services
    show_status
    
    # Keep script running to catch Ctrl+C
    while true; do
        sleep 1
        
        # Check if processes are still running
        if [ -f "$FRONTEND_PID_FILE" ]; then
            FRONTEND_PID=$(cat "$FRONTEND_PID_FILE")
            if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
                echo -e "${RED}Frontend process died unexpectedly. Check $FRONTEND_LOG${NC}"
                rm -f "$FRONTEND_PID_FILE"
            fi
        fi
        
        if [ -f "$BACKEND_PID_FILE" ]; then
            BACKEND_PID=$(cat "$BACKEND_PID_FILE")
            if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
                echo -e "${RED}Backend process died unexpectedly. Check $BACKEND_LOG${NC}"
                rm -f "$BACKEND_PID_FILE"
            fi
        fi
    done
}

main "$@"
