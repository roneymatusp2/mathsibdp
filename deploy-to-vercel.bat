@echo off
echo ===== Deploying IBMATHS CHOICE to Vercel =====
echo.

cd "%~dp0"

echo Checking for Vercel CLI...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Vercel CLI not found. Installing...
  npm install -g vercel
  if %ERRORLEVEL% NEQ 0 (
    echo Failed to install Vercel CLI.
    exit /b 1
  )
)

echo.
echo Deploying to Vercel...
vercel --prod
if %ERRORLEVEL% NEQ 0 (
  echo Deployment failed. Please check the error message.
  exit /b 1
)

echo.
echo ===== Deployment completed! =====
echo Your site should now be live on Vercel.
pause
