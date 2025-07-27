"use client";

import React, {RefAttributes, useEffect, useState} from 'react';
import {Filters} from '@/app/components/Filters';
import {MapContainerProps} from 'react-leaflet';
import Marks from '@/app/components/Marks';
import {Map as LeafletMap} from 'leaflet';
import {FilterState} from '@/app/types';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import "../app.scss";


const [MapContainer, TileLayer] = [
	dynamic<MapContainerProps & RefAttributes<LeafletMap>>(
		() => import('react-leaflet').then((mod) => mod.MapContainer), {ssr: false}
	),
	dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {ssr: false}),
];


export default function Map() {
	const [center, setCenter] = useState<[number, number] | null>(null);
	const [filter, setFilter] = useState<FilterState>({
		country: null,
		since: "2000-01-01",
		limit: 10000,
	});

	useEffect(() => {
		const fetchLocation = async () => {
			const response = await fetch('/api/location');
			const data = await response.json();

			if (data.latitude && data.longitude)
				setCenter([data.latitude, data.longitude]);
	  
			
			if (data.country) {
				setFilter((prev) => ({...prev, country: data.country}));
			}
		};
		fetchLocation();
	}, []);

	if (center === null) return <span>Loading...</span>;
	

	return (
		<div className="container">
			<Filters filter={filter} setFilter={setFilter}/>

			<MapContainer className="map" center={center} zoom={7} scrollWheelZoom={false} preferCanvas={true}>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

				<Marks country={filter.country} since={filter.since} limit={filter.limit}/>
			</MapContainer>
		</div>
	);
}
