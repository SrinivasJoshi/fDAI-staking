import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/config';
import { Inter } from 'next/font/google';
import Card from '@/components/layout/Card';
import Card2 from '@/components/layout/Card2';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import {
	FDAI_ADDRESS,
	STAKE_CONTRACT_ADDRESS,
	STAKE_CONTRACT_ABI,
} from '@/utils/config';
import { utils } from 'ethers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const [loading, setLoading] = useState(false);
	const { address } = useAccount();
	const balance1 = useBalance({
		address,
		token: FDAI_ADDRESS as `0x{string}`,
	});
	const balance2 = useBalance({
		address,
		token: STAKE_CONTRACT_ADDRESS as `0x{string}`,
	});
	const { data: rewardRate } = useContractRead({
		address: STAKE_CONTRACT_ADDRESS as `0x${string}`,
		abi: STAKE_CONTRACT_ABI,
		functionName: 'rewardRate',
	});
	const {
		data: stakesOfUser,
		refetch: stakesRefetch,
	} = useContractRead({
		address: STAKE_CONTRACT_ADDRESS as `0x${string}`,
		abi: STAKE_CONTRACT_ABI,
		functionName: 'stakesOfUser',
		args: [address as `0x{string}`],
	});

	// refresh data
	useEffect(() => {
		balance1.refetch();
		stakesRefetch();
	}, [loading]);

	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-around px-20 pt-10 ${inter.className}`}>
			<Head>
				<title>{SITE_NAME}</title>
				<meta name='description' content={SITE_DESCRIPTION} />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
			</Head>
			<nav className='z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex'>
				<p className='fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'>
					fDAI Staking
				</p>
				<div className='bottom-0 left-0 flex items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black static h-auto w-auto lg:bg-none my-24 lg:my-0'>
					<ConnectButton showBalance={false} />
				</div>
			</nav>
			<div className='flex flex-col items-center justify-evenly w-full max-w-7xl mb-5'>
				<p className='w-3/5 my-5 text-lg text-center'>
					Welcome to my staking dApp! Stake your fDAI and earn Radish Tokens
					(RDT) as rewards.
				</p>
				<div className='flex justify-between w-4/5 items-center font-bold mt-5'>
					<h2 className='text-xl text-center p-4 border border-gray-400 rounded-xl'>
						fDAI balance <br /> {balance1.data?.formatted.substring(0, 7)}
					</h2>
					<h2 className='text-xl text-center p-4 border border-gray-400 rounded-xl'>
						Staked fDAI <br />{' '}
						{stakesOfUser
							? utils.formatEther(stakesOfUser)
							: utils.formatEther(0)}
					</h2>
					<h2 className='text-xl text-center p-4 border border-gray-400 rounded-xl'>
						Reward per token per day <br />
						{rewardRate?.toString()}
					</h2>
					<h2 className='text-xl text-center p-4 border border-gray-400 rounded-xl'>
						Your RDT balance <br /> {balance2.data?.formatted}
					</h2>
				</div>

				<div className='flex justify-evenly w-4/5 items-center'>
					<Card2
						title='Stake fDAI'
						balance1={balance1}
						stakesOfUser={stakesOfUser}
						loading={loading}
						setLoading={setLoading}
					/>
					<Card2
						title='Unstake fDAI'
						balance1={balance1}
						stakesOfUser={stakesOfUser}
						loading={loading}
						setLoading={setLoading}
					/>
				</div>

				<div className='flex justify-evenly w-4/5 items-center gap-10'>
					<Card
						title='Mint fDai'
						description='Mint 100 fDAI and test this dApp'
						loading={loading}
						setLoading={setLoading}
					/>
					<Card
						title='Calculated Yield'
						description='Calculates yield based on staked fDAI'
						loading={loading}
						setLoading={setLoading}
					/>
					<Card
						title='Withdraw Yield'
						description='You can withdraw your RDT yield here'
						loading={loading}
						setLoading={setLoading}
					/>
				</div>
			</div>
			<Toaster position='bottom-left' />
		</main>
	);
}

// 1. Stake form
// 1. Unstake form
// 1. Calculate yield
// 1. Earn yield
// 1. Show fDAI balance
// 1. mint fDAI here

// -write all functions
