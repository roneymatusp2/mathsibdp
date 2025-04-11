#!/bin/bash

echo "===== Preparing GitHub Deployment ====="
echo

# Ensure we're in the script's directory
cd "$(dirname "$0")"

echo "Initializing Git repository..."
git init

echo
echo "Configuring .gitignore..."
cat > .gitignore << EOF
node_modules/
.env
.DS_Store
dist/
.idea/
*.log
EOF

echo
echo "Adding all files..."
git add .

echo
echo "Making initial commit..."
git commit -m "Initial version of IBMATHS CHOICE multi-school system"

echo
echo "Configuring remote repository..."
git remote add origin https://github.com/roneymatusp2/mathsibdp.git

echo
echo "Forcing push to GitHub (overwrite existing content)..."
git push -f origin master:main

echo
echo "===== Deployment completed! ====="
echo "Visit: https://github.com/roneymatusp2/mathsibdp"
