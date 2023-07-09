import {WebpackOverrideFn} from '@remotion/cli/config';
import path from 'path';

export const webpackOverride: WebpackOverrideFn = (currentConfiguration) => {
	return {
		...currentConfiguration,
		resolve: {
			...currentConfiguration.resolve,
			alias: {
				...(currentConfiguration.resolve?.alias ?? {}),
				'@/components': path.join(process.cwd(), 'src', 'components'),
				'@/types': path.join(process.cwd(), 'src', 'types'),
				'@/utils': path.join(process.cwd(), 'src', 'utils'),
				'@/stills': path.join(process.cwd(), 'src', 'stills'),
				'@/compositions': path.join(process.cwd(), 'src', 'compositions'),
				'@/contexts': path.join(process.cwd(), 'src', 'contexts'),
				'@/constants': path.join(process.cwd(), 'src', 'constants'),
			},
		},
		module: {
			...currentConfiguration.module,
			rules: [
				...(currentConfiguration.module?.rules
					? currentConfiguration.module.rules
					: []
				).filter((rule) => {
					if (rule === '...') {
						return false;
					}
					if (rule.test?.toString().includes('.css')) {
						return false;
					}
					return true;
				}),
				{
					test: /\.css$/i,
					use: [
						'style-loader',
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [
										'postcss-preset-env',
										'tailwindcss',
										'autoprefixer',
									],
								},
							},
						},
					],
				},
			],
		},
	};
};
