"use client";

import React, {memo, useEffect, useMemo, useState} from "react";
import PopupInner from "@/app/components/PopupInner";
import {isMobile} from 'react-device-detect';
import {LocationType} from "@/app/types";
import dynamic from "next/dynamic";


const [CircleMarker, Popup, MarkerClusterGroup] = [
	dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), {ssr: false}),
	dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {ssr: false}),
	dynamic(() => import('react-leaflet-markercluster').then(mod => mod.default), {ssr: false})
];


const sourceColors: Record<string, string> = {
	livelox: "red",
	loggator: "orange",
	omaps: "#005583",
	"omaps-no": "#00205B",
	"omaps-au": "#012169",
};

const getColor = (source: string) => sourceColors[source] || "black";


const MarkerPopup = memo(function MarkerPopup({id}: { id: number }) {
	const [hasOpened, setHasOpened] = useState(false);

	return (
		<Popup
			className="popup"
			eventHandlers={{
				add: () => setHasOpened(true),
			}}
		>
			{hasOpened ? <PopupInner id={id}/> : <div>Loading...</div>}
		</Popup>
	);
});


interface MarksProps {
	country: string | null;
	name: string | null;
	source: string;
	since: string;
	limit: number;
}


export default function Marks({country, since, limit, source, name}: MarksProps) {
	const [events, setEvents] = useState<LocationType[]>([]);
	const [loading, setLoading] = useState(true);
	const markerSize = isMobile ? 7 : 4;

	useEffect(() => {
		if (!country) {
			return;
		}

		const controller = new AbortController();
		const fetchEvents = async () => {
			setLoading(true);
			const params = new URLSearchParams({
				limit: (limit || 999999).toString(),
				country,
				source,
				since,
				...(name && {name})
			}).toString();

			try {
				const response = await fetch(`/api/maps?${params}`, {signal: controller.signal});

				if (!response.ok) {
					console.error("Failed to fetch events:", response.statusText);
					return;
				}

				const data = await response.json();
				setEvents(data as LocationType[]);
			}

			catch (error) {
				if (error instanceof DOMException && error.name === "AbortError")
					return;

				console.error("Failed to fetch events:", error);
			}

			finally {
				if (!controller.signal.aborted)
					setLoading(false);
			}
		};

		void fetchEvents();

		return () => {
			controller.abort();
		};
	}, [country, since, limit, source, name]);


	const allMarkers = useMemo(() => events.map((mark: LocationType) => {
		return <CircleMarker key={mark.id} center={[mark.lat, mark.lon]} pathOptions={{color: getColor(mark.source)}} radius={markerSize}>
			<MarkerPopup id={mark.id}/>
		</CircleMarker>
	}), [events, markerSize]);

	if (loading && events.length === 0) {
		return <div className="loading-indicator">Loading maps...</div>;
	}

	if (!loading && events.length === 0) {
		return <div className="empty-state-message">No maps found for the selected filters.</div>;
	}

	return <MarkerClusterGroup
		chunkedLoading
		chunkInterval={120}
		chunkDelay={25}
		removeOutsideVisibleBounds
		showCoverageOnHover={false}
		spiderfyOnMaxZoom={false}
		animate={false}
		animateAddingMarkers={false}
	>
		{allMarkers}
	</MarkerClusterGroup>
}
