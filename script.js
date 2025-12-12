// Configuración
const WEEKS_PER_MONTH = 4;

// Datos Semanales Simulados (4 semanas por mes)
// Generamos datos para las últimas 4 semanas (1 mes)
const WEEKLY_DATA = [
    { label: '3° Nov 25', cba: 170523.05 },
    { label: '4° Nov 25', cba: 169811.46 },
    { label: '1° Dic 25', cba: 169976.31 },
    { label: '2° Dic 25', cba: 171348.20 },

];

// Valores Base (Semanal por Adulto Equivalente)
const CBA_WEEKLY_BASE = 171348.20; // Valor última semana
const CBT_WEEKLY_BASE = 358117.73; // Valor última semana (aprox)

// Composición CBA (Productos y Costo Base Semanal por AE)
// Estimación basada en proporciones INDEC y valor total semanal
const CBA_PRODUCTS = [
    { label: 'Carnes', cost: 59144.01 },
    { label: 'Frutas y Verduras', cost: 32849.47 },
    { label: 'Panadería', cost: 25512.28 },
    { label: 'Lácteos', cost: 19920.70 },
    { label: 'Bebidas Alcohólicas', cost: 6427.69 },
    { label: 'Yerba, Cafe y Té', cost: 5951.56 },
    { label: 'Condimentos', cost: 5278.41 },
    { label: 'Bebidas no Alcohólicas', cost: 2768.22 },
    { label: 'Huevos', cost: 2595.94 },
    { label: 'Arroz', cost: 2427.16 },
    { label: 'Harinas', cost: 2156.74 },
    { label: 'Fideos', cost: 1999.86 },
    { label: 'Otros', cost: 1646.08 },
    { label: 'Azúcar', cost: 1567.11 },
    { label: 'Fiambres', cost: 1102.98 },

];

// Tabla de Adulto Equivalente
function getAdultEquivalent(sex, age) {
    if (age < 1) return 0.35;
    if (age === 1) return 0.37;
    if (age === 2) return 0.46;
    if (age === 3) return 0.51;
    if (age === 4) return 0.55;
    if (age === 5) return 0.60;
    if (age === 6) return 0.64;
    if (age === 7) return 0.66;
    if (age === 8) return 0.68;
    if (age === 9) return 0.69;

    if (sex === 'M') {
        ///varon
        if (age === 10) return 0.79;
        if (age === 11) return 0.82;
        if (age === 12) return 0.85;
        if (age === 13) return 0.90;
        if (age === 14) return 0.96;
        if (age === 15) return 1.00;
        if (age === 16) return 1.03;
        if (age === 17) return 1.04;
        if (age >= 18 && age <= 29) return 1.02;
        if (age >= 30 && age <= 45) return 1.00;
        if (age >= 46 && age <= 60) return 1.00;
        if (age >= 61 && age <= 75) return 0.83;
        if (age >= 76) return 0.74;
    } else {
        // mujer
        if (age === 10) return 0.70;
        if (age === 11) return 0.72;
        if (age === 12) return 0.74;
        if (age === 13) return 0.76;
        if (age === 14) return 0.76;
        if (age === 15) return 0.77;
        if (age === 16) return 0.77;
        if (age === 17) return 0.77;
        if (age >= 18 && age <= 29) return 0.76;
        if (age >= 30 && age <= 45) return 0.77;
        if (age >= 46 && age <= 60) return 0.76;
        if (age >= 61 && age <= 75) return 0.67;
        if (age >= 76) return 0.63;
    }


}

// Estado
let members = [];
let evolutionChart = null;
let compositionChart = null;

// Elementos
const sexoSelect = document.getElementById('sexo');
const edadInput = document.getElementById('edad');
const btnAgregar = document.getElementById('btn-agregar');
const listaIntegrantes = document.getElementById('lista-integrantes');
const totalCbaEl = document.getElementById('total-cba');
const totalCbtEl = document.getElementById('total-cbt');
const totalAeEl = document.getElementById('total-ae');
const emptyState = document.getElementById('empty-state');

const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

function init() {
    btnAgregar.addEventListener('click', addMember);
    edadInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addMember(); });

    initCharts();

    // 1. Por defecto cargar un integrante varón de 30 años
    members.push({ id: Date.now(), sex: 'M', age: 30, ae: getAdultEquivalent('M', 30) });
    renderMembers();
    updateTotals();
}

function addMember() {
    const sex = sexoSelect.value;
    const age = parseInt(edadInput.value);
    if (isNaN(age) || age < 0 || age > 120) { alert('Edad inválida'); return; }

    const ae = getAdultEquivalent(sex, age);
    members.push({ id: Date.now(), sex, age, ae });

    renderMembers();
    updateTotals();
    edadInput.value = '';
    edadInput.focus();
}

