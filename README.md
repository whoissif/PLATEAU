# 📊 PlateauLab - Análisis de Zona de Plateau para Detectores de Radiación



**PlateauLab** es una aplicación web avanzada para el análisis de la zona de plateau en detectores de radiación. Esta herramienta permite identificar automáticamente el rango óptimo de voltaje de operación para detectores Geiger-Müller y otros detectores de radiación, maximizando la eficiencia y minimizando el ruido.

## ✨ Características Principales

### 🔍 Identificación Inteligente de Zona de Plateau
- Detección automática del mejor segmento de voltaje que forma una zona de plateau
- Algoritmo estadístico avanzado basado en χ² reducido
- Opciones de ajuste lineal y cuadrático para diferentes tipos de detectores
- Evaluación cuantitativa de la calidad del ajuste

### 📈 Análisis Estadístico Completo
- Cálculo de variación relativa y absoluta en la zona identificada
- Determinación de la tensión de trabajo recomendada
- Evaluación de la pendiente en %/V para caracterizar la estabilidad
- Intervalo de confianza basado en errores estadísticos (±√cuentas)

### 🖥️ Interfaz de Usuario Intuitiva
- Múltiples métodos de entrada de datos (manual, archivo, ejemplos predefinidos)
- Visualización interactiva con gráficos animados
- Sistema de notificaciones en tiempo real
- Panel de depuración avanzado para análisis detallado

### 💾 Gestión de Datos
- Importación desde archivos .txt y .csv
- Generación de datos aleatorios para pruebas
- Tres conjuntos de datos de ejemplo incluidos:
  * Contador G-M típico con plateau claro
  * Datos con alto nivel de ruido
  * Caso sin plateau definido
- Exportación completa de resultados en múltiples formatos

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript puro
- **Gráficos**: Chart.js con plugins de anotación
- **Diseño**: CSS Grid, Flexbox, variables CSS y animaciones
- **Iconos**: Font Awesome 6
- **Arquitectura**: Aplicación de página única (SPA) sin frameworks

## 🚀 Cómo Usar

### 1. Métodos de entrada de datos:
- **Entrada manual**: Complete la tabla con los valores de voltaje y cuentas
- **Carga de archivos**: Importe datos desde archivos .txt o .csv
- **Datos de ejemplo**: Seleccione entre tres conjuntos predefinidos para probar la aplicación

### 2. Configuración del análisis:
- Seleccione el tipo de ajuste (lineal o cuadrático)
- Ajuste los parámetros avanzados según sus necesidades:
  * Rango mínimo de voltaje (V)
  * Número mínimo de puntos en el segmento
  * Nivel de optimización (velocidad vs exhaustividad)

### 3. Ejecución y visualización:
- Pulse "Procesar Datos y Encontrar Plateau"
- Revise los resultados en el panel de resultados
- Visualice el gráfico interactivo con la zona de plateau resaltada
- Exporte los resultados o descargue el gráfico para informes

## 📸 Ejemplo de Resultados

La aplicación proporciona resultados detallados incluyendo:

```
Zona de Plateau identificada: 400 - 700 V
Intervalo de voltaje: 300.0 V
Número de puntos: 13
χ² reducido (ajuste lineal): 0.2451
Calidad del ajuste: Excelente - Los datos se ajustan muy bien al modelo
Pendiente: 3.24 cuentas/V (0.0065 %/V)
Tasa de conteo promedio: 50243.62 cuentas
Variación absoluta: 362.00 cuentas
Variación relativa: 0.72 %
Tensión de trabajo recomendada: 550.0 V
```


## ⚙️ Instalación y Ejecución

1. **Clona el repositorio:**
```bash
git clone https://github.com/tu-usuario/PlateauLab.git
cd PlateauLab
```

2. **Abre la aplicación:**
   - Simplemente abre el archivo `index.html` en cualquier navegador web moderno
   - No requiere servidor local ni dependencias adicionales
   - Funciona completamente offline una vez descargado

3. **Para desarrollo:**
   - Edita los archivos `index.html`, `styles.css` y `script.js` según tus necesidades
   - La estructura de código está modularizada para facilitar modificaciones

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor abre un issue o pull request para:
- Mejorar los algoritmos de detección de plateau
- Añadir nuevos tipos de ajustes o modelos estadísticos
- Mejorar la interfaz de usuario y experiencia de usuario
- Corregir errores o mejorar el rendimiento
- Añadir nuevos conjuntos de datos de ejemplo

## 📜 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

Esta herramienta fue desarrollada para facilitar el trabajo en laboratorios de física nuclear y formación de estudiantes. Agradecemos a la comunidad educativa por su apoyo y contribuciones.

---

**PlateauLab** - Simplificando el análisis de detectores de radiación con precisión y profesionalismo. 🌟
