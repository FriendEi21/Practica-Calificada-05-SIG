// Instanciar el mapa y establecer la vista en Huancayo (Latitud, Longitud, Zoom)
var mapa = L.map('mapa').setView([-12.0667, -75.2049], 13)

// Agregamos la capa base (Mosaicos de OpenStreetMap) - Guardamos en la variable capaOSM
var capaOSM = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

// Añadimos marcadores con popups (Ventanas emergentes)
var marcadorUNCP = L.marker([-12.0435, -75.2505]).bindPopup('<b>UNCP</b><br>Facultad de Ingeniería de Sistemas')
var marcadorPlazaConst = L.marker([-12.0667, -75.2049]).bindPopup('<b>Parque Constitución</b><br>Centro de la ciudad')
var marcadorParqueIdent = L.marker([-12.0725, -75.2098]).bindPopup('<b>Parque de la Identidad</b><br>San Carlos')

// Agregamos los marcadores al mapa para que sean visibles
marcadorUNCP.addTo(mapa);
marcadorPlazaConst.addTo(mapa);
marcadorParqueIdent.addTo(mapa);

// Conexión al servidor local de GeoServer
var capaWMS = L.tileLayer.wms('http://localhost:8080/geoserver/semana12/wms', {
    layers: 'semana12:Distrito_INEI_2017',
    format: 'image/png',
    transparent: 'true',
    version: '1.1.0',
    atribution: "Datos del INEI servidos por GeoServer"
});

// Agregamos la capa WMS al mapa
capaWMS.addTo(mapa);

// Configuración de control de capas (Layers Control)

    // Agrupamos los mapas base (un mapa a la vez - Radio buttons)
var mapasBase = {
    "Mapa(OSM)": capaOSM
};

    // Agrupamos las capas superpuestas (varias a la vez - checkboxes)
var capasSuperpuestas = {
    "Universidad (UNCP)": marcadorUNCP,
    "Parque Constitución": marcadorPlazaConst,
    "Parque Identidad": marcadorParqueIdent,
    "Capa Distritos (GeoServer)": capaWMS
};

    // Inyectamos el control de capas en la esquina superior derecha del mapa
L.control.layers(mapasBase, capasSuperpuestas).addTo(mapa);