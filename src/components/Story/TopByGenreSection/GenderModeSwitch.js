import React from 'react';

const modes = [
	{ mode: "All", title: "Overall" },
	{ mode: "F", title: "Women" },
	{ mode: "M", title: "Men" },
];

const GenderModeSwitch = ({ currentMode, onClick }) => {

	return (
		<div className="gender-mode-switch">
			{ 
				modes.map((item) => (
					<button 
						key={item.mode}
						value={item.mode}
						className={ (item.mode == currentMode) ? "active" : ""}
						onClick={onClick}>
							{item.title}
					</button>
				))
			}
		</div>
	);
};

export default GenderModeSwitch;