export type MetadataFile = {
  files: File[];
};

export type File = {
  path: string;
  isPublic: boolean;
  lastModified: string;
  url: string;
};
