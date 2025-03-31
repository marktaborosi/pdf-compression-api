#!/bin/bash

# 🔁 Cleanup Script
# Deletes files in /app/uploads older than the number of days set in .env

AGE_DAYS="${CLEANUP_FILE_AGE_DAYS:-5}"

echo "🧹 Cleaning up files older than $AGE_DAYS days..."
find /app/uploads -type f -mtime +"$AGE_DAYS" -exec rm -f {} \;
