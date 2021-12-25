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
    return sideBar.hidden = !sideBar.hidden;
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
    sideBar.hidden = false;

    let marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });

    google.maps.event.addListener(marker, 'click', function () {
        removeMarker(marker);
    });

    addMarkers(marker);
    addLine(latLng);
}

// marker Array
function getMarkers() {
    return markerArray;
}

function getMarkersLength() {
    return markerArray.length;
}

// marker
function removeMarker(marker) {
    let index = (getMarkers().indexOf(marker) + 1);

    for (let i = 0; i < getMarkersLength(); i++){
        if (getMarkers()[i] === marker){
            getMarkers()[i].setMap(null);
            getMarkers().splice(i, 1);
            drawPath.getPath().removeAt(i);
        }
    }
    updatePaneHtml(index);
}

function addMarkers(marker) {
    markerArray.push(marker);
    createPaneHtml(marker);
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
    for (let i = 0; i < paneList.children.length; i++){
        if(parseInt(paneList.children[i].id) === index){
            document.getElementById(index).remove();
        }
    }
}

// lines
function addLine(latLng) {
    drawPath.getPath().setAt(drawPath.getPath().getLength(), latLng);
}
