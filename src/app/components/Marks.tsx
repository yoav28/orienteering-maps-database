"use client";

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {isMobile} from 'react-device-detect';
import {LocationType} from "@/app/types";
import dynamic from "next/dynamic";
import EventDetailsPanel from "@/app/components/EventDetailsPanel";


const [CircleMarker, MarkerClusterGroup] = [
	dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), {ssr: false}),
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
	const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
	const markerSize = isMobile ? 7 : 4;

	useEffect(() => {
		if (!country) {
			setEvents([]);
			setSelectedEventId(null);
			setLoading(false);
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

	useEffect(() => {
		if (!selectedEventId) {
			return;
		}

		const hasSelectedEvent = events.some((event) => event.id === selectedEventId);
		if (!hasSelectedEvent) {
			setSelectedEventId(null);
		}
	}, [events, selectedEventId]);

	const eventsById = useMemo(() => {
		const result = new Map<number, LocationType>();
		for (const event of events) {
			result.set(event.id, event);
		}

		return result;
	}, [events]);

	const selectEvent = useCallback((eventId: number) => {
		if (!eventsById.has(eventId)) {
			return;
		}

		setSelectedEventId(eventId);
	}, [eventsById]);

	const allMarkers = useMemo(() => events.map((mark) => {
		return <CircleMarker
			key={mark.id}
			center={[mark.lat, mark.lon]}
			pathOptions={{color: getColor(mark.source)}}
			radius={markerSize}
			eventHandlers={{
				click: () => selectEvent(mark.id),
			}}
		/>;
	}), [events, markerSize, selectEvent]);

	if (loading && events.length === 0) {
		return <div className="loading-indicator">Loading maps...</div>;
	}

	if (!loading && events.length === 0) {
		return <div className="empty-state-message">No maps found for the selected filters.</div>;
	}

	return <>
		<MarkerClusterGroup
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

		<EventDetailsPanel
			events={events}
			selectedEventId={selectedEventId}
			onClose={() => setSelectedEventId(null)}
		/>
	</>;
}
