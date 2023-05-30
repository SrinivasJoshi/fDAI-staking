'use client';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { SITE_NAME, SITE_DESCRIPTION, FDAI_CONTRACT_ABI } from '@/utils/config';
import { Inter } from 'next/font/google';
import Card from '@/components/layout/Card';
import Card2 from '@/components/layout/Card2';
import {
	useAccount,
	useBalance,
	useContractRead,
	useContractWrite,
	useNetwork,
	usePrepareContractWrite,
} from 'wagmi';
import {
	FDAI_ADDRESS,
	STAKE_CONTRACT_ADDRESS,
	STAKE_CONTRACT_ABI,
} from '@/utils/config';
import { utils } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [stakeInput, setStakeInput] = useState('');
	const [unstakeInput, setUnstakeInput] = useState('');

	// this page logic
	const { address } = useAccount();
	const { chain } = useNetwork();

	//fDAI
	const balance1 = useBalance({
		address,
		token: FDAI_ADDRESS as `0x{string}`,
	});
	// RDT
	const balance2 = useBalance({
		address,
		token: STAKE_CONTRACT_ADDRESS as `0x{string}`,
	});
	const { data: rewardRate } = useContractRead({
		address: STAKE_CONTRACT_ADDRESS as `0x${string}`,
		abi: STAKE_CONTRACT_ABI,
		functionName: 'rewardRate',
	});
	const { data: stakesOfUser, refetch: stakesRefetch } = useContractRead({
		address: STAKE_CONTRACT_ADDRESS as `0x${string}`,
		abi: STAKE_CONTRACT_ABI,
		functionName: 'stakesOfUser',
		args: [address as `0x{string}`],
	});

	const { data: calculatedYield, refetch: yieldRefetch } = useContractRead({
		address: STAKE_CONTRACT_ADDRESS as `0x${string}`,
		abi: STAKE_CONTRACT_ABI,
		functionName: 'calculateYield',
		args: [address as `0x{string}`],
	});

	const [fdaiBalance, setFdaiBalance] = useState(
		balance1.data?.formatted.substring(0, 8)
	);
	const [stakedBalance, setStakedBalance] = useState(
		utils.formatEther(stakesOfUser || 0)
	);

	// stake config logic
	const {
		config: stakingConfig,
		isError: isError1,
		error: error1,
	} = usePrepareContractWrite({
		address: STAKE_CONTRACT_ADDRESS as `0x{string}`,
		abi: STAKE_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'stake',
		args: [stakeInput ? utils.parseEther(stakeInput) : utils.parseEther('0')],
	});
	const contractWrite1 = useContractWrite({
		...stakingConfig,
		onError() {
			toast.error('User denied transaction');
		},
	});

	// unstake config logic
	const {
		config: unstakeConfig,
		error: error2,
		isError: isError2,
	} = usePrepareContractWrite({
		address: STAKE_CONTRACT_ADDRESS as `0x{string}`,
		abi: STAKE_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'unstake',
		args: [
			unstakeInput ? utils.parseEther(unstakeInput) : utils.parseEther('0'),
		],
	});
	const contractWrite2 = useContractWrite({
		...unstakeConfig,
		onError() {
			toast.error('User denied transaction');
		},
	});

	// approve logic config
	const { config: config3 } = usePrepareContractWrite({
		address: FDAI_ADDRESS as `0x{string}`,
		abi: FDAI_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'approve',
		args: [
			STAKE_CONTRACT_ADDRESS as `0x{string}`,
			stakeInput ? utils.parseEther(stakeInput) : utils.parseEther('0'),
		],
	});
	const contractWrite3 = useContractWrite({
		...config3,
		onError() {
			toast.error('User denied transaction');
		},
	});

	// withdraw yield config
	const { config: withdrawYieldConfig } = usePrepareContractWrite({
		address: STAKE_CONTRACT_ADDRESS as `0x{string}`,
		abi: STAKE_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'withdrawYield',
	});
	const contractWrite4 = useContractWrite({
		...withdrawYieldConfig,
		onError() {
			toast.error('User denied transaction');
		},
	});

	// mint fDAI config
	const { config: mintConfig } = usePrepareContractWrite({
		address: FDAI_ADDRESS as `0x{string}`,
		abi: FDAI_CONTRACT_ABI,
		chainId: chain?.id,
		functionName: 'mint',
		args: [address as `0x${string}`, utils.parseEther('100')],
	});
	const contractWrite5 = useContractWrite({
		...mintConfig,
		onError() {
			toast.error('User denied transaction');
		},
	});

	// submit stake
	const stakeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		try {
			const res1 = await contractWrite3.writeAsync?.();
			if (res1) {
				await toast.promise(res1.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Approval Successful',
					error: 'Approval failed',
				});
			}
			const res2 = await contractWrite1.writeAsync?.();
			if (res2) {
				await toast.promise(res2.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Staking Successful',
					error: 'Staking failed',
				});
			}
			setStakeInput('');
			setLoading(false);
			stakesRefetch();
			await balance1.refetch();
			await balance2.refetch();
			setFdaiBalance(balance1.data?.formatted.substring(0, 8));
			setStakedBalance(utils.formatEther(stakesOfUser || 0));
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	// submit unstake
	const unstakeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		try {
			const res = await contractWrite2.writeAsync?.();
			if (res) {
				await toast.promise(res.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Unstaking Successful',
					error: 'Unstaking failed',
				});
			}
			setLoading(false);
			stakesRefetch();
			await balance1.refetch();
			await balance2.refetch();
			setFdaiBalance(balance1.data?.formatted.substring(0, 8));
			setStakedBalance(utils.formatEther(stakesOfUser || 0));
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	// withdraw yield submit
	const withdrawYieldSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		try {
			const res = await contractWrite4.writeAsync?.();
			if (res) {
				await toast.promise(res.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Withdraw Successful',
					error: 'Withdraw failed',
				});
			}
			setLoading(false);
			await balance2.refetch();
			yieldRefetch();
			setFdaiBalance(balance1.data?.formatted.substring(0, 8));
			setStakedBalance(utils.formatEther(stakesOfUser || 0));
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	// mint fDAI submit
	const mintSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		try {
			const res = await contractWrite5.writeAsync?.();
			if (res) {
				await toast.promise(res.wait(), {
					loading: 'Waiting for confirmation',
					success: 'Withdraw Successful',
					error: 'Withdraw failed',
				});
			}
			setLoading(false);
			await balance1.refetch();
			setFdaiBalance(balance1.data?.formatted.substring(0, 8));
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-around px-5 md:px-20 pt-10 ${inter.className}`}>
			<Head>
				<title>{SITE_NAME}</title>
				<meta name='description' content={SITE_DESCRIPTION} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
			</Head>
			<nav className='z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex'>
				<p className='fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
					fDAI Staking
				</p>
				<div className='bottom-0 left-0 flex items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black static h-auto w-auto lg:bg-none my-12 md:my-24 lg:my-0'>
					<ConnectButton showBalance={false} />
				</div>
			</nav>
			<div className='flex flex-col items-center justify-evenly w-full max-w-7xl mb-5'>
				<p className='w-full md:w-3/5 md:my-5 my-2 text-lg text-center'>
					Welcome to my staking dApp! Stake your fDAI and earn Radish Tokens
					(RDT) as rewards.
				</p>
				<div className='flex md:flex-row flex-col gap-5 justify-between w-4/5 items-center font-bold mt-5'>
					<h2 className='text-base md:text-lg text-center p-4 border border-gray-400 rounded-xl'>
						fDAI balance <br /> {balance1.data ? fdaiBalance : '-'}
					</h2>
					<h2 className='text-base md:text-lg text-center p-4 border border-gray-400 rounded-xl'>
						Staked fDAI <br />
						{stakesOfUser ? stakedBalance : '-'}
					</h2>
					<h2 className='text-base md:text-lg text-center p-4 border border-gray-400 rounded-xl'>
						Reward per token per day <br />
						{rewardRate ? rewardRate.toString() : '-'}
					</h2>
					<h2 className='text-base md:text-lg text-center p-4 border border-gray-400 rounded-xl'>
						Your RDT balance <br />
						{balance2.data ? balance2.data?.formatted.substring(0, 8) : '-'}
					</h2>
				</div>

				<div className='flex md:flex-row flex-col gap-5 justify-evenly w-4/5 items-center my-5'>
					<Card2
						title='Stake fDAI'
						input={stakeInput}
						setInput={setStakeInput}
						submitFunc={stakeSubmit}
						balance1={balance1}
						stakesOfUser={stakesOfUser}
						loading={loading}
					/>
					<Card2
						title='Unstake fDAI'
						balance1={balance1}
						stakesOfUser={stakesOfUser}
						input={unstakeInput}
						setInput={setUnstakeInput}
						submitFunc={unstakeSubmit}
						loading={loading}
					/>
				</div>

				<div className='flex md:flex-row flex-col justify-evenly w-4/5 items-center gap-10'>
					<Card
						title='Mint fDai'
						description='Mint 100 fDAI and test this dApp'
						loading={loading}
						submitFunc={mintSubmit}
					/>
					<Card
						title='Calculated Yield'
						description='Calculates yield based on staked fDAI'
						loading={loading}
						yield={calculatedYield}
					/>
					<Card
						title='Withdraw Yield'
						description='You can withdraw your RDT yield here'
						loading={loading}
						submitFunc={withdrawYieldSubmit}
					/>
				</div>
			</div>
			<Toaster position='bottom-left' />
		</main>
	);
}
