@echo off
setlocal
pushd %~dp0

if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

echo Building CML package...
call npm run -w @cml/cml build

echo Building LLM Client package...
call npm run -w @cml/llm-client build

echo Building Prompts-LLM package...
call npm run -w @cml/prompts-llm build

echo Building worker...
call npm run -w @cml/worker build

echo Building API...
call npm run -w @cml/api build

start "CML API" cmd /k "npm run -w @cml/api dev"
start "CML Worker" cmd /k "npm run -w @cml/worker dev"
start "CML Web" cmd /k "npm run -w @cml/web dev"

popd
endlocal
