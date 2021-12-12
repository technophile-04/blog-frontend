import { css } from '@emotion/react';
import PacmanLoader from 'react-spinners/PacmanLoader';

const override = css`
	display: block;
	margin: 18rem auto;
`;

const Loader = () => {
	return (
		<PacmanLoader loading={true} css={override} size={30} color={'#065F46'} />
	);
};

export default Loader;
