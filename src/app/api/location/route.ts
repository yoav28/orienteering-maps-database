import {NextRequest, NextResponse} from 'next/server';


export async function GET(request: NextRequest) {
	try {
		let latitude: number | null = null;
		let longitude: number | null = null;
		let country: string | null = null;

		// Try ipregistry.co
		try {
			const response = await fetch('https://api.ipregistry.co/?key=tryout');
			const data = await response.json();
			if (data.location) {
				latitude = data.location.latitude;
				longitude = data.location.longitude;
				country = data.location.country.name;
			}
		} catch (error) {
			console.error('Failed to fetch from ipregistry:', error);
		}

		// If not found, try ipapi.co
		if (latitude === null || longitude === null) {
			try {
				const res = await fetch('https://ipapi.co/json/');
				const d = await res.json();
				if (d.latitude) {
					latitude = d.latitude;
					longitude = d.longitude;
					country = d.country_name || null;
				}
			} catch (error) {
				console.error('Failed to fetch from ipapi.co:', error);
			}
		}

		// If not found, try ipify.org then ipapi.co
		if (latitude === null || longitude === null) {
			try {
				const res_ = await fetch('https://api.ipify.org?format=json');
				const d_ = await res_.json();
				const res__ = await fetch(`https://ipapi.co/${d_.ip}/json/`);
				const d__ = await res__.json();
				if (d__.latitude) {
					latitude = d__.latitude;
					longitude = d__.longitude;
					country = d__.country_name || null;
				}
			} catch (error) {
				console.error('Failed to fetch from ipify/ipapi.co (fallback):', error);
			}
		}

		if (latitude !== null && longitude !== null) {
			return NextResponse.json({latitude, longitude, country}, {
				status: 200,
				headers: {
					'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
				},
			});
			
		} else {
			console.log('Default center used: [50, 15]');
			return NextResponse.json({latitude: 50, longitude: 15, country: country});
		}
	} catch (error) {
		console.error('Error in location API route:', error);
		return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
	}
}
