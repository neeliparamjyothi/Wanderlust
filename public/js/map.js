<script>
  // Set map center (latitude, longitude) and zoom level
const map = L.map('map').setView([28.6139, 77.2090], 13); // New Delhi coordinates

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map);

// Add a marker
const marker = L.marker([28.6139, 77.2090]).addTo(map);

// Add a popup
marker.bindPopup("<b>Hello!</b><br>This is New Delhi.").openPopup();

</script>