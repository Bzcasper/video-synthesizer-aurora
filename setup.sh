#!/bin/bash

# Define the base project directory
BASE_DIR="/workspaces/video-synthesizer-aurora"

# Define subdirectories
SUB_DIRS=("src/pages" "src/components" "src/hooks" "public" "config" "docs" "logs" "scripts")

# Create the main directory if it doesn’t exist
mkdir -p "$BASE_DIR"

# Create subdirectories
for DIR in "${SUB_DIRS[@]}"; do
    mkdir -p "$BASE_DIR/$DIR"
done

# Create README.md
README_FILE="$BASE_DIR/README.md"
cat > "$README_FILE" <<EOL
# Aurora Video Synthesizer

## Project Overview
A web-based AI-powered video synthesizer using Vite, TypeScript, React, Tailwind CSS, and Shadcn UI.

## Setup Instructions
1. Clone the repo
2. Run \`npm install\`
3. Start the dev server with \`npm run dev\`

## Development Tasks
Refer to the \`docs/tasks.md\` for UI improvement tasks.
EOL

# Create a Tasks Documentation File
TASKS_FILE="$BASE_DIR/docs/tasks.md"
cat > "$TASKS_FILE" <<EOL
# UI Improvement Tasks for Aurora Video Synthesizer

### 1. Video Generation Form Improvement
**Prompt:**  
Refine the form with logical sections, real-time validation, and tooltips.

### 2. Video Preview & Player Enhancement
**Prompt:**  
Implement a custom video player with enhanced controls and error handling.

### 3. Video Processing Status Visualization
**Prompt:**  
Show a real-time progress bar with estimated wait times.

### 4. Landing Page Optimization
**Prompt:**  
Redesign the landing page with a hero section, CTA, and feature highlights.

### 5. Mobile Responsiveness
**Prompt:**  
Ensure all UI elements adapt to small screens.

### 6. Performance Optimization
**Prompt:**  
Use lazy loading, dynamic imports, and asset compression.

### 7. Error Handling & User Feedback
**Prompt:**  
Enhance form errors, toast notifications, and error boundaries.

### 8. Documentation & Metadata Setup
**Prompt:**  
Expand README, add LICENSE, setup meta tags for SEO.
EOL

# Create default config file
CONFIG_FILE="$BASE_DIR/config/settings.json"
cat > "$CONFIG_FILE" <<EOL
{
    "useCustomPrompts": true,
    "defaultPromptFile": "prompts/default-prompts.json",
    "componentFolder": "src/components"
}
EOL

# Create a sample React component
COMPONENT_FILE="$BASE_DIR/src/components/SampleComponent.tsx"
cat > "$COMPONENT_FILE" <<EOL
import React from "react";

const SampleComponent = () => {
    return (
        <div className="p-4 bg-gray-100 border rounded-md">
            <h2 className="text-xl font-bold">Hello from SampleComponent!</h2>
        </div>
    );
};

export default SampleComponent;
EOL

# Create a sample script in scripts/
SCRIPT_FILE="$BASE_DIR/scripts/sample-script.sh"
echo '#!/bin/bash' > "$SCRIPT_FILE"
echo 'echo "This is a test script in the custom scripts folder!"' >> "$SCRIPT_FILE"
chmod +x "$SCRIPT_FILE"

# Create a log file
LOG_FILE="$BASE_DIR/logs/setup-log.txt"
echo "Setup completed on $(date)" > "$LOG_FILE"

# Confirm setup completion
echo "✅ Aurora Video Synthesizer setup complete!"
echo "Your project files are now ready in: $BASE_DIR"
