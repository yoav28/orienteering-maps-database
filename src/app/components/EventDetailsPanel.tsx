"use client";

import React, {useEffect, useMemo, useState} from "react";
import {Event, LocationType} from "@/app/types";


const eventCache = new Map<number, Event>();


interface EventDetailsPanelProps {
	events: LocationType[];
	selectedEventId: number | null;
	onSelectEvent: (id: number) => void;
	onClose: () => void;
}


export default function EventDetailsPanel({events, selectedEventId, onSelectEvent, onClose}: EventDetailsPanelProps) {
	const [eventDetails, setEventDetails] = useState<Event | null>(null);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const [hasImageError, setHasImageError] = useState(false);

	const selectedIndex = useMemo(
		() => selectedEventId === null ? -1 : events.findIndex((event) => event.id === selectedEventId),
		[events, selectedEventId]
	);

	const selectedPreview = selectedIndex >= 0 ? events[selectedIndex] : null;

	useEffect(() => {
		setIsImageLoaded(false);
		setHasImageError(false);
	}, [selectedEventId]);

	useEffect(() => {
		if (selectedEventId === null) {
			setEventDetails(null);
			return;
		}

		const cachedEvent = eventCache.get(selectedEventId);
		if (cachedEvent) {
			setEventDetails(cachedEvent);
			setIsLoadingDetails(false);
			return;
		}

		setEventDetails(null);
		const controller = new AbortController();
		setIsLoadingDetails(true);

		const fetchEvent = async () => {
			try {
				const response = await fetch(`/api/events/${selectedEventId}`, {signal: controller.signal});

				if (!response.ok) {
					console.error("Failed to fetch event details");
					return;
				}

				const fetchedEvent = await response.json() as Event;
				eventCache.set(selectedEventId, fetchedEvent);
				setEventDetails(fetchedEvent);
			}

			catch (error) {
				if (error instanceof DOMException && error.name === "AbortError")
					return;

				console.error("Failed to fetch event details", error);
			}

			finally {
				if (!controller.signal.aborted) {
					setIsLoadingDetails(false);
				}
			}
		};

		void fetchEvent();

		return () => {
			controller.abort();
		};
	}, [selectedEventId]);

	if (!selectedPreview || selectedEventId === null) {
		return null;
	}

	const mapUrl = eventDetails?.map || null;
	const eventUrl = eventDetails?.event_url || null;
	const isLoadingImage = !!mapUrl && !isImageLoaded && !hasImageError;

	const goToEventOffset = (offset: number) => {
		const nextIndex = selectedIndex + offset;
		if (nextIndex < 0 || nextIndex >= events.length) {
			return;
		}

		onSelectEvent(events[nextIndex].id);
	};

	const openMap = () => {
		if (!mapUrl) {
			return;
		}

		window.open(mapUrl, '_blank');
	};

	const downloadMap = async () => {
		if (!mapUrl) {
			return;
		}

		try {
			const response = await fetch(mapUrl, {mode: 'cors'});
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = `${selectedPreview.name || 'map'}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}

		catch (error) {
			console.error("Failed to download map", error);
		}
	};

	const openGoogleMaps = () => {
		window.open(`https://www.google.com/maps/search/?api=1&query=${selectedPreview.lat},${selectedPreview.lon}`, '_blank');
	};


	return <aside className="event-details-panel" role="complementary" aria-label="Event details panel">
		<div className="event-details-header">
			<div>
				<h3>{selectedPreview.name || `Event ${selectedPreview.id}`}</h3>
				<p>{selectedPreview.date} · {selectedPreview.country}</p>
			</div>

			<button className="panel-close-button" onClick={onClose} aria-label="Close event details">
				×
			</button>
		</div>

		<div className="event-details-nav">
			<button onClick={() => goToEventOffset(-1)} disabled={selectedIndex <= 0}>
				Previous
			</button>
			<span>{selectedIndex + 1} / {events.length}</span>
			<button onClick={() => goToEventOffset(1)} disabled={selectedIndex >= events.length - 1}>
				Next
			</button>
		</div>

		<div className="event-thumbnail">
			{isLoadingImage && <div className="event-thumbnail-skeleton">Loading map preview...</div>}

			{mapUrl && !hasImageError && <img
				src={mapUrl}
				alt={`Map for ${selectedPreview.name}`}
				onLoad={() => setIsImageLoaded(true)}
				onError={() => {
					setHasImageError(true);
					setIsImageLoaded(false);
				}}
				style={{display: isImageLoaded ? 'block' : 'none'}}
			/>}

			{(!mapUrl || hasImageError) && <div className="event-thumbnail-skeleton">Map preview unavailable</div>}
		</div>

		<div className="event-details-actions">
			<button onClick={openMap} disabled={!mapUrl}>
				Open map
			</button>
			<button onClick={downloadMap} disabled={!mapUrl}>
				Download
			</button>
			<button onClick={openGoogleMaps}>
				Google Maps
			</button>
			<button onClick={() => eventUrl && window.open(eventUrl, '_blank')} disabled={!eventUrl}>
				Event Link
			</button>
		</div>

		{isLoadingDetails && <p className="event-details-loading">Loading full event details...</p>}
	</aside>
}
