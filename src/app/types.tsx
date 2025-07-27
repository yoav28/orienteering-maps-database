export type LocationType = {
	id: number;
	lat: number;
	lon: number;
	source: string;
};


export type Event = {
	id: number;
	lat: number;
	lon: number;
	map: string;
	date: string;
	name: string;
	country: string;
	class_id: number;
};

export type FilterState = {
    country: string | null;
	source: string;
	since: string;
	limit: number;
};