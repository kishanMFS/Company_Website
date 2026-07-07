// Strapi API Response Types

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface StrapiImageFormats {
  thumbnail?: StrapiImageFormat;
  small?: StrapiImageFormat;
  medium?: StrapiImageFormat;
  large?: StrapiImageFormat;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  focalPoint: string | null;
  width: number;
  height: number;
  formats: StrapiImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiRichTextNode {
  type: string;
  children: Array<{
    type: string;
    text: string;
  }>;
}

export interface StrapiBreadcrumbs {
  type: string;
  enabled: boolean;
}

export interface StrapiMetaPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination: StrapiMetaPagination;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

// Company Settings Type (for your API data)
export interface CompanySettings {
  id: number;
  documentId: string;
  companyName: string;
  footer: StrapiRichTextNode[];
  companyLogo: StrapiImage;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}


export type HomeBanner = {
  title?: string;
  subtitle?: string;
  companyName?: string;
};

export type Service = {
  id?: number;
  title?: string;
  description?: string;
};

export type BlogPost = {
  id?: number;
  title?: string;
  content?: string;
  slug?: string;
};