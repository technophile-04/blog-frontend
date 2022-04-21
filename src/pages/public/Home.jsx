import React from 'react';

const Home = () => {
	return (
		<div className="flex flex-col items-center justify-center bg-gray-800 fill-available">
			<p className="text-lg font-bold text-blue-400 ">
				Create posts to educate
			</p>
			<h2 className="max-w-2xl mt-2 mb-7 text-6xl 2xl:text-8xl text-white font-bold font-heading text-center">
				Pen down your ideas{' '}
				<span className="text-yellow-500">By creating a post</span>
			</h2>
			<p className=" text-xl text-gray-100">
				Your post must be free from racism and unhealthy words
			</p>
		</div>
	);
};

export default Home;
