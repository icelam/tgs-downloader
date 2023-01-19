import dotenv from 'dotenv';
import path from 'path';
import { ArgumentParser } from 'argparse';
import { mkdir } from './utils/fileSystem.js';
import errorLogger from './utils/errorLogger.js';
import downloadPackAsWebp from './downloader.js';

dotenv.config({ path: '.env' });

const main = async () => {
  const parser = new ArgumentParser({
    description: 'CLI tool for downloading animated stickers (*.tgs) from Telegram',
  });

  parser.add_argument('stickerPacks', { help: 'Names of animated sticker pack', nargs: '+' });

  const args = parser.parse_args();

  const cwd = process.cwd();
  const OUTPUT_DIRECTORY = path.join(cwd, process.env.OUTPUT_DIRECTORY || 'output');
  mkdir(OUTPUT_DIRECTORY);

  // eslint-disable-next-line no-restricted-syntax
  for (const pack of args.stickerPacks) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await downloadPackAsWebp(
        pack,
        { outputDirectory: OUTPUT_DIRECTORY, token: process.env.BOT_TOKEN },
      );
    } catch (error) {
      errorLogger(error);
    }
  }
};

main();
