@echo off
echo ===== Preparing GitHub Deployment =====
echo.

cd "%~dp0"

echo Installing required dependencies...
npm install --save-dev terser

echo.
echo Building project to verify it compiles...
call npm run build

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Build failed! Attempting to fix common issues...
  
  echo Installing Terser (often required for minification)...
  npm install --save-dev terser
  
  echo Retrying build with Terser installed...
  call npm run build
  
  if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Build still failing. Please fix the errors manually.
    pause
    exit /b 1
  )
)

echo.
echo Build successful! Continuing with deployment...
echo.

echo Initializing Git repository...
git init

echo.
echo Configuring .gitignore...
echo node_modules/ > .gitignore
echo .env >> .gitignore
echo .DS_Store >> .gitignore
echo dist/ >> .gitignore
echo .idea/ >> .gitignore
echo *.log >> .gitignore

echo.
echo Adding all files...
git add .

echo.
echo Making initial commit...
git commit -m "Initial version of IBMATHS CHOICE multi-school system"

echo.
echo Configuring remote repository...
git remote add origin https://github.com/roneymatusp2/mathsibdp.git

echo.
echo Forcing push to GitHub (overwrite existing content)...
git push -f origin master:main

echo.
echo ===== Deployment completed! =====
echo Visit: https://github.com/roneymatusp2/mathsibdp
pause
