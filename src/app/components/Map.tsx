"use client";

import React, {RefAttributes, useEffect} from "react";
import {useTheme} from "@/app/context/ThemeContext";
import {MapContainerProps} from "react-leaflet";
import {Map as LeafletMap} from "leaflet";
import {FilterState} from "@/app/types";
import dynamic from "next/dynamic";


const [MapContainer, TileLayer, Marks] = [
	dynamic<MapContainerProps & RefAttributes<LeafletMap>>(() => import('react-leaflet').then((mod) => mod.MapContainer), {ssr: false}),

	dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {ssr: false}),

	dynamic(() => import('@/app/components/Marks'), {ssr: false})
];


const Tile = ({filter, theme}: {filter: FilterState, theme: string}) => {
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
	} as { [theme: string]: { [style: string]: string } };

	const url = tileLayers[theme][filter.mapStyle] || tileLayers.light.road;

	return <TileLayer url={url}/>
};


interface Props {
	setMap: (map: LeafletMap) => void;
	center: [number, number];
	filter: FilterState;
}



export default function Map({center, filter, setMap}: Props) {
	const {theme} = useTheme();

	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
	}, [theme]);


	return <MapContainer className="map" center={center} zoom={2} scrollWheelZoom={false} ref={setMap} aria-label="Orienteering Maps">
		<Tile filter={filter} theme={theme}/>

		<Marks country={filter.country} since={filter.since} limit={filter.limit} source={filter.source} name={filter.name}/>
	</MapContainer>
}
