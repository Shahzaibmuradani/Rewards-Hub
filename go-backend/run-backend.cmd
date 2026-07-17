@echo off
setlocal

set "REPO_ROOT=%~dp0"
set "GO_EXE="

if exist "%GOROOT%\bin\go.exe" set "GO_EXE=%GOROOT%\bin\go.exe"
if not defined GO_EXE if exist "C:\Program Files\Go\bin\go.exe" set "GO_EXE=C:\Program Files\Go\bin\go.exe"
if not defined GO_EXE if exist "C:\Go\bin\go.exe" set "GO_EXE=C:\Go\bin\go.exe"

if not defined GO_EXE (
  echo Could not find go.exe. Install Go or add it to PATH.
  exit /b 1
)

echo Using Go from: %GO_EXE%
pushd "%REPO_ROOT%"
"%GO_EXE%" run .\cmd\main.go
set "EXIT_CODE=%ERRORLEVEL%"
popd
exit /b %EXIT_CODE%
