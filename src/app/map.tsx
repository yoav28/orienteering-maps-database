"use client";

import React, {RefAttributes, useEffect, useState} from 'react';
import {MapContainerProps} from 'react-leaflet';
import {Map as LeafletMap} from 'leaflet';
import dynamic from 'next/dynamic';
import Marks from "@/app/marks";
import 'leaflet/dist/leaflet.css';
import "./app.scss";


const [MapContainer, TileLayer, CircleMarker, Popup] = [
	dynamic<MapContainerProps & RefAttributes<LeafletMap>>(
		() => import('react-leaflet').then((mod) => mod.MapContainer), {ssr: false}
	),
	dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {ssr: false}),
	dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), {ssr: false}),
	dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {ssr: false}),
];


export default function Map() {
	const [center, setCenter] = useState<[number, number] | null>(null);
	const [countries, setCountries] = useState<string[]>([]);
	const [filter, setFilter] = useState({
		country: null as string | null,
		since: "2000-01-01",
		limit: 10000,
	});


	useEffect(() => {
		getLocation();

		fetch(`/api/countries`).then(async (r) => {
			if (!r.ok)
				return console.error('Failed to fetch countries');

			const data = await r.json();
			console.log(data);
			setCountries(data);
		});
	}, []);


	const daysBack = (days: number) => {
		const date = new Date(Date.now() - days * 1000 * 60 * 60 * 24);
		return date.toISOString().split('T')[0];
	}


	const getLocation = async () => {
		const response = await fetch('https://api.ipregistry.co/?key=tryout');
		const data = await response.json();

		if (data.location)
			return setCenter([data.location.latitude, data.location.longitude]);

		const res = await fetch('https://ipapi.co/json/');
		const d = await res.json();

		if (d.latitude) {
			return setCenter([d.latitude, d.longitude]);
		}

		const res_ = await fetch('https://api.ipify.org?format=json');
		const d_ = await res_.json();

		const res__ = await fetch(`https://ipapi.co/${d_.ip}/json/`);
		const d__ = await res__.json();

		if (d__.latitude)
			return setCenter([d__.latitude, d__.longitude]);

		console.log('Default center used: [50, 15]');
		return setCenter([50, 15]);
	}


	const displayCountry = (country: string) => {
		const emojis: Record<string, string> = {
			"Sweden": "🇸🇪",
			"Israel": "🇮🇱",
			"Czechia": "🇨🇿",
			"Norway": "🇳🇴",
			"Finland": "🇫🇮",
			"Latvia": "🇱🇻",
			"Switzerland": "🇨🇭",
			"Spain": "🇪🇸",
			"Italy": "🇮🇹",
			"United Kingdom": "🇬🇧",
			"Japan": "🇯🇵",
			"Belgium": "🇧🇪",
			"Turkey": "🇹🇷",
			"Austria": "🇦🇹",
			"Bulgaria": "🇧🇬",
			"Hungary": "🇭🇺",
			"United States": "🇺🇸",
			"Australia": "🇦🇺",
			"Germany": "🇩🇪",
			"France": "🇫🇷",
			"Romania": "🇷🇴",
			"Denmark": "🇩🇰",
			"Poland": "🇵🇱",
			"Estonia": "🇪🇪",
			"Slovenia": "🇸🇮",
			"Ukraine": "🇺🇦",
			"Canada": "🇨🇦",
			"Indonesia": "🇮🇩",
			"Portugal": "🇵🇹",
			"Greenland": "🇬🇱",
			"New Zealand": "🇳🇿",
			"Belarus": "🇧🇾",
			"Moldova": "🇲🇩",
			"China": "🇨🇳",
			"Lithuania": "🇱🇹",
			"North Macedonia": "🇲🇰",
			"Netherlands": "🇳🇱",
			"Slovakia": "🇸🇰",
			"Taiwan, Province of China": "🇹🇼",
			"Iceland": "🇮🇸",
			"Serbia": "🇷🇸",
			"Hong Kong": "🇭🇰",
			"Ireland": "🇮🇪",
			"Russian Federation": "🇷🇺",
			"Colombia": "🇨🇴",
			"Luxembourg": "🇱🇺",
			"Croatia": "🇭🇷",
			"South Korea": "🇰🇷",
			"Georgia": "🇬🇪",
			"Mauritius": "🇲🇺",
			"Ecuador": "🇪🇨",
			"Brazil": "🇧🇷",
			"Thailand": "🇹🇭",
			"Bahrain": "🇧🇭",
			"Malaysia": "🇲🇾",
			"Morocco": "🇲🇦",
			"Dominica": "🇩🇲",
			"Saint Helena": "🇸🇭",
			"Antigua and Barbuda": "🇦🇬",
			"Saint Kitts and Nevis": "🇰🇳",
			"Puerto Rico": "🇵🇷",
			"Bosnia and Herzegovina": "🇧🇦",
			"South Africa": "🇿🇦",
			"Faroe Islands": "🇫🇴"
		};
		
		const emoji = emojis[country];

		const shortCountryNames: Record<string, string> = {
			"United States": "USA",
			"United Kingdom": "UK",
			"South Korea": "Korea",
			"Russian Federation": "Russia",
			"Taiwan, Province of China": "Taiwan",
			"Bosnia and Herzegovina": "Herzegovina",
			"Saint Kitts and Nevis": "St. Kitts",
			"Saint Helena": "St. Helena",
			"Antigua and Barbuda": "Antigua",
		}

		return `${emoji ? emoji + ' ' : ''}${shortCountryNames[country] || country}`;
	}

	if (center === null) return <span>Loading...</span>


	return <div className="container">
		<div className="filters">
			<div>
				<label htmlFor="country">Country:</label>

				<select id="country" name="country" onChange={(e) => {
					const value = e.target.value;
					setFilter((prev) => ({...prev, country: value === "All" ? null : value}));
				}}>
					
					{countries.map((country) => (
						<option key={country} value={country}>{displayCountry(country)}</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="since">Since:</label>

				<select id="since" name="since" defaultValue={filter.since} onChange={(e) => {
					const value = e.target.value;
					setFilter((prev) => ({...prev, since: value,}));
				}}>
					
					<option value="2000-01-01">All</option>
					<option value={daysBack(7)}>Last 7 days</option>
					<option value={daysBack(30)}>Last 30 days</option>
					<option value={daysBack(90)}>Last 90 days</option>
					<option value={daysBack(365)}>Last year</option>
					<option value={daysBack(365 * 2)}>Last 2 years</option>
				</select>
			</div>

			<div>
				<label htmlFor="limit">Limit:</label>

				<select id="limit" name="limit" defaultValue={filter.limit} onChange={(e) => {
					const value = parseInt(e.target.value, 10);
					setFilter((prev) => ({...prev, limit: isNaN(value) ? 999999 : value,}));
				}}>
					
					<option value="999999" selected>No Limit</option>
					<option value="1000">1,000</option>
					<option value="10000">10,000</option>
					<option value="50000">50,000</option>
				</select>
			</div>
		</div>

		<MapContainer className="map" center={center} zoom={7} scrollWheelZoom={false} preferCanvas={true}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

			<Marks country={filter.country} since={filter.since} limit={filter.limit}/>
		</MapContainer>
	</div>

}
