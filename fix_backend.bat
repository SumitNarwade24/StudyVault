@echo off
echo [StudyVault] Troubleshooting Backend Dependencies...
cd backend

echo [1/3] Checking Java version...
java -version

echo [2/3] Attempting to clean and compile...
echo This requires Maven (mvn) to be in your PATH. 
echo If you don't have Maven, please download it from https://maven.apache.org/download.cgi
mvn clean compile

echo [3/3] If the above failed, try the following in your IDE:
echo - IntelliJ: Right-click pom.xml -> Maven -> Reload Project
echo - VS Code: Command Palette -> Java: Clean Language Server Workspace -> Restart
echo - Ensure "Annotation Processing" is ENABLED in IDE settings.

pause
