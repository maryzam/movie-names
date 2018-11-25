import React from 'react';

const DecadeSwitch = ({ decade, isFirst, isLast, onSwitch }) => (
	<div className="decade-switch">
		<button 
			className="prev" 
			value="prev"
			disabled={ isFirst }
			onClick={ onSwitch }>
			⬅
		</button>
		<span>{ decade }'s</span>
		<button 
			className="next" 
			value="next"
			disabled={ isLast }
			onClick={ onSwitch } >
			➡
		</button>
	</div>
);

export default DecadeSwitch;