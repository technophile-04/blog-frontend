const Loader = () => {
	let circleCommonClasses = 'h-5 w-5 bg-current rounded-full';

	return (
		<div className="flex justify-center mt-56">
			<div className={`${circleCommonClasses} mr-3 animate-bounce`}></div>
			<div className={`${circleCommonClasses} mr-3 animate-bounce200`}></div>
			<div className={`${circleCommonClasses} animate-bounce400`}></div>
		</div>
	);
};

export default Loader;
