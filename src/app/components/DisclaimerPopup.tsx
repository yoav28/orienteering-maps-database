import React from 'react';


interface DisclaimerPopupProps {
	onClose: () => void;
}


export default function DisclaimerPopup({onClose}: DisclaimerPopupProps) {
	return <div className="popup-overlay">
		<div className="popup-content">
			<img src="/icon.png" alt="Icon"/>
			<span>
				This project was built for educational purposes only. <br/><br/>
				Please do not use any of the maps for any commercial purposes, including but not limited to competitions, without the mapper's permission. <br/><br/>
				
				If you have any questions or concerns, please contact the project maintainers at <b>omd.studied752@aleeas.com</b>
            </span>


			<button onClick={onClose} className="popup-close-button">
				I understand
			</button>
		</div>
	</div>
};
