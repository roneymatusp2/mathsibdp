@echo off
echo ===== Deploying IBMATHS CHOICE to Netlify =====
echo.

cd "%~dp0"

echo Checking for Netlify CLI...
where netlify >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Netlify CLI not found. Installing...
  npm install -g netlify-cli
  if %ERRORLEVEL% NEQ 0 (
    echo Failed to install Netlify CLI.
    exit /b 1
  )
)

echo.
echo Installing required dependencies...
npm install --save-dev terser

echo.
echo Building the project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Build failed. Please check the error message above.
  
  echo.
  echo Attempting to fix common issues...
  
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
echo Build successful! Deploying to Netlify...
netlify deploy --prod --dir=dist
if %ERRORLEVEL% NEQ 0 (
  echo Deployment failed. Please check the error message above.
  pause
  exit /b 1
)

echo.
echo ===== Deployment completed! =====
echo Your site should now be live on Netlify.
pause
