#!/bin/bash
# Script para atualizar o APK rapidamente

set -e

# Build web
npm run build

# Sincroniza assets com Android
npx cap sync android

# Build APK debug
cd android
./gradlew assembleDebug

# Volta para a raiz
cd ..

echo "APK atualizado em android/app/build/outputs/apk/debug/app-debug.apk"
