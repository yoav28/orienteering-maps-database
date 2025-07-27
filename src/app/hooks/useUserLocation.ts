"use client";

import {useEffect, useState} from 'react';



export function useUserLocation() {
	const [center, setCenter] = useState<[number, number] | null>(null);
    const [country, setCountry] = useState<string | null>(null);

	useEffect(() => {
		const getLocation = async () => {
			try {
				const response = await fetch('https://api.ipregistry.co/?key=tryout');
				const data = await response.json();
				if (data.location) {
					setCenter([data.location.latitude, data.location.longitude]);
                    setCountry(data.country);
                    
					return;
				}
			} 
            
            catch (error) {
				console.error('Failed to fetch from ipregistry:', error);
			}

			try {
				const res = await fetch('https://ipapi.co/json/');
				const d = await res.json();
				if (d.latitude) {
					setCenter([d.latitude, d.longitude]);
                    setCountry(d.country_name || null);
                    
					return;
				}
			} 
            
            catch (error) {
				console.error('Failed to fetch from ipapi.co:', error);
			}

			try {
				const res_ = await fetch('https://api.ipify.org?format=json');
				const d_ = await res_.json();
				const res__ = await fetch(`https://ipapi.co/${d_.ip}/json/`);
				const d__ = await res__.json();
				if (d__.latitude) {
					setCenter([d__.latitude, d__.longitude]);
                    setCountry(d__.country_name || null);
                    
					return;
				}
			} catch (error) {
				console.error('Failed to fetch from ipify/ipapi.co:', error);
			}

			console.log('Default center used: [50, 15]');
			setCenter([50, 15]);
		};

		getLocation();
	}, []);

	return { center, country }
}
