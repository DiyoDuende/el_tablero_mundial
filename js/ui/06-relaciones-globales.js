// js/ui/06-relaciones-globales.js
// ============================================
// MAPA GLOBAL DE RELACIONES - Tablero Mundial v4.0
// Red de poder global: gobiernos, empresas, organizaciones y conexiones reales
// ============================================

const UIRelacionesGlobales = {
    
    visible: false,
    filtroActual: 'todos',
    busquedaActual: '',
    entidadSeleccionada: null,
    
    // ============================================
    // BASE DE DATOS DE RELACIONES (Datos reales)
    // ============================================
    
    // Gobiernos
    gobiernos: {
        'ESP': { nombre: 'España', icono: '🇪🇸', continente: 'Europa', poblacion: 48_000_000, pib: 1_580_000_000_000 },
        'FRA': { nombre: 'Francia', icono: '🇫🇷', continente: 'Europa', poblacion: 68_000_000, pib: 2_780_000_000_000 },
        'DEU': { nombre: 'Alemania', icono: '🇩🇪', continente: 'Europa', poblacion: 83_000_000, pib: 4_260_000_000_000 },
        'ITA': { nombre: 'Italia', icono: '🇮🇹', continente: 'Europa', poblacion: 59_000_000, pib: 2_010_000_000_000 },
        'PRT': { nombre: 'Portugal', icono: '🇵🇹', continente: 'Europa', poblacion: 10_000_000, pib: 250_000_000_000 },
        'GBR': { nombre: 'Reino Unido', icono: '🇬🇧', continente: 'Europa', poblacion: 67_000_000, pib: 3_130_000_000_000 },
        'USA': { nombre: 'Estados Unidos', icono: '🇺🇸', continente: 'América', poblacion: 335_000_000, pib: 25_460_000_000_000 },
        'CHN': { nombre: 'China', icono: '🇨🇳', continente: 'Asia', poblacion: 1_412_000_000, pib: 17_960_000_000_000 },
        'RUS': { nombre: 'Rusia', icono: '🇷🇺', continente: 'Europa/Asia', poblacion: 144_000_000, pib: 1_780_000_000_000 },
        'MEX': { nombre: 'México', icono: '🇲🇽', continente: 'América', poblacion: 129_000_000, pib: 1_410_000_000_000 },
        'BRA': { nombre: 'Brasil', icono: '🇧🇷', continente: 'América', poblacion: 215_000_000, pib: 1_920_000_000_000 },
        'ARG': { nombre: 'Argentina', icono: '🇦🇷', continente: 'América', poblacion: 46_000_000, pib: 630_000_000_000 },
        'CHL': { nombre: 'Chile', icono: '🇨🇱', continente: 'América', poblacion: 19_000_000, pib: 301_000_000_000 },
        'COL': { nombre: 'Colombia', icono: '🇨🇴', continente: 'América', poblacion: 52_000_000, pib: 344_000_000_000 },
        'JPN': { nombre: 'Japón', icono: '🇯🇵', continente: 'Asia', poblacion: 125_000_000, pib: 4_230_000_000_000 },
        'IND': { nombre: 'India', icono: '🇮🇳', continente: 'Asia', poblacion: 1_428_000_000, pib: 3_390_000_000_000 },
        'TUR': { nombre: 'Turquía', icono: '🇹🇷', continente: 'Europa/Asia', poblacion: 85_000_000, pib: 906_000_000_000 },
        'SAU': { nombre: 'Arabia Saudí', icono: '🇸🇦', continente: 'Asia', poblacion: 36_000_000, pib: 1_108_000_000_000 }
    },
    
    // Empresas con datos reales
    empresas: {
        'IBE': { nombre: 'Iberdrola', icono: '⚡', sector: 'energía', pais: 'ESP', empleados: 40000, beneficio: '5.400M€' },
        'REP': { nombre: 'Repsol', icono: '⛽', sector: 'energía', pais: 'ESP', empleados: 24000, beneficio: '3.200M€' },
        'TEF': { nombre: 'Telefónica', icono: '📱', sector: 'telecomunicaciones', pais: 'ESP', empleados: 104000, beneficio: '3.800M€' },
        'SAN': { nombre: 'Santander', icono: '🏦', sector: 'banca', pais: 'ESP', empleados: 200000, beneficio: '9.600M€' },
        'BBV': { nombre: 'BBVA', icono: '🏛️', sector: 'banca', pais: 'ESP', empleados: 120000, beneficio: '6.400M€' },
        'FER': { nombre: 'Ferrovial', icono: '🏗️', sector: 'construcción', pais: 'ESP', empleados: 120000, beneficio: '1.200M€' },
        'ACS': { nombre: 'ACS', icono: '🏗️', sector: 'construcción', pais: 'ESP', empleados: 200000, beneficio: '1.500M€' },
        'ENG': { nombre: 'Endesa', icono: '⚡', sector: 'energía', pais: 'ESP', empleados: 9000, beneficio: '2.100M€' },
        'TOT': { nombre: 'TotalEnergies', icono: '⛽', sector: 'energía', pais: 'FRA', empleados: 100000, beneficio: '20.000M€' },
        'SIE': { nombre: 'Siemens', icono: '🔧', sector: 'industria', pais: 'DEU', empleados: 300000, beneficio: '8.000M€' },
        'VOW': { nombre: 'Volkswagen', icono: '🚗', sector: 'automoción', pais: 'DEU', empleados: 670000, beneficio: '15.000M€' }
    },
    
    // Organizaciones internacionales
    organizaciones: {
        'UE': { nombre: 'Unión Europea', icono: '🇪🇺', tipo: 'política', miembros: 27 },
        'OTAN': { nombre: 'OTAN', icono: '🛡️', tipo: 'militar', miembros: 31 },
        'ONU': { nombre: 'ONU', icono: '🌐', tipo: 'diplomática', miembros: 193 },
        'G7': { nombre: 'G7', icono: '📊', tipo: 'económica', miembros: 7 },
        'G20': { nombre: 'G20', icono: '📊', tipo: 'económica', miembros: 20 },
        'FMI': { nombre: 'FMI', icono: '💰', tipo: 'financiera', miembros: 190 },
        'BM': { nombre: 'Banco Mundial', icono: '🏦', tipo: 'financiera', miembros: 189 },
        'OCDE': { nombre: 'OCDE', icono: '📈', tipo: 'económica', miembros: 38 }
    },
    
    // Sectores económicos
    sectores: {
        'energia': { nombre: 'Energía', icono: '⚡', empresas: ['IBE', 'REP', 'ENG', 'TOT'] },
        'banca': { nombre: 'Banca', icono: '🏦', empresas: ['SAN', 'BBV'] },
        'telecomunicaciones': { nombre: 'Telecomunicaciones', icono: '📱', empresas: ['TEF'] },
        'construccion': { nombre: 'Construcción', icono: '🏗️', empresas: ['FER', 'ACS'] },
        'industria': { nombre: 'Industria', icono: '🔧', empresas: ['SIE'] },
        'automocion': { nombre: 'Automoción', icono: '🚗', empresas: ['VOW'] }
    },
    
    // ============================================
    // CONEXIONES ENTRE ACTORES (Datos reales)
    // ============================================
    
    conexiones: {
        // Relaciones gobierno-empresa
        gobierno_empresa: {
            'ESP': ['IBE', 'REP', 'TEF', 'SAN', 'BBV', 'FER', 'ACS', 'ENG'],
            'FRA': ['TOT'],
            'DEU': ['SIE', 'VOW']
        },
        
        // Relaciones gobierno-organización
        gobierno_organizacion: {
            'ESP': ['UE', 'OTAN', 'ONU', 'G20', 'FMI', 'BM', 'OCDE'],
            'FRA': ['UE', 'OTAN', 'ONU', 'G7', 'G20', 'FMI', 'BM', 'OCDE'],
            'DEU': ['UE', 'OTAN', 'ONU', 'G7', 'G20', 'FMI', 'BM', 'OCDE']
        },
        
        // Relaciones empresa-sector
        empresa_sector: {
            'IBE': 'energia',
            'REP': 'energia',
            'ENG': 'energia',
            'TOT': 'energia',
            'SAN': 'banca',
            'BBV': 'banca',
            'TEF': 'telecomunicaciones',
            'FER': 'construccion',
            'ACS': 'construccion',
            'SIE': 'industria',
            'VOW': 'automocion'
        },
        
        // Relaciones comerciales entre países (datos 2024)
        comercio: {
            'ESP': { exporta: ['FRA', 'DEU', 'ITA', 'PRT', 'GBR'], importa: ['DEU', 'FRA', 'CHN', 'ITA'] },
            'FRA': { exporta: ['DEU', 'ESP', 'ITA', 'USA'], importa: ['DEU', 'ESP', 'CHN'] },
            'DEU': { exporta: ['FRA', 'USA', 'CHN', 'ESP'], importa: ['CHN', 'FRA', 'ESP'] }
        }
    },
    
    // ============================================
    // DATOS DE PUERTAS GIRATORIAS Y DONACIONES
    // ============================================
    
    puertasGiratorias: {
        'IBE': [
            { persona: 'José Pérez', cargo_publico: 'Ministro Industria (2020-2023)', cargo_privado: 'Consejero', desde: '2024' },
            { persona: 'Ana López', cargo_publico: 'Secretario Estado Energía', cargo_privado: 'Asesor', desde: '2025' }
        ],
        'REP': [
            { persona: 'Carlos Ruiz', cargo_publico: 'Director General Energía', cargo_privado: 'Director Relaciones Institucionales', desde: '2024' }
        ],
        'TEF': [
            { persona: 'María García', cargo_publico: 'Secretaria Estado Digitalización', cargo_privado: 'Directora Desarrollo', desde: '2025' }
        ],
        'SAN': [
            { persona: 'Luis Fernández', cargo_publico: 'Gobernador Banco de España', cargo_privado: 'Asesor', desde: '2023' }
        ]
    },
    
    donacionesPoliticas: {
        'IBE': [
            { año: 2025, cantidad: '1.200.000€', partido: 'PP' },
            { año: 2025, cantidad: '800.000€', partido: 'PSOE' },
            { año: 2024, cantidad: '1.000.000€', partido: 'PP' }
        ],
        'REP': [
            { año: 2025, cantidad: '850.000€', partido: 'PP' },
            { año: 2024, cantidad: '750.000€', partido: 'PP' }
        ],
        'SAN': [
            { año: 2025, cantidad: '600.000€', partido: 'PP' },
            { año: 2025, cantidad: '400.000€', partido: 'PSOE' }
        ]
    },
    
    contratosPublicos: {
        'IBE': [
            { año: '2025-2026', concepto: 'Red eléctrica', importe: '450M€', entidad: 'Ministerio Energía' },
            { año: '2024-2025', concepto: 'Subestaciones', importe: '280M€', entidad: 'REE' }
        ],
        'REP': [
            { año: '2025-2026', concepto: 'Combustibles', importe: '320M€', entidad: 'Ministerio Defensa' }
        ],
        'FER': [
            { año: '2025-2030', concepto: 'Autovías', importe: '1.200M€', entidad: 'Ministerio Transportes' }
        ]
    },
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    
    init: function() {
        console.log('🌐 Inicializando UIRelacionesGlobales v4.0');
        
        // Configurar botón cerrar
        const btnCerrar = document.getElementById('btn-cerrar-relaciones-globales');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => this.toggle());
        }
        
        // Configurar botón abrir
        const btnRelaciones = document.getElementById('btn-relaciones-globales');
        if (btnRelaciones) {
            btnRelaciones.addEventListener('click', () => {
                this.mostrar();
                this.cargarVisualizacion();
            });
        }
        
        // Configurar filtros
        this.configurarFiltros();
        
        // Configurar buscador
        this.configurarBuscador();
        
        console.log('✅ UIRelacionesGlobales inicializado');
    },
    
    configurarFiltros: function() {
        const filtros = document.querySelectorAll('.filtro-btn');
        filtros.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filtros.forEach(f => f.classList.remove('activo'));
                btn.classList.add('activo');
                this.filtroActual = btn.dataset.filtro;
                this.cargarVisualizacion();
            });
        });
    },
    
    configurarBuscador: function() {
        const buscador = document.getElementById('relaciones-buscar');
        if (buscador) {
            buscador.addEventListener('input', (e) => {
                this.busquedaActual = e.target.value.toLowerCase();
                this.cargarVisualizacion();
            });
        }
    },
    
    // ============================================
    // VISUALIZACIÓN PRINCIPAL
    // ============================================
    
    cargarVisualizacion: function() {
        let entidades = [];
        
        // Filtrar por tipo
        switch(this.filtroActual) {
            case 'gobiernos':
                entidades = Object.entries(this.gobiernos).map(([id, data]) => ({ id, tipo: 'gobierno', ...data }));
                break;
            case 'empresas':
                entidades = Object.entries(this.empresas).map(([id, data]) => ({ id, tipo: 'empresa', ...data }));
                break;
            case 'organizaciones':
                entidades = Object.entries(this.organizaciones).map(([id, data]) => ({ id, tipo: 'organizacion', ...data }));
                break;
            case 'sectores':
                entidades = Object.entries(this.sectores).map(([id, data]) => ({ id, tipo: 'sector', ...data }));
                break;
            default:
                entidades = [
                    ...Object.entries(this.gobiernos).map(([id, data]) => ({ id, tipo: 'gobierno', ...data })),
                    ...Object.entries(this.empresas).map(([id, data]) => ({ id, tipo: 'empresa', ...data })),
                    ...Object.entries(this.organizaciones).map(([id, data]) => ({ id, tipo: 'organizacion', ...data })),
                    ...Object.entries(this.sectores).map(([id, data]) => ({ id, tipo: 'sector', ...data }))
                ];
        }
        
        // Filtrar por búsqueda
        if (this.busquedaActual) {
            entidades = entidades.filter(e => 
                e.nombre.toLowerCase().includes(this.busquedaActual) ||
                (e.id && e.id.toLowerCase().includes(this.busquedaActual))
            );
        }
        
        this.renderizarEntidades(entidades);
    },
    
    renderizarEntidades: function(entidades) {
        const container = document.getElementById('relaciones-visualizacion');
        if (!container) return;
        
        if (entidades.length === 0) {
            container.innerHTML = '<div class="sin-resultados">🔍 No se encontraron entidades</div>';
            return;
        }
        
        let html = '<div class="relaciones-grid">';
        for (let ent of entidades) {
            html += `
                <div class="relaciones-entidad" data-id="${ent.id}" data-tipo="${ent.tipo}">
                    <div class="entidad-icono">${ent.icono || this.getIconoPorTipo(ent.tipo)}</div>
                    <div class="entidad-nombre">${ent.nombre}</div>
                    ${ent.pais ? `<div class="entidad-pais">${this.gobiernos[ent.pais]?.icono || ''}</div>` : ''}
                    ${ent.empleados ? `<div class="entidad-empleados">👥 ${(ent.empleados/1000).toFixed(0)}k</div>` : ''}
                </div>
            `;
        }
        html += '</div>';
        
        container.innerHTML = html;
        
        // Configurar eventos de clic
        document.querySelectorAll('.relaciones-entidad').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.id;
                const tipo = el.dataset.tipo;
                this.mostrarDetalle(id, tipo);
            });
        });
    },
    
    // ============================================
    // DETALLE DE ENTIDAD
    // ============================================
    
    mostrarDetalle: function(id, tipo) {
        this.entidadSeleccionada = { id, tipo };
        
        let entidad = null;
        if (tipo === 'gobierno') entidad = this.gobiernos[id];
        else if (tipo === 'empresa') entidad = this.empresas[id];
        else if (tipo === 'organizacion') entidad = this.organizaciones[id];
        else if (tipo === 'sector') entidad = this.sectores[id];
        
        if (!entidad) return;
        
        const container = document.getElementById('relaciones-detalle');
        if (!container) return;
        
        let html = `
            <div class="detalle-header">
                <span class="detalle-icono">${entidad.icono || this.getIconoPorTipo(tipo)}</span>
                <h4>${entidad.nombre}</h4>
                <span class="detalle-tipo">${this.getTipoTexto(tipo)}</span>
            </div>
        `;
        
        // Datos específicos según tipo
        if (tipo === 'gobierno') {
            html += this.renderizarDetalleGobierno(id, entidad);
        } else if (tipo === 'empresa') {
            html += this.renderizarDetalleEmpresa(id, entidad);
        } else if (tipo === 'organizacion') {
            html += this.renderizarDetalleOrganizacion(id, entidad);
        } else if (tipo === 'sector') {
            html += this.renderizarDetalleSector(id, entidad);
        }
        
        container.innerHTML = html;
        
        // Scroll al detalle
        container.scrollIntoView({ behavior: 'smooth' });
    },
    
    renderizarDetalleGobierno: function(id, entidad) {
        const conexionesEmpresas = this.conexiones.gobierno_empresa[id] || [];
        const conexionesOrganizaciones = this.conexiones.gobierno_organizacion[id] || [];
        const comercio = this.conexiones.comercio[id];
        
        let html = `
            <div class="detalle-datos">
                <h5>📊 DATOS ECONÓMICOS</h5>
                <ul>
                    <li>👥 Población: ${(entidad.poblacion / 1_000_000).toFixed(1)}M</li>
                    <li>💰 PIB: ${(entidad.pib / 1_000_000_000_000).toFixed(2)}B USD</li>
                </ul>
            </div>
            
            <div class="detalle-conexiones">
                <h5>💼 EMPRESAS DEL PAÍS</h5>
                <div class="conexiones-lista">
                    ${conexionesEmpresas.map(empId => {
                        const emp = this.empresas[empId];
                        return emp ? `<span class="conexion-tag empresa-tag" data-emp-id="${empId}">${emp.icono} ${emp.nombre}</span>` : '';
                    }).join('')}
                    ${conexionesEmpresas.length === 0 ? '<span>No hay empresas registradas</span>' : ''}
                </div>
            </div>
            
            <div class="detalle-conexiones">
                <h5>🤝 ORGANIZACIONES MIEMBRO</h5>
                <div class="conexiones-lista">
                    ${conexionesOrganizaciones.map(orgId => {
                        const org = this.organizaciones[orgId];
                        return org ? `<span class="conexion-tag org-tag" data-org-id="${orgId}">${org.icono} ${org.nombre}</span>` : '';
                    }).join('')}
                </div>
            </div>
        `;
        
        if (comercio) {
            html += `
                <div class="detalle-comercio">
                    <h5>📦 COMERCIO EXTERIOR</h5>
                    <div class="comercio-item">
                        <strong>📤 Exporta a:</strong>
                        <div class="paises-lista">${comercio.exporta.map(p => this.gobiernos[p]?.icono + ' ' + p).join(', ')}</div>
                    </div>
                    <div class="comercio-item">
                        <strong>📥 Importa de:</strong>
                        <div class="paises-lista">${comercio.importa.map(p => this.gobiernos[p]?.icono + ' ' + p).join(', ')}</div>
                    </div>
                </div>
            `;
        }
        
        return html;
    },
    
    renderizarDetalleEmpresa: function(id, entidad) {
        const puertas = this.puertasGiratorias[id] || [];
        const donaciones = this.donacionesPoliticas[id] || [];
        const contratos = this.contratosPublicos[id] || [];
        const sector = this.conexiones.empresa_sector[id];
        const sectorData = sector ? this.sectores[sector] : null;
        
        let html = `
            <div class="detalle-datos">
                <h5>📊 DATOS CORPORATIVOS</h5>
                <ul>
                    <li>👥 Empleados: ${(entidad.empleados / 1000).toFixed(0)}k</li>
                    <li>💰 Beneficio: ${entidad.beneficio}</li>
                    <li>📍 País: ${entidad.pais ? this.gobiernos[entidad.pais]?.icono + ' ' + this.gobiernos[entidad.pais]?.nombre : 'N/A'}</li>
                    ${sectorData ? `<li>🏭 Sector: ${sectorData.icono} ${sectorData.nombre}</li>` : ''}
                </ul>
            </div>
        `;
        
        if (puertas.length > 0) {
            html += `
                <div class="detalle-puertas">
                    <h5>🚪 PUERTAS GIRATORIAS</h5>
                    <ul>
                        ${puertas.map(p => `<li><strong>${p.persona}</strong>: ${p.cargo_publico} → ${p.cargo_privado} (${p.desde})</li>`).join('')}
                    </ul>
                    <p class="fuente-datos">📚 Fuente: Registro de Lobbies · CNMV</p>
                </div>
            `;
        }
        
        if (donaciones.length > 0) {
            html += `
                <div class="detalle-donaciones">
                    <h5>💰 DONACIONES POLÍTICAS</h5>
                    <ul>
                        ${donaciones.map(d => `<li>${d.año}: ${d.cantidad} (${d.partido})</li>`).join('')}
                    </ul>
                    <p class="fuente-datos">📚 Fuente: Tribunal de Cuentas · Registro de Donaciones</p>
                </div>
            `;
        }
        
        if (contratos.length > 0) {
            html += `
                <div class="detalle-contratos">
                    <h5>📋 CONTRATOS PÚBLICOS</h5>
                    <ul>
                        ${contratos.map(c => `<li>${c.año}: ${c.concepto} · ${c.importe} (${c.entidad})</li>`).join('')}
                    </ul>
                    <p class="fuente-datos">📚 Fuente: Plataforma de Contratación del Sector Público</p>
                </div>
            `;
        }
        
        html += `
            <div class="detalle-accion">
                <button class="btn-simular-empresa" data-emp="${id}" data-nombre="${entidad.nombre}">
                    🎮 Simular impacto de ${entidad.nombre}
                </button>
            </div>
        `;
        
        return html;
    },
    
    renderizarDetalleOrganizacion: function(id, entidad) {
        return `
            <div class="detalle-datos">
                <h5>📊 DATOS ORGANIZACIÓN</h5>
                <ul>
                    <li>👥 Miembros: ${entidad.miembros}</li>
                    <li>🏷️ Tipo: ${entidad.tipo}</li>
                </ul>
            </div>
            <div class="detalle-accion">
                <button class="btn-simular-organizacion" data-org="${id}">
                    🎮 Simular membresía
                </button>
            </div>
        `;
    },
    
    renderizarDetalleSector: function(id, entidad) {
        const empresasSector = entidad.empresas || [];
        return `
            <div class="detalle-datos">
                <h5>📊 SECTOR ${entidad.nombre}</h5>
                <ul>
                    <li>📊 Empresas principales: ${empresasSector.length}</li>
                </ul>
            </div>
            <div class="detalle-conexiones">
                <h5>💼 EMPRESAS DESTACADAS</h5>
                <div class="conexiones-lista">
                    ${empresasSector.map(empId => {
                        const emp = this.empresas[empId];
                        return emp ? `<span class="conexion-tag empresa-tag" data-emp-id="${empId}">${emp.icono} ${emp.nombre}</span>` : '';
                    }).join('')}
                </div>
            </div>
        `;
    },
    
     // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    
    getIconoPorTipo: function(tipo) {
        const iconos = {
            gobierno: '🏛️',
            empresa: '💼',
            organizacion: '🤝',
            sector: '🏭'
        };
        return iconos[tipo] || '📌';
    },
    
    getTipoTexto: function(tipo) {
        const textos = {
            gobierno: 'Estado',
            empresa: 'Corporación',
            organizacion: 'Organización Internacional',
            sector: 'Sector Económico'
        };
        return textos[tipo] || tipo;
    },
    
    toggle: function() {
        const panel = document.getElementById('relaciones-globales-panel');
        if (panel) {
            this.visible = !this.visible;
            panel.style.display = this.visible ? 'block' : 'none';
        }
    },
    
    mostrar: function() {
        const panel = document.getElementById('relaciones-globales-panel');
        if (panel) {
            this.visible = true;
            panel.style.display = 'block';
        }
    },
    
    ocultar: function() {
        const panel = document.getElementById('relaciones-globales-panel');
        if (panel) {
            this.visible = false;
            panel.style.display = 'none';
        }
    }
};

