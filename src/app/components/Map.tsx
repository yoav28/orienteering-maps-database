"use client";

import React, {RefAttributes, useEffect, useState} from 'react';
import {useUserLocation} from '@/app/hooks/useUserLocation';
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
	const {center, country} = useUserLocation();
	const [filter, setFilter] = useState<FilterState>({
		country: country,
		since: "2000-01-01",
		limit: 10000,
	});
	
	useEffect(() => {
		console.log(country);
		
		if (country)
			setFilter((prev) => ({
				...prev,
				country: country,
			}));
	}, [country]);

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
