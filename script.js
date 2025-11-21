let chart = null;
let chartType = 'scatter';
let fitType = 'linear'; // 'linear' or 'quadratic'
let debugMode = false;
let lastAnalysisResults = null;

// Datos de ejemplo
const exampleData = {
    'gm-tube': [
        {v: 250, c: 1}, {v: 275, c: 1}, {v: 300, c: 2}, {v: 325, c: 5},
        {v: 350, c: 45335}, {v: 375, c: 48164}, {v: 400, c: 49503}, {v: 425, c: 49929},
        {v: 450, c: 50198}, {v: 475, c: 50913}, {v: 500, c: 50722}, {v: 525, c: 51250},
        {v: 550, c: 51543}, {v: 575, c: 52111}, {v: 600, c: 52164}, {v: 625, c: 52157},
        {v: 650, c: 52930}, {v: 675, c: 53165}, {v: 700, c: 53251}, {v: 725, c: 53701},
        {v: 750, c: 54252}, {v: 775, c: 55460}, {v: 800, c: 56090}, {v: 825, c: 56532},
        {v: 850, c: 58290}, {v: 875, c: 59151}, {v: 900, c: 60000}
    ],
    'noisy-data': [
        {v: 250, c: 1}, {v: 275, c: 1}, {v: 300, c: 2}, {v: 325, c: 3},
        {v: 350, c: 42500}, {v: 375, c: 46800}, {v: 400, c: 44200}, {v: 425, c: 48500},
        {v: 450, c: 49200}, {v: 475, c: 51500}, {v: 500, c: 48900}, {v: 525, c: 52300},
        {v: 550, c: 50800}, {v: 575, c: 53100}, {v: 600, c: 51800}, {v: 625, c: 54200},
        {v: 650, c: 53500}, {v: 675, c: 54800}, {v: 700, c: 56100}, {v: 725, c: 57300},
        {v: 750, c: 54900}, {v: 775, c: 58200}, {v: 800, c: 56800}, {v: 825, c: 59100},
        {v: 850, c: 60500}, {v: 875, c: 61200}, {v: 900, c: 62800}
    ],
    'no-plateau': [
        {v: 250, c: 1000}, {v: 275, c: 1200}, {v: 300, c: 1500}, {v: 325, c: 2000},
        {v: 350, c: 2800}, {v: 375, c: 3500}, {v: 400, c: 4300}, {v: 425, c: 5200},
        {v: 450, c: 6200}, {v: 475, c: 7300}, {v: 500, c: 8500}, {v: 525, c: 9800},
        {v: 550, c: 11200}, {v: 575, c: 12700}, {v: 600, c: 14300}, {v: 625, c: 16000},
        {v: 650, c: 17800}, {v: 675, c: 19700}, {v: 700, c: 21700}, {v: 725, c: 23800},
        {v: 750, c: 26000}, {v: 775, c: 28300}, {v: 800, c: 30700}, {v: 825, c: 33200},
        {v: 850, c: 35800}, {v: 875, c: 38500}, {v: 900, c: 41300}
    ]
};

// ================================
// UTILIDADES DE DEPURACIÓN
// ================================
function logDebug(message) {
    if (!debugMode) return;
    const debugPanel = document.getElementById('debugPanel');
    const debugLog = document.getElementById('debugLog');
    debugPanel.style.display = 'block';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logEntry = `[${timestamp}] ${message}\n`;
    debugLog.textContent += logEntry;
    debugLog.scrollTop = debugLog.scrollHeight;
}

function clearDebugLog() {
    document.getElementById('debugLog').textContent = '';
    showMessage("✅ Logs de depuración limpiados", "success");
}

function toggleDebugMode() {
    debugMode = document.getElementById('debugMode').checked;
    if (!debugMode) {
        document.getElementById('debugPanel').style.display = 'none';
    }
    logDebug(`Modo depuración ${debugMode ? 'activado' : 'desactivado'}`);
}

// ================================
// MANEJO DE INTERFAZ Y PESTAÑAS
// ================================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        // Hide all tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        // Show the corresponding tab pane
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

function switchInputMethod(method) {
    // This function can be expanded to handle different input methods if needed
    showMessage(`✅ Modo de entrada cambiado a: ${method === 'manual' ? 'Entrada Manual' : 'Otro método'}`, "success");
}

// ================================
// GENERACIÓN Y MANIPULACIÓN DE DATOS
// ================================
function generateTable() {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';
    for (let v = 250; v <= 900; v += 25) {
        const row = document.createElement('tr');
        const voltageCell = document.createElement('td');
        voltageCell.textContent = v;
        voltageCell.style.fontWeight = 'bold';
        
        const countCell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.step = '1';
        input.placeholder = '0';
        input.className = 'form-control';
        input.dataset.voltage = v;
        input.dataset.index = (v - 250) / 25;
        
        countCell.appendChild(input);
        row.appendChild(voltageCell);
        row.appendChild(countCell);
        tbody.appendChild(row);
    }
}

