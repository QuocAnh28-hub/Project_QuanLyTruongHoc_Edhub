import { convertToComparableFormat } from "@gedu/shared";
import { CONTACT_RELATION_MAPPING } from "../constants/common.constants";

export const parseFilePathFromUrl = (
  url: string
): { bucketName: string; objectName: string } => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter((part) => part); // Remove empty strings

    if (pathParts.length < 2) {
      throw new Error("Invalid file path format");
    }

    // First part after the domain is the bucket name
    const bucketName = pathParts[0];
    // Rest of the parts form the object name
    const objectName = pathParts.slice(1).join("/");

    return { bucketName, objectName };
  } catch (error) {
    throw new Error(
      `Invalid file path format. Expected URL format: https://domain/bucket-name/path/to/file.csv, got "${url}"`
    );
  }
};

export const arrayToObjectMapping = (array: string[], mapping: string[]) => {
  if (array.length !== mapping.length) {
    throw new Error("Array length does not match mapping length");
  }

  return mapping.reduce(
    (obj, key, index) => {
      const raw = array[index] ?? '';
      const cleaned = String(raw).trim().replace(/ +/g, " ");
      obj[key] = cleaned === "" ? undefined : parseValue(cleaned);
      return obj;
    },
    {} as Record<string, string | boolean | Date | undefined>
  );
};

export const streamToString = (
  stream: NodeJS.ReadableStream
): Promise<string> => {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

export const parseValue = (value: string): string | boolean | Date => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (dateRegex.test(value)) {
    const [day, month, year] = value.split("/");
    const isoDate = `${year}-${month}-${day}`;
    const date = new Date(isoDate);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return value || "";
};

export const constantNumberMapping = (input: string, mapping: Record<string, number>) => {
  const comparableInput = convertToComparableFormat(input);
  const result = mapping[comparableInput as keyof typeof mapping];
  return result !== undefined ? result : -1;
};

export const contactRelationMapping = (input: string) => {
  const comparableInput = convertToComparableFormat(input);
  const result = CONTACT_RELATION_MAPPING[comparableInput as keyof typeof CONTACT_RELATION_MAPPING];
  if (!result) {
    return CONTACT_RELATION_MAPPING['khac'];
  }
  return result;
};

/**
   * Extracts the file extension from a given file path.
   * @param input - The file path to extract the extension from.
   * @returns The file extension in lowercase, or an empty string if no extension is found.
   */
export const getExt = (input: string): string => {
  let pathname = input;
  try {
    pathname = new URL(input).pathname;
  } catch {
    // not a URL; best-effort removal of query/hash
    pathname = input.split('?')[0].split('#')[0];
  }
  const base = pathname.split('/').pop() ?? '';
  const idx = base.lastIndexOf('.');
  return idx >= 0 ? base.slice(idx + 1).toLowerCase() : '';
};