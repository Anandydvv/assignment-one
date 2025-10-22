@echo off
title 🚀 Escape Room Auto Docker Runner
echo Starting Docker Desktop...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

:: Wait until Docker engine is available
:waitloop
docker info >nul 2>&1
if errorlevel 1 (
    echo 🕐 Waiting for Docker to start...
    timeout /t 5 >nul
    goto waitloop
)

echo ✅ Docker is running!
echo -------------------------------------
cd /d "%~dp0"
echo 🧱 Building containers...
docker-compose build

echo 🚀 Starting containers...
docker-compose up
pause
