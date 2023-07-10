window.onload=init
function init(){
    const map= new ol.Map({
        view: new ol.View({
            center: ol.proj.fromLonLat([79.0882,21.1458]),
            zoom:4,
        }),
        target: "js-map"
    })
            
    //Adding the base layer

    const OSMStandard= new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible:true,
        title: 'OSMStandard'
        // extent:[7452161.885163681,501531.71304235095,11116848.094956594,4469949.507237884]
    })

    const OSMHumantarian= new ol.layer.Tile({
        source: new ol.source.OSM({
            url:'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible:false,
        title: 'OSMSHumanitarian'
        // extent:[7452161.885163681,501531.71304235095,11116848.094956594,4469949.507237884]
    })

    const BingMaps= new ol.layer.Tile({        
        source: new ol.source.BingMaps({
            key: 'AvfYAHlHKxISbw4Dp3c0PDshVawerUobwy8KBsLQ01kXny-8OjlBje60O542RkIv',
            imagerySet: 'AerialWithLabels'
        }),
        visible: false,
        title:'BingMap'
    })
                
    const stamenBaseMapLayer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer:'terrain'
        }),
        visible: false,
        title: 'StamenTerrain'
    })
        
    const cartoDBBaselayer = new ol.layer.Tile({
        source:new ol.source.XYZ({
            url:'https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{scale}.png',
        }),
        visible: false,
        title: 'CartoDB'
    })

    const baseLayerGroup = new ol.layer.Group({
        layers: [OSMStandard, OSMHumantarian, BingMaps, stamenBaseMapLayer, cartoDBBaselayer]
    })
    map.addLayer(baseLayerGroup);

    // Layer Switcher Logic for Base Layers

    const baseLayerElements = document.querySelectorAll('.sidebar>input[type=radio]')
    for(let baseLayerElement of baseLayerElements){
        baseLayerElement.addEventListener('change', function(){
            let baseLayerElementValue=this.value;
            baseLayerGroup.getLayers().forEach(function(element, index, array){
                let baseLayerName=element.get('title');
                element.setVisible(baseLayerName===baseLayerElementValue);
                element.get('visible')
            })
        })
    }

    // Adding GeoJSAN Layers

    const vectorGJLayer = new ol.layer.Vector({
        source : new ol.source.Vector({
            url:'./data/map.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: false,
        title: 'vectorGJLayer'
    })
    // map.addLayer(vectorGJLayer);

    const otherLayerGroup = new ol.layer.Group({
        layers: [vectorGJLayer]
    })
    map.addLayer(otherLayerGroup);

    // Layer Switcher for other layers

    const otherLayerElements = document.querySelectorAll('.sidebar>input[type=checkbox]')
    for(let otherLayerElement of otherLayerElements){
        otherLayerElement.addEventListener('change', function(){
            let otherLayerElementValue=this.value
            let otherLayer;
            otherLayerGroup.getLayers().forEach(function(element, index, array){
                if(otherLayerElementValue===element.get('title')){
                    otherLayer=element;
                }
            })
            this.checked?otherLayer.setVisible(true):otherLayer.setVisible(false)  
        })
    }

    //vector layer popup information
        
    const overlayContainerElement = document.querySelector('.overlay-container')
    const overlayLayer = new ol.Overlay({
        element:overlayContainerElement
    })
    map.addOverlay(overlayLayer);
    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureInfo1 = document.getElementById('feature-info1');
    const overlayFeatureInfo2 = document.getElementById('feature-info2');
    const overlayFeatureInfo3 = document.getElementById('feature-info3');
    const overlayFeatureInfo4 = document.getElementById('feature-info4');

    //vector layer information
        
    map.on('click', function(e){
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel,function(feature,layer){
            let clickedCoordinate=e.coordinate;
            let clickedFeatureName=feature.get('Name of the Institute');
            let clickedFeatureInfo1=feature.get('NIRF Ranking');
            let clickedFeatureInfo2=feature.get('Departments');
            let clickedFeatureInfo3=feature.get('Academic Programmes');
            let clickedFeatureInfo4=feature.get('Institute Website');
            if(clickedFeatureName && clickedFeatureInfo1 && clickedFeatureInfo2 && clickedFeatureInfo3 &&clickedFeatureInfo4 !=undefined){
                overlayLayer.setPosition(clickedCoordinate);
                overlayFeatureName.innerHTML=clickedFeatureName;
                overlayFeatureInfo1.innerHTML=clickedFeatureInfo1;
                overlayFeatureInfo2.innerHTML=clickedFeatureInfo2;
                overlayFeatureInfo3.innerHTML=clickedFeatureInfo3;
                overlayFeatureInfo4.innerHTML=clickedFeatureInfo4;
            }
        })
    })
}

