import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Category } from 'src/database/entities/category.entity';
import { Repository } from 'typeorm';
import {
  ListCategoryResponseDto,
  ListCategoryResponseWrapperDto,
} from './dto/list-category-response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(lang?: string): Promise<ListCategoryResponseWrapperDto> {
    const query = this.categoryRepository.createQueryBuilder('category');

    if (lang) {
      query.where('category.lang_code = :lang', { lang });
    }

    query.orderBy('category.created_at', 'ASC');

    const categories = await query.getMany();

    const items = plainToInstance(ListCategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });

    return plainToInstance(
      ListCategoryResponseWrapperDto,
      { items },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
