import https from 'https';
import fs from 'fs';
import path from 'path';
import Telegram from 'node-telegram-bot-api';
import { toWebP } from 'tgs2gif';
import cliProgress from 'cli-progress';
import { mkdir, rmdir } from './utils/fileSystem.js';

class DownloadError extends Error {
  constructor(message, errorCode) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
  }

  statusCode() {
    return this.status;
  }
}

const downloadPackAsWebp = async (stickerPackName, options) => {
  const bot = new Telegram(options.token, { polling: false });
  const stickerPackOutputDirectory = path.join(options.outputDirectory, stickerPackName);

  console.info(`Fetching information of sticker pack "${stickerPackName}"...`);

  let stickerPackInformation;

  try {
    stickerPackInformation = await bot.getStickerSet(stickerPackName);
  } catch (error) {
    const { error_code: errorCode, description: errorDescription } = error.response.body;
    throw new DownloadError(
      `Failed to get information of sticker pack "${stickerPackName}" due to the following reason: ${errorCode} - ${errorDescription}`,
      'FAILED_TO_GET_STICKER_INFORMATION',
    );
  }

  const { is_animated: isAnimatedStickerPack } = stickerPackInformation;

  if (!isAnimatedStickerPack) {
    throw new DownloadError(
      `Sticker pack "${stickerPackName}" is not an animated sticker pack and is not supported by this tools.`,
      'NOT_ANIMATED_STICKER_PACK',
    );
  }

  const numberOfStickers = stickerPackInformation.stickers.length;

  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(numberOfStickers, 0);

  if (fs.existsSync(stickerPackOutputDirectory)) {
    rmdir(stickerPackOutputDirectory);
  }

  mkdir(stickerPackOutputDirectory);

  fs.writeFileSync(
    path.join(stickerPackOutputDirectory, 'mainfest.json'),
    JSON.stringify(stickerPackInformation, null, 2),
  );

  for (let i = 0; i < stickerPackInformation.stickers.length; i++) {
    const sticker = stickerPackInformation.stickers[i];
    // eslint-disable-next-line no-await-in-loop
    const tgsUrl = await bot.getFileLink(sticker.file_id);
    const outputPath = `${stickerPackOutputDirectory}/${(`0000${i + 1}`).slice(-2)}.webp`;

    let isDownloadFinished = false;
    let numberOfTries = 0;

    while (!isDownloadFinished && numberOfTries < 3) {
      numberOfTries++;

      // eslint-disable-next-line no-await-in-loop
      isDownloadFinished = await new Promise((resolve, reject) => {
        https.get(tgsUrl, async (stream) => {
          try {
            await toWebP(stream, outputPath);
            resolve(true);
          } catch (error) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(false);
          }
        });
      });
    }

    if (isDownloadFinished) {
      progressBar.update(i + 1);
    } else {
      progressBar.stop();

      throw new DownloadError(
        `Failed to download one or more stickers from "${stickerPackName}", please try again later.`,
        'STICKER_DOWNLOAD_FAILED',
      );
    }
  }

  progressBar.stop();
  console.info(`Finish downloading sticker pack "${stickerPackName}".`);
};

export default downloadPackAsWebp;
