// js/simulador/07-motor.js
// ============================================
// MOTOR DE SIMULACIÓN - Versión 4.0
// Con eventos, cadena de impacto, memoria de contexto y modo realidad/juego
// ============================================

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURACIÓN DEL MOTOR
    // ============================================
    
    const CONFIG_MOTOR = {
        version: '4.0',
        factorEscalaBase: 100,
        decaimientoPorTurno: 0.85,    // Los efectos se reducen un 15% por turno
        memoriaMaxima: 50,             // Máximo de acciones recordadas
        umbralCrisis: 70,              // A partir de 70 puntos se activan crisis
        umbralTensionAlta: 50,
        umbralTensionCritica: 80
    };
    
    // ============================================
    // ESTADO GLOBAL DEL MOTOR
    // ============================================
    
    let estadoMotor = {
        tensionGlobal: 35,              // 0-100
        estabilidadFinanciera: 65,      // 0-100
        climaSocial: 60,                // 0-100
        memoriaAcciones: [],            // Historial de acciones
        eventosActivos: new Map(),      // Eventos en curso
        ultimoIdEvento: 0,
        modo: 'realidad',               // 'realidad' o 'juego'
        multiplicadorInestabilidad: 1.0
    };
    
    // ============================================
    // DICCIONARIOS PARA LENGUAJE NATURAL
    // ============================================
    
    const DICCIONARIOS_MOTOR = {
        poderes: {
            'político': 0.7,
            'económico': 0.8,
            'financiero': 0.75,
            'militar': 0.9,
            'judicial': 0.5,
            'social': 0.6,
            'mediático': 0.65,
            'religioso': 0.4,
            'criminal': 0.3,
            'científico': 0.55,
            'territorial': 0.6,
            'ecosistema': 0.5,
            'gobierno': 0.7,
            'empresa': 0.6,
            'ciudadano': 0.4,
            'medios': 0.65
        },
        
        sectores: {
            'educación': 0.5,
            'sanidad': 0.55,
            'energía': 0.8,
            'infraestructuras': 0.6,
            'industria': 0.7,
            'comercio': 0.65,
            'tecnología': 0.75,
            'agricultura': 0.5,
            'medio_ambiente': 0.5,
            'defensa': 0.85,
            'petróleo': 0.8,
            'gas': 0.8,
            'electricidad': 0.7,
            'vivienda': 0.6,
            'empleo': 0.65
        },
        
        mecanismos: {
            'inversión': 0.6,
            'privatización': 0.7,
            'impuestos': 0.65,
            'subvenciones': 0.55,
            'deuda': 0.7,
            'regulación': 0.6,
            'concesiones': 0.55,
            'capital_riesgo': 0.65,
            'sanción': 0.75,
            'acuerdo': 0.5,
            'protesta': 0.6,
            'ley': 0.65,
            'crisis': 0.8,
            'ayuda': 0.5
        }
    };
    
    // ============================================
    // CATÁLOGO DE EVENTOS
    // ============================================
    
    const CATALOGO_EVENTOS = {
        'crisis_energetica': {
            nombre: 'Crisis energética',
            impactos: { económico: -0.3, geopolítico: -0.2, social: -0.25 },
            duracionBase: 6,
            factorDecaimiento: 0.9,
            probabilidadBase: 0.1
        },
        'subida_petroleo': {
            nombre: 'Subida del precio del petróleo',
            impactos: { económico: -0.2, geopolítico: -0.15, social: -0.1 },
            duracionBase: 3,
            factorDecaimiento: 0.85,
            probabilidadBase: 0.15
        },
        'crisis_financiera': {
            nombre: 'Crisis financiera',
            impactos: { económico: -0.4, geopolítico: -0.1, social: -0.3 },
            duracionBase: 8,
            factorDecaimiento: 0.95,
            probabilidadBase: 0.05
        },
        'protestas_sociales': {
            nombre: 'Protestas sociales',
            impactos: { social: -0.3, geopolítico: -0.1, económico: -0.1 },
            duracionBase: 2,
            factorDecaimiento: 0.7,
            probabilidadBase: 0.2
        },
        'sequía': {
            nombre: 'Sequía prolongada',
            impactos: { económico: -0.25, social: -0.2, ecosistema: -0.3 },
            duracionBase: 12,
            factorDecaimiento: 0.95,
            probabilidadBase: 0.08
        },
        'acuerdo_comercial': {
            nombre: 'Acuerdo comercial',
            impactos: { económico: 0.2, geopolítico: 0.15 },
            duracionBase: 24,
            factorDecaimiento: 0.98,
            probabilidadBase: 0.12
        },
        'ciberataque': {
            nombre: 'Ciberataque masivo',
            impactos: { tecnológico: -0.3, económico: -0.15, geopolítico: -0.1 },
            duracionBase: 2,
            factorDecaimiento: 0.6,
            probabilidadBase: 0.1
        },
        'ley_nueva': {
            nombre: 'Nueva legislación',
            impactos: { político: 0.15, social: 0.1, económico: 0.05 },
            duracionBase: 12,
            factorDecaimiento: 0.9,
            probabilidadBase: 0.25
        }
    };
    
    // ============================================
    // FUNCIONES DE UTILIDAD
    // ============================================
    
    function normalizarValor(valor, min = 0, max = 1) {
        return Math.max(min, Math.min(max, valor));
    }
    
    function obtenerValorDiccionario(diccionario, clave, porDefecto = 0.5) {
        if (!clave) return porDefecto;
        const claveLower = clave.toLowerCase();
        for (let [key, value] of Object.entries(diccionario)) {
            if (claveLower.includes(key)) {
                return value;
            }
        }
        return porDefecto;
    }
    
    function generarIdEvento() {
        return `evento_${Date.now()}_${++estadoMotor.ultimoIdEvento}`;
    }
    
    // ============================================
    // CÁLCULO DE IMPACTOS
    // ============================================
    
    function calcularImpactoBase(poder, sector, mecanismo, factorTerritorio = 1) {
        const valorPoder = typeof poder === 'number' ? poder : obtenerValorDiccionario(DICCIONARIOS_MOTOR.poderes, poder, 0.5);
        const valorSector = typeof sector === 'number' ? sector : obtenerValorDiccionario(DICCIONARIOS_MOTOR.sectores, sector, 0.5);
        const valorMecanismo = typeof mecanismo === 'number' ? mecanismo : obtenerValorDiccionario(DICCIONARIOS_MOTOR.mecanismos, mecanismo, 0.5);
        
        const base = valorPoder * valorSector * valorMecanismo * factorTerritorio;
        const escalado = base * CONFIG_MOTOR.factorEscalaBase;
        
        return {
            económico: Math.round(escalado * 1.0),
            geopolítico: Math.round(escalado * 0.8),
            social: Math.round(escalado * 0.5),
            político: Math.round(escalado * 0.7),
            tecnológico: Math.round(escalado * 0.4),
            financiero: Math.round(escalado * 0.9),
            formula: `${valorPoder.toFixed(2)} × ${valorSector.toFixed(2)} × ${valorMecanismo.toFixed(2)} × ${factorTerritorio} × ${CONFIG_MOTOR.factorEscalaBase} = ${escalado.toFixed(0)}`
        };
    }
    
    // ============================================
    // EFECTO CADENA
    // ============================================
    
    const EFECTOS_CADENA = {
        económico: ['empleo', 'consumo', 'inversión', 'recaudación'],
        empleo: ['consumo', 'social', 'recaudación'],
        consumo: ['económico', 'empresas', 'recaudación'],
        inversión: ['económico', 'tecnología', 'empleo'],
        social: ['protestas', 'estabilidad', 'votación'],
        protestas: ['social', 'político', 'económico'],
        energía: ['económico', 'industria', 'precios'],
        geopolítico: ['relaciones', 'comercio', 'alianzas']
    };
    
    const COEFICIENTES_CADENA = {
        directo: 1.0,
        secundario: 0.4,
        terciario: 0.2,
        cuaternario: 0.1
    };
    
    function calcularEfectoCadena(impactoInicial, tipoImpacto, factorTerritorio = 1) {
        const impactosSecundarios = EFECTOS_CADENA[tipoImpacto] || [];
        const numSecundarios = Math.min(impactosSecundarios.length, 3);
        
        const secundario = impactoInicial * COEFICIENTES_CADENA.secundario * (numSecundarios / 3) * factorTerritorio;
        const terciario = secundario * COEFICIENTES_CADENA.terciario * factorTerritorio;
        const cuaternario = terciario * COEFICIENTES_CADENA.cuaternario * factorTerritorio;
        
        const cadenaStr = impactosSecundarios.slice(0, 3).join(' → ');
        
        return {
            directo: Math.round(impactoInicial),
            secundario: Math.round(secundario),
            terciario: Math.round(terciario),
            cuaternario: Math.round(cuaternario),
            total: Math.round(impactoInicial + secundario + terciario + cuaternario),
            cadena: cadenaStr ? `${tipoImpacto} → ${cadenaStr}` : `${tipoImpacto} → sin efectos cadena`,
            afectados: impactosSecundarios.slice(0, 3)
        };
    }
    
    // ============================================
    // ACTUALIZACIÓN DE ESTADO GLOBAL
    // ============================================
    
    function actualizarEstadoGlobal(impactos, efectoGlobal) {
        // Actualizar tensión global
        let nuevaTension = estadoMotor.tensionGlobal + (efectoGlobal.total / 20);
        nuevaTension = normalizarValor(nuevaTension, 0, 100);
        
        // Actualizar estabilidad financiera
        let nuevaEstabilidad = estadoMotor.estabilidadFinanciera + (impactos.financiero || impactos.económico || 0) / 50;
        nuevaEstabilidad = normalizarValor(nuevaEstabilidad, 0, 100);
        
        // Actualizar clima social
        let nuevoClimaSocial = estadoMotor.climaSocial + (impactos.social || 0) / 40;
        nuevoClimaSocial = normalizarValor(nuevoClimaSocial, 0, 100);
        
        // Calcular multiplicador de inestabilidad
        let multiplicador = 1.0;
        if (nuevaTension > CONFIG_MOTOR.umbralTensionCritica) multiplicador = 1.5;
        else if (nuevaTension > CONFIG_MOTOR.umbralTensionAlta) multiplicador = 1.2;
        
        // Guardar estado anterior
        const estadoAnterior = {
            tensionGlobal: estadoMotor.tensionGlobal,
            estabilidadFinanciera: estadoMotor.estabilidadFinanciera,
            climaSocial: estadoMotor.climaSocial,
            multiplicadorInestabilidad: estadoMotor.multiplicadorInestabilidad
        };
        
        // Actualizar estado
        estadoMotor.tensionGlobal = nuevaTension;
        estadoMotor.estabilidadFinanciera = nuevaEstabilidad;
        estadoMotor.climaSocial = nuevoClimaSocial;
        estadoMotor.multiplicadorInestabilidad = multiplicador;
        
        // Detectar crisis
        const crisis = [];
        if (nuevaTension > CONFIG_MOTOR.umbralCrisis && estadoAnterior.tensionGlobal <= CONFIG_MOTOR.umbralCrisis) {
            crisis.push('CRISIS DE TENSIÓN GLOBAL');
        }
        if (nuevaEstabilidad < 30 && estadoAnterior.estabilidadFinanciera >= 30) {
            crisis.push('CRISIS FINANCIERA');
        }
        if (nuevoClimaSocial < 30 && estadoAnterior.climaSocial >= 30) {
            crisis.push('MALESTAR SOCIAL GENERALIZADO');
        }
        
        return {
            nuevo: {
                tensionGlobal: nuevaTension,
                estabilidadFinanciera: nuevaEstabilidad,
                climaSocial: nuevoClimaSocial,
                multiplicadorInestabilidad: multiplicador
            },
            anterior: estadoAnterior,
            crisis: crisis,
            nivelTension: obtenerNivelTension(nuevaTension)
        };
    }
    
    function obtenerNivelTension(tension) {
        if (tension < 30) return { texto: '🌱 Baja', color: '#2e7d32' };
        if (tension < 60) return { texto: '⚖️ Moderada', color: '#f57c00' };
        if (tension < 80) return { texto: '🔥 Alta', color: '#d32f2f' };
        return { texto: '💥 Crítica', color: '#b71c1c' };
    }
    
    // ============================================
    // GESTIÓN DE EVENTOS
    // ============================================
    
    function activarEvento(tipoEvento, params = {}) {
        const eventoDef = CATALOGO_EVENTOS[tipoEvento];
        if (!eventoDef) return null;
        
        const id = generarIdEvento();
        const evento = {
            id: id,
            tipo: tipoEvento,
            nombre: eventoDef.nombre,
            impactos: eventoDef.impactos,
            duracionRestante: eventoDef.duracionBase,
            duracionBase: eventoDef.duracionBase,
            factorDecaimiento: eventoDef.factorDecaimiento,
            fechaInicio: new Date().toISOString(),
            params: params
        };
        
        estadoMotor.eventosActivos.set(id, evento);
        return evento;
    }
    
    function actualizarEventos() {
        const eventosCompletados = [];
        
        for (let [id, evento] of estadoMotor.eventosActivos) {
            evento.duracionRestante--;
            
            // Aplicar decaimiento de impactos
            for (let [tipo, impacto] of Object.entries(evento.impactos)) {
                evento.impactos[tipo] = impacto * evento.factorDecaimiento;
            }
            
            if (evento.duracionRestante <= 0) {
                eventosCompletados.push(id);
            }
        }
        
        // Eliminar eventos completados
        for (let id of eventosCompletados) {
            estadoMotor.eventosActivos.delete(id);
        }
        
        return eventosCompletados;
    }
    
    function obtenerImpactosEventos() {
        const impactosAcumulados = { económico: 0, social: 0, geopolítico: 0, político: 0 };
        
        for (let evento of estadoMotor.eventosActivos.values()) {
            for (let [tipo, valor] of Object.entries(evento.impactos)) {
                impactosAcumulados[tipo] = (impactosAcumulados[tipo] || 0) + valor;
            }
        }
        
        return impactosAcumulados;
    }
    
    // ============================================
    // MEMORIA DE ACCIONES
    // ============================================
    
    function registrarEnMemoria(accion, resultado) {
        estadoMotor.memoriaAcciones.unshift({
            timestamp: new Date().toISOString(),
            accion: accion,
            resultado: {
                impactos: resultado.impactos,
                tension: resultado.estadoActual?.tensionGlobal,
                efectosCadena: resultado.efectoCadena
            }
        });
        
        // Limitar tamaño
        if (estadoMotor.memoriaAcciones.length > CONFIG_MOTOR.memoriaMaxima) {
            estadoMotor.memoriaAcciones.pop();
        }
    }
    
    function obtenerUltimasAcciones(cantidad = 5) {
        return estadoMotor.memoriaAcciones.slice(0, cantidad);
    }
    
    // ============================================
    // SIMULACIÓN PRINCIPAL (EXPORTADA)
    // ============================================
    
    const MotorSimulacion = {
        // Configuración
        version: CONFIG_MOTOR.version,
        
        // Cambiar modo
        setModo: function(modo) {
            if (modo === 'realidad' || modo === 'juego') {
                estadoMotor.modo = modo;
                return { exito: true, modo: modo };
            }
            return { exito: false, mensaje: 'Modo no válido' };
        },
        
        getModo: function() {
            return estadoMotor.modo;
        },
        
        // Obtener estado actual
        getEstado: function() {
            const impactosEventos = obtenerImpactosEventos();
            return {
                tensionGlobal: estadoMotor.tensionGlobal,
                estabilidadFinanciera: estadoMotor.estabilidadFinanciera,
                climaSocial: estadoMotor.climaSocial,
                multiplicadorInestabilidad: estadoMotor.multiplicadorInestabilidad,
                eventosActivos: Array.from(estadoMotor.eventosActivos.values()).map(e => ({
                    nombre: e.nombre,
                    duracionRestante: e.duracionRestante,
                    impactos: e.impactos
                })),
                ultimasAcciones: this.obtenerUltimasAcciones(5),
                nivelTension: obtenerNivelTension(estadoMotor.tensionGlobal)
            };
        },
        
        // Resetear estado
        resetear: function() {
            estadoMotor = {
                tensionGlobal: 35,
                estabilidadFinanciera: 65,
                climaSocial: 60,
                memoriaAcciones: [],
                eventosActivos: new Map(),
                ultimoIdEvento: 0,
                modo: estadoMotor.modo, // Mantener modo
                multiplicadorInestabilidad: 1.0
            };
            return { exito: true };
        },
        
        // Función principal de simulación
        simular: function(params) {
            const {
                poder = 0.5,
                sector = 0.5,
                mecanismo = 0.5,
                factorTerritorio = 1,
                factorEscala = CONFIG_MOTOR.factorEscalaBase,
                contexto = null,
                eventoAsociado = null,
                ignorarEventos = false
            } = params;
            
            // 1. Calcular impacto base
            let impactos = calcularImpactoBase(poder, sector, mecanismo, factorTerritorio);
            
            // Aplicar multiplicador de inestabilidad
            const multiplicador = estadoMotor.multiplicadorInestabilidad;
            for (let key in impactos) {
                if (typeof impactos[key] === 'number' && key !== 'formula') {
                    impactos[key] = Math.round(impactos[key] * multiplicador);
                }
            }
            
            // 2. Calcular efecto cadena para cada tipo de impacto
            const efectosCadena = {
                económico: calcularEfectoCadena(impactos.económico, 'económico', factorTerritorio),
                social: calcularEfectoCadena(impactos.social, 'social', factorTerritorio),
                geopolítico: calcularEfectoCadena(impactos.geopolítico, 'geopolítico', factorTerritorio)
            };
            
            // 3. Calcular impacto total con efecto cadena
            const impactoTotal = {
                económico: efectosCadena.económico.total,
                geopolítico: efectosCadena.geopolítico.total,
                social: efectosCadena.social.total
            };
            
            // 4. Aplicar eventos activos (si no se ignoran)
            let eventosImpacto = null;
            if (!ignorarEventos && estadoMotor.eventosActivos.size > 0) {
                eventosImpacto = obtenerImpactosEventos();
                for (let key in impactoTotal) {
                    const modificador = eventosImpacto[key] || 0;
                    impactoTotal[key] = Math.round(impactoTotal[key] * (1 + modificador));
                }
            }
            
            // 5. Actualizar estado global
            const estadoActualizado = actualizarEstadoGlobal(impactoTotal, efectosCadena.económico);
            
            // 6. Activar evento asociado si se especifica
            let eventoActivado = null;
            if (eventoAsociado && CATALOGO_EVENTOS[eventoAsociado]) {
                eventoActivado = activarEvento(eventoAsociado, { poder, sector, mecanismo });
            }
            
            // 7. Actualizar eventos activos (decaimiento)
            const eventosCompletados = actualizarEventos();
            
            // 8. Preparar resultado
            const resultado = {
                exito: true,
                timestamp: new Date().toISOString(),
                params: { poder, sector, mecanismo, factorTerritorio, factorEscala },
                impactos: impactoTotal,
                impactosBase: impactos,
                efectoCadena: efectosCadena,
                eventosImpacto: eventosImpacto,
                estadoActual: estadoActualizado.nuevo,
                estadoAnterior: estadoActualizado.anterior,
                crisis: estadoActualizado.crisis,
                eventosCompletados: eventosCompletados,
                eventoActivado: eventoActivado,
                nivelRiesgo: this.calcularRiesgoGlobal(),
                sugerencias: this.generarSugerencias(impactoTotal)
            };
            
            // 9. Registrar en memoria (solo en modo juego)
            if (estadoMotor.modo === 'juego') {
                registrarEnMemoria(params, resultado);
            }
            
            return resultado;
        },
        
        // Simular evento específico
        simularEvento: function(tipoEvento, params = {}) {
            if (!CATALOGO_EVENTOS[tipoEvento]) {
                return { exito: false, mensaje: `Evento "${tipoEvento}" no encontrado` };
            }
            
            const evento = activarEvento(tipoEvento, params);
            if (!evento) return { exito: false };
            
            // Simular el impacto inmediato del evento
            const resultadoEvento = this.simular({
                poder: 0.7,
                sector: 'energía',
                mecanismo: 'crisis',
                factorTerritorio: params.factorTerritorio || 1,
                eventoAsociado: tipoEvento
            });
            
            return {
                exito: true,
                evento: evento,
                resultado: resultadoEvento
            };
        },
        
        // Calcular riesgo global
        calcularRiesgoGlobal: function() {
            const tension = estadoMotor.tensionGlobal;
            const estabilidad = estadoMotor.estabilidadFinanciera;
            const clima = estadoMotor.climaSocial;
            
            const riesgo = (tension * 0.4) + ((100 - estabilidad) * 0.3) + ((100 - clima) * 0.3);
            const riesgoFinal = Math.round(riesgo * 10) / 10;
            
            let nivel = '✅ Estable';
            let color = '#2e7d32';
            if (riesgoFinal > 70) { nivel = '💀 Zona crítica'; color = '#b71c1c'; }
            else if (riesgoFinal > 50) { nivel = '🔥 Alta tensión'; color = '#d32f2f'; }
            else if (riesgoFinal > 30) { nivel = '⚠️ Competitivo'; color = '#f57c00'; }
            
            return { valor: riesgoFinal, nivel: nivel, color: color };
        },
        
        // Generar sugerencias basadas en impactos
        generarSugerencias: function(impactos) {
            const sugerencias = [];
            
            if (impactos.económico < -20) {
                sugerencias.push('💰 El impacto económico es severo. Considera medidas de estímulo.');
            }
            if (impactos.social < -15) {
                sugerencias.push('👥 El malestar social aumentará. Prepárate para protestas.');
            }
            if (impactos.geopolítico < -10) {
                sugerencias.push('🌍 Las relaciones internacionales se tensarán. Busca aliados.');
            }
            if (impactos.económico > 20) {
                sugerencias.push('📈 Oportunidad económica. Refuerza la inversión.');
            }
            
            return sugerencias;
        },
        
        // Obtener historial de acciones
        obtenerUltimasAcciones: function(cantidad = 5) {
            return obtenerUltimasAcciones(cantidad);
        },
        
        // Activar evento aleatorio (modo juego)
        eventoAleatorio: function() {
            const eventos = Object.keys(CATALOGO_EVENTOS);
            const eventoAleatorio = eventos[Math.floor(Math.random() * eventos.length)];
            return this.simularEvento(eventoAleatorio);
        },
        
        // Obtener catálogo de eventos
        getCatalogoEventos: function() {
            return { ...CATALOGO_EVENTOS };
        },
        
        // Actualizar factor territorial (para integración)
        actualizarFactorTerritorial: function(iso3, datosTerritorio) {
            if (window.FactorTerritorio && window.FactorTerritorio.calcular) {
                return window.FactorTerritorio.calcular(datosTerritorio);
            }
            return 1.0;
        },
        
        // Versión simplificada (compatibilidad con código existente)
        calcular: function(params) {
            const { poder = 0.5, sector = 0.5, mecanismo = 0.5, factorTerritorio = 1, factorEscala = 100 } = params;
            const base = poder * sector * mecanismo * factorTerritorio;
            return {
                económico: Math.round(base * factorEscala * 1.0),
                geopolítico: Math.round(base * factorEscala * 0.8),
                social: Math.round(base * factorEscala * 0.5),
                formula: `${poder} × ${sector} × ${mecanismo} × ${factorTerritorio} × ${factorEscala} = ${Math.round(base * factorEscala)}`
            };
        }
    };
    
    // ============================================
    // EXPORTAR
    // ============================================
    
    window.MotorSimulacion = MotorSimulacion;
    window.CATALOGO_EVENTOS = CATALOGO_EVENTOS;
    
    console.log(`✅ MotorSimulacion v${CONFIG_MOTOR.version} cargado correctamente`);
    
})();
