window.addEventListener("DOMContentLoaded", () => {
    console.log('Script is READY !');
});

// vars
let markerArray = [];

let flightPlanCoordinates = [],
    flightPath,
    flightPathStatus = false,
    sideBar = document.getElementById('sidebar'),
    paneList = document.getElementById('pane');

sideBar.hidden = true;

function toggleSideBar() {
    return sideBar.hidden = !sideBar.hidden;
}

// Map init
function initMap(listener) {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: {lat: 46.232192999999995, lng: 2.209666999999996},
    });

    const onChangeHandler = function () {
        if (flightPathStatus)
            removeLine();

        if(!flightPathStatus){
            drawFlightPlan();
        }

        addLine(flightPath, map);
        toggleSideBar();
    };

    map.addListener("click", (e) => {
        // We limit to 2 markers
        if (getMarkersLength() < 2) {
            addMarker(e.latLng, map);
        }
        // We draw positions
        if (getMarkersLength() >= 2) {
            onChangeHandler();
        }
    });
}

// add Marker
function addMarker(latLng, map) {
    toggleSideBar();

    let marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });

    google.maps.event.addListener(marker, 'click', function () {
        deleteMarkers(marker);
        updatePaneHtml(marker);

        if(removeMarkersItem(marker)){
            removeLine();
            hideMarkers(marker);
            flightPathStatus = false;
        }
        if(!getMarkersLength()){
            flightPlanCoordinates = [];
            updatePaneHtml(marker);
            toggleSideBar();
        }
    });

    addMarkersItem(marker);
    createPaneHtml(marker);
}

// marker Array
function getMarkers() {
    return markerArray;
}

function getMarkersLength() {
    return markerArray.length;
}

function removeMarkersItem(marker) {
    let index = markerArray.indexOf(marker);
    return markerArray = markerArray.slice(index, (index + 1)) || null;
}

function addMarkersItem(marker) {
    markerArray.push(marker);
}

function returnMarkersIndex(markersArray, arg) {
    if (Array.isArray(markersArray)
        && markersArray.length > 0) {
        return markersArray[(arg - 1)] || null
    }
}

// markers
function hideMarkers(marker) {
    marker.setMap(null);
}

function deleteMarkers(marker) {
    hideMarkers(marker);
}

function createPaneHtml(marker) {
    let template = `
            <li class="my-5" id="${getMarkersLength()}" data-identifier="pan-${getMarkersLength()}"> 
                <strong>Position ${getMarkersLength()}</strong><br>Lat : ${marker.getPosition().lat()}, Long : ${marker.getPosition().lng()}
            <br></li>
        `;
    paneList.innerHTML += template;
}

function updatePaneHtml(marker) {
    let idIndex = (getMarkers().indexOf(marker) + 1);
    for (let i = 0; i < paneList.children.length; i++){
        if(parseInt(paneList.children[i].id) === idIndex){
            document.getElementById(idIndex).remove();
        }
    }
    // drop paneList if no marker
    if (!getMarkersLength()) {
        paneList.innerHTML = '';
    }
}

// lines
function addLine(flightPath, map) {
    flightPath.setMap(map);
}

function removeLine() {
    flightPath.setMap(null);
}



// draw
function drawFlightPlan(){
    let drawElements = getMarkers();

    for (let i = 0; i < drawElements.length; i++){
        flightPlanCoordinates.push(
            {
                lat: drawElements[i].getPosition().lat(),
                lng: drawElements[i].getPosition().lng()
            },
        );
    }

    flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    flightPathStatus = true;
}
