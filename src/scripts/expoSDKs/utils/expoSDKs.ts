import {parse} from 'fsp-xml-parser';
import {JSDOM} from 'jsdom';

const ExpoURL = 'https://docs.expo.dev/sitemap.xml';

type SitemapResponse = {
	root: {
		children: {
			children: {
				content: string;
			}[];
		}[];
	};
};

const getExpoDocsURLs = async () => {
	const response = await fetch(ExpoURL);
	const finalText = await response.text();

	const parsed = (await parse(finalText)) as SitemapResponse;

	const urls = parsed.root.children.map((child) => child.children[0].content);

	return urls;
};

type GetExpoSDKsURLsParams = {
	version: string;
};

const getExpoSDKsURLs = async (
	{version = 'latest'}: GetExpoSDKsURLsParams = {version: 'latest'}
) => {
	const urls = await getExpoDocsURLs();
	return urls.filter((url) => url.includes(`/versions/${version}/sdk/`));
};

const extractTextOnly = (element: Element | null) =>
	Array.from(element?.childNodes ?? [])
		.filter((node) => node.nodeType === 3)
		.map((node) => node.textContent?.trim())
		.join(' ')
		.trim();

const extractSDKNameFromURL = (url: string) =>
	url.split('/').slice(-2, -1)?.[0];

const getSDKInfoFromUrl = async (url: string) => {
	const sdkName = extractSDKNameFromURL(url);

	const response = await fetch(url);

	const text = await response.text();

	const dom = new JSDOM(text);

	const doc = dom.window.document;

	const title = extractTextOnly(doc.querySelector('.css-mmc1h0'));

	const description = doc.querySelector('.css-1cvtq7x')?.textContent;

	const installation =
		doc.querySelectorAll('code.css-4rwsp2')?.[1]?.textContent;

	const githubLink = doc.querySelector('.css-154yqju')?.getAttribute('href');

	const npmLink = doc
		.querySelectorAll('.css-154yqju')?.[1]
		?.getAttribute('href');

	let deprecated = false;
	const calloutBox = doc?.querySelector('.css-4swul4');

	if (calloutBox) {
		const calloutBoxContent = calloutBox.querySelector('.css-1kl7xeu');
		const deprecatedMessage = extractTextOnly(calloutBoxContent);

		deprecated = Boolean(
			deprecatedMessage?.startsWith('This module will no longer')
		);
	}

	const supportTableCells = doc.querySelectorAll(
		'table.css-jy4bom .css-1wgk19c'
	);

	const support = supportTableCells
		? {
				androidDevice: Boolean(
					supportTableCells?.[0]?.querySelector('.text-icon-success')
				),
				androidEmulator: Boolean(
					supportTableCells?.[1]?.querySelector('.text-icon-success')
				),
				iOSDevice: Boolean(
					supportTableCells?.[2]?.querySelector('.text-icon-success')
				),
				iOSSimulator: Boolean(
					supportTableCells?.[3]?.querySelector('.text-icon-success')
				),
				web: Boolean(
					supportTableCells?.[4]?.querySelector('.text-icon-success')
				),
		  }
		: undefined;

	return {
		name: sdkName,
		title,
		description,
		installation,
		githubLink,
		npmLink,
		docsLink: url,
		support,
		...(deprecated && {deprecated}),
	};
};

type GetExpoSDKsParams = {
	previousVersion: string;
	version: string;
};

export const getExpoSDKs = async ({
	previousVersion,
	version,
}: GetExpoSDKsParams) => {
	const previousSdkURLs = await getExpoSDKsURLs({version: previousVersion});
	const sdkURLs = await getExpoSDKsURLs({version});

	const previousSdkNames = previousSdkURLs.map(extractSDKNameFromURL);
	const sdkNames = sdkURLs.map(extractSDKNameFromURL);

	const newSDKNames = sdkNames.filter(
		(sdkName) => !previousSdkNames.includes(sdkName)
	);

	let sdksInfo = await Promise.all(sdkURLs.map(getSDKInfoFromUrl));

	sdksInfo = sdksInfo
		.map((sdkInfo) => ({
			...sdkInfo,
			...(newSDKNames.includes(sdkInfo.name) && {isNew: true}),
		}))
		.filter((sdk) => sdk.githubLink?.includes('github.com/expo/expo/'));

	return sdksInfo;
};
