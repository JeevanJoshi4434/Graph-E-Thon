import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiamVldmFuam9zaGkiLCJhIjoiY2x2djh0YnViMXN2cjJpcDFwaTg4Z3czYyJ9.zEDRwvJFAwXfIbV4hnmQIQ';

export default function MapBox({ locations = [], user=null }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(user.location.longitude);
    const [lat, setLat] = useState(user.location.latitude);
    const [zoom, setZoom] = useState(12);

    useEffect(() => {
        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom
            });

            map.current.on('move', () => {
                setLng(map.current.getCenter().lng.toFixed(4));
                setLat(map.current.getCenter().lat.toFixed(4));
                setZoom(map.current.getZoom().toFixed(2));
            });
        }

        // Add custom markers for each location
        if (locations.length > 0) {
            locations.forEach(location => {
                const markerElement = document.createElement('div');
                markerElement.className = 'marker';
                console.log({ location, lat: location.latitude, lng: location.longitude, user });
                const marker = new mapboxgl.Marker(markerElement)
                    .setLngLat([location.longitude, location.latitude])
                    .addTo(map.current);

                // Example of adding a popup to the marker
                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h3>${location.shopName}</h3><p>${location.name}</p>`);

                marker.setPopup(popup);
            });


        }
        if (user) {
            const markerElement = document.createElement('div');
            markerElement.className = 'user-marker';
            const marker = new mapboxgl.Marker(markerElement)
                .setLngLat([user.location.longitude, user.location.latitude])
                .addTo(map.current);

            // Example of adding a popup to the marker
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>My Location</h3><p>${user.name}</p>`);

            marker.setPopup(popup);
        }

    }, [locations, lng, lat, zoom]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}
