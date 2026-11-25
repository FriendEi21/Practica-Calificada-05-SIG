var mapa = L.map('mapa').setView([-12.0667, -75.2049], 13);
var marcadorDinamico = null; // Pregunta 4: Instancia de marcador dinámico

// 1.1 Mapa Base (OpenStreetMap)
var capaOSM = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// 1.2 Vectores Cliente (3 marcadores representativos con popup)
var marcadorPARQUE = L.marker([-12.049476186308157, -75.19598970457149]).bindPopup('<b>Allqu Park</b><br>Parque de los Perros');
var marcadorMUSEO = L.marker([-12.065459590440392, -75.21443118672762]).bindPopup('<b>Museo</b><br>Museo Salesiano Vicente Rasetto');
var marcadorPLAZA = L.marker([-12.070614086379969, -75.2082102746632]).bindPopup('<b>Plaza Huamanmarca</b><br>Plaza Huamanmarca');

marcadorPARQUE.addTo(mapa);
marcadorMUSEO.addTo(mapa);
marcadorPLAZA.addTo(mapa);

// 1.3 Integración WMS local con opacidad del 50% (0.5)
var capaDistritosWMS = L.tileLayer.wms('http://localhost:8080/geoserver/semana12/wms', {
    layers: 'semana12:Distrito_INEI_2017',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    opacity: 0.5,
    attribution: 'Datos del INEI servidos por GeoServer'
}).addTo(mapa);

// Pregunta 2: Consumo y estilización dinámica de un geojson
var capaSaludGeoJSON = L.geoJSON(null, {
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.nombre) {
            layer.bindPopup(
                '<b>' + feature.properties.nombre + '</b><br>' +
                'Tipo: ' + feature.properties.tipo + '<br>' +
                'Distrito: ' + feature.properties.distrito
            );
        } // fin if properties
    } // fin onEachFeature
});

fetch('establecimientos_junin.geojson')
    .then(function (response) {
        return response.json();
    }) // fin then response
    .then(function (datos) {
        capaSaludGeoJSON.addData(datos);
    }) // fin then datos
    .catch(function (error) {
        console.error('Error al cargar el GeoJSON:', error);
    }); // fin catch

// Pregunta 3: Filtrdo especial CQL 
var capaJuninWMS = L.tileLayer.wms('http://localhost:8080/geoserver/evaluacion_sistemas/wms', {
    layers: 'evaluacion_sistemas:DEPARTAMENTOS',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    opacity: 0.6,
    CQL_FILTER: "DEPARTAMEN = 'JUNIN'",
    attribution: 'Límites Departamentales INEI - GeoServer'
});

// 1.4 Control de Capas 
var mapasBase = {
    'Mapa Base (OSM)': capaOSM
};

var capasSuperpuestas = {
    'Parque de los Mates Burilados': marcadorPARQUE,
    'Museo Salesiano Vicente Rasetto': marcadorMUSEO,
    'Plaza Huamanmarca': marcadorPLAZA,
    'Distritos INEI (WMS 50%)': capaDistritosWMS,
    'Establecimientos de Salud (GeoJSON)': capaSaludGeoJSON, // 2.5 Agregamos la capa geojson
    'Solo Departamento Junín (CQL WMS)': capaJuninWMS // Pregunta 3: Agregando la capa con filtro
};

L.control.layers(mapasBase, capasSuperpuestas).addTo(mapa);

// Pregunta 4: Eventos interactivos y geocaptura dinámica
mapa.on('click', function (e) {
    var lat = e.latlng.lat.toFixed(5);
    var lon = e.latlng.lng.toFixed(5);

    // Validación: eliminar marcador previo de la vista y de la memoria
    if (marcadorDinamico !== null) {
        mapa.removeLayer(marcadorDinamico);
        marcadorDinamico = null;
    } // fin if validacion marcador

    // Instanciar nuevo marcador dinámico y abrir popup automáticamente
    marcadorDinamico = L.marker([lat, lon])
        .addTo(mapa)
        .bindPopup('Coordenadas: Lat: ' + lat + ', Lon: ' + lon)
        .openPopup();
}); // fin mapa.on click