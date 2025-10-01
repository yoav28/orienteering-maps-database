"use client";

import React, {useEffect, useState} from 'react';
import {Skeleton} from '@/app/components/Skeleton';
import {Filters} from '@/app/components/Filters';
import {Map as LeafletMap} from 'leaflet';
import {FilterState} from '@/app/types';
import Map from "@/app/components/Map";
import "../styles/skeleton.scss";
import "../styles/filters.scss";
import "../styles/popup.scss";
import "../styles/app.scss";


const daysBack = (days: number) => {
	const date = new Date(Date.now() - days * 1000 * 60 * 60 * 24);
	return date.toISOString().split('T')[0];
};


export default function MapWrapper() {
	const [center, setCenter] = useState<[number, number] | null>(null);
	const [isSidebarOpen, setisSidebarOpen] = useState(false);
	const [map, setMap] = useState<LeafletMap | null>(null);
	const [filter, setFilter] = useState<FilterState>({
		since: daysBack(365 * 5), // Default to 5 years back
		mapStyle: "road",
		country: null,
		limit: 999999,
		source: "all",
		name: null
	});

	
	useEffect(() => {
		const fetchLocation = async () => {
			try {
				let latitude: number | null = null;
				let longitude: number | null = null;
				let country: string | null = null;

				// Try ipregistry.co
				try {
					const response = await fetch('https://api.ipregistry.co/?key=tryout');
					const data = await response.json();
					if (data.location) {
						latitude = data.location.latitude;
						longitude = data.location.longitude;
						country = data.location.country.name;
					}
				} catch (error) {
					console.error('Failed to fetch from ipregistry:', error);
				}

				// If not found, try ipapi.co
				if (latitude === null || longitude === null) {
					try {
						const res = await fetch('https://ipapi.co/json/');
						const d = await res.json();
						if (d.latitude) {
							latitude = d.latitude;
							longitude = d.longitude;
							country = d.country_name || null;
						}
					} catch (error) {
						console.error('Failed to fetch from ipapi.co:', error);
					}
				}

				// If not found, try ipify.org then ipapi.co
				if (latitude === null || longitude === null) {
					try {
						const res_ = await fetch('https://api.ipify.org?format=json');
						const d_ = await res_.json();
						const res__ = await fetch(`https://ipapi.co/${d_.ip}/json/`);
						const d__ = await res__.json();
						if (d__.latitude) {
							latitude = d__.latitude;
							longitude = d__.longitude;
							country = d__.country_name || null;
						}
					} catch (error) {
						console.error('Failed to fetch from ipify/ipapi.co (fallback):', error);
					}
				}

				if (latitude !== null && longitude !== null) {
					setCenter([latitude, longitude]);
					setFilter((prev) => ({
						...prev,
						country: country || "Sweden"
					}));
				} else {
					console.log('Default center used: [50, 15]');
					setCenter([50, 15]);
					setFilter((prev) => ({
						...prev,
						country: "Sweden"
					}));
				}
			}

			catch (error) {
				console.error('Error in location API route:', error);
			}
		};
		fetchLocation();
	}, []);


	useEffect(() => {
		if (!filter.country || !map) return;

		const fetchCountryCoordinates = async (country: string) => {
			try {
				const response = await fetch(`https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(country)}&format=json&limit=1`);
				const data = await response.json();
				if (data && data.length > 0) {
					const { lat, lon } = data[0];
					const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
					map.flyTo(newCenter, 5);
				}
			} 
			
			catch (error) {
				console.error('Failed to fetch country coordinates:', error);
			}
		};

		fetchCountryCoordinates(filter.country);
	}, [filter.country, map]);


	if (center === null)
		return <Skeleton/>;


	return <div className="container">
		<button className="filter-toggle-button" onClick={() => setisSidebarOpen(!isSidebarOpen)} aria-expanded={isSidebarOpen} aria-controls="filter-sidebar">
			Filters
		</button>

		<Filters daysBack={daysBack} filter={filter} setFilter={setFilter}/>

		<div id="filter-sidebar" className={`filter-sidebar ${isSidebarOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
			<button className="close-sidebar-button" onClick={() => setisSidebarOpen(false)} aria-label="Close sidebar">&times;</button>
			<Filters daysBack={daysBack} filter={filter} setFilter={setFilter}/>
		</div>

		<Map center={center} filter={filter} map={map} setMap={setMap}/>
	</div>
}
