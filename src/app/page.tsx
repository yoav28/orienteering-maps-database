"use client";

import DisclaimerPopup from "@/app/components/DisclaimerPopup";
import {useEffect, useState} from "react";
import MapWrapper from "@/app/components/MapWrapper";


export default function Home() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        // setShowDisclaimer(true);
    }, []);


    return (
        <div>
            {showDisclaimer && <DisclaimerPopup onClose={() => setShowDisclaimer(false)}/>}
            
            <MapWrapper/>
        </div>
    );
}
