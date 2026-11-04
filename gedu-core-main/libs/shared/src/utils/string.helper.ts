import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";

export const renameVietnameseDistrictToEnglish = (input: string) => {
  const name = removeVietnameseDiacritics(input);
  let cleanedName = name;

  if (name.toLowerCase().includes("thi xa")) {
    cleanedName = name.replace(/thi xa/gi, "").trim() + " Town";
  } else if (name.toLowerCase().includes("thanh pho")) {
    cleanedName = name.replace(/thanh pho/gi, "").trim() + " City";
  } else if (name.toLowerCase().includes("huyen")) {
    cleanedName = name.replace(/huyen/gi, "").trim() + " District";
  } else if (name.toLowerCase().match(/quan \d+/)) {
    cleanedName = name.replace(/quan/gi, "District").trim();
  } else if (name.toLowerCase().includes("quan")) {
    cleanedName = name.replace(/quan/gi, "").trim() + " District";
  }

  return cleanedName;
};

export const renameVietnameseWardToEnglish = (input: string) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return removeVietnameseDiacritics(input.toLowerCase()
    .replace(/^(xã|phường|đặc khu)/gi, "")).trim();
};

/**
 * Rename Vietnamese province to English
 * @param input - The input string
 * @returns The renamed string
 */
export const renameVietnameseProvinceToEnglish = (input: string) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  const cleanedName = removeVietnameseDiacritics(input.toLowerCase()
    .replace(/^(thành phố|tỉnh)/gi, ""))
    .trim();

  return cleanedName;
};

export const removeVietnameseDiacritics = (input: string) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  let name = input;
  name = name.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  name = name.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  name = name.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  name = name.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  name = name.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  name = name.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  name = name.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  name = name.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  name = name.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  name = name.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  name = name.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  name = name.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  name = name.replace(/đ/g, "d");
  name = name.replace(/Đ/g, "D");
  name = name.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // tone marks
  name = name.replace(/\u02C6|\u0306|\u031B/g, ""); // diacritical marks

  return name;
};

export const generateSecurePassword = (length = 16) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#_";
  const randomBytes = crypto.randomBytes(length);
  return Array.from(randomBytes, (byte) => charset[byte % charset.length]).join(
    ""
  );
};

export const cryptString = async (str: string): Promise<string> => {
  return await bcrypt.hash(str, 8);
};

export const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const convertToComparableFormat = (input: string) => {
  return removeVietnameseDiacritics(input).toLowerCase().trim().replace(/\s+/g, '-');
};

export const convertProvinceNameToComparableFormat = (input: string) => {
  return renameVietnameseProvinceToEnglish(input).toLowerCase().trim().replace(/\s+/g, '-');
};

export const convertWardNameToComparableFormat = (input: string) => {
  return renameVietnameseWardToEnglish(input).toLowerCase().trim().replace(/\s+/g, '-');
};

export const compareProvinceName = (input1: string, input2: string) => {
  if (!input1 || !input2) {
    return false;
  }
  return convertProvinceNameToComparableFormat(input1) === convertProvinceNameToComparableFormat(input2);
};

export const compareWardName = (input1: string, input2: string) => {
  if (!input1 || !input2) {
    return false;
  }
  return convertWardNameToComparableFormat(input1) === convertWardNameToComparableFormat(input2);
};

export const compareTwoString = (input1: string, input2: string) => {
  if (!input1 || !input2) {
    return false;
  }
  return convertToComparableFormat(input1) === convertToComparableFormat(input2);
};

export const buildURL= (host: string, path: string, port?: string | number) => {
  if (host.startsWith('http')) {
    return [host, path].join('/')
  }
  let _port = port ? parseInt(port.toString()) : 80;
  if (port === 80) {
    return `http://${[host, path].join('/')}`
  } else if (port === 443) {
    return `https://${[host, path].join('/')}`
  }
  return `http://${[host, path].join('/')}:${port}`
}