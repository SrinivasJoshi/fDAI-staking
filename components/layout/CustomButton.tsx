import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

type btnType = 'blue' | 'red';

interface Props {
	text: string;
	type: btnType;
	className?: string;
	submit?: boolean;
	disabled?: boolean;
	handleClick: () => any;
}

const CustomButton = (props: Props) => {
	return (
		<button
			className={`max-w-[100px] text-sm text-white rounded-2xl px-3 py-2 mt-4 ${
				inter.className
			} ${props.type === 'blue' ? 'bg-[#3898FF]' : 'bg-[#ff3838]'} ${
				props.className
			}`}
			onClick={() => props.handleClick()}
			type={`${props.submit ? 'submit' : 'button'}`}
			disabled={props.disabled ? props.disabled : false}>
			{props.text}
		</button>
	);
};

export default CustomButton;
