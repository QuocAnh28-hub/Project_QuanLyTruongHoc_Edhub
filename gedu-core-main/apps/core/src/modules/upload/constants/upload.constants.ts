export const UPLOAD_CONFIG = 'UPLOAD_CONFIG';

export const ACCEPTED_TYPES = [
  {
    type: 'avatar',
    mimeTypes: [
      'image/jpeg',
      'image/png',
    ],
    isPublic: true
  },
  {
    type: 'document',
    mimeTypes: [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ],
    isPublic: false
  }
]

export const DEFAULT_UPLOAD_CONFIG = {
  maxSizeInMB: 50,
}; 