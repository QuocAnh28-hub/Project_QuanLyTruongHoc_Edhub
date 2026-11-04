import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const generateUniqueFileName = (originalName: string): string => {
  return `${uuidv4()}${extname(originalName)}`;
};

export const getFileExtension = (fileName: string): string => {
  return extname(fileName);
};

export const isImageFile = (fileName: string): boolean => {
  const ext = getFileExtension(fileName).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
};

export const isPdfFile = (fileName: string): boolean => {
  const ext = getFileExtension(fileName).toLowerCase();
  return ext === '.pdf';
};

export const isExcelFile = (fileName: string): boolean => {
  const ext = getFileExtension(fileName).toLowerCase();
  return ['.xls', '.xlsx'].includes(ext);
};

export const isDocFile = (fileName: string): boolean => {
  const ext = getFileExtension(fileName).toLowerCase();
  return ['.doc', '.docx'].includes(ext);
}; 