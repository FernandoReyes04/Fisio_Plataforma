#!/bin/bash
# Script para ejecutar tests E2E - Fisioterapia

echo "======================================"
echo "  TESTS E2E - FISIOLABS FISIOTERAPIA"
echo "======================================"
echo ""

# Verificar si el backend está disponible
echo "🔍 Verificando backend en Puerto 5223..."
if curl -s http://localhost:5223 > /dev/null 2>&1; then
    echo "✅ Backend disponible"
else
    echo ""
    echo "⚠️  Backend NO disponible en http://localhost:5223"
    echo ""
    echo "Pasos para ejecutar los tests:"
    echo "1️⃣  Abre una terminal y navega a: cd /path/to/FisioterapiaBack/Presentation"
    echo "2️⃣  Inicia el backend: dotnet run"
    echo "3️⃣  Espera a que esté listo (verás 'Application started')"
    echo ""
    echo "Luego en otra terminal, aquí:"
    echo "4️⃣  Ejecuta: npm run test:e2e"
    echo ""
    exit 1
fi

echo ""
echo "📝 Credenciales configuradas en: e2e/fixtures.js"
echo "   Verifica que sean correctas antes de ejecutar"
echo ""

echo "🚀 Iniciando tests E2E..."
echo ""

# Ejecutar tests
npx playwright test

echo ""
echo "======================================"
echo "  Tests completados"
echo "======================================"
echo ""
echo "📊 Para ver el reporte: npx playwright show-report"
