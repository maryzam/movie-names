import React from 'react';

const NamesFilter = ({ onFilterChange}) => (
		<div>
			<input 
				type="text" 
				className="search" 
				placeholder="Enter a name..." 
				onChange={ onFilterChange } />
		</div>
	);


export default NamesFilter;