function clearTable() {
    if (confirm("⚠️ ¿Está seguro de que quiere limpiar toda la tabla? Se perderán todos los datos introducidos.")) {
        document.querySelectorAll('#dataTableBody input[type="number"]').forEach(input => {
            input.value = '';
        });
        
        if (chart) {
            chart.destroy();
            chart = null;
        }
        
        document.getElementById('results').innerHTML = '<p>Ingrese datos y haga clic en "Procesar Datos" para ver los resultados.</p>';
        document.getElementById('resultsPlaceholder').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        
        showMessage("✅ Tabla limpiada correctamente", "success");
    }
}

function generateRandomData() {
    clearTable();
    const inputs = document.querySelectorAll('#dataTableBody input[type="number"]');
    
    // Generar datos aleatorios con una zona de plateau aproximada
    for (let i = 0; i < inputs.length; i++) {
        const v = 250 + i * 25;
        let count;
        if (v < 350) {
            // Ruido inicial
            count = Math.floor(Math.random() * 10);
        } else if (v >= 350 && v <= 750) {
            // Zona de plateau con algo de ruido
            const base = 50000;
            const noise = Math.floor((Math.random() - 0.5) * 3000);
            count = base + noise;
        } else {
            // Región final con aumento
            const base = 50000 + (v - 750) * 50;
            const noise = Math.floor((Math.random() - 0.5) * 3000);
            count = base + noise;
        }
        inputs[i].value = count;
    }
    
    showMessage("✅ Datos aleatorios generados. Haga clic en \"Procesar Datos\" para analizar.", "success");
}

function loadExample(exampleType) {
    clearTable();
    const inputs = document.querySelectorAll('#dataTableBody input[type="number"]');
    const data = exampleData[exampleType];
    
    if (!data) {
        showMessage("Error: Tipo de ejemplo no válido.", "error");
        return;
    }
    
    data.forEach(item => {
        const input = Array.from(inputs).find(inp => 
            parseFloat(inp.dataset.voltage) === item.v
        );
        if (input) {
            input.value = item.c;
        }
    });
    
    let exampleName = '';
    if (exampleType === 'gm-tube') exampleName = 'Contador G-M típico';
    else if (exampleType === 'noisy-data') exampleName = 'Datos con ruido alto';
    else if (exampleType === 'no-plateau') exampleName = 'Sin zona de plateau clara';
    
    showMessage(`✅ Datos de ejemplo "${exampleName}" cargados. Haga clic en "Procesar Datos" para analizar.`, "success");
    
    // Cambiar a la pestaña de resultados
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="input"]').classList.add('active');
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById('input-tab').classList.add('active');
}

// ================================
// CARGA Y PROCESAMIENTO DE ARCHIVOS
// ================================
function downloadExampleFile() {
    const exampleData = `250,1
275,1
300,1
325,1
350,45335
375,48164
400,49503
425,49929
450,50198
475,50913
500,50722
525,51250
550,51543
575,52111
600,52164
625,52157
650,52930
675,53165
700,53251
725,53701
750,54252
775,55460
800,56090
825,56532
850,58290
875,59151
900,60000`;
    const blob = new Blob([exampleData], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ejemplo_plateau.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    showMessage("✅ Archivo de ejemplo descargado correctamente", "success");
}

function loadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        showMessage("Por favor seleccione un archivo .txt o .csv", "error");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const fileName = file.name.toLowerCase();
        let loadedData = [];
        
        try {
            if (fileName.endsWith('.csv')) {
                loadedData = parseCSV(content);
            } else if (fileName.endsWith('.txt')) {
                loadedData = parseTXT(content);
            } else {
                throw new Error('Formato de archivo no soportado. Use .txt o .csv');
            }
            
            if (loadedData.length === 0) {
                throw new Error('No se encontraron datos válidos en el archivo.');
            }
            
            populateTable(loadedData);
            showMessage(`✅ Se cargaron ${loadedData.length} valores correctamente.`, "success");
        } catch (error) {
            showMessage(`Error al procesar el archivo: ${error.message}`, "error");
            console.error("Error detallado:", error);
        }
    };
    
    reader.onerror = function(e) {
        console.error("Error de lectura de archivo:", e);
        showMessage('Error al leer el archivo: ' + (e.message || 'Error desconocido'), "error");
    };
    
    reader.readAsText(file);
}

