import React from 'react';
import { MODE } from "./constants";

const ModeSwitch = ({ currentMode, onChange }) => (
		<div className="mode-switch switch">
			<p>Switch between different view modes:</p>
			<p>
				{ 
					Object.values(MODE)
						.map((mode) => (
							<button
								key={ mode }
								value={ mode }
								className={ (mode === currentMode) ? "active" : "" }
								onClick={ onChange }>
									{mode}			
							</button>
						))
				}
			</p>
		</div>
	);

export default ModeSwitch;