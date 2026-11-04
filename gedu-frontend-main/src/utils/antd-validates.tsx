export const antDCheckWhiteSpace = (_: any, value: string) => {
  if (value && value.includes(' ')) {
    return Promise.reject(new Error('Không được chứa khoảng trắng'));
  }
  return Promise.resolve();
};