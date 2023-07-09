import {z} from 'zod';

const keys = <K extends string>(r: Record<K, unknown>): K[] =>
	Object.keys(r) as K[];

export function ObjectKeysEnum<K extends string>(obj: Record<K, unknown>) {
	return z.enum(keys(obj) as [K, ...K[]]);
}
