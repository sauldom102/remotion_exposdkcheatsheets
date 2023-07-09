import { STILL_IDS } from '@/constants';
import { PromisePool } from '@supercharge/promise-pool';
import {spawn} from 'child_process';

const cmd = (...command: string[]) => {
	const p = spawn('bash', ['-c', ...command]);

  return new Promise((resolveFunc) => {
		p.on('exit', (code) => {
			resolveFunc(code);
		});
	});
}

const STILL_ID = STILL_IDS.ExpoSDKCheatsheet
const OUT_IDR = "out/"
const NUMBER_OF_PAGES = 8

const main = async () => {
  const fileNames: string[] = [];

  const commands = new Array(NUMBER_OF_PAGES).fill(null).map((_, i) => {
    const fileName = `${OUT_IDR}${STILL_ID}_${i + 1}.pdf`
    
    fileNames.push(fileName);

    return `remotion still ${STILL_ID} --props='${JSON.stringify({ page: i + 1 })}' ${fileName}`
  })

  await PromisePool.for(commands)
		.withConcurrency(1)
    .process((command) => cmd(command));

  await cmd(`pdfunite ${fileNames.reduce((res, fileName) => `${res} ${fileName}`)} ${OUT_IDR}${STILL_ID}.pdf`)

  await cmd(`rm ${fileNames.reduce((res, fileName) => `${res} ${fileName}`)}`)
}

main()