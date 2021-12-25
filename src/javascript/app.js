window.addEventListener("DOMContentLoaded", () => {
    console.log('Script is READY !');
});

// vars
let markerArray = [],
    drawPath,
    map,
    sideBar = document.getElementById('sidebar'),
    paneList = document.getElementById('pane');

sideBar.hidden = true

function toggleSideBar() {
    sideBar.hidden = false;
    //return sideBar.hidden = !sideBar.hidden;
}

// Map init
function initMap(listener) {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: {lat: 46.232192999999995, lng: 2.209666999999996},
    });

    drawPath = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
    });

    drawPath.setMap(map);

    let onChangeHandler = function (event) {
        addMarker(event.latLng);
    };

    google.maps.event.addListener(map, 'click', onChangeHandler);
}

// add Marker
function addMarker(latLng) {
    toggleSideBar();

    let marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });

    google.maps.event.addListener(marker, 'click', function () {
        removeMarkersItem(marker);
    });

    addMarkersItem(marker);
    addLine(latLng);
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
    deleteMarkers(marker);
    getMarkers().slice((index + 1), getMarkersLength());
    updatePaneHtml(index);
    removeLine(marker);
}

function addMarkersItem(marker) {
    markerArray.push(marker);
    createPaneHtml(marker);
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

// markers html template
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
function addLine(latLng) {
    drawPath.getPath().setAt(drawPath.getPath().getLength(), latLng);
}

function removeLine(marker) {
    for (let i = 0; i < drawPath.getPath().getLength(); i++){
        if (getMarkers()[i] === marker)
            drawPath.getPath().removeAt(i);
    }
}
