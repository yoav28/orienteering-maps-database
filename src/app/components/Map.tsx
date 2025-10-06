"use client";

import dynamic from "next/dynamic";
import {FilterState, MapContainerType} from "@/app/types";
import {useTheme} from "@/app/context/ThemeContext";
import React, {useEffect, useRef} from "react";
import Marks from "@/app/components/Marks";
import {Map as LeafletMap} from "leaflet";
import Tile from "@/app/components/Tile";

import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet/dist/leaflet.css";


const MapContainer = dynamic<MapContainerType>(
	() => import("react-leaflet").then((mod) => mod.MapContainer),
	{ssr: false}
);


interface Props {
	setMap: (map: LeafletMap) => void;
	center: [number, number];
	map: LeafletMap | null;
	filter: FilterState;
}


export default function Map({center, filter, map, setMap}: Props) {
	const {theme} = useTheme();
	const locateControlRef = useRef<any>(null);

	useEffect(() => {
		document.body.setAttribute("data-theme", theme);
	}, [theme]);

	useEffect(() => {
		if (!map || locateControlRef.current) return;

		import("leaflet.locatecontrol").then(({LocateControl}) => {
			const control = new LocateControl({
				flyTo: true,
				drawCircle: true,
				showCompass: true,
				initialZoomLevel: 14,
				locateOptions: {
					enableHighAccuracy: true,
				},
			});

			control.addTo(map);
			locateControlRef.current = control;
		});

		return () => {
			if (map && locateControlRef.current) {
				map.removeControl(locateControlRef.current);
				locateControlRef.current = null;
			}
		};
	}, [map]);

	return (
		<MapContainer
			className="map"
			center={center}
			zoom={2}
			scrollWheelZoom={false}
			ref={setMap}
			aria-label="Orienteering Maps"
		>
			<Tile filter={filter} theme={theme}/>

			<Marks
				country={filter.country}
				since={filter.since}
				limit={filter.limit}
				source={filter.source}
				name={filter.name}
			/>
		</MapContainer>
	);
}
