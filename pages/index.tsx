import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/config';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	const origin =
		typeof window !== 'undefined' && window.location.origin
			? window.location.origin
			: SITE_URL;
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
					<ConnectButton />
				</div>
			</nav>
			<div className='flex flex-col items-center justify-evenly w-full max-w-7xl'>
				<p className='w-1/2 my-5 text-lg text-center'>
					Welcome to my staking dApp! Stake your fDAI and earn Radish Tokens
					(RDT) as rewards. Take part in our innovative staking system to grow
					your holdings and maximize your earnings. Join now and unlock the
					power of decentralized finance!
				</p>
				<div className='flex justify-between w-4/5 items-center font-'>
					<h2 className='text-xl'>Your fDAI balance : {1200}</h2>
					<h2 className='text-xl'>Reward per token per day: {1}</h2>{' '}
					<h2 className='text-xl'>Your RDT balance : {120}</h2>
				</div>

				<div className='flex justify-evenly w-4/5 items-center'>
					<form className='flex flex-col items-center border-2 border-gray-300 p-10 rounded-xl mt-10'>
						<label
							htmlFor='stake'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Stake
						</label>
						<input
							type='number'
							id='stake'
							aria-describedby='helper-text-explanation'
							className='my-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							placeholder='100'
						/>
						<button
							type='submit'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
							Submit
						</button>
					</form>

					<form className='flex flex-col items-center border-2 border-gray-300 p-10 rounded-xl mt-10'>
						<label
							htmlFor='Unstake'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Unstake
						</label>
						<input
							type='number'
							id='Unstake'
							aria-describedby='helper-text-explanation'
							className='my-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							placeholder='100'
						/>
						<button
							type='submit'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
							Submit
						</button>
					</form>
				</div>

				<div className='flex justify-evenly w-4/5 items-center'>
					<form className='flex flex-col items-center border-2 border-gray-300 p-8 rounded-xl mt-10'>
						<label
							htmlFor='Withdraw'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Withdraw Yield
						</label>

						<button
							type='submit'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
							Submit
						</button>
					</form>
					<form className='flex flex-col items-center border-2 border-gray-300 p-8 rounded-xl mt-10'>
						<label
							htmlFor='Yield'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Calculate Yield
						</label>
						<button
							type='submit'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
							Submit
						</button>
					</form>
					<form className='flex flex-col items-center border-2 border-gray-300 p-8 rounded-xl mt-10'>
						<label
							htmlFor='mint'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Mint fDAI
						</label>
						<button
							type='submit'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
							Submit
						</button>
					</form>
					{/* <form className='border-2 border-gray-300 p-10 rounded-xl mt-10'>
						<label
							htmlFor='Unstake'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Unstake
						</label>
						<input
							type='number'
							id='Unstake'
							aria-describedby='helper-text-explanation'
							className='my-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							placeholder='100'
						/>
						<button
							type='submit'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
							Submit
						</button>
					</form> */}
				</div>
			</div>
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
// -make componetns for those 4
