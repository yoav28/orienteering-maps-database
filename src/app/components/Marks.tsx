"use client";

import React, {ReactNode, useEffect, useMemo, useState} from "react";
import PopupInner from "@/app/components/PopupInner";
import {LocationType} from "@/app/types";
import dynamic from "next/dynamic";


const [CircleMarker, Popup, MarkerClusterGroup] = [
	dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), { ssr: false }),
	dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false }),
	dynamic(() => import('react-leaflet-markercluster').then(mod => mod.default), { ssr: false })
];


interface MarksProps {
	country: string | null;
	source: string;
	since: string;
	limit: number;
	name: string | null;
}


export default function Marks({country, since, limit, source, name}: MarksProps) {
	const [events, setEvents] = useState<LocationType[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (country) {
			fetchEvents();
		}
	}, [country, since, limit, source, name]);


	const fetchEvents = async () => {
		setLoading(true);
		const params = new URLSearchParams({
			limit: (limit || 999999).toString(),
			country: country || "",
			source: source,
			since: since,
			...(name && { name })
		}).toString();


		const response = await fetch(`/api/maps?${params}`);

		if (!response.ok) {
			console.error("Failed to fetch events:", response.statusText);
			setLoading(false);
			return;
		}
		
		const data = await response.json();

		setEvents(data as LocationType[]);
		setLoading(false);
	};


	const allMarkers = useMemo(() => events.map((mark: LocationType) => {
		const getColor = (source: string) => {
			if (source === "livelox")
				return "red";

			if (source === "loggator")
				return "orange";

			if (source === "omaps")
				return "#005583";

			if (source === "omaps-no")
				return "#00205B";

			if (source === "omaps-au")
				return "#012169";

			return "black";
		}

		return <CircleMarker key={mark.id} center={[mark.lat, mark.lon]} pathOptions={{color: getColor(mark.source), fillOpacity: 0}} radius={3}>
			<Popup className="popup">
				<PopupInner id={mark.id}/>
			</Popup>
		</CircleMarker>
	}), [events]);
	
	if (loading) {
		return <div className="loading-indicator">Loading maps...</div>;
	}

	if (events.length === 0) {
		return <div className="empty-state-message">No maps found for the selected filters.</div>;
	}

	return <MarkerClusterGroup>
		{allMarkers}
	</MarkerClusterGroup>
}
