const map = L.map('map', {
  center: [40.709792, -73.874817],
  zoom: 13,
})
const venueMarkersFeatureGroup = L.featureGroup().addTo(map);
let venues;

function init() {
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://github.com/na-stewart/tpc-map">tpc-map v1.0</a>'
  }).addTo(map);
  fetch(`tpc-map/json/venues.json`)
  .then(function(response) {
    return response.json();
  })
  .then((data) => {
    venues = data;
    fillVenuesMap(venues);
    createFilters(venues, ['borough', 'capacity']);
  });
}

function fillVenuesMap(venues) {
  document.getElementById("map-overlay-container").innerHTML = '';
  venueMarkersFeatureGroup.clearLayers();
  const customMarkerIcon = L.icon({
    iconUrl: 'tpc-map/img/location-marker.png',
    iconSize: [40, 40]
  });
  for (let i = 0; i < venues.length; i++) {
    (function () {
      let venue = venues[i];
      const marker = L.marker(venue.coordinates, {icon: customMarkerIcon}).addTo(venueMarkersFeatureGroup);
      marker.bindPopup(`
        <img style="height: 150px; width: 200px;" src=${venue.image_url}>
        <p style="font-weight: bold; text-align: center; margin-top: 5px; margin-bottom: 5px;">${venue.name}</p>
        <p style="text-align: center; margin-top: 5px; margin-bottom: 5px; font-size: 11px; width:200px;">${venue.summary}</p>
        <div style="text-align: center;">
          <span>
            <a href="${venue.url}" style="color: grey;">Learn More</a>
          </span>
        </div>
      `);
      const venueContainer = document.createElement("div");
      venueContainer.classList.add("venue-container");
      venueContainer.addEventListener("click", function () {
        marker.openPopup();
      });
      venueContainer.innerHTML = `
        <img src=${venue.image_url}>
        <p class="title">${venue.name}</p>
        <p>${venue.borough} | <a href="${venue.url}">Learn More</a></p>
        <p>Reception - ${venue.reception} | Seated - ${venue.seated}</p>
      `;
      document.getElementById("map-overlay-container").appendChild(venueContainer);
    })();
  }
  map.flyToBounds(venueMarkersFeatureGroup.getBounds());
  map.setMaxBounds(venueMarkersFeatureGroup.getBounds().pad(1.5));
}