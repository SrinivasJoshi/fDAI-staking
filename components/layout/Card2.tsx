import { FC, useEffect, useState } from 'react';
import CustomButton from './CustomButton';
import {
	FDAI_ADDRESS,
	FDAI_CONTRACT_ABI,
	STAKE_CONTRACT_ADDRESS,
	STAKE_CONTRACT_ABI,
} from '@/utils/config';
import { Toaster, toast } from 'react-hot-toast';
import { useDebounce } from 'use-debounce';
import {
	useNetwork,
	useAccount,
	useBalance,
	useContractWrite,
	usePrepareContractWrite,
	useWaitForTransaction,
	erc20ABI,
} from 'wagmi';
import { utils } from 'ethers';

interface Card2Props {
	title: string;
	description: string;
	balance: any;
}

const Card2: FC<Card2Props> = (props: Card2Props) => {
	const { chain } = useNetwork();
	const { address } = useAccount();
	const [input, setInput] = useState<string>('');
	const [debouncedInput] = useDebounce(input, 500);

	const { config: config1, status: status1 } = usePrepareContractWrite({
		address: STAKE_CONTRACT_ADDRESS as `0x{string}`,
		abi: STAKE_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'stake',
		args: [
			debouncedInput ? utils.parseEther(debouncedInput) : utils.parseEther('0'),
		],
	});
	const contractWrite1 = useContractWrite({
		...config1,
		onError() {
			toast.error('User denied transaction');
		},
	});

	const { config: config2, status: status2 } = usePrepareContractWrite({
		address: STAKE_CONTRACT_ADDRESS as `0x{string}`,
		abi: STAKE_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'unstake',
		args: [
			debouncedInput ? utils.parseEther(debouncedInput) : utils.parseEther('0'),
		],
	});
	const contractWrite2 = useContractWrite({
		...config2,
		onError() {
			toast.error('User denied transaction');
		},
	});

	const { config: config3 } = usePrepareContractWrite({
		address: FDAI_ADDRESS as `0x{string}`,
		abi: FDAI_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'approve',
		args: [
			STAKE_CONTRACT_ADDRESS as `0x{string}`,
			debouncedInput ? utils.parseEther(debouncedInput) : utils.parseEther('0'),
		],
	});
	const contractWrite3 = useContractWrite({
		...config3,
		onError() {
			toast.error('User denied transaction');
		},
	});

	const submitTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (props.title === 'Stake fDAI') {
			contractWrite3.writeAsync?.().then((res) => {
				toast.promise(res.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Approval Successful',
					error: 'Approval failed',
				});
			});
		} else {
			contractWrite2.writeAsync?.().then((res) => {
				toast.promise(res.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Transaction Successful',
					error: 'Transaction failed',
				});
			});
		}
	};

	const waitForTransaction1 = useWaitForTransaction({
		hash: contractWrite3.data?.hash,
		onSuccess() {
			contractWrite1.writeAsync?.().then((res) => {
				toast.promise(res.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Staking Successful',
					error: 'Staking failed',
				});
			});
		},
	});

	const waitForTransaction2 = useWaitForTransaction({
		hash: contractWrite1.data?.hash,
		onSettled() {
			props.balance.refetch();
		},
	});

	const waitForTransaction3 = useWaitForTransaction({
		hash: contractWrite2.data?.hash,
		onSettled() {
			props.balance.refetch();
		},
	});

	return (
		<form
			className='flex flex-col items-center border-2 border-gray-300 p-10 rounded-xl mt-10'
			onSubmit={(e) => submitTransaction(e)}>
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
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<CustomButton
				text='Submit'
				type='blue'
				submit={true}
				handleClick={() => {}}
			/>
		</form>
	);
};

export default Card2;
