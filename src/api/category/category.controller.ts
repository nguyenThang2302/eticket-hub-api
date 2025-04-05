import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCategories(@I18n() i18n: I18nContext) {
    const lang = i18n.lang;
    return await this.categoryService.getCategories(lang);
  }
}
