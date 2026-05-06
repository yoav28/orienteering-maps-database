import {MapContainerProps} from "react-leaflet";
import {RefAttributes} from "react";
import {Map as LeafletMap} from "leaflet";


export type LocationType = {
	id: number;
	lat: number;
	lon: number;
	source: string;
	name: string;
	date: string;
	country: string;
};


export type Event = {
	id: number;
	lat: number;
	lon: number;
	map: string;
	date: string;
	name: string;
	country: string;
	class_id: number;
	event_url: string | null;
};

export type FilterState = {
    country: string | null;
	source: string;
	from: string;
	to: string;
	limit: number;
	mapStyle: string;
	name: string | null;
};

export type MapContainerType = MapContainerProps & RefAttributes<LeafletMap>;
