import {FilterState} from "@/app/types";
import dynamic from "next/dynamic";
import React from "react";


const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {ssr: false});

export default function Tile ({filter, theme}: { filter: FilterState; theme: string }) {
	const tileLayers = {
		light: {
			road: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			satellite:
				"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
			topographic: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
		},
		dark: {
			road: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
			satellite:
				"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
			topographic: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
		},
	} as { [theme: string]: { [style: string]: string } };

	const url = tileLayers[theme][filter.mapStyle] || tileLayers.light.road;

	return <TileLayer url={url}/>;
};
