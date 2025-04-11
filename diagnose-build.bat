@echo off
echo ===== Diagnosing Build Process =====
echo.

cd "%~dp0"

echo Step 1: Checking Node and NPM versions...
node -v
npm -v

echo.
echo Step 2: Checking if terser is installed...
npm list terser --depth=0
echo.

echo Step 3: Attempting to run prebuild script...
echo.
call npm run prebuild
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Prebuild script failed with exit code %ERRORLEVEL%
  goto :error
)

echo.
echo Step 4: Checking Vite configuration...
echo Current vite.config.ts content:
type vite.config.ts
echo.

echo Step 5: Running Vite build with verbose logging...
echo.
set DEBUG=vite:*
call npm run build -- --debug
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Build failed with exit code %ERRORLEVEL%
  goto :error
)

echo.
echo ===== Diagnosis Complete - Build Successful =====
goto :end

:error
echo.
echo ===== Diagnosis Failed - See Errors Above =====
echo.
echo Possible solutions:
echo 1. Check for missing dependencies
echo 2. Verify vite.config.ts is correct
echo 3. Look for TypeScript or JavaScript syntax errors
echo 4. Confirm all imports/exports match between files

:end
pause