function parseCSV(content) {
    const lines = content.split('\n');
    const data = [];
    let hasHeader = false;
    
    // Verificar si la primera línea podría ser un encabezado
    if (lines[0].toLowerCase().includes('volt') || lines[0].toLowerCase().includes('cuent')) {
        hasHeader = true;
    }
    
    for (let i = hasHeader ? 1 : 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Dividir por coma, punto y coma o tabulación
        const separators = [',', ';', '\t'];
        let values = [];
        for (const sep of separators) {
            if (line.includes(sep)) {
                values = line.split(sep).map(v => v.trim());
                break;
            }
        }
        
        // Si no se encontró separador, intentar con espacios
        if (values.length < 2) {
            values = line.split(/\s+/).filter(v => v !== '');
        }
        
        if (values.length >= 2) {
            const voltage = parseFloat(values[0].replace(/[^\d.-]/g, ''));
            let count = parseFloat(values[1].replace(/[^\d.-]/g, ''));
            
            if (!isNaN(voltage) && !isNaN(count) && count >= 0) {
                // Normalizar al voltaje más cercano en los pasos de 25V
                const normalizedVoltage = Math.round(voltage / 25) * 25;
                if (normalizedVoltage >= 250 && normalizedVoltage <= 900) {
                    data.push({ voltage: normalizedVoltage, count: Math.round(count) });
                }
            }
        }
    }
    
    return data;
}

function parseTXT(content) {
    const lines = content.split('\n');
    const data = [];
    let countIndex = 0;
    
    for (const line of lines) {
        const cleanLine = line.trim().replace(/[^\d.-]/g, '');
        if (!cleanLine) continue;
        
        const count = parseFloat(cleanLine);
        if (!isNaN(count) && count >= 0) {
            const voltage = 250 + countIndex * 25;
            if (voltage <= 900) {
                data.push({ voltage: voltage, count: Math.round(count) });
                countIndex++;
            }
        }
    }
    
    return data;
}

function populateTable(data) {
    const inputs = document.querySelectorAll('#dataTableBody input[type="number"]');
    
    // Limpiar tabla
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Llenar con los datos cargados
    data.forEach(item => {
        const input = Array.from(inputs).find(inp => 
            parseFloat(inp.dataset.voltage) === item.voltage
        );
        if (input) {
            input.value = item.count;
        }
    });
}

// ================================
// ANÁLISIS ESTADÍSTICO AVANZADO
// ================================
// Ajuste lineal ponderado (mejorado con manejo de errores)
function weightedLinearFit(x, y) {
    logDebug(`Iniciando ajuste lineal con ${x.length} puntos`);
    const n = x.length;
    if (n < 2) {
        logDebug('Error: Se necesitan al menos 2 puntos para el ajuste lineal');
        return null;
    }
    
    // Calcular errores y pesos
    const yerr = y.map(val => Math.sqrt(Math.max(val, 1)));
    const weights = yerr.map(e => 1 / (e * e));
    
    // Sumas necesarias para el ajuste lineal ponderado
    let S = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
    for (let i = 0; i < n; i++) {
        S += weights[i];
        Sx += weights[i] * x[i];
        Sy += weights[i] * y[i];
        Sxx += weights[i] * x[i] * x[i];
        Sxy += weights[i] * x[i] * y[i];
    }
    
    const delta = S * Sxx - Sx * Sx;
    if (Math.abs(delta) < 1e-12) {
        logDebug(`Error: Sistema singular o mal condicionado (delta = ${delta})`);
        return null; // Evitar división por cero
    }
    
    const a = (Sxx * Sy - Sx * Sxy) / delta; // intercepto
    const b = (S * Sxy - Sx * Sy) / delta;   // pendiente
    
    // Calcular chi2
    let chi2 = 0;
    for (let i = 0; i < n; i++) {
        const yPred = b * x[i] + a;
        const residual = y[i] - yPred;
        chi2 += (residual * residual) / (yerr[i] * yerr[i]);
    }
    
    const chi2Reducido = n > 2 ? chi2 / (n - 2) : 0;
    logDebug(`Ajuste lineal completado: intercepto = ${a.toFixed(2)}, pendiente = ${b.toFixed(4)}, χ² reducido = ${chi2Reducido.toFixed(4)}`);
    
    return { intercept: a, slope: b, chi2: chi2, chi2Reducido: chi2Reducido, n: n };
}

