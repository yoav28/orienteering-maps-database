"use client";

import {useEffect, useState} from "react";
import {Event} from "@/app/types";


export default function PopupInner({id}: { id: number }) {
	const [event, setEvent] = useState<Event | null>(null);
	
	
	useEffect(() => {
		const fetchEvent = async () => {
			const response = await fetch(`/api/events/${id}`);
			if (response.ok) {
				const data = await response.json();
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


	if (!event) return null;

	return <div className="popup-inner">
		<b>{event.id} {event.name}</b><br/><br/>
		<span>{event.date}</span><br/>

		<img src={event.map} alt={event.name} onClick={open}/>
	</div>
}