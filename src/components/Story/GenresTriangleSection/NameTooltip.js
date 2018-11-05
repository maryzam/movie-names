import React from 'react';

const NameTooltip = ({ position, info }) => {

	if (!info) {
		return null;
	}

	return (
		<div className="tooltip"
			style={{ top: position.y, left: position.x }} >
				<p className="name">{ info.name }</p>
				<p className="total">(total: { info.total})</p>
		</div>
	);

};

export default NameTooltip;