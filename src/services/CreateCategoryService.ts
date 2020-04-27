import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title_category: string;
}

class CreateCategoryService {
  public async execute({ title_category }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { title: title_category },
    });

    if (!category) {
      const newCategory = categoryRepository.create({
        title: title_category,
      });

      await categoryRepository.save(newCategory);
      return newCategory;
    }
    return category;
  }
}

export default CreateCategoryService;
