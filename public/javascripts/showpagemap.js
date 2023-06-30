    mapboxgl.accessToken =map_token;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11 ', // style URL
    center:[-74,40] , // starting position [lng, lat]
    zoom: 10, // starting zoom
    }); 
    // new mapboxgl.Marker()
    //             .setLngLat(campgrounds.geometry.coordinates)
    //             .setPopup(
    //                 new mapboxgl.Popup({offset:25})
    //                 .setHTML(
    //                     `<h2>${campgrounds.title}</h2>`
    //                 )
    //             )
    //             .addTo(map);