function removeMember(id) {
    members = members.filter(m => m.id !== id);
    renderMembers();
    updateTotals();
}

function renderMembers() {
    listaIntegrantes.innerHTML = '';
    if (members.length === 0) {
        listaIntegrantes.appendChild(emptyState);
        return;
    }
    members.forEach(member => {
        const tr = document.createElement('tr');
        tr.className = 'animate-slide-in hover:bg-slate-50 transition-colors';
        const sexIcon = member.sex === 'M'
            ? '<span class="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">Varón</span>'
            : '<span class="text-pink-600 bg-pink-50 px-2 py-0.5 rounded text-xs font-medium">Mujer</span>';
        tr.innerHTML = `
            <td class="px-4 py-3">${sexIcon}</td>
            <td class="px-4 py-3 text-slate-700 font-medium">${member.age} años</td>
            <td class="px-4 py-3 text-right font-mono text-slate-600">${member.ae.toFixed(2)}</td>
            <td class="px-4 py-3 text-center">
                <button onclick="removeMember(${member.id})" class="text-slate-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        `;
        listaIntegrantes.appendChild(tr);
    });
}

function updateTotals() {
    const totalAe = members.reduce((sum, m) => sum + m.ae, 0);

    // Cálculo Semanal Directo
    const cba = totalAe * CBA_WEEKLY_BASE;
    const cbt = totalAe * CBT_WEEKLY_BASE;

    totalAeEl.textContent = totalAe.toFixed(2);
    totalCbaEl.textContent = formatter.format(cba);
    totalCbtEl.textContent = formatter.format(cbt);

    updateCharts(totalAe);
}

function initCharts() {
    // Gráfico de Evolución (Línea, Solo CBA, 4 puntos)
    const ctxEvo = document.getElementById('chart-evolution').getContext('2d');
    evolutionChart = new Chart(ctxEvo, {
        type: 'line',
        data: {
            labels: WEEKLY_DATA.map(d => d.label),
            datasets: [
                {
                    label: 'CBA Semanal',
                    borderColor: '#10b981', // brand-500
                    backgroundColor: '#10b981',
                    data: [],
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return formatter.format(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    // 3. Mínimo 150,000 y Máximo 200,000
                    //min: 0,
                    //max: 180000,
                    ticks: {
                        callback: function (value) {
                            return '$' + value.toLocaleString('es-AR');
                        }
                    }
                }
            }
        }
    });

    // Gráfico de Composición (Barras Horizontales, Valor $)
    const ctxComp = document.getElementById('chart-composition').getContext('2d');

    // Plugin inline para dibujar valores
    const dataLabelsPlugin = {
        id: 'dataLabels',
        afterDatasetsDraw(chart, args, options) {
            const { ctx } = chart;
            chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                meta.data.forEach((bar, index) => {
                    const value = dataset.data[index];
                    const text = formatter.format(value);

                    ctx.fillStyle = '#065f46'; // brand-800
                    ctx.font = 'bold 10px Inter';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';

                    // Dibujar texto un poco a la derecha de la barra
                    ctx.fillText(text, bar.x + 5, bar.y);
                });
            });
        }
    };

    compositionChart = new Chart(ctxComp, {
        type: 'bar',
        data: {
            labels: CBA_PRODUCTS.map(p => p.label),
            datasets: [{
                label: 'Costo Estimado',
                data: [],
                backgroundColor: '#34d399', // brand-400
                borderRadius: 4,
                barThickness: 12
            }]
        },
        plugins: [dataLabelsPlugin], // Registrar plugin
        options: {
            indexAxis: 'y', // Barras horizontales
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    right: 60 // Espacio extra para las etiquetas de valor
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return formatter.format(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '$' + value.toLocaleString('es-AR');
                        }
                    }
                },
                y: {
                    // 2. Mostrar todas las leyendas (etiquetas)
                    ticks: {
                        autoSkip: false,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function updateCharts(totalAe) {
    if (!evolutionChart || !compositionChart) return;

    // Actualizar Evolución
    const dataEvo = WEEKLY_DATA.map(d => d.cba * totalAe);
    evolutionChart.data.datasets[0].data = dataEvo;
    evolutionChart.update();

    // Actualizar Composición
    // Ordenar descendente por valor
    const products = [...CBA_PRODUCTS].sort((a, b) => b.cost - a.cost);

    compositionChart.data.labels = products.map(p => p.label);
    compositionChart.data.datasets[0].data = products.map(p => p.cost * totalAe);
    compositionChart.update();
}

init();
