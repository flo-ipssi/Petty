import { categoriesTypes } from "@/utils/categories";

export interface UploadData {
  cards: Array<{
    uploads: any;
    uri: string;
    _id: string;
    owner?: {
      name: string;
      id: string;
    };
    file: string;
    category: categoriesTypes;
  }>;
}