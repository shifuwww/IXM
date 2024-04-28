export interface IGetFile {
  id: string;
  name: string;
  type: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDownloadFile {
  data: Buffer;
  mimeType: string;
}

export interface IFilterFile {
  page: number;
  limit: number;
  order: string;
  getOrderedField(fields: string[]): string;
  countOffset(): number;
}

export interface IFilesPageableReponseData {
  count: number;
  total: number;
  pageCount: number;
  page: number;
  data: Array<IGetFile>;
}