// Nuevo: Ajuste cuadrático ponderado
function weightedQuadraticFit(x, y) {
    logDebug(`Iniciando ajuste cuadrático con ${x.length} puntos`);
    const n = x.length;
    if (n < 3) { // Necesitamos al menos 3 puntos para ajustar 3 parámetros
        logDebug('Error: Se necesitan al menos 3 puntos para el ajuste cuadrático');
        return null;
    }
    
    // Calcular errores y pesos
    const yerr = y.map(val => Math.sqrt(Math.max(val, 1)));
    const weights = yerr.map(e => 1 / (e * e));
    
    // Matrices para el sistema de ecuaciones
    let S = 0, Sx = 0, Sx2 = 0, Sx3 = 0, Sx4 = 0;
    let Sy = 0, Sxy = 0, Sx2y = 0;
    
    for (let i = 0; i < n; i++) {
        const w = weights[i];
        const xi = x[i];
        const yi = y[i];
        const xi2 = xi * xi;
        const xi3 = xi2 * xi;
        const xi4 = xi3 * xi;
        
        S += w;
        Sx += w * xi;
        Sx2 += w * xi2;
        Sx3 += w * xi3;
        Sx4 += w * xi4;
        Sy += w * yi;
        Sxy += w * xi * yi;
        Sx2y += w * xi2 * yi;
    }
    
    // Resolver el sistema de ecuaciones para el ajuste cuadrático
    // [ S    Sx   Sx2 ] [c]   [Sy  ]
    // [ Sx   Sx2  Sx3 ] [b] = [Sxy ]
    // [ Sx2  Sx3  Sx4 ] [a]   [Sx2y]
    // Usar regla de Cramer para resolver el sistema 3x3
    const det = S*(Sx2*Sx4 - Sx3*Sx3) - Sx*(Sx*Sx4 - Sx2*Sx3) + Sx2*(Sx*Sx3 - Sx2*Sx2);
    
    if (Math.abs(det) < 1e-12) {
        logDebug(`Error: Sistema singular para ajuste cuadrático (determinante = ${det})`);
        return null;
    }
    
    const detC = Sy*(Sx2*Sx4 - Sx3*Sx3) - Sx*(Sxy*Sx4 - Sx2*Sx2y) + Sx2*(Sxy*Sx3 - Sx2*Sx2y);
    const detB = S*(Sxy*Sx4 - Sx2*Sx2y) - Sx*(Sy*Sx4 - Sx2*Sx2y) + Sx2*(Sy*Sx3 - Sxy*Sx2);
    const detA = S*(Sx2*Sx2y - Sx3*Sxy) - Sx*(Sx*Sx2y - Sx3*Sy) + Sx2*(Sx*Sxy - Sx2*Sy);
    
    const c = detC / det; // término constante
    const b = detB / det; // término lineal
    const a = detA / det; // término cuadrático
    
    // Calcular chi2
    let chi2 = 0;
    for (let i = 0; i < n; i++) {
        const yPred = a * x[i] * x[i] + b * x[i] + c;
        const residual = y[i] - yPred;
        chi2 += (residual * residual) / (yerr[i] * yerr[i]);
    }
    
    const chi2Reducido = n > 3 ? chi2 / (n - 3) : 0;
    logDebug(`Ajuste cuadrático completado: a = ${a.toFixed(6)}, b = ${b.toFixed(4)}, c = ${c.toFixed(2)}, χ² reducido = ${chi2Reducido.toFixed(4)}`);
    
    return { a: a, b: b, c: c, chi2: chi2, chi2Reducido: chi2Reducido, n: n };
}

