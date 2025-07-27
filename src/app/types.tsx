export type LocationType = {
	id: number;
	lat: number;
	lon: number;
};


export type Event = {
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
  since: string;
  limit: number;
};