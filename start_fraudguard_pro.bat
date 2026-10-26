@echo off
echo.
echo ========================================
echo    FraudGuard Pro
echo    Advanced Security Analytics
echo ========================================
echo.
echo Starting FraudGuard Pro...
echo.
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo Starting the application...
echo.
echo Open your browser and go to: http://localhost:5003
echo.
echo Press Ctrl+C to stop the server
echo.
python fraudguard_pro.py
pause
