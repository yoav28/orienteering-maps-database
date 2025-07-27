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
	
	return <div>
		
	</div>
}