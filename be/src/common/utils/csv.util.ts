import * as fs from 'fs';
const csvReader = require('csv-reader');

export function readCsvFile<T>(path: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const rows: T[] = [];

    const inputStream = fs.createReadStream(path, 'utf8');
    inputStream
      .pipe(new csvReader({ asObject: true, parseNumbers: true, trim: true }))
      .on('data', (item: any[]) => {
        const row = item as T;
        rows.push(row);
      })
      .on('end', () => {
        return resolve(rows);
      })
      .on('error', (err: any) => {
        return reject(err);
      });
  });
}
