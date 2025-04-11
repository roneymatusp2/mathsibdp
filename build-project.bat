@echo off
echo ===== Building IBMATHS CHOICE Project =====
echo.

cd "%~dp0"

echo Checking for required dependencies...
echo.

echo Checking for terser...
npm list terser --depth=0 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Terser not found, installing...
  npm install --save-dev terser
)

echo.
echo Building project...
call npm run build

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Build failed! Attempting to fix common issues...
  
  echo 1. Updating browserslist database...
  npx update-browserslist-db@latest
  
  echo 2. Fixing potential JavaScript/TypeScript module issues...
  
  echo Retrying build...
  call npm run build
  
  if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Build still failing. Please check the error messages above.
    echo Common issues to look for:
    echo - Missing dependencies
    echo - TypeScript errors
    echo - Import/export issues
    echo - Environment variable configuration
    pause
    exit /b 1
  )
)

echo.
echo ===== Build Successful! =====
echo The build files are located in the 'dist' directory and ready for deployment.
echo.
pause
