@echo on
echo ===== Building IBMATHS CHOICE Project (Simple) =====
echo.

cd "%~dp0"

echo Installing terser explicitly...
call npm install --save-dev terser
echo.

echo Running pre-build script...
call node scripts/remove-bom.js
echo.

echo Building project with vite...
call npx vite build
echo.

if %ERRORLEVEL% NEQ 0 (
  echo Build failed with exit code %ERRORLEVEL%
) else (
  echo Build completed successfully!
)

pause