function findBestPlateauRegion(voltage, counts, minVoltageSpan = 200, minPoints = 9) {
    logDebug(`Buscando mejor región de plateau: span mínimo = ${minVoltageSpan}V, puntos mínimos = ${minPoints}`);
    const n = voltage.length;
    const minPointsCalculated = Math.max(minPoints, Math.floor(minVoltageSpan / 25) + 1);
    logDebug(`Puntos mínimos calculados: ${minPointsCalculated}`);
    
    if (n < minPointsCalculated) {
        logDebug(`Error: Se necesitan al menos ${minPointsCalculated} puntos, pero solo hay ${n}`);
        return null;
    }
    
    // Obtener nivel de optimización
    const optimizationLevel = parseInt(document.getElementById('optimizationLevel').value) || 3;
    const stepSize = Math.max(1, Math.floor(optimizationLevel / 3));
    
    let bestChi2Red = Infinity;
    let bestResult = null;
    let totalSegmentsEvaluated = 0;
    let bestSegmentPoints = [];
    
    fitType = document.querySelector('input[name="fitType"]:checked').value;
    logDebug(`Usando tipo de ajuste: ${fitType}`);
    
    // Evaluar todos los segmentos posibles con al menos minPointsCalculated puntos
    for (let i = 0; i <= n - minPointsCalculated; i += stepSize) {
        // Para cada punto inicial, evaluar diferentes longitudes de segmento
        for (let len = minPointsCalculated; i + len <= n; len++) {
            const j = i + len;
            const VSeg = voltage.slice(i, j);
            const CSeg = counts.slice(i, j);
            
            // Verificar span de voltaje
            const voltageSpan = VSeg[VSeg.length - 1] - VSeg[0];
            if (voltageSpan < minVoltageSpan) {
                continue;
            }
            
            totalSegmentsEvaluated++;
            let fitResult;
            
            if (fitType === 'linear') {
                fitResult = weightedLinearFit(VSeg, CSeg);
            } else if (fitType === 'quadratic') {
                fitResult = weightedQuadraticFit(VSeg, CSeg);
            }
            
            if (!fitResult) continue;
            
            if (fitResult.chi2Reducido < bestChi2Red) {
                bestChi2Red = fitResult.chi2Reducido;
                bestSegmentPoints = [i, j];
                bestResult = {
                    startIdx: i,
                    endIdx: j,
                    vStart: VSeg[0],
                    vEnd: VSeg[VSeg.length - 1],
                    vSpan: voltageSpan,
                    fitResult: fitResult,
                    nPoints: VSeg.length,
                    plateauVoltages: VSeg,
                    plateauCounts: CSeg
                };
            }
        }
    }
    
    logDebug(`Segmentos evaluados: ${totalSegmentsEvaluated}`);
    logDebug(`Mejor χ² reducido encontrado: ${bestChi2Red.toFixed(4)}`);
    
    if (!bestResult) {
        logDebug('No se encontró ningún segmento válido');
        return null;
    }
    
    // Calcular la recta/predicción para el mejor segmento
    if (fitType === 'linear') {
        bestResult.slope = bestResult.fitResult.slope;
        bestResult.intercept = bestResult.fitResult.intercept;
        bestResult.lineX = bestResult.plateauVoltages;
        bestResult.lineY = bestResult.lineX.map(x => bestResult.slope * x + bestResult.intercept);
    } else if (fitType === 'quadratic') {
        bestResult.a = bestResult.fitResult.a;
        bestResult.b = bestResult.fitResult.b;
        bestResult.c = bestResult.fitResult.c;
        bestResult.lineX = bestResult.plateauVoltages;
        bestResult.lineY = bestResult.lineX.map(x => bestResult.a * x * x + bestResult.b * x + bestResult.c);
    }
    
    bestResult.chi2Reducido = bestResult.fitResult.chi2Reducido;
    return bestResult;
}

