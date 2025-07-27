import React from 'react';


export function Skeleton() {
	return <div className="container">
		<div className="filters skeleton-filters">
			<div className="skeleton-filter-item"></div>
			<div className="skeleton-filter-item"></div>
			<div className="skeleton-filter-item"></div>
			<div className="skeleton-filter-item"></div>
		</div>
		<div className="map skeleton-map"></div>
	</div>
}
