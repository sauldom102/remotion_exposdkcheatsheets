/* eslint-disable react/no-danger */
import {AbsoluteFill} from 'remotion';
import {Props} from './types';
import {useMemo} from 'react';
import ExpoSDKItem from '@/components/ExpoSDKItem';
import sortBy from 'lodash/sortBy';

const ExpoSDKCheatsheet: React.FC<Props> = ({
	title,
	sdks,
	page,
	itemsPerColumn,
}) => {
	const itemsPerPage = itemsPerColumn * 2;

	const sdksToShow = useMemo(() => {
		const from = (page - 1) * itemsPerPage;
		return sortBy(sdks, ['name']).slice(from, from + itemsPerPage);
	}, [sdks, page, itemsPerPage]);

	if (!sdksToShow.length) {
		return <AbsoluteFill className="bg-background" />;
	}

	return (
		<div className="flex-1 bg-background overflow-clip">
			<div className="bg-display">
				<h1 className="text-[2.5rem] font-semibold text-white text-center py-[24px]">
					{`${title} - Page ${page}`}
				</h1>
			</div>
			<div className="grid grid-cols-2 auto-rows-min h-full gap-x-[36px] gap-y-[36px] py-[96px] px-[36px]">
				{sdksToShow.map((sdk) => (
					<ExpoSDKItem key={sdk.name} {...sdk} />
				))}
			</div>
		</div>
	);
};

export default ExpoSDKCheatsheet;
