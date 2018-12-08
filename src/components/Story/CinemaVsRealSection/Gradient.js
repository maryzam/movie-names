import React from 'react';

const Gradient = ({ name, topColor, bottomColor }) => (
	<linearGradient id={ name } 
		gradientUnits="objectBoundingBox"
		x1={0} y1={0} x2={0} y2="100%">
		<stop offset="0%" style={{ stopColor: topColor, stopOpacity: 1}} />
      	<stop offset="100%" style={{ stopColor: bottomColor, stopOpacity: 1}} />
	</linearGradient>
);

export default Gradient;