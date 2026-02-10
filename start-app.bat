@echo off
setlocal
pushd %~dp0

if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

if not exist packages\cml\dist (
  echo Building CML package...
  call npm run -w @cml/cml build
)

if not exist packages\llm-client\dist (
  echo Building LLM Client package...
  call npm run -w @cml/llm-client build
)

if not exist packages\prompts-llm\dist (
  echo Building Prompts-LLM package...
  call npm run -w @cml/prompts-llm build
)

if not exist apps\worker\dist (
  echo Building worker...
  call npm run -w @cml/worker build
)

if not exist apps\api\dist (
  echo Building API...
  call npm run -w @cml/api build
)

start "CML API" cmd /k "npm run -w @cml/api dev"
start "CML Worker" cmd /k "npm run -w @cml/worker dev"
start "CML Web" cmd /k "npm run -w @cml/web dev"

popd
endlocal
