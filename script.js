const churches = [
    { 
      name: "CCC International Headquarters", 
      lat: 6.5944, 
      lng: 3.3745, 
      country: "Nigeria", 
      address: "Mission House, Ketu, Lagos", 
      website: "https://thecccworldwide.org",
      image: "https://example.com/hq.jpg"
    },
    {
      name: "CCC Supreme Headquarters", 
      lat: 6.4969, 
      lng: 2.6283, 
      country: "Benin", 
      address: "Tchakou, Porto-Novo", 
      website: "https://thecccworldwide.org",
      image: "https://example.com/supreme-hq.jpg"
    },
    {
      name: "CCC Holy City", 
      lat: 7.4333, 
      lng: 2.8500, 
      country: "Nigeria", 
      address: "Celestial City, Imeko, Ogun State", 
      website: "https://thecccworldwide.org",
      image: "https://example.com/holy-city.jpg"
    },
    {
      name: "CCC UK Diocese Headquarters", 
      lat: 51.5074, 
      lng: -0.1278, 
      country: "United Kingdom", 
      address: "London", 
      website: "https://celestialchurchofchrist.org",
      image: "https://example.com/uk-hq.jpg"
    },
    {
      name: "CCC London Parish",
      lat: 51.5074,
      lng: -0.1278,
      country: "UK",
      address: "123 Example St, London",
      website: "https://ccclondonparish.org",
      image: "https://example.com/london.jpg"
    },
    {
      name: "CCC New York Parish",
      lat: 40.7128,
      lng: -74.0060,
      country: "USA",
      address: "456 Sample Ave, New York",
      website: "https://cccnewyork.org",
      image: "https://example.com/newyork.jpg"
    },
    {
      name: "CCC Paris Parish",
      lat: 48.8566,
      lng: 2.3522,
      country: "France",
      address: "789 Rue de l'Exemple, Paris",
      website: "https://cccparis.fr",
      image: "https://example.com/paris.jpg"
    },
    {
      name: "CCC Johannesburg Parish",
      lat: -26.2041,
      lng: 28.0473,
      country: "South Africa",
      address: "101 Example Road, Johannesburg",
      website: "https://cccjohannesburg.co.za",
      image: "https://example.com/johannesburg.jpg"
    },
    {
      name: "CCC Sydney Parish",
      lat: -33.8688,
      lng: 151.2093,
      country: "Australia",
      address: "202 Sample Street, Sydney",
      website: "https://cccsydney.com.au",
      image: "https://example.com/sydney.jpg"
    }
  ];
  
  
  const map = L.map('map').setView([0, 0], 2);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  const churchIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  
  let markers = [];
  
  function addMarkers() {
    churches.forEach(church => {
      const marker = L.marker([church.lat, church.lng], {icon: churchIcon})
        .addTo(map)
        .bindPopup(`
          <div class="church-info">
            <img src="${church.image}" alt="${church.name}">
            <h3>${church.name}</h3>
            <p>${church.address}</p>
            <p>${church.country}</p>
            <a href="${church.website}" target="_blank" class="website">Visit Website</a>
          </div>
        `);
      markers.push(marker);
    });
  }
  
  addMarkers();
  
  const searchInput = document.getElementById('search');
  const filterSelect = document.getElementById('filter');
  const locateButton = document.getElementById('locate');
  
  // Populate filter options
  const countries = [...new Set(churches.map(church => church.country))];
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    filterSelect.appendChild(option);
  });
  
  function filterMarkers() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCountry = filterSelect.value;
  
    markers.forEach((marker, index) => {
      const church = churches[index];
      const isVisible = (church.name.toLowerCase().includes(searchTerm) || church.country.toLowerCase().includes(searchTerm))
        && (selectedCountry === '' || church.country === selectedCountry);
      
      if (isVisible) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  }
  
  searchInput.addEventListener('input', filterMarkers);
  filterSelect.addEventListener('change', filterMarkers);
  
  locateButton.addEventListener('click', () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
        
        L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'user-location',
            html: '<i class="fas fa-map-marker-alt" style="color: #ff4136; font-size: 24px;"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
          })
        }).addTo(map).bindPopup("You are here").openPopup();
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  });
  
  // Add a scale control to the map
  L.control.scale().addTo(map);
  
  // Add a fullscreen control
  map.addControl(new L.Control.Fullscreen());