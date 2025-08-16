"use strict";

// Variables para los gráficos
let chartProductos, chartVentas, chartBalance;

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;

    let bgColor, borderColor, icon;
    switch (tipo) {
        case 'success':
            bgColor = 'rgba(16, 185, 129, 0.2)';
            borderColor = '#10b981';
            icon = '✓';
            break;
        case 'warning':
            bgColor = 'rgba(245, 158, 11, 0.2)';
            borderColor = '#f59e0b';
            icon = '⚠';
            break;
        case 'error':
            bgColor = 'rgba(239, 68, 68, 0.2)';
            borderColor = '#ef4444';
            icon = '✕';
            break;
        default:
            bgColor = 'rgba(255, 255, 255, 0.05)';
            borderColor = '#ff6f00';
            icon = 'ℹ';
    }

    notificacion.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: ${borderColor}; color: white; font-size: 0.85rem; font-weight: bold;">${icon}</div>
            <span style="flex: 1; font-size: 0.9rem;">${mensaje}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; width: 20px; height: 20px;">&times;</button>
        </div>
    `;

    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        border: 1px solid ${borderColor};
        border-radius: 12px;
        padding: 1rem;
        color: white;
        backdrop-filter: blur(10px);
        z-index: 10000;
        max-width: 320px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }
    }, 4000);
}

// Configuración del gráfico de productos más vendidos
const getOptionProductosMasVendidos = () => {
    return {
        backgroundColor: 'transparent',
        dataset: [
            {
                dimensions: ['name', 'score'],
                source: [
                    ['Harina', 314],
                    ['CocaCola', 351],
                    ['Fideos', 287],
                    ['Pan', 219],
                    ['Arroz', 253],
                ]
            },
            {
                transform: {
                    type: 'sort',
                    config: { dimension: 'score', order: 'desc' }
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0,
                rotate: 30,
                color: '#b4b4b4',
                fontSize: 11
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        yAxis: {
            axisLabel: {
                color: '#b4b4b4',
                fontSize: 11
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        },
        series: {
            type: 'bar',
            encode: { x: 'name', y: 'score' },
            datasetIndex: 1,
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#ff8c00'
                    }, {
                        offset: 1, color: '#ff6f00'
                    }]
                },
                borderRadius: [4, 4, 0, 0]
            }
        }
    };
};

// Configuración del gráfico de ventas
const getOptionVentas = (periodo = 'month') => {
    const dataMonthly = {
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        values: [32000, 28000, 35000, 41000, 38000, 45000]
    };
    
    const dataWeekly = {
        categories: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        values: [12000, 8500, 15000, 9800]
    };
    
    const data = periodo === 'month' ? dataMonthly : dataWeekly;
    
    return {
        backgroundColor: 'transparent',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.categories,
            axisLabel: {
                color: '#b4b4b4',
                fontSize: 11,
                rotate: periodo === 'month' ? 20 : 0
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#b4b4b4',
                fontSize: 11,
                formatter: function(value) {
                    return '$' + (value / 1000) + 'k';
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        },
        series: [{
            type: 'line',
            data: data.values,
            smooth: true,
            lineStyle: {
                color: '#10b981',
                width: 3
            },
            itemStyle: {
                color: '#10b981',
                borderColor: '#059669',
                borderWidth: 2
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(16, 185, 129, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(16, 185, 129, 0.05)'
                    }]
                }
            },
            symbol: 'circle',
            symbolSize: 8
        }]
    };
};

// Configuración del gráfico de balance
const getOptionBalance = () => {
    return {
        backgroundColor: 'transparent',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            axisLabel: {
                color: '#b4b4b4',
                fontSize: 11,
                rotate: 20
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#b4b4b4',
                fontSize: 11,
                formatter: function(value) {
                    return '$' + (value / 1000) + 'k';
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.05)'
                }
            }
        },
        legend: {
            data: ['Ingresos', 'Gastos'],
            textStyle: {
                color: '#b4b4b4'
            },
            top: 5
        },
        series: [
            {
                name: 'Ingresos',
                type: 'bar',
                data: [32000, 28000, 35000, 41000, 38000, 45000],
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#10b981'
                        }, {
                            offset: 1, color: '#059669'
                        }]
                    },
                    borderRadius: [4, 4, 0, 0]
                }
            },
            {
                name: 'Gastos',
                type: 'bar',
                data: [18000, 22000, 19000, 25000, 21000, 28000],
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#ef4444'
                        }, {
                            offset: 1, color: '#dc2626'
                        }]
                    },
                    borderRadius: [4, 4, 0, 0]
                }
            }
        ]
    };
};

// Función para inicializar todos los gráficos
const initCharts = () => {
    // Gráfico de productos más vendidos
    const chartProductosElement = document.getElementById("graficoProductos");
    if (chartProductosElement && typeof echarts !== 'undefined') {
        chartProductos = echarts.init(chartProductosElement);
        chartProductos.setOption(getOptionProductosMasVendidos());
    }

    // Gráfico de ventas
    const chartVentasElement = document.getElementById("graficoVentas");
    if (chartVentasElement && typeof echarts !== 'undefined') {
        chartVentas = echarts.init(chartVentasElement);
        chartVentas.setOption(getOptionVentas('month'));
    }

    // Gráfico de balance
    const chartBalanceElement = document.getElementById("graficoBalance");
    if (chartBalanceElement && typeof echarts !== 'undefined') {
        chartBalance = echarts.init(chartBalanceElement);
        chartBalance.setOption(getOptionBalance());
    }
};

// Función para manejar cambio de período
function handlePeriodChange(periodo) {
    if (chartVentas) {
        chartVentas.setOption(getOptionVentas(periodo));
        
        // Actualizar métricas según el período
        updateMetricsForPeriod(periodo);
    }
}

// Función para actualizar métricas según el período
function updateMetricsForPeriod(periodo) {
    const salesCard = document.querySelector('.dashboard-card .card-value');
    const salesChange = document.querySelector('.dashboard-card .card-change');
    
    if (periodo === 'week') {
        if (salesCard) salesCard.textContent = '$9,800';
        if (salesChange) salesChange.textContent = '+5.2%';
        mostrarNotificacion('Mostrando datos semanales', 'info');
    } else {
        if (salesCard) salesCard.textContent = '$45,320';
        if (salesChange) salesChange.textContent = '+12.5%';
        mostrarNotificacion('Mostrando datos mensuales', 'info');
    }
}

// Función para redimensionar gráficos
const resizeCharts = () => {
    if (chartProductos) chartProductos.resize();
    if (chartVentas) chartVentas.resize();
    if (chartBalance) chartBalance.resize();
};

// Función para navegar de regreso
function volverInicio() {
    mostrarNotificacion('Regresando al menú principal...', 'info');
    
    // Crear overlay de transición
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 111, 0, 0.95), rgba(255, 140, 0, 0.95));
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;

    overlay.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="width: 60px; height: 60px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <h3 style="margin: 0; font-size: 1.2rem;">Cargando...</h3>
        </div>
    `;

    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(overlay);

    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);

    // Navegar después de la animación
    setTimeout(() => {
        window.location.href = 'MenuInicio.html';
    }, 1200);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Botón de regreso
    const volverBtn = document.getElementById('volverInicio');
    if (volverBtn) {
        volverBtn.addEventListener('click', volverInicio);
    }

    // Toggle de tema
    const toggleTheme = document.getElementById('toggleTheme');
    if (toggleTheme) {
        toggleTheme.addEventListener('click', () => {
            const body = document.body;
            const isDark = body.classList.contains('dark-mode');

            body.classList.toggle('dark-mode', !isDark);
            body.classList.toggle('light-mode', isDark);

            // Guardar preferencia
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            
            mostrarNotificacion(`Tema ${isDark ? 'claro' : 'oscuro'} activado`, 'success');
        });
    }

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.remove('dark-mode', 'light-mode');
        document.body.classList.add(savedTheme + '-mode');
    }

    // Event listeners para tabs de período
    const periodTabs = document.querySelectorAll('[data-period]');
    periodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            
            // Actualizar tabs activos
            periodTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizar gráfico
            handlePeriodChange(period);
        });
    });

    // Event listeners para botones de acción
    const exportBtn = document.getElementById('exportarReporte');
    const detailsBtn = document.getElementById('verDetalles');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            mostrarNotificacion('Generando reporte de estadísticas...', 'info');
            
            // Simular exportación
            setTimeout(() => {
                mostrarNotificacion('Reporte exportado exitosamente', 'success');
            }, 2500);
        });
    }
    
    if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
            mostrarNotificacion('Vista detallada de estadísticas próximamente', 'info');
        });
    }

    // Inicializar gráficos después de que todo esté cargado
    setTimeout(() => {
        initCharts();
    }, 500);
});

// Event listener para redimensionar ventana
window.addEventListener('resize', () => {
    resizeCharts();
});

// Agregar estilos para animaciones de notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);