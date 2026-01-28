export interface Category {
  _id: string;
  name: string;
  slug?: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  category: Category;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}




