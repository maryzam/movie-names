import React from 'react';
import { GENDER } from "./constants";

const ModeSwitch = ({ currentGender, onChange }) => (
		<div className="gender-switch switch">
			<p>Chose target gender:</p>
			<p>
				{ 
					Object.values(GENDER)
						.map((gender) => (
							<button
								key={ gender }
								value={ gender }
								className={ (gender === currentGender) ? "active" : "" }
								onClick={ onChange }>
									{gender}			
							</button>
						))
				}
			</p>
		</div>
	);

export default ModeSwitch;