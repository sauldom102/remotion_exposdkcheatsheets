import {Folder, Still} from 'remotion';
import ExpoSDKCheatsheet from '@/stills/ExpoSDKCheatsheet';
import {EXPO_SDKS, SIZES, STILL_IDS} from '@/constants';
import {ThemeProvider} from '@/contexts/theme';
import {expoSDKCheatsheetSchema} from '@/stills/ExpoSDKCheatsheet/types';

import './style.css';

export const RemotionRoot: React.FC = () => {
	return (
		<ThemeProvider>
			<Folder name="Cheatsheets">
				<Still
					id={STILL_IDS.ExpoSDKCheatsheet}
					component={ExpoSDKCheatsheet}
					schema={expoSDKCheatsheetSchema}
					calculateMetadata={async ({props}) => {
						return {
							width: SIZES[props.size][0],
							height: SIZES[props.size][1],
							props: {
								...props,
								title: `Expo SDK ${props.expoVersion} Cheatsheet`,
							},
						};
					}}
					defaultProps={{
						title: 'Expo SDK 49 Cheatsheet',
						page: 1,
						size: 'A4' as const,
						sdks: EXPO_SDKS,
						itemsPerColumn: 5,
						expoVersion: 49,
					}}
				/>
			</Folder>
		</ThemeProvider>
	);
};
