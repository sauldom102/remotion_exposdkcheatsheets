import {Config} from '@remotion/cli/config';
import {webpackOverride} from './src/webpack-override';

Config.setStillImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setVideoImageFormat('jpeg');
Config.overrideWebpackConfig(webpackOverride);
