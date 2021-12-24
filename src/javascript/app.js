window.addEventListener("DOMContentLoaded", () => {
    console.log('Script is READY !');
});

// vars
let markerArray = [];

let drawPath,
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

    drawPath = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
    });

    drawPath.setMap(map);

    const onChangeHandler = function (event) {
        addLine(event);
        addMarker(event.latLng, map);
        sideBar.hidden = false;
    };

    map.addListener("click", onChangeHandler);
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
        let isRemoved = removeMarkersItem(marker);
        if(isRemoved){
            console.log('removed');
        }
        if(!getMarkersLength()){
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
    let index = getMarkers().indexOf(marker);
    updatePaneHtml(index);
    removeLine(marker);
    return getMarkers().slice((index + 1), getMarkersLength()) || null;
}

function addMarkersItem(marker) {
    markerArray.push(marker);
}

function returnMarkersIndex(getMarkers, arg) {
    if (Array.isArray(getMarkers())
        && getMarkersLength() > 0) {
        return getMarkers()[(arg - 1)] || null
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
    paneList.insertAdjacentHTML('beforeend', template);
}

function updatePaneHtml(index) {
    let idIndex = index === 0 ? 1 : (index + 1);
    for (let i = 0; i < paneList.children.length; i++){
        if(parseInt(paneList.children[i].id) === idIndex){
            document.getElementById(idIndex).remove();
        }
    }
}

// lines

function addLine(event) {
    const path = drawPath.getPath();
    drawPath.getPath().setAt(getMarkersLength(), event.latLng);
}

function removeLine(marker) {
    for (let i = 0; i < getMarkersLength(); i++){
        if (getMarkers()[i] === marker)
            drawPath.getPath().removeAt(i);
    }
}
