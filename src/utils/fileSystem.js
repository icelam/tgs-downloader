import fs from 'fs';
import path from 'path';

export const mkdir = (directory) => {
  try {
    fs.mkdirSync(directory, 0o755);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
};

export const rmdir = (directory) => {
  if (fs.existsSync(directory)) {
    const list = fs.readdirSync(directory);
    for (let i = 0; i < list.length; i++) {
      const filename = path.join(directory, list[i]);
      const stat = fs.statSync(filename);

      if (filename !== '.' && filename !== '..') {
        if (stat.isDirectory()) {
          rmdir(filename);
        } else {
          fs.unlinkSync(filename);
        }
      }
    }
    fs.rmdirSync(directory);
  } else {
    console.warn(`Warn: Cannot remove ${directory} that does not exists`);
  }
};
