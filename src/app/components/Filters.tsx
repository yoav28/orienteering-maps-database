"use client";

import React from 'react';
import {useCountries} from '@/app/hooks/useCountries';
import {displayCountry} from '@/app/lib/countries';
import {FilterState} from '@/app/types';


interface FiltersProps {
	filter: FilterState;
	setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
}


export function Filters({filter, setFilter}: FiltersProps) {
	const countries = useCountries();


	const daysBack = (days: number) => {
		const date = new Date(Date.now() - days * 1000 * 60 * 60 * 24);
		return date.toISOString().split('T')[0];
	};


	return <div className="filters">
		<div>
			<label htmlFor="country">Country:</label>
			<select id="country" name="country" defaultValue={filter.country ?? "Sweden"}
			        onChange={(e) => {
					const value = e.target.value;
					setFilter((prev) => ({...prev, country: value}));
				}}
			>
				{countries.map((country) => (
					<option key={country} value={country}>
						{displayCountry(country)}
					</option>
				))}
			</select>
		</div>

		<div>
			<label htmlFor="since">Since:</label>
			<select id="since" name="since" defaultValue={filter.since} 
			        onChange={(e) => {
					const value = e.target.value;
					setFilter((prev) => ({...prev, since: value}));
				}}
			>
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
			<select id="limit" name="limit" defaultValue={filter.limit}
				onChange={(e) => {
					const value = parseInt(e.target.value, 10);
					setFilter((prev) => ({...prev, limit: isNaN(value) ? 999999 : value}));
				}}
			>
				<option value="999999">No Limit</option>
				<option value="1000">1,000</option>
				<option value="10000">10,000</option>
				<option value="50000">50,000</option>
			</select>
		</div>
	</div>
}