// ================================
// VISUALIZACIÓN Y RESULTADOS
// ================================
function processData() {
    // Limpiar mensajes previos
    document.getElementById('messageContainer').innerHTML = '';
    
    // Actualizar modo de depuración
    toggleDebugMode();
    
    const inputs = document.querySelectorAll('#dataTableBody input[type="number"]');
    const voltages = [];
    const counts = [];
    
    try {
        let validDataCount = 0;
        for (let input of inputs) {
            const v = parseFloat(input.dataset.voltage);
            const c = input.value.trim() !== '' ? parseFloat(input.value) : NaN;
            
            if (!isNaN(c) && c >= 0) {
                voltages.push(v);
                counts.push(c);
                validDataCount++;
            }
        }
        
        logDebug(`Datos válidos encontrados: ${validDataCount}`);
        
        if (validDataCount === 0) {
            throw new Error("No se encontraron datos válidos. Por favor ingrese al menos un valor de conteo.");
        }
        
        if (validDataCount < 3) {
            throw new Error("Se necesitan al menos 3 puntos de datos para realizar el análisis.");
        }
        
        // Obtener parámetros de configuración
        const minVoltageSpan = parseInt(document.getElementById('minVoltageSpan').value) || 200;
        const minPoints = parseInt(document.getElementById('minPoints').value) || 9;
        
        logDebug(`Parámetros del análisis: span mínimo = ${minVoltageSpan}V, puntos mínimos = ${minPoints}`);
        showMessage("🔄 Procesando datos... Por favor espere.", "warning");
        
        // Encontrar la mejor zona de plateau
        setTimeout(() => {
            const result = findBestPlateauRegion(voltages, counts, minVoltageSpan, minPoints);
            
            if (!result) {
                throw new Error(`No se encontró una región de plateau válida con los parámetros actuales. Intente reducir el rango mínimo de voltaje o el número mínimo de puntos.`);
            }
            
            // Calcular estadísticas adicionales
            const avgCount = result.plateauCounts.reduce((a, b) => a + b, 0) / result.plateauCounts.length;
            const minCount = Math.min(...result.plateauCounts);
            const maxCount = Math.max(...result.plateauCounts);
            const absVariation = maxCount - minCount;
            const relVariation = avgCount > 0 ? (absVariation / avgCount) * 100 : 0;
            const tensionTrabajo = (result.vStart + result.vEnd) / 2;
            
            // Calcular pendiente en %/V (solo para ajuste lineal)
            let slopePercPerVolt = 0;
            if (fitType === 'linear') {
                slopePercPerVolt = result.slope * 100 / avgCount;
            }
            
            // Evaluar la calidad del ajuste
            let qualityAssessment = '';
            if (result.chi2Reducido < 0.8) {
                qualityAssessment = 'Excelente - Los datos se ajustan muy bien al modelo';
            } else if (result.chi2Reducido < 1.5) {
                qualityAssessment = 'Bueno - Los datos se ajustan adecuadamente al modelo';
            } else if (result.chi2Reducido < 3) {
                qualityAssessment = 'Aceptable - Hay cierta variación adicional no explicada por los errores estadísticos';
            } else {
                qualityAssessment = 'Pobre - La variación es mucho mayor que la esperada por los errores estadísticos';
            }
            
            // Actualizar tarjetas de resultados
            document.getElementById('plateauRange').textContent = `${result.vStart} - ${result.vEnd}`;
            document.getElementById('chiSquared').textContent = result.chi2Reducido.toFixed(4);
            document.getElementById('relVariation').textContent = relVariation.toFixed(2) + '%';
            document.getElementById('tensionTrabajo').textContent = tensionTrabajo.toFixed(1);
            
            // Generar HTML de resultados
            let resultsHTML = `
                <h3><i class="fas fa-chart-area"></i> Análisis de la Zona de Plateau</h3>
                <div class="card" style="margin-top: 15px; border-left: 4px solid var(--primary);">
                    <h4 style="color: var(--dark); margin-bottom: 10px;"><i class="fas fa-ruler-combined"></i> Parámetros de la Zona Identificada</h4>
                    <p><strong>Zona de Plateau:</strong> ${result.vStart} V – ${result.vEnd} V</p>
                    <p><strong>Intervalo de voltaje:</strong> ${result.vSpan.toFixed(1)} V</p>
                    <p><strong>Número de puntos:</strong> ${result.nPoints}</p>
                    <p><strong>χ² reducido (${fitType === 'linear' ? 'ajuste lineal' : 'ajuste cuadrático'}):</strong> ${result.chi2Reducido.toFixed(4)}</p>
                    <p><strong>Calidad del ajuste:</strong> ${qualityAssessment}</p>
                </div>
            `;
            
            if (fitType === 'linear') {
                resultsHTML += `
                <div class="card" style="margin-top: 15px; border-left: 4px solid #3498db;">
                    <h4 style="color: var(--dark); margin-bottom: 10px;"><i class="fas fa-line-chart"></i> Parámetros del Ajuste Lineal</h4>
                    <p><strong>Pendiente:</strong> ${result.slope.toFixed(2)} cuentas/V (${slopePercPerVolt.toFixed(4)} %/V)</p>
                    <p><strong>Intercepto:</strong> ${result.intercept.toFixed(2)} cuentas</p>
                </div>
                `;
            } else {
                resultsHTML += `
                <div class="card" style="margin-top: 15px; border-left: 4px solid #9b59b6;">
                    <h4 style="color: var(--dark); margin-bottom: 10px;"><i class="fas fa-chart-line"></i> Parámetros del Ajuste Cuadrático</h4>
                    <ul style="margin-left: 20px;">
                        <li><strong>Término cuadrático (a):</strong> ${result.a.toFixed(6)}</li>
                        <li><strong>Término lineal (b):</strong> ${result.b.toFixed(4)}</li>
                        <li><strong>Término constante (c):</strong> ${result.c.toFixed(2)}</li>
                    </ul>
                </div>
                `;
            }
            
            resultsHTML += `
                <div class="card" style="margin-top: 15px; border-left: 4px solid #2ecc71;">
                    <h4 style="color: var(--dark); margin-bottom: 10px;"><i class="fas fa-percent"></i> Estadísticas del Plateau</h4>
                    <p><strong>Tasa de conteo promedio:</strong> ${avgCount.toFixed(2)} cuentas</p>
                    <p><strong>Variación absoluta:</strong> ${absVariation.toFixed(2)} cuentas</p>
                    <p><strong>Variación relativa:</strong> ${relVariation.toFixed(2)} %</p>
                    <p><strong>Tensión de trabajo recomendada:</strong> ${tensionTrabajo.toFixed(1)} V</p>
                </div>
            `;
            
            if (result.vSpan < minVoltageSpan) {
                resultsHTML += `
                <div class="card" style="margin-top: 15px; background-color: #fff8e1; border: 1px solid #ffecb3;">
                    <p style="color: #e65100; margin: 0; padding: 8px;">
                        <i class="fas fa-exclamation-triangle"></i> <strong>Nota:</strong> El intervalo encontrado (${result.vSpan.toFixed(1)} V) es menor que el mínimo especificado (${minVoltageSpan} V) pero representa la mejor región disponible.
                    </p>
                </div>
                `;
            }
            
            document.getElementById('results').innerHTML = resultsHTML;
            lastAnalysisResults = {
                result: result,
                avgCount: avgCount,
                tensionTrabajo: tensionTrabajo,
                slopePercPerVolt: slopePercPerVolt,
                fitType: fitType
            };
            
            // Actualizar gráfico
            updateChart(voltages, counts, result.plateauVoltages, result.plateauCounts, result.lineX, result.lineY);
            
            // Mostrar sección de resultados
            document.getElementById('resultsPlaceholder').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'block';
            
            // Mostrar mensaje de éxito
            showMessage(`✅ Análisis completado exitosamente. Zona de plateau identificada entre ${result.vStart}V y ${result.vEnd}V.`, "success");
            
            // Mostrar advertencia si el ajuste es pobre
            if (result.chi2Reducido > 3) {
                showMessage(`⚠️ Advertencia: El valor alto de χ² reducido (${result.chi2Reducido.toFixed(2)}) indica que el modelo no describe bien los datos en esta región. Considere revisar los datos o ajustar los parámetros.`, "warning");
            }
        }, 100);
        
    } catch (error) {
        logDebug(`Error en processData: ${error.message}`);
        showMessage(`Error: ${error.message}`, "error");
        document.getElementById('results').innerHTML = '<p>Ocurrió un error durante el procesamiento. Revise la consola para más detalles.</p>';
        
        if (chart) {
            chart.destroy();
            chart = null;
        }
    }
}

