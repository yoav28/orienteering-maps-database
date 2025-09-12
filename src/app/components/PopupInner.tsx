"use client";

import {isDesktop} from 'react-device-detect';
import {useEffect, useState} from "react";
import {Event} from "@/app/types";


export default function PopupInner({id}: { id: number }) {
	const [event, setEvent] = useState<Event | null>(null);
	
	
	useEffect(() => {
		const fetchEvent = async () => {
			const response = await fetch(`/api/events/${id}`);
			if (response.ok) {
				const data = await response.json();
				console.log(data)
				setEvent(data);
			} else {
				console.error("Failed to fetch event");
			}
		};

		fetchEvent();
	}, [id]);
	
	
	const open = () => {
		if (event && event.map) {
			window.open(event.map, '_blank');
		}
	};

	const download = async () => {
		if (!event || !event.map)
			return

		try {
			const response = await fetch(event.map, {mode: 'cors'});
			
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			
			link.href = url;
			link.download = `${event.name || 'map'}.png`;
			document.body.appendChild(link);
			link.click();
			
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} 
		
		catch (error) {
			console.error("Download failed", error);
			alert("Unable to download image.");
		}
	};


	if (!event) return null;


	const googleMaps = () => {
		const {lon, lat} = event;

		const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
		window.open(url, '_blank');
	};
	
	
	const EventUrl = () => {
		const {event_url} = event;
		
		if (!event_url)
			return null;

		return <button onClick={() => window.open(event_url, '_blank')} aria-label="Open event Url">Livelox</button>
	}


	const DownloadOrOpen = () => {
		if (isDesktop)
			return <button onClick={download} aria-label={`Download map for ${event.name}`}>Download</button>;

		return <button onClick={open} aria-label={`Open map for ${event.name}`}>Open</button>
	}



	return <div className="popup-inner">
		<b>{event.id} {event.name}</b><br/><br/>
		<span>{event.date}</span><br/>

		<img src={event.map} alt={`Map for ${event.name}`} onClick={open}/>

		<DownloadOrOpen/>
		
		<button onClick={googleMaps} aria-label="Google Maps">Google Maps</button>
		
		<EventUrl/>
	</div>
}