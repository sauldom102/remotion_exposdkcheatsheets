import fs from 'fs';
import {getExpoSDKs} from './utils';

const main = async () => {
	const sdksInfo = await getExpoSDKs({
		version: 'v49.0.0',
		previousVersion: 'v48.0.0',
	});

	const jsonData = JSON.stringify(sdksInfo, null, 2);

	fs.writeFile(
		'src/constants/expoSDKs.ts',
		`export const EXPO_SDKS = ${jsonData};`,
		'utf8',
		(err) => {
			if (err) {
				console.error('An error occurred while writing the file:', err);
			} else {
				console.log('File has been written successfully.');
			}
		}
	);
};

main();
