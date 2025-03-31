#!/bin/bash

# 🐳 Run tests inside Docker container with Ghostscript pre-installed

echo "🔍 Running tests in Docker container..."

docker compose run --rm ghostscript npm test