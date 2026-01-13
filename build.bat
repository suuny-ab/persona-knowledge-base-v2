@echo off
echo Building renderer...
call npx webpack --config webpack.config.js --mode production
echo Build complete!
pause
