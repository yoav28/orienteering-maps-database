"use client";

import DisclaimerPopup from "@/app/components/DisclaimerPopup";
import {useEffect, useState} from "react";
import Map from "@/app/components/Map";


export default function Home() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        // setShowDisclaimer(true);
    }, []);


    return (
        <div>
            {showDisclaimer && <DisclaimerPopup onClose={() => setShowDisclaimer(false)}/>}
            
            <Map/>
        </div>
    );
}
