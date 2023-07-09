import {SIZES} from '@/constants';
import {ObjectKeysEnum} from '@/utils/zod';
import {z} from 'zod';

const expoSDKCheatsheetSchema = z.object({
	title: z.string(),
	page: z.number().int().min(1),
	size: ObjectKeysEnum(SIZES),
	itemsPerColumn: z.number().int().min(5).max(10),
	expoVersion: z.number().int().min(46).max(49),
});

export {expoSDKCheatsheetSchema};

type Support = {
	androidDevice: boolean;
	androidEmulator: boolean;
	iOSDevice: boolean;
	iOSSimulator: boolean;
	web: boolean;
};

export type SDKInfo = {
	name: string;
	title: string;
	description: string;
	installation: string;
	githubLink: string;
	npmLink: string;
	docsLink: string;
	support?: Support;
	deprecated?: boolean;
	isNew?: boolean;
};

export type Props = z.infer<typeof expoSDKCheatsheetSchema> & {
	sdks: SDKInfo[];
};
