import {
	useAccount,
	useContractRead,
	useContractWrite,
	useNetwork,
	usePrepareContractWrite,
	useWaitForTransaction,
} from 'wagmi';
import CustomButton from './CustomButton';
import {
	FDAI_ADDRESS,
	FDAI_CONTRACT_ABI,
	STAKE_CONTRACT_ABI,
	STAKE_CONTRACT_ADDRESS,
} from '@/utils/config';
import { toast } from 'react-hot-toast';
import { utils } from 'ethers';

interface Props {
	title: string;
	description: string;
	balance?: any;
}

const Card = (props: Props) => {
	const { chain } = useNetwork();
	const { address } = useAccount();
	const { data, isError } = useContractRead({
		address: STAKE_CONTRACT_ADDRESS as `0x${string}`,
		abi: STAKE_CONTRACT_ABI,
		functionName: 'calculateYield',
		args: [address as `0x${string}`],
	});

	const { config: config1 } = usePrepareContractWrite({
		address: STAKE_CONTRACT_ADDRESS as `0x{string}`,
		abi: STAKE_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'withdrawYield',
	});
	const contractWrite1 = useContractWrite({
		...config1,
		onError() {
			toast.error('User denied transaction');
		},
	});

	const { config: config2 } = usePrepareContractWrite({
		address: FDAI_ADDRESS as `0x{string}`,
		abi: FDAI_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'mint',
		args: [address as `0x${string}`, utils.parseEther('100')],
	});
	const contractWrite2 = useContractWrite({
		...config2,
		onError() {
			toast.error('User denied transaction');
		},
	});
	useWaitForTransaction({
		hash: contractWrite2.data?.hash,
		onSettled() {
			props.balance.refetch();
		},
	});

	const submitTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (props.title === 'Withdraw Yield') {
			contractWrite1.writeAsync?.().then((res) => {
				toast.promise(res.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Yield Withdrawl Successful',
					error: 'Yield Withdrawl failed',
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

	return (
		<form
			className='flex flex-col items-center border-2 border-gray-300 p-5 rounded-xl mt-10 flex-1'
			onSubmit={(e) => submitTransaction(e)}>
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
					{utils.formatEther(data || '0').substring(0, 7)}
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
				/>
			)}
		</form>
	);
};

export default Card;
