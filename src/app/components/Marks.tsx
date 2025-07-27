"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useMapEvents } from 'react-leaflet';
import { LocationType } from "@/app/types";
import dynamic from "next/dynamic";
import L from 'leaflet';
import PopupInner from "@/app/components/PopupInner";

const [CircleMarker, Popup] = [
	dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), { ssr: false }),
	dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false }),
];

interface MarksProps {
  country: string | null;
  since: string;
  limit: number;
}


export default function Marks({ country, since, limit }: MarksProps) {
	const [renderedMarkers, setRenderedMarkers] = useState<ReactNode[]>([]);
	const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
	const [events, setEvents] = useState<LocationType[]>([]);
	const [zoom, setZoom] = useState<number>(0);

	
	useEffect(() => {
		if (country) {
			fetchEvents();
		}
	}, [country, since, limit]);


	const fetchEvents = async () => {
		const response = await fetch(`/api/maps?limit=${limit || 999999}&since=${since || "2000-01-01"}&country=${country}`);
		const data = await response.json();

		setEvents(data as LocationType[]);
	};
	

	const MapEvents = () => {
		useMapEvents({
			moveend: (event) => {
				const bounds = event.target.getBounds();
				setBounds(bounds);
				
				const zoom = event.target.getZoom();
				setZoom(zoom);
			},
		});

		return null;
	};

	
	const allMarkers = useMemo(() => events.map((mark: LocationType) => {
		return <CircleMarker key={mark.id} center={[mark.lat, mark.lon]} pathOptions={{color: "red", fillOpacity: 0}} radius={3}>
			<Popup className="popup">
				<PopupInner id={mark.id}/>
			</Popup>
		</CircleMarker>
	}), [events]);

	
	const visibleMarkers = useMemo(() => {
		const len = allMarkers.length;
		
		if (!bounds || len === 0)
			return [];
		
		if (zoom < 3 && len > 500)
			return allMarkers.slice(0, 500);
		
		if (zoom < 5 && len > 1000) 
			return allMarkers.slice(0, 1000);
		
		if (zoom < 8 && len > 5000)
			return allMarkers.slice(0, 5000);
		

		return allMarkers.filter((mark: any) => bounds.contains(mark.props.center));
	}, [bounds, allMarkers, zoom]);

	
	useEffect(() => {
		setRenderedMarkers([]);
		
		if (visibleMarkers.length > 0) {
			const chunkSize = 1000;
			
			const renderChunk = (index = 0) => {
				const chunk = visibleMarkers.slice(index, index + chunkSize);
				
				if (chunk.length > 0) {
					setRenderedMarkers((prev) => {
						const existingIds = new Set(prev.map((m: any) => m.key));
						const newMarkers = chunk.filter((m: any) => !existingIds.has(m.key));
						return [...prev, ...newMarkers];
					});
					
					setTimeout(() => renderChunk(index + chunkSize), 100);
				}
			};
			renderChunk();
		}
	}, [visibleMarkers]);



	return <div>
		<MapEvents/>

		{renderedMarkers}
	</div>
}
