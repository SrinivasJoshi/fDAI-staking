import CustomButton from './CustomButton';
import { BigNumber, utils } from 'ethers';

interface Props {
	yield?: BigNumber | undefined;
	title: string;
	description: string;
	loading: boolean;
	submitFunc?: (e: React.FormEvent<HTMLFormElement>) => {};
}

const Card = (props: Props) => {
	return (
		<form
			className='flex flex-col items-center border-2 border-gray-300 p-5 rounded-xl mt-2 md:mt-10 flex-1'
			onSubmit={(e) => props.submitFunc?.(e)}>
			<label
				htmlFor='mint'
				className='block mb-2 text-md font-semibold text-gray-900 dark:text-white'>
				{props.title}
			</label>
			<p className='text-sm text-gray-500 dark:text-gray-400 w-3/4 text-center'>
				{props.description}
			</p>

			{props.title === 'Calculated Yield' && (
				<p className='mt-4 font-bold text-lg'>
					{props.yield ? utils.formatEther(props.yield).substring(0, 8) : '-'}
				</p>
			)}

			{props.title === 'Calculated Yield' ? (
				''
			) : (
				<CustomButton
					text='Submit'
					type='blue'
					submit={true}
					handleClick={() => {}}
					disabled={props.loading}
				/>
			)}
		</form>
	);
};

export default Card;
