

initMap = ()=>{
    // The location of Uluru
    const uluru = { lat: -25.344, lng: 131.031 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: uluru,
    });

    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
    position: uluru,
    map: map,
    })
}

src="https://maps.googleapis.com/maps/api/js?key=<%-process.env.GOOGLE_KEY%>&callback=initMap&v=weekly"
defer
