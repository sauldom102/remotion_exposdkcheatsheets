import React, {memo, useMemo} from 'react';
import {Props} from './types';
import {Img, staticFile} from 'remotion';
import classNames from 'classnames';

type TagProps = {
	title: string;
	className?: string;
};

const Tag: React.FC<TagProps> = ({title, className}) => (
	<span
		className={classNames(
			'text-display font-medium px-[20px] py-[8px] text-[1.7rem] rounded-xl',
			className
		)}
	>
		{title}
	</span>
);

const ExpoSDKItem: React.FC<Props> = ({
	title,
	description,
	installation,
	githubLink,
	docsLink,
	support,
	deprecated = false,
	isNew = false,
}) => {
	const supportTitles = useMemo(() => {
		if (!support) {
			return;
		}

		const res = {
			iOS: '',
			android: '',
			web: '',
		};

		if (support.androidDevice || support.androidEmulator) {
			if (support.androidDevice && !support.androidEmulator) {
				res.android = 'Device only';
			}

			if (support.androidEmulator && !support.androidDevice) {
				res.android = 'Emulator only';
			}

			if (!res.android) {
				res.android = 'Device and Emulator';
			}
		}

		if (support.iOSDevice || support.iOSSimulator) {
			if (support.iOSDevice && !support.iOSSimulator) {
				res.iOS = 'Physical iPhone only';
			}

			if (support.iOSSimulator && !support.iOSDevice) {
				res.iOS = 'Simulator only';
			}

			if (!res.iOS) {
				res.iOS = 'iPhone and Simulator';
			}
		}

		if (support.web) {
			res.web = 'React Native Web';
		}

		return res;
	}, [support]);

	return (
		<div className="relative bg-white flex flex-col w-full h-full p-[32px] rounded-2xl border-4 border-display text-display">
			{isNew && (
				<Tag
					title="New in SDK 48"
					className="bg-green-100 absolute top-4 right-4"
				/>
			)}

			{deprecated && (
				<Tag
					title="Deprecated"
					className="bg-yellow-100 absolute top-4 right-4"
				/>
			)}

			<p className="text-[3rem] font-medium">{title}</p>
			<p className="text-[2rem]">{description}</p>

			<code className="text-[1.6rem] inline-flex self-start items-center bg-gray-800 text-white rounded-lg p-4 px-6 mt-[16px]">
				<span className="flex gap-4">
					<span className="shrink-0 text-gray-500">$</span>
					<span className="flex-1">{installation}</span>
				</span>
			</code>

			<div className="flex flex-row items-start mt-[32px] font-medium">
				<Img
					src={staticFile('icons/github.svg')}
					className="w-[32px] aspect-square"
				/>
				<span className="text-[1.55rem] ml-[12px]">{githubLink}</span>
			</div>

			<div className="flex flex-row items-start mt-[16px] font-medium text-[1.55rem]">
				<span>🔗</span>
				<span className="ml-[20px]">{docsLink}</span>
			</div>

			{supportTitles && (
				<>
					<div className="flex-1" />
					<hr className="mt-[24px] -mx-[32px] border-display border-opacity-75 border-t-4" />

					<div className="flex flex-row items-center gap-[32px] font-medium text-[1.5rem] mt-[32px]">
						{supportTitles.android && (
							<div className="flex flex-row items-center gap-[16px]">
								<Img
									src={staticFile('icons/android.svg')}
									className="h-[44px]"
								/>
								<span className="flex-1">{supportTitles.android}</span>
							</div>
						)}

						{supportTitles.iOS && (
							<div className="flex flex-row items-center gap-[16px]">
								<Img
									src={staticFile('icons/apple.svg')}
									className="h-[44px] mb-2"
								/>
								<span className="flex-1">{supportTitles.iOS}</span>
							</div>
						)}

						{supportTitles.web && (
							<div className="flex flex-row items-center gap-[16px]">
								<Img src={staticFile('icons/www.svg')} className="h-[44px]" />
								<span className="flex-1">{supportTitles.web}</span>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default memo(ExpoSDKItem);
