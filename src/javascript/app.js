window.addEventListener("DOMContentLoaded", () => {
    console.log('Script is READY !');
});

// vars
let markerArray = [];

let flightPlanCoordinates,
    flightPath,
    sideBar = document.getElementById('sidebar'),
    paneList = document.getElementById('pane');

sideBar.hidden = true;

function toggleSideBar(){
    return sideBar.hidden = !sideBar.hidden;
}

// Map init
function initMap(listener) {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 46.232192999999995, lng: 2.209666999999996 },
    });

    const onChangeHandler = function () {
        let start = returnMarkersIndex(markerArray, 1);
        let end = returnMarkersIndex(markerArray, 2);

        flightPlanCoordinates = [
            { lat: start.getPosition().lat(),
                lng: start.getPosition().lng()
            },
            { lat: end.getPosition().lat(),
                lng: end.getPosition().lng()
            },
        ];

        flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
    };

    map.addListener("click", (e) => {
        // We limit to 2 markers
        if(getMarkersLength() < 2){
            addMarker(e.latLng, map);
        }
        // We draw positions
        if(getMarkersLength() === 2){
            onChangeHandler();
            addLine(flightPath, map);
            toggleSideBar();
        }
    });
}

// add Marker
function addMarker(latLng, map) {
    let marker = new google.maps.Marker({
        position: latLng,
        map: map,
    })

    google.maps.event.addListener(marker, 'click', function () {
        deleteMarkers(marker);
        if(removeMarkersItem(marker)){
            if(getMarkersLength() >= 1)
                removeLine();
                sideBar.hidden = true;
        }
    });

    addMarkersItem(marker);

    let template = `
            <li> <strong>Position ${getMarkersLength()}</strong><br> Lat : ${ marker.getPosition().lat() }, Long ${ marker.getPosition().lng() }</li> <br>
        `;

    paneList.innerHTML += template;
}

// marker Array
function getMarkersLength(){
    return markerArray.length;
}

function removeMarkersItem(marker){
    return markerArray = markerArray.splice(markerArray.indexOf(marker), 1) || null;
}

function addMarkersItem(marker){
    markerArray.push(marker);
}

function returnMarkersIndex(markersArray, arg){
    if(Array.isArray(markersArray)
        && markersArray.length > 0){
        return markersArray[(arg - 1)] || null
    }
}

// markers
function hideMarkers(marker) {
    marker.setMap(null);
}

function deleteMarkers(marker) {
    hideMarkers(marker);
    paneList.innerHTML = '';
}

// lines
function addLine(flightPath, map) {
    flightPath.setMap(map);
}

function removeLine() {
    flightPath.setMap(null);
    markerArray = [];
}