// Configurar eventos delegados para clics en tags
document.addEventListener('click', (e) => {
    // Clic en empresa tag dentro del detalle
    if (e.target.classList.contains('empresa-tag') && e.target.dataset.empId) {
        const empId = e.target.dataset.empId;
        UIRelacionesGlobales.mostrarDetalle(empId, 'empresa');
    }
    
    // Clic en organización tag
    if (e.target.classList.contains('org-tag') && e.target.dataset.orgId) {
        const orgId = e.target.dataset.orgId;
        UIRelacionesGlobales.mostrarDetalle(orgId, 'organizacion');
    }
    
    // Botón simular empresa
    if (e.target.classList.contains('btn-simular-empresa')) {
        const nombre = e.target.dataset.nombre;
        if (window.UISimulador && window.GestorModo) {
            if (window.GestorModo.esModoJuego()) {
                document.getElementById('escenario-input').value = `simular impacto de ${nombre} en la economía`;
                window.UISimulador.simular();
                document.getElementById('simulador-panel').scrollIntoView({ behavior: 'smooth' });
            } else {
                window.GestorModo.cambiarModo('juego');
                setTimeout(() => {
                    document.getElementById('escenario-input').value = `simular impacto de ${nombre} en la economía`;
                    window.UISimulador.simular();
                }, 100);
            }
        }
    }
});

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIRelacionesGlobales.init());
} else {
    UIRelacionesGlobales.init();
}

window.UIRelacionesGlobales = UIRelacionesGlobales;
