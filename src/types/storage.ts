export type MetadataFile = {
  files: IFile[];
};

export type IFile = {
  path: string;
  isPublic: boolean;
  isString: boolean;
  lastModified: string;
  url: string;
};
