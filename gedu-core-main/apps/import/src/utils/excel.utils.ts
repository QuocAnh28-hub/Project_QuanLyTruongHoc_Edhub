import ExcelJS from 'exceljs';
import { Readable } from 'stream';

/**
 * Read an XLSX file from a Readable stream and return the worksheet reader at the given index.
 * @param readable - Readable stream containing XLSX data
 * @param worksheetIndex - Zero-based index of the worksheet to retrieve (default: 0)
 * @returns Promise resolving to the worksheet reader at the specified index
 * @throws Error when no worksheet is found at the given index
 */
export const readXLSXAsStream = async (
  readable: Readable,
  worksheetIndex: number = 0
): Promise<ExcelJS.stream.xlsx.WorksheetReader> => {
  const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(readable, {
    entries: 'emit',  
    sharedStrings: 'cache',  
    styles: 'cache',  
    worksheets: 'emit',
  });
  let worksheetReader: ExcelJS.stream.xlsx.WorksheetReader | null = null;
  let currentIndex = 0;
  for await (const sheet of workbookReader) {
    if (currentIndex === worksheetIndex) {
      worksheetReader = sheet;
      break;
    }
    currentIndex++;
  }
  
  if (!worksheetReader) {
    throw new Error(`No worksheet found at index ${worksheetIndex}`);
  }
  return worksheetReader;
};

/**
 * Converts a readable stream to a Buffer by collecting all data chunks.
 * @param stream - The readable stream to convert
 * @returns Promise resolving to a Buffer containing all stream data
 */
export const streamToBuffer = (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer | string) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    );
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err) => reject(err));
    // Handle case where stream is already ended
    if (stream.readableEnded) {
      resolve(Buffer.concat(chunks));
    }
  });
};