function updateChart(voltages, counts, plateauVoltages, plateauCounts, lineX, lineY) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    const datasets = [
        {
            label: 'Datos experimentales',
            data: voltages.map((v, i) => ({ x: v, y: counts[i] })),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        },
        {
            label: 'Zona de Plateau',
            data: plateauVoltages.map((v, i) => ({ x: v, y: plateauCounts[i] })),
            backgroundColor: 'rgba(255, 99, 132, 0.9)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 3,
            pointRadius: 8,
            pointStyle: 'rectRot',
            pointHoverRadius: 10
        },
        {
            label: fitType === 'linear' ? 'Ajuste lineal' : 'Ajuste cuadrático',
            data: lineX.map((x, i) => ({ x: x, y: lineY[i] })),
            type: 'line',
            borderColor: fitType === 'linear' ? 'rgba(54, 162, 235, 1)' : 'rgba(153, 102, 255, 1)',
            backgroundColor: 'transparent',
            pointRadius: 0,
            fill: false,
            tension: 0.1,
            borderWidth: 3
        }
    ];
    
    chart = new Chart(ctx, {
        type: chartType,
        data: { datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            scales: {
                x: {
                    title: { 
                        display: true, 
                        text: 'Voltaje (V)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    min: Math.min(...voltages) - 25,
                    max: Math.max(...voltages) + 25,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: { 
                        display: true, 
                        text: 'Tasa de conteo (cuentas)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    min: Math.min(...counts, ...lineY) * 0.9,
                    max: Math.max(...counts, ...lineY) * 1.1,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: { 
                    position: 'top',
                    labels: {
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} cuentas @ ${context.parsed.x} V`;
                        }
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                },
                annotation: {
                    annotations: {
                        box1: {
                            type: 'box',
                            xMin: plateauVoltages[0],
                            xMax: plateauVoltages[plateauVoltages.length - 1],
                            yMin: 0,
                            yMax: Math.max(...counts) * 1.1,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 0.5)',
                            borderWidth: 1,
                            drawTime: 'beforeDatasetsDraw'
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

function toggleChartType() {
    chartType = chartType === 'scatter' ? 'line' : 'scatter';
    if (chart) {
        chart.config.type = chartType;
        chart.update();
    }
    showMessage(`📊 Tipo de gráfico cambiado a: ${chartType === 'scatter' ? 'Dispersión' : 'Línea'}`, "success");
}

// ================================
// EXPORTACIÓN Y UTILIDADES
// ================================
function exportResults() {
    if (!lastAnalysisResults) {
        showMessage('No hay resultados para exportar. Realice el análisis primero.', 'error');
        return;
    }
    
    const { result, avgCount, tensionTrabajo, slopePercPerVolt, fitType } = lastAnalysisResults;
    const date = new Date().toISOString().split('T')[0];
    
    const content = `ANÁLISIS DE ZONA DE PLATEAU
Fecha: ${new Date().toLocaleString()}
---------------------------------------------------
Zona de Plateau identificada: ${result.vStart} - ${result.vEnd} V
Intervalo de voltaje: ${result.vSpan.toFixed(1)} V
Número de puntos: ${result.nPoints}
χ² reducido (${fitType === 'linear' ? 'ajuste lineal' : 'ajuste cuadrático'}): ${result.chi2Reducido.toFixed(4)}
${fitType === 'linear' ? `Pendiente: ${result.slope.toFixed(2)} cuentas/V (${slopePercPerVolt.toFixed(4)} %/V)` : ''}
Tasa de conteo promedio: ${avgCount.toFixed(2)} cuentas
Variación absoluta: ${((Math.max(...result.plateauCounts) - Math.min(...result.plateauCounts))).toFixed(2)} cuentas
Variación relativa: ${(((Math.max(...result.plateauCounts) - Math.min(...result.plateauCounts)) / avgCount) * 100).toFixed(2)} %
Tensión de trabajo recomendada: ${tensionTrabajo.toFixed(1)} V
---------------------------------------------------
Datos del plateau:
Voltaje (V), Cuentas, Predicción
${result.plateauVoltages.map((v, i) => 
    `${v}, ${result.plateauCounts[i]}, ${result.lineY[i].toFixed(2)}`
).join('\n')}
`;
    
    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisis_plateau_${date}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    showMessage('✅ Resultados exportados exitosamente', 'success');
}

function copyResultsToClipboard() {
    if (!lastAnalysisResults) {
        showMessage('No hay resultados para copiar. Realice el análisis primero.', 'error');
        return;
    }
    
    const resultsText = document.getElementById('results').innerText;
    navigator.clipboard.writeText(resultsText).then(() => {
        showMessage('✅ Resultados copiados al portapapeles', 'success');
    }).catch(err => {
        showMessage('❌ Error al copiar: ' + err.message, 'error');
    });
}

function printResults() {
    if (!lastAnalysisResults) {
        showMessage('No hay resultados para imprimir. Realice el análisis primero.', 'error');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Resultados del Análisis de Plateau</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #4361ee; font-size: 2.2rem; margin-bottom: 10px; }
                .header p { color: #5a6b8c; font-size: 1.1rem; }
                .results { margin: 20px 0; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; }
                .card { margin: 15px 0; padding: 15px; border-left: 4px solid #4361ee; background: #f8fafc; border-radius: 8px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Resultados del Análisis de Zona de Plateau</h1>
                <p>Fecha: ${new Date().toLocaleString()}</p>
            </div>
            <div class="results">
                ${document.getElementById('results').innerHTML}
            </div>
            <div class="footer">
                <p>Documento generado con PlateauLab Interactive</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    showMessage('🖨️ Ventana de impresión abierta', 'success');
}

function downloadChartImage() {
    if (!chart) {
        showMessage('No hay gráfico para descargar. Realice el análisis primero.', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.href = chart.toBase64Image('image/png', 1);
    link.download = `grafico_plateau_${new Date().toISOString().split('T')[0]}.png`;
    link.click();
    
    showMessage('✅ Gráfico descargado exitosamente', 'success');
}

// ================================
// SISTEMA DE MENSAJES
// ================================
function showMessage(message, type) {
    try {
        const container = document.getElementById('messageContainer');
        if (!container) return;
        
        // Remove oldest message if more than 3
        while (container.children.length > 3) {
            container.removeChild(container.children[0]);
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = message;
        container.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    } catch (error) {
        console.error("Error en showMessage:", error);
    }
}

// ================================
// INICIALIZACIÓN
// ================================
window.addEventListener('DOMContentLoaded', function() {
    generateTable();
    
    // Event listeners para configuración
    document.querySelectorAll('input[name="fitType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const note = document.getElementById('analysisNote');
            if (this.value === 'linear') {
                note.textContent = 'El error estadístico de cada medida se considera como ±√(cuentas). El algoritmo busca el segmento con intervalo ≥200V que mejor se ajuste a una recta, minimizando el χ² reducido.';
            } else {
                note.textContent = 'El error estadístico de cada medida se considera como ±√(cuentas). El algoritmo busca el segmento con intervalo ≥200V que mejor se ajuste a una curva cuadrática, minimizando el χ² reducido.';
            }
        });
    });
    
    // Cargar datos de ejemplo al hacer clic en el botón de ayuda
    document.querySelector('.info').addEventListener('click', function() {
        if (confirm('¿Desea cargar datos de ejemplo para probar la aplicación?')) {
            loadExample('gm-tube');
        }
    });
    
    logDebug('Aplicación inicializada correctamente');
    
    // Mensaje de bienvenida
    setTimeout(() => {
        showMessage("💡 Bienvenido a PlateauLab Interactive. Seleccione un método de entrada de datos para comenzar.", "success");
    }, 1000);
});