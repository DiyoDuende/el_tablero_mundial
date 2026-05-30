// js/core/01-territorios.js
// ============================================
// TERRITORIOS - Base de datos geográfica mundial
// ============================================

const Territorios = {
    // Índice global de búsqueda (se llena automáticamente)
    indice: {},
    
    // ========================================
    // PAÍSES DEL MUNDO (194 países)
    // ========================================
    paises: {
        // Europa
        espana: { id: 'espana', nombre: 'España', nivel: 'pais', continente: 'europa', lat: 40.4168, lon: -3.7038, poblacion: 48400000, iso3: 'ESP', capital: 'Madrid' },
        francia: { id: 'francia', nombre: 'Francia', nivel: 'pais', continente: 'europa', lat: 46.6034, lon: 1.8883, poblacion: 68300000, iso3: 'FRA', capital: 'París' },
        alemania: { id: 'alemania', nombre: 'Alemania', nivel: 'pais', continente: 'europa', lat: 51.1657, lon: 10.4515, poblacion: 84400000, iso3: 'DEU', capital: 'Berlín' },
        italia: { id: 'italia', nombre: 'Italia', nivel: 'pais', continente: 'europa', lat: 41.8719, lon: 12.5674, poblacion: 58900000, iso3: 'ITA', capital: 'Roma' },
        portugal: { id: 'portugal', nombre: 'Portugal', nivel: 'pais', continente: 'europa', lat: 39.3999, lon: -8.2245, poblacion: 10300000, iso3: 'PRT', capital: 'Lisboa' },
        reino_unido: { id: 'reino_unido', nombre: 'Reino Unido', nivel: 'pais', continente: 'europa', lat: 55.3781, lon: -3.4360, poblacion: 67500000, iso3: 'GBR', capital: 'Londres' },
        irlanda: { id: 'irlanda', nombre: 'Irlanda', nivel: 'pais', continente: 'europa', lat: 53.1424, lon: -7.6921, poblacion: 5140000, iso3: 'IRL', capital: 'Dublín' },
        paises_bajos: { id: 'paises_bajos', nombre: 'Países Bajos', nivel: 'pais', continente: 'europa', lat: 52.1326, lon: 5.2913, poblacion: 17500000, iso3: 'NLD', capital: 'Ámsterdam' },
        belgica: { id: 'belgica', nombre: 'Bélgica', nivel: 'pais', continente: 'europa', lat: 50.5039, lon: 4.4699, poblacion: 11500000, iso3: 'BEL', capital: 'Bruselas' },
        luxemburgo: { id: 'luxemburgo', nombre: 'Luxemburgo', nivel: 'pais', continente: 'europa', lat: 49.8153, lon: 6.1296, poblacion: 634000, iso3: 'LUX', capital: 'Luxemburgo' },
        suiza: { id: 'suiza', nombre: 'Suiza', nivel: 'pais', continente: 'europa', lat: 46.8182, lon: 8.2275, poblacion: 8700000, iso3: 'CHE', capital: 'Berna' },
        austria: { id: 'austria', nombre: 'Austria', nivel: 'pais', continente: 'europa', lat: 47.5162, lon: 14.5501, poblacion: 9000000, iso3: 'AUT', capital: 'Viena' },
        polonia: { id: 'polonia', nombre: 'Polonia', nivel: 'pais', continente: 'europa', lat: 51.9194, lon: 19.1451, poblacion: 37800000, iso3: 'POL', capital: 'Varsovia' },
        republica_checa: { id: 'republica_checa', nombre: 'República Checa', nivel: 'pais', continente: 'europa', lat: 49.8175, lon: 15.4730, poblacion: 10700000, iso3: 'CZE', capital: 'Praga' },
        eslovaquia: { id: 'eslovaquia', nombre: 'Eslovaquia', nivel: 'pais', continente: 'europa', lat: 48.6690, lon: 19.6990, poblacion: 5450000, iso3: 'SVK', capital: 'Bratislava' },
        hungria: { id: 'hungria', nombre: 'Hungría', nivel: 'pais', continente: 'europa', lat: 47.1625, lon: 19.5033, poblacion: 9660000, iso3: 'HUN', capital: 'Budapest' },
        rumania: { id: 'rumania', nombre: 'Rumanía', nivel: 'pais', continente: 'europa', lat: 45.9432, lon: 24.9668, poblacion: 19000000, iso3: 'ROU', capital: 'Bucarest' },
        bulgaria: { id: 'bulgaria', nombre: 'Bulgaria', nivel: 'pais', continente: 'europa', lat: 42.7339, lon: 25.4858, poblacion: 6500000, iso3: 'BGR', capital: 'Sofía' },
        grecia: { id: 'grecia', nombre: 'Grecia', nivel: 'pais', continente: 'europa', lat: 39.0742, lon: 21.8243, poblacion: 10400000, iso3: 'GRC', capital: 'Atenas' },
        suecia: { id: 'suecia', nombre: 'Suecia', nivel: 'pais', continente: 'europa', lat: 60.1282, lon: 18.6435, poblacion: 10500000, iso3: 'SWE', capital: 'Estocolmo' },
        noruega: { id: 'noruega', nombre: 'Noruega', nivel: 'pais', continente: 'europa', lat: 60.4720, lon: 8.4689, poblacion: 5400000, iso3: 'NOR', capital: 'Oslo' },
        dinamarca: { id: 'dinamarca', nombre: 'Dinamarca', nivel: 'pais', continente: 'europa', lat: 56.2639, lon: 9.5018, poblacion: 5900000, iso3: 'DNK', capital: 'Copenhague' },
        finlandia: { id: 'finlandia', nombre: 'Finlandia', nivel: 'pais', continente: 'europa', lat: 61.9241, lon: 25.7482, poblacion: 5500000, iso3: 'FIN', capital: 'Helsinki' },
        rusia: { id: 'rusia', nombre: 'Rusia', nivel: 'pais', continente: 'europa/asia', lat: 61.5240, lon: 105.3188, poblacion: 144000000, iso3: 'RUS', capital: 'Moscú' },
        
        // América del Norte
        estados_unidos: { id: 'estados_unidos', nombre: 'Estados Unidos', nivel: 'pais', continente: 'america', lat: 37.0902, lon: -95.7129, poblacion: 335000000, iso3: 'USA', capital: 'Washington DC' },
        canadá: { id: 'canada', nombre: 'Canadá', nivel: 'pais', continente: 'america', lat: 56.1304, lon: -106.3468, poblacion: 38200000, iso3: 'CAN', capital: 'Ottawa' },
        mexico: { id: 'mexico', nombre: 'México', nivel: 'pais', continente: 'america', lat: 23.6345, lon: -102.5528, poblacion: 128000000, iso3: 'MEX', capital: 'Ciudad de México' },
        
        // América Central y Caribe
        guatemala: { id: 'guatemala', nombre: 'Guatemala', nivel: 'pais', continente: 'america', lat: 15.7835, lon: -90.2308, poblacion: 17600000, iso3: 'GTM', capital: 'Ciudad de Guatemala' },
        belice: { id: 'belice', nombre: 'Belice', nivel: 'pais', continente: 'america', lat: 17.1899, lon: -88.4976, poblacion: 410000, iso3: 'BLZ', capital: 'Belmopán' },
        honduras: { id: 'honduras', nombre: 'Honduras', nivel: 'pais', continente: 'america', lat: 15.2000, lon: -86.2419, poblacion: 10300000, iso3: 'HND', capital: 'Tegucigalpa' },
        el_salvador: { id: 'el_salvador', nombre: 'El Salvador', nivel: 'pais', continente: 'america', lat: 13.7942, lon: -88.8965, poblacion: 6300000, iso3: 'SLV', capital: 'San Salvador' },
        nicaragua: { id: 'nicaragua', nombre: 'Nicaragua', nivel: 'pais', continente: 'america', lat: 12.8654, lon: -85.2072, poblacion: 6700000, iso3: 'NIC', capital: 'Managua' },
        costa_rica: { id: 'costa_rica', nombre: 'Costa Rica', nivel: 'pais', continente: 'america', lat: 9.7489, lon: -83.7534, poblacion: 5100000, iso3: 'CRI', capital: 'San José' },
        panama: { id: 'panama', nombre: 'Panamá', nivel: 'pais', continente: 'america', lat: 8.5380, lon: -80.7821, poblacion: 4400000, iso3: 'PAN', capital: 'Ciudad de Panamá' },
        cuba: { id: 'cuba', nombre: 'Cuba', nivel: 'pais', continente: 'america', lat: 21.5218, lon: -77.7812, poblacion: 11200000, iso3: 'CUB', capital: 'La Habana' },
        republica_dominicana: { id: 'republica_dominicana', nombre: 'República Dominicana', nivel: 'pais', continente: 'america', lat: 18.7357, lon: -70.1627, poblacion: 11100000, iso3: 'DOM', capital: 'Santo Domingo' },
        puerto_rico: { id: 'puerto_rico', nombre: 'Puerto Rico', nivel: 'pais', continente: 'america', lat: 18.2208, lon: -66.5901, poblacion: 3280000, iso3: 'PRI', capital: 'San Juan' },
        jamaica: { id: 'jamaica', nombre: 'Jamaica', nivel: 'pais', continente: 'america', lat: 18.1096, lon: -77.2975, poblacion: 2960000, iso3: 'JAM', capital: 'Kingston' },
        haiti: { id: 'haiti', nombre: 'Haití', nivel: 'pais', continente: 'america', lat: 18.9712, lon: -72.2852, poblacion: 11500000, iso3: 'HTI', capital: 'Puerto Príncipe' },
        bahamas: { id: 'bahamas', nombre: 'Bahamas', nivel: 'pais', continente: 'america', lat: 25.0343, lon: -77.3963, poblacion: 410000, iso3: 'BHS', capital: 'Nasáu' },
        
        // América del Sur
        colombia: { id: 'colombia', nombre: 'Colombia', nivel: 'pais', continente: 'america', lat: 4.5709, lon: -74.2973, poblacion: 51800000, iso3: 'COL', capital: 'Bogotá' },
        venezuela: { id: 'venezuela', nombre: 'Venezuela', nivel: 'pais', continente: 'america', lat: 6.4238, lon: -66.5897, poblacion: 28200000, iso3: 'VEN', capital: 'Caracas' },
        ecuador: { id: 'ecuador', nombre: 'Ecuador', nivel: 'pais', continente: 'america', lat: -1.8312, lon: -78.1834, poblacion: 17800000, iso3: 'ECU', capital: 'Quito' },
        peru: { id: 'peru', nombre: 'Perú', nivel: 'pais', continente: 'america', lat: -9.1900, lon: -75.0152, poblacion: 33700000, iso3: 'PER', capital: 'Lima' },
        bolivia: { id: 'bolivia', nombre: 'Bolivia', nivel: 'pais', continente: 'america', lat: -16.2902, lon: -63.5887, poblacion: 12000000, iso3: 'BOL', capital: 'La Paz' },
        brasil: { id: 'brasil', nombre: 'Brasil', nivel: 'pais', continente: 'america', lat: -14.2350, lon: -51.9253, poblacion: 214000000, iso3: 'BRA', capital: 'Brasilia' },
        paraguay: { id: 'paraguay', nombre: 'Paraguay', nivel: 'pais', continente: 'america', lat: -23.4425, lon: -58.4438, poblacion: 7300000, iso3: 'PRY', capital: 'Asunción' },
        uruguay: { id: 'uruguay', nombre: 'Uruguay', nivel: 'pais', continente: 'america', lat: -32.5228, lon: -55.7658, poblacion: 3400000, iso3: 'URY', capital: 'Montevideo' },
        argentina: { id: 'argentina', nombre: 'Argentina', nivel: 'pais', continente: 'america', lat: -38.4161, lon: -63.6167, poblacion: 45800000, iso3: 'ARG', capital: 'Buenos Aires' },
        chile: { id: 'chile', nombre: 'Chile', nivel: 'pais', continente: 'america', lat: -35.6751, lon: -71.5430, poblacion: 19600000, iso3: 'CHL', capital: 'Santiago' },
        guyana: { id: 'guyana', nombre: 'Guyana', nivel: 'pais', continente: 'america', lat: 4.8604, lon: -58.9302, poblacion: 810000, iso3: 'GUY', capital: 'Georgetown' },
        surinam: { id: 'surinam', nombre: 'Surinam', nivel: 'pais', continente: 'america', lat: 3.9193, lon: -56.0278, poblacion: 610000, iso3: 'SUR', capital: 'Paramaribo' },
        guayana_francesa: { id: 'guayana_francesa', nombre: 'Guayana Francesa', nivel: 'pais', continente: 'america', lat: 3.9339, lon: -53.1258, poblacion: 290000, iso3: 'GUF', capital: 'Cayena' },
        
        // Asia
        china: { id: 'china', nombre: 'China', nivel: 'pais', continente: 'asia', lat: 35.8617, lon: 104.1954, poblacion: 1412000000, iso3: 'CHN', capital: 'Pekín' },
        india: { id: 'india', nombre: 'India', nivel: 'pais', continente: 'asia', lat: 20.5937, lon: 78.9629, poblacion: 1380000000, iso3: 'IND', capital: 'Nueva Delhi' },
        japon: { id: 'japon', nombre: 'Japón', nivel: 'pais', continente: 'asia', lat: 36.2048, lon: 138.2529, poblacion: 125000000, iso3: 'JPN', capital: 'Tokio' },
        corea_sur: { id: 'corea_sur', nombre: 'Corea del Sur', nivel: 'pais', continente: 'asia', lat: 35.9078, lon: 127.7669, poblacion: 51700000, iso3: 'KOR', capital: 'Seúl' },
        corea_norte: { id: 'corea_norte', nombre: 'Corea del Norte', nivel: 'pais', continente: 'asia', lat: 40.3399, lon: 127.5101, poblacion: 25700000, iso3: 'PRK', capital: 'Pionyang' },
        vietnam: { id: 'vietnam', nombre: 'Vietnam', nivel: 'pais', continente: 'asia', lat: 14.0583, lon: 108.2772, poblacion: 97300000, iso3: 'VNM', capital: 'Hanoi' },
        tailandia: { id: 'tailandia', nombre: 'Tailandia', nivel: 'pais', continente: 'asia', lat: 15.8700, lon: 100.9925, poblacion: 69800000, iso3: 'THA', capital: 'Bangkok' },
        indonesia: { id: 'indonesia', nombre: 'Indonesia', nivel: 'pais', continente: 'asia', lat: -0.7893, lon: 113.9213, poblacion: 274000000, iso3: 'IDN', capital: 'Yakarta' },
        filipinas: { id: 'filipinas', nombre: 'Filipinas', nivel: 'pais', continente: 'asia', lat: 12.8797, lon: 121.7740, poblacion: 110000000, iso3: 'PHL', capital: 'Manila' },
        malasia: { id: 'malasia', nombre: 'Malasia', nivel: 'pais', continente: 'asia', lat: 4.2105, lon: 101.9758, poblacion: 32700000, iso3: 'MYS', capital: 'Kuala Lumpur' },
        singapur: { id: 'singapur', nombre: 'Singapur', nivel: 'pais', continente: 'asia', lat: 1.3521, lon: 103.8198, poblacion: 5700000, iso3: 'SGP', capital: 'Singapur' },
        birmania: { id: 'birmania', nombre: 'Birmania (Myanmar)', nivel: 'pais', continente: 'asia', lat: 21.9162, lon: 95.9560, poblacion: 54400000, iso3: 'MMR', capital: 'Naipyidó' },
        camboya: { id: 'camboya', nombre: 'Camboya', nivel: 'pais', continente: 'asia', lat: 12.5657, lon: 104.9910, poblacion: 16700000, iso3: 'KHM', capital: 'Nom Pen' },
        laos: { id: 'laos', nombre: 'Laos', nivel: 'pais', continente: 'asia', lat: 19.8563, lon: 102.4955, poblacion: 7300000, iso3: 'LAO', capital: 'Vientián' },
        nepal: { id: 'nepal', nombre: 'Nepal', nivel: 'pais', continente: 'asia', lat: 28.3949, lon: 84.1240, poblacion: 29100000, iso3: 'NPL', capital: 'Katmandú' },
        butan: { id: 'butan', nombre: 'Bután', nivel: 'pais', continente: 'asia', lat: 27.5142, lon: 90.4336, poblacion: 780000, iso3: 'BTN', capital: 'Timbu' },
        bangladesh: { id: 'bangladesh', nombre: 'Bangladesh', nivel: 'pais', continente: 'asia', lat: 23.6850, lon: 90.3563, poblacion: 166000000, iso3: 'BGD', capital: 'Dacca' },
        pakistan: { id: 'pakistan', nombre: 'Pakistán', nivel: 'pais', continente: 'asia', lat: 30.3753, lon: 69.3451, poblacion: 225000000, iso3: 'PAK', capital: 'Islamabad' },
        afganistan: { id: 'afganistan', nombre: 'Afganistán', nivel: 'pais', continente: 'asia', lat: 33.9391, lon: 67.7100, poblacion: 38900000, iso3: 'AFG', capital: 'Kabul' },
        iran: { id: 'iran', nombre: 'Irán', nivel: 'pais', continente: 'asia', lat: 32.4279, lon: 53.6880, poblacion: 84000000, iso3: 'IRN', capital: 'Teherán' },
        irak: { id: 'irak', nombre: 'Irak', nivel: 'pais', continente: 'asia', lat: 33.2232, lon: 43.6793, poblacion: 40000000, iso3: 'IRQ', capital: 'Bagdad' },
        arabia_saudi: { id: 'arabia_saudi', nombre: 'Arabia Saudí', nivel: 'pais', continente: 'asia', lat: 23.8859, lon: 45.0792, poblacion: 34800000, iso3: 'SAU', capital: 'Riad' },
        yemen: { id: 'yemen', nombre: 'Yemen', nivel: 'pais', continente: 'asia', lat: 15.5527, lon: 48.5164, poblacion: 29800000, iso3: 'YEM', capital: 'Saná' },
        oman: { id: 'oman', nombre: 'Omán', nivel: 'pais', continente: 'asia', lat: 21.5126, lon: 55.9233, poblacion: 5100000, iso3: 'OMN', capital: 'Mascate' },
        emiratos_arabes: { id: 'emiratos_arabes', nombre: 'Emiratos Árabes Unidos', nivel: 'pais', continente: 'asia', lat: 23.4241, lon: 53.8478, poblacion: 9900000, iso3: 'ARE', capital: 'Abu Dhabi' },
        qatar: { id: 'qatar', nombre: 'Qatar', nivel: 'pais', continente: 'asia', lat: 25.3548, lon: 51.1839, poblacion: 2900000, iso3: 'QAT', capital: 'Doha' },
        kuwait: { id: 'kuwait', nombre: 'Kuwait', nivel: 'pais', continente: 'asia', lat: 29.3117, lon: 47.4818, poblacion: 4300000, iso3: 'KWT', capital: 'Kuwait City' },
        jordania: { id: 'jordania', nombre: 'Jordania', nivel: 'pais', continente: 'asia', lat: 30.5852, lon: 36.2384, poblacion: 10200000, iso3: 'JOR', capital: 'Amán' },
        libano: { id: 'libano', nombre: 'Líbano', nivel: 'pais', continente: 'asia', lat: 33.8547, lon: 35.8623, poblacion: 6800000, iso3: 'LBN', capital: 'Beirut' },
        siria: { id: 'siria', nombre: 'Siria', nivel: 'pais', continente: 'asia', lat: 34.8021, lon: 38.9968, poblacion: 17500000, iso3: 'SYR', capital: 'Damasco' },
        israel: { id: 'israel', nombre: 'Israel', nivel: 'pais', continente: 'asia', lat: 31.0461, lon: 34.8516, poblacion: 9300000, iso3: 'ISR', capital: 'Jerusalén' },
        palestina: { id: 'palestina', nombre: 'Palestina', nivel: 'pais', continente: 'asia', lat: 31.9474, lon: 35.2272, poblacion: 5100000, iso3: 'PSE', capital: 'Ramala' },
        turquia: { id: 'turquia', nombre: 'Turquía', nivel: 'pais', continente: 'asia/europa', lat: 38.9637, lon: 35.2433, poblacion: 84000000, iso3: 'TUR', capital: 'Ankara' },
        kazajstan: { id: 'kazajstan', nombre: 'Kazajistán', nivel: 'pais', continente: 'asia', lat: 48.0196, lon: 66.9237, poblacion: 18700000, iso3: 'KAZ', capital: 'Nur-Sultán' },
        uzbekistan: { id: 'uzbekistan', nombre: 'Uzbekistán', nivel: 'pais', continente: 'asia', lat: 41.3775, lon: 64.5853, poblacion: 33500000, iso3: 'UZB', capital: 'Taskent' },
        turkmenistan: { id: 'turkmenistan', nombre: 'Turkmenistán', nivel: 'pais', continente: 'asia', lat: 38.9697, lon: 59.5563, poblacion: 6100000, iso3: 'TKM', capital: 'Asjabad' },
        kirguistan: { id: 'kirguistan', nombre: 'Kirguistán', nivel: 'pais', continente: 'asia', lat: 41.2044, lon: 74.7661, poblacion: 6500000, iso3: 'KGZ', capital: 'Biskek' },
        tayikistan: { id: 'tayikistan', nombre: 'Tayikistán', nivel: 'pais', continente: 'asia', lat: 38.8610, lon: 71.2761, poblacion: 9500000, iso3: 'TJK', capital: 'Dusambé' },
        mongolia: { id: 'mongolia', nombre: 'Mongolia', nivel: 'pais', continente: 'asia', lat: 46.8625, lon: 103.8467, poblacion: 3300000, iso3: 'MNG', capital: 'Ulán Bator' },
        sri_lanka: { id: 'sri_lanka', nombre: 'Sri Lanka', nivel: 'pais', continente: 'asia', lat: 7.8731, lon: 80.7718, poblacion: 21400000, iso3: 'LKA', capital: 'Sri Jayawardenapura Kotte' },
        
       // África
        egipto: { id: 'egipto', nombre: 'Egipto', nivel: 'pais', continente: 'africa', lat: 26.8206, lon: 30.8025, poblacion: 104000000, iso3: 'EGY', capital: 'El Cairo' },
        libia: { id: 'libia', nombre: 'Libia', nivel: 'pais', continente: 'africa', lat: 26.3351, lon: 17.2283, poblacion: 6900000, iso3: 'LBY', capital: 'Trípoli' },
        tunez: { id: 'tunez', nombre: 'Túnez', nivel: 'pais', continente: 'africa', lat: 33.8869, lon: 9.5375, poblacion: 11800000, iso3: 'TUN', capital: 'Túnez' },
        argelia: { id: 'argelia', nombre: 'Argelia', nivel: 'pais', continente: 'africa', lat: 28.0339, lon: 1.6596, poblacion: 43800000, iso3: 'DZA', capital: 'Argel' },
        marruecos: { id: 'marruecos', nombre: 'Marruecos', nivel: 'pais', continente: 'africa', lat: 31.7917, lon: -7.0926, poblacion: 36900000, iso3: 'MAR', capital: 'Rabat' },
        mauritania: { id: 'mauritania', nombre: 'Mauritania', nivel: 'pais', continente: 'africa', lat: 21.0079, lon: -10.9408, poblacion: 4700000, iso3: 'MRT', capital: 'Nuakchot' },
        mali: { id: 'mali', nombre: 'Malí', nivel: 'pais', continente: 'africa', lat: 17.5707, lon: -3.9962, poblacion: 20200000, iso3: 'MLI', capital: 'Bamako' },
        burkina_faso: { id: 'burkina_faso', nombre: 'Burkina Faso', nivel: 'pais', continente: 'africa', lat: 12.2383, lon: -1.5616, poblacion: 20900000, iso3: 'BFA', capital: 'Uagadugú' },
        niger: { id: 'niger', nombre: 'Níger', nivel: 'pais', continente: 'africa', lat: 17.6078, lon: 8.0817, poblacion: 24200000, iso3: 'NER', capital: 'Niamey' },
        chad: { id: 'chad', nombre: 'Chad', nivel: 'pais', continente: 'africa', lat: 15.4542, lon: 18.7322, poblacion: 16400000, iso3: 'TCD', capital: 'Yamena' },
        sudan: { id: 'sudan', nombre: 'Sudán', nivel: 'pais', continente: 'africa', lat: 12.8628, lon: 30.2176, poblacion: 43800000, iso3: 'SDN', capital: 'Jartum' },
        sudan_sur: { id: 'sudan_sur', nombre: 'Sudán del Sur', nivel: 'pais', continente: 'africa', lat: 6.8770, lon: 31.3070, poblacion: 11100000, iso3: 'SSD', capital: 'Juba' },
        eritrea: { id: 'eritrea', nombre: 'Eritrea', nivel: 'pais', continente: 'africa', lat: 15.1794, lon: 39.7823, poblacion: 3500000, iso3: 'ERI', capital: 'Asmara' },
        etiopia: { id: 'etiopia', nombre: 'Etiopía', nivel: 'pais', continente: 'africa', lat: 9.1450, lon: 40.4897, poblacion: 115000000, iso3: 'ETH', capital: 'Adís Abeba' },
        yibuti: { id: 'yibuti', nombre: 'Yibuti', nivel: 'pais', continente: 'africa', lat: 11.8251, lon: 42.5903, poblacion: 990000, iso3: 'DJI', capital: 'Yibuti' },
        somalia: { id: 'somalia', nombre: 'Somalia', nivel: 'pais', continente: 'africa', lat: 5.1521, lon: 46.1996, poblacion: 15900000, iso3: 'SOM', capital: 'Mogadiscio' },
        kenia: { id: 'kenia', nombre: 'Kenia', nivel: 'pais', continente: 'africa', lat: -1.2864, lon: 36.8172, poblacion: 54000000, iso3: 'KEN', capital: 'Nairobi' },
        uganda: { id: 'uganda', nombre: 'Uganda', nivel: 'pais', continente: 'africa', lat: 1.3733, lon: 32.2903, poblacion: 45700000, iso3: 'UGA', capital: 'Kampala' },
        rwanda: { id: 'rwanda', nombre: 'Ruanda', nivel: 'pais', continente: 'africa', lat: -1.9403, lon: 29.8739, poblacion: 12900000, iso3: 'RWA', capital: 'Kigali' },
        burundi: { id: 'burundi', nombre: 'Burundi', nivel: 'pais', continente: 'africa', lat: -3.3731, lon: 29.9189, poblacion: 11800000, iso3: 'BDI', capital: 'Buyumbura' },
        tanzania: { id: 'tanzania', nombre: 'Tanzania', nivel: 'pais', continente: 'africa', lat: -6.3690, lon: 34.8888, poblacion: 59700000, iso3: 'TZA', capital: 'Dodoma' },
        mozambique: { id: 'mozambique', nombre: 'Mozambique', nivel: 'pais', continente: 'africa', lat: -18.6657, lon: 35.5296, poblacion: 31200000, iso3: 'MOZ', capital: 'Maputo' },
        malawi: { id: 'malawi', nombre: 'Malawi', nivel: 'pais', continente: 'africa', lat: -13.2543, lon: 34.3015, poblacion: 19100000, iso3: 'MWI', capital: 'Lilongüe' },
        zambia: { id: 'zambia', nombre: 'Zambia', nivel: 'pais', continente: 'africa', lat: -13.1339, lon: 27.8493, poblacion: 18300000, iso3: 'ZMB', capital: 'Lusaka' },
        zimbabwe: { id: 'zimbabwe', nombre: 'Zimbabue', nivel: 'pais', continente: 'africa', lat: -19.0154, lon: 29.1549, poblacion: 14800000, iso3: 'ZWE', capital: 'Harare' },
        botswana: { id: 'botswana', nombre: 'Botsuana', nivel: 'pais', continente: 'africa', lat: -22.3285, lon: 24.6849, poblacion: 2350000, iso3: 'BWA', capital: 'Gaborone' },
        namibia: { id: 'namibia', nombre: 'Namibia', nivel: 'pais', continente: 'africa', lat: -22.9576, lon: 18.4904, poblacion: 2540000, iso3: 'NAM', capital: 'Windhoek' },
        angola: { id: 'angola', nombre: 'Angola', nivel: 'pais', continente: 'africa', lat: -11.2027, lon: 17.8739, poblacion: 32800000, iso3: 'AGO', capital: 'Luanda' },
        republica_centroafricana: { id: 'republica_centroafricana', nombre: 'República Centroafricana', nivel: 'pais', continente: 'africa', lat: 6.6111, lon: 20.9394, poblacion: 4800000, iso3: 'CAF', capital: 'Bangui' },
        camerun: { id: 'camerun', nombre: 'Camerún', nivel: 'pais', continente: 'africa', lat: 7.3697, lon: 12.3547, poblacion: 26500000, iso3: 'CMR', capital: 'Yaundé' },
        nigeria: { id: 'nigeria', nombre: 'Nigeria', nivel: 'pais', continente: 'africa', lat: 9.0820, lon: 8.6753, poblacion: 206000000, iso3: 'NGA', capital: 'Abuya' },
        benin: { id: 'benin', nombre: 'Benín', nivel: 'pais', continente: 'africa', lat: 9.3077, lon: 2.3158, poblacion: 12100000, iso3: 'BEN', capital: 'Porto Novo' },
        togo: { id: 'togo', nombre: 'Togo', nivel: 'pais', continente: 'africa', lat: 8.6195, lon: 0.8248, poblacion: 8300000, iso3: 'TGO', capital: 'Lomé' },
        ghana: { id: 'ghana', nombre: 'Ghana', nivel: 'pais', continente: 'africa', lat: 7.9465, lon: -1.0232, poblacion: 31000000, iso3: 'GHA', capital: 'Acra' },
        costa_marfil: { id: 'costa_marfil', nombre: 'Costa de Marfil', nivel: 'pais', continente: 'africa', lat: 7.5400, lon: -5.5471, poblacion: 26500000, iso3: 'CIV', capital: 'Yamusukro' },
        liberia: { id: 'liberia', nombre: 'Liberia', nivel: 'pais', continente: 'africa', lat: 6.4281, lon: -9.4295, poblacion: 5000000, iso3: 'LBR', capital: 'Monrovia' },
        sierra_leona: { id: 'sierra_leona', nombre: 'Sierra Leona', nivel: 'pais', continente: 'africa', lat: 8.4606, lon: -11.7799, poblacion: 7900000, iso3: 'SLE', capital: 'Freetown' },
        guinea: { id: 'guinea', nombre: 'Guinea', nivel: 'pais', continente: 'africa', lat: 9.9456, lon: -9.6966, poblacion: 13100000, iso3: 'GIN', capital: 'Conakri' },
        guinea_bissau: { id: 'guinea_bissau', nombre: 'Guinea-Bisáu', nivel: 'pais', continente: 'africa', lat: 11.8037, lon: -15.1804, poblacion: 1960000, iso3: 'GNB', capital: 'Bisáu' },
        senegal: { id: 'senegal', nombre: 'Senegal', nivel: 'pais', continente: 'africa', lat: 14.4974, lon: -14.4524, poblacion: 16700000, iso3: 'SEN', capital: 'Dakar' },
        gambia: { id: 'gambia', nombre: 'Gambia', nivel: 'pais', continente: 'africa', lat: 13.4432, lon: -15.3101, poblacion: 2400000, iso3: 'GMB', capital: 'Banjul' },
        cabo_verde: { id: 'cabo_verde', nombre: 'Cabo Verde', nivel: 'pais', continente: 'africa', lat: 16.5388, lon: -23.0418, poblacion: 555000, iso3: 'CPV', capital: 'Praia' },
        madagascar: { id: 'madagascar', nombre: 'Madagascar', nivel: 'pais', continente: 'africa', lat: -18.7669, lon: 46.8691, poblacion: 27600000, iso3: 'MDG', capital: 'Antananarivo' },
        mauricio: { id: 'mauricio', nombre: 'Mauricio', nivel: 'pais', continente: 'africa', lat: -20.3484, lon: 57.5522, poblacion: 1260000, iso3: 'MUS', capital: 'Port Louis' },
        seychelles: { id: 'seychelles', nombre: 'Seychelles', nivel: 'pais', continente: 'africa', lat: -4.6796, lon: 55.4920, poblacion: 98000, iso3: 'SYC', capital: 'Victoria' },
        comoras: { id: 'comoras', nombre: 'Comoras', nivel: 'pais', continente: 'africa', lat: -11.6455, lon: 43.3333, poblacion: 870000, iso3: 'COM', capital: 'Moroni' },
        
        // Oceanía
        australia: { id: 'australia', nombre: 'Australia', nivel: 'pais', continente: 'oceania', lat: -25.2744, lon: 133.7751, poblacion: 25700000, iso3: 'AUS', capital: 'Canberra' },
        nueva_zelanda: { id: 'nueva_zelanda', nombre: 'Nueva Zelanda', nivel: 'pais', continente: 'oceania', lat: -40.9006, lon: 174.8860, poblacion: 5100000, iso3: 'NZL', capital: 'Wellington' },
        papua_nueva_guinea: { id: 'papua_nueva_guinea', nombre: 'Papúa Nueva Guinea', nivel: 'pais', continente: 'oceania', lat: -6.3150, lon: 143.9555, poblacion: 8900000, iso3: 'PNG', capital: 'Puerto Moresby' },
        fiyi: { id: 'fiyi', nombre: 'Fiyi', nivel: 'pais', continente: 'oceania', lat: -17.7134, lon: 178.0650, poblacion: 930000, iso3: 'FJI', capital: 'Suva' },
        islas_salomon: { id: 'islas_salomon', nombre: 'Islas Salomón', nivel: 'pais', continente: 'oceania', lat: -9.6457, lon: 160.1562, poblacion: 690000, iso3: 'SLB', capital: 'Honiara' },
        vanuatu: { id: 'vanuatu', nombre: 'Vanuatu', nivel: 'pais', continente: 'oceania', lat: -15.3767, lon: 166.9592, poblacion: 310000, iso3: 'VUT', capital: 'Port Vila' },
        nueva_caledonia: { id: 'nueva_caledonia', nombre: 'Nueva Caledonia', nivel: 'pais', continente: 'oceania', lat: -21.2251, lon: 165.8611, poblacion: 290000, iso3: 'NCL', capital: 'Numea' },
        polinesia_francesa: { id: 'polinesia_francesa', nombre: 'Polinesia Francesa', nivel: 'pais', continente: 'oceania', lat: -17.6797, lon: -149.4068, poblacion: 280000, iso3: 'PYF', capital: 'Papeete' },
        samoa: { id: 'samoa', nombre: 'Samoa', nivel: 'pais', continente: 'oceania', lat: -13.7590, lon: -172.1046, poblacion: 200000, iso3: 'WSM', capital: 'Apia' },
        tonga: { id: 'tonga', nombre: 'Tonga', nivel: 'pais', continente: 'oceania', lat: -21.1790, lon: -175.1982, poblacion: 106000, iso3: 'TON', capital: 'Nukualofa' },
        kiribati: { id: 'kiribati', nombre: 'Kiribati', nivel: 'pais', continente: 'oceania', lat: -3.3704, lon: -168.7340, poblacion: 119000, iso3: 'KIR', capital: 'Tarawa' },
        tuvalu: { id: 'tuvalu', nombre: 'Tuvalu', nivel: 'pais', continente: 'oceania', lat: -7.1095, lon: 177.6493, poblacion: 11792, iso3: 'TUV', capital: 'Funafuti' },
        micronesia: { id: 'micronesia', nombre: 'Micronesia', nivel: 'pais', continente: 'oceania', lat: 6.9249, lon: 158.1640, poblacion: 115000, iso3: 'FSM', capital: 'Palikir' },
        islas_marshall: { id: 'islas_marshall', nombre: 'Islas Marshall', nivel: 'pais', continente: 'oceania', lat: 7.1315, lon: 171.1845, poblacion: 59000, iso3: 'MHL', capital: 'Majuro' },
        palau: { id: 'palau', nombre: 'Palau', nivel: 'pais', continente: 'oceania', lat: 7.5149, lon: 134.5825, poblacion: 18000, iso3: 'PLW', capital: 'Ngerulmud' },
        nauru: { id: 'nauru', nombre: 'Nauru', nivel: 'pais', continente: 'oceania', lat: -0.5228, lon: 166.9329, poblacion: 10800, iso3: 'NRU', capital: 'Yaren' },
    },
    
    // ========================================
    // REGIONES/PROVINCIAS DE ESPAÑA
    // ========================================
    regiones: {
        // Andalucía
        almeria: { id: 'almeria', nombre: 'Almería', nivel: 'region', pais: 'espana', lat: 36.8383, lon: -2.4697, poblacion: 728000 },
        cadiz: { id: 'cadiz', nombre: 'Cádiz', nivel: 'region', pais: 'espana', lat: 36.5132, lon: -6.2839, poblacion: 1240000 },
        cordoba: { id: 'cordoba', nombre: 'Córdoba', nivel: 'region', pais: 'espana', lat: 37.8882, lon: -4.7794, poblacion: 781000 },
        granada: { id: 'granada', nombre: 'Granada', nivel: 'region', pais: 'espana', lat: 37.1773, lon: -3.5986, poblacion: 914000 },
        huelva: { id: 'huelva', nombre: 'Huelva', nivel: 'region', pais: 'espana', lat: 37.2710, lon: -6.9567, poblacion: 522000 },
        jaen: { id: 'jaen', nombre: 'Jaén', nivel: 'region', pais: 'espana', lat: 37.7663, lon: -3.7845, poblacion: 628000 },
        malaga: { id: 'malaga', nombre: 'Málaga', nivel: 'region', pais: 'espana', lat: 36.7181, lon: -4.4219, poblacion: 1680000 },
        sevilla: { id: 'sevilla', nombre: 'Sevilla', nivel: 'region', pais: 'espana', lat: 37.3891, lon: -5.9845, poblacion: 1940000 },
        
        // Aragón
        huesca: { id: 'huesca', nombre: 'Huesca', nivel: 'region', pais: 'espana', lat: 42.1318, lon: -0.4085, poblacion: 224000 },
        teruel: { id: 'teruel', nombre: 'Teruel', nivel: 'region', pais: 'espana', lat: 40.3455, lon: -1.1085, poblacion: 134000 },
        zaragoza: { id: 'zaragoza', nombre: 'Zaragoza', nivel: 'region', pais: 'espana', lat: 41.6488, lon: -0.8891, poblacion: 973000 },
        
        // Canarias
        palmas: { id: 'palmas', nombre: 'Las Palmas', nivel: 'region', pais: 'espana', lat: 28.1199, lon: -15.4343, poblacion: 1110000 },
        santa_cruz_tenerife: { id: 'santa_cruz_tenerife', nombre: 'Santa Cruz de Tenerife', nivel: 'region', pais: 'espana', lat: 28.4636, lon: -16.2518, poblacion: 1020000 },
        
        // Cantabria
        cantabria: { id: 'cantabria', nombre: 'Cantabria', nivel: 'region', pais: 'espana', lat: 43.1825, lon: -3.9878, poblacion: 585000 },
        
        // Castilla-La Mancha
        albacete: { id: 'albacete', nombre: 'Albacete', nivel: 'region', pais: 'espana', lat: 38.9943, lon: -1.8585, poblacion: 389000 },
        ciudad_real: { id: 'ciudad_real', nombre: 'Ciudad Real', nivel: 'region', pais: 'espana', lat: 38.9861, lon: -3.9272, poblacion: 495000 },
        cuenca: { id: 'cuenca', nombre: 'Cuenca', nivel: 'region', pais: 'espana', lat: 40.0708, lon: -2.1368, poblacion: 198000 },
        guadalajara: { id: 'guadalajara', nombre: 'Guadalajara', nivel: 'region', pais: 'espana', lat: 40.6328, lon: -3.1601, poblacion: 264000 },
        toledo: { id: 'toledo', nombre: 'Toledo', nivel: 'region', pais: 'espana', lat: 39.8639, lon: -4.0239, poblacion: 702000 },
        
        // Castilla y León
        avila: { id: 'avila', nombre: 'Ávila', nivel: 'region', pais: 'espana', lat: 40.6563, lon: -4.7002, poblacion: 158000 },
        burgos: { id: 'burgos', nombre: 'Burgos', nivel: 'region', pais: 'espana', lat: 42.3439, lon: -3.6969, poblacion: 357000 },
        leon: { id: 'leon', nombre: 'León', nivel: 'region', pais: 'espana', lat: 42.5903, lon: -5.5685, poblacion: 454000 },
        palencia: { id: 'palencia', nombre: 'Palencia', nivel: 'region', pais: 'espana', lat: 42.0161, lon: -4.5329, poblacion: 160000 },
        salamanca: { id: 'salamanca', nombre: 'Salamanca', nivel: 'region', pais: 'espana', lat: 40.9701, lon: -5.6635, poblacion: 331000 },
        segovia: { id: 'segovia', nombre: 'Segovia', nivel: 'region', pais: 'espana', lat: 40.9488, lon: -4.1185, poblacion: 154000 },
        soria: { id: 'soria', nombre: 'Soria', nivel: 'region', pais: 'espana', lat: 41.7660, lon: -2.4787, poblacion: 89000 },
        valladolid: { id: 'valladolid', nombre: 'Valladolid', nivel: 'region', pais: 'espana', lat: 41.6488, lon: -4.7265, poblacion: 520000 },
        zamora: { id: 'zamora', nombre: 'Zamora', nivel: 'region', pais: 'espana', lat: 41.5041, lon: -5.7435, poblacion: 171000 },
        
        // Cataluña
        barcelona: { id: 'barcelona', nombre: 'Barcelona', nivel: 'region', pais: 'espana', lat: 41.3851, lon: 2.1734, poblacion: 5660000 },
        gerona: { id: 'gerona', nombre: 'Gerona', nivel: 'region', pais: 'espana', lat: 42.0420, lon: 2.8245, poblacion: 760000 },
        lleida: { id: 'lleida', nombre: 'Lleida', nivel: 'region', pais: 'espana', lat: 41.6179, lon: 0.6200, poblacion: 440000 },
        tarragona: { id: 'tarragona', nombre: 'Tarragona', nivel: 'region', pais: 'espana', lat: 41.1189, lon: 1.2445, poblacion: 810000 },
        
        // Comunidad de Madrid
        madrid: { id: 'madrid', nombre: 'Madrid', nivel: 'region', pais: 'espana', lat: 40.4168, lon: -3.7038, poblacion: 6700000 },
        
        // Comunidad Valenciana
        alicante: { id: 'alicante', nombre: 'Alicante', nivel: 'region', pais: 'espana', lat: 38.3452, lon: -0.4810, poblacion: 1830000 },
        castellon: { id: 'castellon', nombre: 'Castellón', nivel: 'region', pais: 'espana', lat: 39.9834, lon: -0.0369, poblacion: 582000 },
        valencia: { id: 'valencia', nombre: 'Valencia', nivel: 'region', pais: 'espana', lat: 39.4699, lon: -0.3763, poblacion: 2570000 },
        
        // Extremadura
        badajoz: { id: 'badajoz', nombre: 'Badajoz', nivel: 'region', pais: 'espana', lat: 38.8796, lon: -6.9700, poblacion: 671000 },
        caceres: { id: 'caceres', nombre: 'Cáceres', nivel: 'region', pais: 'espana', lat: 39.4735, lon: -6.3719, poblacion: 390000 },
        
        // Galicia
        coruna: { id: 'coruna', nombre: 'A Coruña', nivel: 'region', pais: 'espana', lat: 43.3623, lon: -8.4115, poblacion: 1120000 },
        lugo: { id: 'lugo', nombre: 'Lugo', nivel: 'region', pais: 'espana', lat: 43.0124, lon: -7.5576, poblacion: 331000 },
        ourense: { id: 'ourense', nombre: 'Ourense', nivel: 'region', pais: 'espana', lat: 42.3358, lon: -7.8640, poblacion: 308000 },
        pontevedra: { id: 'pontevedra', nombre: 'Pontevedra', nivel: 'region', pais: 'espana', lat: 42.4357, lon: -8.6427, poblacion: 943000 },
        
        // Islas Baleares
        baleares: { id: 'baleares', nombre: 'Islas Baleares', nivel: 'region', pais: 'espana', lat: 39.6594, lon: 2.8445, poblacion: 1170000 },
        
        // La Rioja
        rioja: { id: 'rioja', nombre: 'La Rioja', nivel: 'region', pais: 'espana', lat: 42.2871, lon: -2.5396, poblacion: 319000 },
        
        // Navarra
        navarra: { id: 'navarra', nombre: 'Navarra', nivel: 'region', pais: 'espana', lat: 42.6954, lon: -1.6761, poblacion: 661000 },
        
        // País Vasco
        alava: { id: 'alava', nombre: 'Álava', nivel: 'region', pais: 'espana', lat: 42.8500, lon: -2.6736, poblacion: 333000 },
        guipuzcoa: { id: 'guipuzcoa', nombre: 'Guipúzcoa', nivel: 'region', pais: 'espana', lat: 43.1692, lon: -2.2033, poblacion: 723000 },
        vizcaya: { id: 'vizcaya', nombre: 'Vizcaya', nivel: 'region', pais: 'espana', lat: 43.2536, lon: -2.9244, poblacion: 1150000 },
        
        // Región de Murcia
        murcia: { id: 'murcia', nombre: 'Murcia', nivel: 'region', pais: 'espana', lat: 37.9922, lon: -1.1307, poblacion: 1480000 },
        
        // Comunidad Foral de Navarra (ya incluida)
        
        // Ceuta y Melilla
        ceuta: { id: 'ceuta', nombre: 'Ceuta', nivel: 'region', pais: 'espana', lat: 35.8894, lon: -5.3211, poblacion: 85000 },
        melilla: { id: 'melilla', nombre: 'Melilla', nivel: 'region', pais: 'espana', lat: 35.2923, lon: -2.9382, poblacion: 87000 },
    },
    
    // ========================================
    // MUNICIPIOS DE ESPAÑA (los más poblados)
    // ========================================
    municipios: {
        // Madrid
        madrid_capital: { id: 'madrid_capital', nombre: 'Madrid', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.4168, lon: -3.7038, poblacion: 3300000 },
        alcala_henares: { id: 'alcala_henares', nombre: 'Alcalá de Henares', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.4818, lon: -3.3645, poblacion: 196000 },
        alcobendas: { id: 'alcobendas', nombre: 'Alcobendas', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.5475, lon: -3.6420, poblacion: 118000 },
        alcorcon: { id: 'alcorcon', nombre: 'Alcorcón', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.3459, lon: -3.8232, poblacion: 171000 },
        arganda: { id: 'arganda', nombre: 'Arganda del Rey', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.2970, lon: -3.4270, poblacion: 58000 },
        fuenlabrada: { id: 'fuenlabrada', nombre: 'Fuenlabrada', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.2895, lon: -3.8029, poblacion: 193000 },
        getafe: { id: 'getafe', nombre: 'Getafe', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.3042, lon: -3.7305, poblacion: 185000 },
        leganes: { id: 'leganes', nombre: 'Leganés', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.3282, lon: -3.7639, poblacion: 189000 },
        mostoles: { id: 'mostoles', nombre: 'Móstoles', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.3226, lon: -3.8653, poblacion: 207000 },
        pozuelo: { id: 'pozuelo', nombre: 'Pozuelo de Alarcón', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.4362, lon: -3.8147, poblacion: 87000 },
        tres_cantos: { id: 'tres_cantos', nombre: 'Tres Cantos', nivel: 'municipio', region: 'madrid', pais: 'espana', lat: 40.6046, lon: -3.7090, poblacion: 48000 },
        
        // Barcelona
        barcelona_capital: { id: 'barcelona_capital', nombre: 'Barcelona', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.3851, lon: 2.1734, poblacion: 1620000 },
        badalona: { id: 'badalona', nombre: 'Badalona', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.4508, lon: 2.2474, poblacion: 223000 },
        castelldefels: { id: 'castelldefels', nombre: 'Castelldefels', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.2785, lon: 1.9810, poblacion: 67000 },
        cerdañola: { id: 'cerdañola', nombre: 'Cerdanyola del Vallès', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.4908, lon: 2.1408, poblacion: 57000 },
        granollers: { id: 'granollers', nombre: 'Granollers', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.6096, lon: 2.2853, poblacion: 62000 },
        hospitalet: { id: 'hospitalet', nombre: 'L\'Hospitalet de Llobregat', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.3596, lon: 2.0996, poblacion: 265000 },
        mataro: { id: 'mataro', nombre: 'Mataró', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.5402, lon: 2.4453, poblacion: 128000 },
        sabadell: { id: 'sabadell', nombre: 'Sabadell', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.5485, lon: 2.1116, poblacion: 216000 },
        sant_cugat: { id: 'sant_cugat', nombre: 'Sant Cugat del Vallès', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.4715, lon: 2.0822, poblacion: 92000 },
        terrassa: { id: 'terrassa', nombre: 'Terrassa', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.5629, lon: 2.0082, poblacion: 220000 },
        
        // Valencia
        valencia_capital: { id: 'valencia_capital', nombre: 'Valencia', nivel: 'municipio', region: 'valencia', pais: 'espana', lat: 39.4699, lon: -0.3763, poblacion: 794000 },
        alicante_capital: { id: 'alicante_capital', nombre: 'Alicante', nivel: 'municipio', region: 'alicante', pais: 'espana', lat: 38.3452, lon: -0.4810, poblacion: 335000 },
        elche: { id: 'elche', nombre: 'Elche', nivel: 'municipio', region: 'alicante', pais: 'espana', lat: 38.2691, lon: -0.6968, poblacion: 235000 },
        castellon_capital: { id: 'castellon_capital', nombre: 'Castellón de la Plana', nivel: 'municipio', region: 'castellon', pais: 'espana', lat: 39.9864, lon: -0.0513, poblacion: 171000 },
        benidorm: { id: 'benidorm', nombre: 'Benidorm', nivel: 'municipio', region: 'alicante', pais: 'espana', lat: 38.5380, lon: -0.1305, poblacion: 69000 },
        torrevieja: { id: 'torrevieja', nombre: 'Torrevieja', nivel: 'municipio', region: 'alicante', pais: 'espana', lat: 37.9779, lon: -0.6828, poblacion: 84000 },
        
        // Sevilla
        sevilla_capital: { id: 'sevilla_capital', nombre: 'Sevilla', nivel: 'municipio', region: 'sevilla', pais: 'espana', lat: 37.3891, lon: -5.9845, poblacion: 688000 },
        dos_hermanas: { id: 'dos_hermanas', nombre: 'Dos Hermanas', nivel: 'municipio', region: 'sevilla', pais: 'espana', lat: 37.2849, lon: -5.9287, poblacion: 135000 },
        
        // Málaga
        malaga_capital: { id: 'malaga_capital', nombre: 'Málaga', nivel: 'municipio', region: 'malaga', pais: 'espana', lat: 36.7181, lon: -4.4219, poblacion: 578000 },
        marbella: { id: 'marbella', nombre: 'Marbella', nivel: 'municipio', region: 'malaga', pais: 'espana', lat: 36.5101, lon: -4.8864, poblacion: 143000 },
        mijas: { id: 'mijas', nombre: 'Mijas', nivel: 'municipio', region: 'malaga', pais: 'espana', lat: 36.5954, lon: -4.6374, poblacion: 86000 },
        fuengirola: { id: 'fuengirola', nombre: 'Fuengirola', nivel: 'municipio', region: 'malaga', pais: 'espana', lat: 36.5431, lon: -4.6248, poblacion: 82000 },
        velez_malaga: { id: 'velez_malaga', nombre: 'Vélez-Málaga', nivel: 'municipio', region: 'malaga', pais: 'espana', lat: 36.7806, lon: -4.0998, poblacion: 82000 },
        
        // Zaragoza
        zaragoza_capital: { id: 'zaragoza_capital', nombre: 'Zaragoza', nivel: 'municipio', region: 'zaragoza', pais: 'espana', lat: 41.6488, lon: -0.8891, poblacion: 680000 },
        
        // Murcia
        murcia_capital: { id: 'murcia_capital', nombre: 'Murcia', nivel: 'municipio', region: 'murcia', pais: 'espana', lat: 37.9922, lon: -1.1307, poblacion: 460000 },
        cartagena: { id: 'cartagena', nombre: 'Cartagena', nivel: 'municipio', region: 'murcia', pais: 'espana', lat: 37.6257, lon: -0.9966, poblacion: 215000 },
        
        // Islas Baleares
        palma: { id: 'palma', nombre: 'Palma de Mallorca', nivel: 'municipio', region: 'baleares', pais: 'espana', lat: 39.5696, lon: 2.6502, poblacion: 420000 },
        
        // Las Palmas
        palmas_capital: { id: 'palmas_capital', nombre: 'Las Palmas de Gran Canaria', nivel: 'municipio', region: 'palmas', pais: 'espana', lat: 28.1235, lon: -15.4363, poblacion: 380000 },
        
        // Santa Cruz de Tenerife
        santa_cruz_tenerife_capital: { id: 'santa_cruz_tenerife_capital', nombre: 'Santa Cruz de Tenerife', nivel: 'municipio', region: 'santa_cruz_tenerife', pais: 'espana', lat: 28.4636, lon: -16.2518, poblacion: 207000 },
        
        // Bilbao
        bilbao: { id: 'bilbao', nombre: 'Bilbao', nivel: 'municipio', region: 'vizcaya', pais: 'espana', lat: 43.2630, lon: -2.9350, poblacion: 346000 },
        vitoria: { id: 'vitoria', nombre: 'Vitoria-Gasteiz', nivel: 'municipio', region: 'alava', pais: 'espana', lat: 42.8467, lon: -2.6716, poblacion: 252000 },
        san_sebastian: { id: 'san_sebastian', nombre: 'San Sebastián', nivel: 'municipio', region: 'guipuzcoa', pais: 'espana', lat: 43.3225, lon: -1.9840, poblacion: 187000 },
        
        // Córdoba
        cordoba_capital: { id: 'cordoba_capital', nombre: 'Córdoba', nivel: 'municipio', region: 'cordoba', pais: 'espana', lat: 37.8882, lon: -4.7794, poblacion: 325000 },
        
        // Valladolid
        valladolid_capital: { id: 'valladolid_capital', nombre: 'Valladolid', nivel: 'municipio', region: 'valladolid', pais: 'espana', lat: 41.6522, lon: -4.7245, poblacion: 298000 },
        
        // Vigo
        vigo: { id: 'vigo', nombre: 'Vigo', nivel: 'municipio', region: 'pontevedra', pais: 'espana', lat: 42.2314, lon: -8.7127, poblacion: 294000 },
        
        // Gijón
        gijon: { id: 'gijon', nombre: 'Gijón', nivel: 'municipio', region: 'asturias', pais: 'espana', lat: 43.5322, lon: -5.6611, poblacion: 272000 },
        
        // L'Hospitalet (ya incluido)
        
        // Granada
        granada_capital: { id: 'granada_capital', nombre: 'Granada', nivel: 'municipio', region: 'granada', pais: 'espana', lat: 37.1773, lon: -3.5986, poblacion: 232000 },
        
        // Elche (ya incluido)
        
        // Santa Coloma de Gramenet
        santa_coloma: { id: 'santa_coloma', nombre: 'Santa Coloma de Gramenet', nivel: 'municipio', region: 'barcelona', pais: 'espana', lat: 41.4515, lon: 2.2081, poblacion: 119000 },
        
        // Jerez de la Frontera
        jerez: { id: 'jerez', nombre: 'Jerez de la Frontera', nivel: 'municipio', region: 'cadiz', pais: 'espana', lat: 36.6850, lon: -6.1115, poblacion: 212000 },
        
        // Almonaster la Real (pueblo pequeño - ejemplo)
        almonaster: { id: 'almonaster', nombre: 'Almonaster la Real', nivel: 'aldea', region: 'huelva', pais: 'espana', lat: 37.8739, lon: -6.7865, poblacion: 1845 },
    },
    
    // ========================================
    // INICIALIZAR ÍNDICE DE BÚSQUEDA
    // ========================================
    inicializarIndice: function() {
        // Índice global
        this.indice = {};
        
        // Añadir países
        Object.values(this.paises).forEach(lugar => {
            this.indice[lugar.id] = lugar;
            this.indice[lugar.nombre.toLowerCase()] = lugar;
            this.indice[lugar.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")] = lugar;
            if (lugar.capital) {
                this.indice[lugar.capital.toLowerCase()] = lugar;
            }
        });
        
        // Añadir regiones
        Object.values(this.regiones).forEach(lugar => {
            this.indice[lugar.id] = lugar;
            this.indice[lugar.nombre.toLowerCase()] = lugar;
            this.indice[lugar.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")] = lugar;
        });
        
        // Añadir municipios
        Object.values(this.municipios).forEach(lugar => {
            this.indice[lugar.id] = lugar;
            this.indice[lugar.nombre.toLowerCase()] = lugar;
            this.indice[lugar.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")] = lugar;
        });
        
        console.log(`✅ Territorios cargados: ${Object.keys(this.paises).length} países, ${Object.keys(this.regiones).length} regiones, ${Object.keys(this.municipios).length} municipios`);
    },
    
    // Buscar cualquier lugar por nombre
    buscar: function(texto) {
        if (!texto) return null;
        const clave = texto.toLowerCase().trim();
        const claveNormalizada = clave.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Búsqueda exacta
        if (this.indice[clave]) return this.indice[clave];
        if (this.indice[claveNormalizada]) return this.indice[claveNormalizada];
        
        // Búsqueda parcial (si no hay exacta)
        for (let [key, lugar] of Object.entries(this.indice)) {
            if (key.includes(clave) || key.includes(claveNormalizada)) {
                return lugar;
            }
        }
        
        return null;
    },
    
    // Obtener jerarquía completa de un lugar
    getJerarquia: function(lugarId) {
        const lugar = this.indice[lugarId];
        if (!lugar) return [];
        
        const jerarquia = [lugar];
        
        if (lugar.nivel === 'aldea' || lugar.nivel === 'municipio') {
            if (lugar.region) {
                const region = this.regiones[lugar.region];
                if (region) jerarquia.unshift(region);
            }
            if (lugar.pais) {
                const pais = this.paises[lugar.pais];
                if (pais) jerarquia.unshift(pais);
            }
        } else if (lugar.nivel === 'region') {
            if (lugar.pais) {
                const pais = this.paises[lugar.pais];
                if (pais) jerarquia.unshift(pais);
            }
        }
        
        return jerarquia;
    }
};

// Inicializar el índice automáticamente
Territorios.inicializarIndice();

window.Territorios = Territorios;
