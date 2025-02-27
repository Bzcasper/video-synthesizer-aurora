#!/bin/bash

# Define the file containing tasks
TASKS_FILE="./docs/tasks.md"

# Define API endpoint for Lovable.dev (Replace with actual API)
LOVABLE_API="https://api.lovable.dev/tasks"

# Check if tasks file exists
if [ ! -f "$TASKS_FILE" ]; then
    echo "❌ Error: Tasks file not found at $TASKS_FILE"
    exit 1
fi

# Read and format tasks
TASKS_JSON="{\"tasks\":["

while IFS= read -r line; do
    # Check for task headings
    if [[ "$line" == "### "* ]]; then
        TASK_TITLE="${line//### /}"
        TASKS_JSON+="{\"title\": \"$TASK_TITLE\", \"status\": \"pending\"},"
    fi
done < "$TASKS_FILE"

# Remove trailing comma and close JSON array
TASKS_JSON="${TASKS_JSON%,}]}"

# Submit tasks to Lovable.dev
RESPONSE=$(curl -s -X POST "$LOVABLE_API" \
    -H "Content-Type: application/json" \
    -d "$TASKS_JSON")

# Check response
if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ Tasks successfully submitted to Lovable.dev!"
else
    echo "❌ Failed to submit tasks. Response: $RESPONSE"
fi
