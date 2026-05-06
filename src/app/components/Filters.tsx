"use client";

import React from 'react';
import Image from 'next/image';
import {useCountries} from '@/app/hooks/useCountries';
import {displayCountry} from '@/app/lib/countries';
import {useTheme} from '../context/ThemeContext';
import {FilterState} from '@/app/types';


interface FiltersProps {
	filter: FilterState;
	setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
}


export function Filters({filter, setFilter}: FiltersProps) {
	const countries = useCountries();
	const {theme, toggleTheme} = useTheme();


	return <div className="filters" role="region" aria-label="MapWrapper Filters">
		<button onClick={toggleTheme} className="theme-toggle-button" aria-label={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}>
			{theme === 'light' ? (
				<Image src="/moon.svg" alt="Switch to Dark Mode" width={24} height={24}/>
			) : (
				<Image src="/sun.svg" alt="Switch to Light Mode" width={24} height={24}/>
			)}
		</button>

		<div>
			<label htmlFor="country">Country:</label>
			<select id="country" name="country" value={filter.country ?? "Sweden"} onChange={(e) => {
				        const value = e.target.value;
				        setFilter((prev) => ({...prev, country: value}));
			        }}>
				{countries.map((country) => (
					<option key={country} value={country}>
						{displayCountry(country)}
					</option>
				))}

				{/*Just for testing, wasting too much ram*/}
				<option value="all">All Countries</option>
			</select>
		</div>

		<div>
			<label htmlFor="from">From:</label>
			<input
				id="from"
				name="from"
				type="date"
				value={filter.from}
				onChange={(e) => {
					const value = e.target.value || "2000-01-01";
					setFilter((prev) => ({...prev, from: value}));
				}}
			/>
		</div>

		<div>
			<label htmlFor="to">To:</label>
			<input
				id="to"
				name="to"
				type="date"
				value={filter.to}
				onChange={(e) => {
					const value = e.target.value || new Date().toISOString().split("T")[0];
					setFilter((prev) => ({...prev, to: value}));
				}}
			/>
		</div>

		<div>
			<label htmlFor="limit">Limit:</label>
			<select id="limit" name="limit" defaultValue={filter.limit} onChange={(e) => {
				        const value = parseInt(e.target.value, 10);
				        setFilter((prev) => ({...prev, limit: isNaN(value) ? 999999 : value}));
			        }}>
				<option value="999999">No Limit</option>
				<option value="1000">1,000</option>
				<option value="10000">10,000</option>
				<option value="50000">50,000</option>
			</select>
		</div>

		<div>
			<label htmlFor="source">Source:</label>
			<select id="source" name="source" defaultValue={filter.source} onChange={(e) => {
				        const value = e.target.value;

				        if (value === "omaps-au")
					        return setFilter((prev) => ({...prev, country: "Australia", source: value}));

				        if (value === "omaps-no")
					        return setFilter((prev) => ({...prev, country: "Norway", source: value}));

				        if (value === "omaps")
					        return setFilter((prev) => ({...prev, country: "Sweden", source: value}));

				        setFilter((prev) => ({...prev, source: value}));
			        }}>
				<option value="all">All</option>
				<option value="livelox">Livelox</option>
				<option value="loggator">Loggator</option>
				<option value="omaps">Omaps Sweden</option>
				<option value="omaps-no">Omaps Norway</option>
				<option value="omaps-au">Omaps Australia</option>
			</select>
		</div>

		<div>
			<label htmlFor="mapStyle">Map Style:</label>
			<select id="mapStyle" name="mapStyle" defaultValue={filter.mapStyle} onChange={(e) => {
				        const value = e.target.value;
				        setFilter((prev) => ({...prev, mapStyle: value}));
			        }}>
				<option value="road">Road</option>
				<option value="satellite">Satellite</option>
				<option value="topographic">Topographic</option>
			</select>
		</div>
	</div>
}
