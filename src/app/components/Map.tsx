"use client";

import React, {RefAttributes, useEffect, useState} from 'react';
import {Filters} from '@/app/components/Filters';
import {MapContainerProps} from 'react-leaflet';
const Marks = dynamic(() => import('@/app/components/Marks'), { ssr: false });
import {Map as LeafletMap} from 'leaflet';
import {FilterState} from '@/app/types';
import dynamic from 'next/dynamic';
import {Skeleton} from '@/app/components/Skeleton';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import "../app.scss";
import { useTheme } from '../context/ThemeContext';


const [MapContainer, TileLayer] = [
	dynamic<MapContainerProps & RefAttributes<LeafletMap>>(
		() => import('react-leaflet').then((mod) => mod.MapContainer), {ssr: false}
	),
	dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {ssr: false}),
];


export default function Map() {
	const [map, setMap] = useState<LeafletMap | null>(null);
	const [center, setCenter] = useState<[number, number] | null>(null);
	const [filter, setFilter] = useState<FilterState>({
		country: null,
		since: "2000-01-01",
		limit: 999999,
		source: "all",
		name: null,
		mapStyle: "road"
	});
	const { theme } = useTheme();

	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
	}, [theme]);

	useEffect(() => {
		const fetchLocation = async () => {
			const response = await fetch('/api/location');
			const data = await response.json();

			if (data.latitude && data.longitude)
				setCenter([data.latitude, data.longitude]);
	  
			
			setFilter((prev) => ({
				...prev,
				country: data.country || "Sweden"
			}));
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
					map.flyTo(newCenter, 6);
				}
			} 
			
			catch (error) {
				console.error('Failed to fetch country coordinates:', error);
			}
		};

		fetchCountryCoordinates(filter.country);
	}, [filter.country, map]);


	if (center === null) return <Skeleton />;

	const tileLayers = {
		light: {
			road: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
			topographic: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
		},
		dark: {
			road: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
			satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
			topographic: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
		}
	};

	const getTileLayerUrl = () => {
		return tileLayers[theme][filter.mapStyle] || tileLayers[theme].road;
	};


	return (
		<div className="container">
			<Filters filter={filter} setFilter={setFilter}/>

			<MapContainer className="map" center={center} zoom={2} scrollWheelZoom={false} ref={setMap}>
				<TileLayer url={getTileLayerUrl()}/>

				<Marks country={filter.country} since={filter.since} limit={filter.limit} source={filter.source} name={filter.name}/>
			</MapContainer>
		</div>
	);
}
