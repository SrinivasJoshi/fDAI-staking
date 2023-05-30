import { FC, useState } from 'react';
import CustomButton from './CustomButton';
import {
	FDAI_ADDRESS,
	FDAI_CONTRACT_ABI,
	STAKE_CONTRACT_ADDRESS,
	STAKE_CONTRACT_ABI,
} from '@/utils/config';
import { toast } from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import {
	useNetwork,
	useAccount,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
} from 'wagmi';
import { utils } from 'ethers';

interface Card2Props {
	title: string;
	balance1: any;
	stakesOfUser: any;
	input: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	submitFunc: (e: React.FormEvent<HTMLFormElement>) => {};
	loading:boolean;
}

const Card2: FC<Card2Props> = (props: Card2Props) => {
	const { chain } = useNetwork();
	const [input, setInput] = useState<string>('');

	// const {
	// 	config: config1,
	// 	isError: isError1,
	// 	error: error1,
	// } = usePrepareContractWrite({
	// 	address: STAKE_CONTRACT_ADDRESS as `0x{string}`,
	// 	abi: STAKE_CONTRACT_ABI,
	// 	chainId: chain?.id,
	// 	functionName: 'stake',
	// 	args: [
	// 		debouncedInput ? utils.parseEther(debouncedInput) : utils.parseEther('0'),
	// 	],
	// });
	// const contractWrite1 = useContractWrite({
	// 	...config1,
	// 	onError() {
	// 		toast.error('User denied transaction');
	// 	},
	// });

	// const {
	// 	config: config2,
	// 	status: approveStatus,
	// 	error: error2,
	// 	isError: isError2,
	// } = usePrepareContractWrite({
	// 	address: STAKE_CONTRACT_ADDRESS as `0x{string}`,
	// 	abi: STAKE_CONTRACT_ABI,
	// 	chainId: chain?.id,
	// 	functionName: 'unstake',
	// 	args: [
	// 		debouncedInput ? utils.parseEther(debouncedInput) : utils.parseEther('0'),
	// 	],
	// });
	// const contractWrite2 = useContractWrite({
	// 	...config2,
	// 	onError() {
	// 		toast.error('User denied transaction');
	// 	},
	// });

	// const { config: config3 } = usePrepareContractWrite({
	// 	address: FDAI_ADDRESS as `0x{string}`,
	// 	abi: FDAI_CONTRACT_ABI,
	// 	chainId: chain?.id,
	// 	functionName: 'approve',
	// 	args: [
	// 		STAKE_CONTRACT_ADDRESS as `0x{string}`,
	// 		debouncedInput ? utils.parseEther(debouncedInput) : utils.parseEther('0'),
	// 	],
	// });
	// const contractWrite3 = useContractWrite({
	// 	...config3,
	// 	onError() {
	// 		toast.error('User denied transaction');
	// 	},
	// });

	// const submitTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	// props.setLoading(true);

	// 	e.preventDefault();
	// 	if (props.title === 'Stake fDAI') {
	// 		if (!isError1) {
	// 			contractWrite1.writeAsync?.().then((res) => {
	// 				toast.promise(res.wait(), {
	// 					loading: 'Waiting for confirmation',
	// 					success: 'Staking Successful',
	// 					error: 'Staking failed',
	// 				});
	// 			});
	// 			return;
	// 		} else {
	// 			// contractWrite3
	// 			// 	.writeAsync?.()
	// 			// 	.then((res) => {
	// 			// 		toast.promise(res.wait(), {
	// 			// 			loading: 'Waiting for confirmation',
	// 			// 			success: 'Approval Successful',
	// 			// 			error: 'Approval failed',
	// 			// 		});
	// 			// 	})
	// 			// 	.then(() => {
	// 			// 		setTimeout(async () => {
	// 			// 			contractWrite1.writeAsync?.().then((res) => {
	// 			// 				toast.promise(res.wait(), {
	// 			// 					loading: 'Waiting for confirmation',
	// 			// 					success: 'Staking Successful',
	// 			// 					error: 'Staking failed',
	// 			// 				});
	// 			// 			});
	// 			// 		}, 5000);
	// 			// 	});
	// 			try {
	// 				const res1 = await contractWrite3.writeAsync?.();
	// 				if (res1) {
	// 					await toast.promise(res1.wait(), {
	// 						loading: 'Waiting for confirmation',
	// 						success: 'Approval Successful',
	// 						error: 'Approval failed',
	// 					});
	// 				}
	// 			} catch (error) {
	// 				// Handle any errors that occur during the execution
	// 				console.error(error);
	// 			}
	// 			try {
	// 				const res2 = await contractWrite1.writeAsync?.();
	// 				if (res2) {
	// 					await toast.promise(res2.wait(), {
	// 						loading: 'Waiting for confirmation',
	// 						success: 'Staking Successful',
	// 						error: 'Staking failed',
	// 					});
	// 				}
	// 			} catch (error) {
	// 				console.error(error);
	// 			}
	// 		}
	// 	} else {
	// 		if (isError2) {
	// 			toast.error(error2 && error2?.message);
	// 			return;
	// 		}

	// 		contractWrite2.writeAsync?.().then((res) => {
	// 			toast.promise(res.wait(), {
	// 				loading: 'Waiting for confirmation',
	// 				success: 'Transaction Successful',
	// 				error: 'Transaction failed',
	// 			});
	// 		});
	// 	}

	// 	// props.setLoading(false);
	// };

	// useWaitForTransaction({
	// 	hash: contractWrite1.data?.hash,
	// 	onSettled() {
	// 		// props.setLoading(false);
	// 	},
	// });
	// useWaitForTransaction({
	// 	hash: contractWrite2.data?.hash,
	// 	onSettled() {
	// 		// props.setLoading(false);
	// 	},
	// });

	return (
		<form
			className='flex flex-col items-center border-2 border-gray-300 p-10 rounded-xl mt-3 md:mt-10'
			onSubmit={(e) => props.submitFunc(e)}>
			<label
				htmlFor='stake'
				className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
				{props.title}
			</label>
			<input
				type='text'
				id='stake'
				aria-describedby='helper-text-explanation'
				className='mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
				placeholder='100'
				value={props.input}
				onChange={(e) => props.setInput(e.target.value)}
			/>
			<CustomButton
				text='Submit'
				type='blue'
				submit={true}
				handleClick={() => {}}
				disabled={props.loading}
			/>
		</form>
	);
};

export default Card2;
