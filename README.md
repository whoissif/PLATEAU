# Análisis Avanzado de Zona de Plateau



Aplicación web para el análisis estadístico avanzado de curvas características de detectores de radiación (tubos Geiger-Müller), con identificación automática de la zona de plateau óptima y cálculo de parámetros operativos.

## Características Principales

- **Múltiples modos de entrada de datos**:
  - Entrada manual en tabla interactiva
  - Carga de archivos CSV/TXT
  - Conjuntos de datos de ejemplo predefinidos
  
- **Algoritmos de análisis avanzado**:
  - Ajuste lineal ponderado con mínimos cuadrados
  - Ajuste cuadrático para detectar curvaturas sutiles
  - Cálculo de χ² reducido para evaluar calidad del ajuste
  - Búsqueda automática de la mejor zona de plateau según parámetros configurables
  
- **Visualización interactiva**:
  - Gráficos dinámicos con Chart.js
  - Identificación visual de la zona de plateau
  - Superposición de la curva de ajuste
  
- **Resultados detallados**:
  - Cálculo de la pendiente en %/V
  - Tensión de trabajo recomendada
  - Variación absoluta y relativa en la zona de plateau
  - Evaluación de calidad del ajuste
  
- **Exportación y utilidades**:
  - Descarga de resultados en formato texto
  - Exportación de gráficos como imágenes
  - Copiado de resultados al portapapeles
  - Impresión de informes formateados
  - Generación de datos aleatorios para pruebas

## Tecnologías Utilizadas

- HTML5, CSS3 y JavaScript puro
- Chart.js para visualizaciones interactivas
- Algoritmos estadísticos implementados manualmente
- Interfaz responsiva para uso en diferentes dispositivos

## Modo de Uso

1. Ingrese los datos experimentales mediante:
   - Rellene la tabla manualmente
   - Cargue un archivo CSV/TXT con sus mediciones
   - Utilice uno de los conjuntos de datos de ejemplo
   
2. Configure los parámetros de análisis según sus necesidades:
   - Seleccione tipo de ajuste (lineal o cuadrático)
   - Especifique el rango mínimo de voltaje para la zona de plateau
   - Ajuste el número mínimo de puntos a considerar
   
3. Haga clic en "Procesar Datos y Encontrar Plateau"
   
4. Revise los resultados y gráficos generados
   - Analice los parámetros estadísticos obtenidos
   - Exporte los resultados si es necesario

## Instalación

Simplemente descargue el archivo HTML y ábralo en cualquier navegador web moderno. No requiere instalación de dependencias adicionales ni conexión a internet para funcionar (excepto para la carga inicial de Chart.js).

## Contribución

Las contribuciones son bienvenidas. Por favor abra un issue para discutir cambios importantes antes de enviar un pull request.

## Licencia


---

Esta aplicación es especialmente útil para laboratorios de física nuclear, técnicos en radioprotección y estudiantes que necesitan caracterizar detectores de radiación y determinar sus parámetros operativos óptimos de manera precisa y reproducible.
