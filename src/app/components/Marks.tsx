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
	const [renderedMarkers, setRenderedMarkers] = useState<ReactNode[]>([]);
	const [events, setEvents] = useState<LocationType[]>([]);

	
	useEffect(() => {
		if (country) {
			fetchEvents();
		}
	}, [country, since, limit, source]);


	const fetchEvents = async () => {
		console.log(country);
		
		const params = new URLSearchParams({
			limit: (limit || 999999).toString(),
			country: country || "",
			source: source,
			since: since,
			...(name && { name })
		}).toString();


		const response = await fetch(`/api/maps?${params}`);

		if (!response.ok)
			return console.error("Failed to fetch events:", response.statusText);
		
		const data = await response.json();

		setEvents(data as LocationType[]);
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
	
	

	useEffect(() => {
		setRenderedMarkers([]);

		if (allMarkers.length > 0) {
			const chunkSize = 500;

			const renderChunk = (index = 0) => {
				const chunk = allMarkers.slice(index, index + chunkSize);

				if (chunk.length > 0) {
					setRenderedMarkers((prev) => {
						const existingIds = new Set(prev.map((m: any) => m.key));
						const newMarkers = chunk.filter((m: any) => !existingIds.has(m.key));
						return [...prev, ...newMarkers];
					});

					setTimeout(() => renderChunk(index + chunkSize), 150);
				}
			};
			renderChunk();
		}
	}, [allMarkers]);

	
	
	return <MarkerClusterGroup>
		{renderedMarkers}
	</MarkerClusterGroup>
}
