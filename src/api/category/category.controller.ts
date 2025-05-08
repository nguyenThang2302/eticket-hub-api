import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListCategoryResponseWrapperDto } from './dto/list-category-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Retrieve a list of categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of categories retrieved successfully',
    type: ListCategoryResponseWrapperDto,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCategories(@I18n() i18n: I18nContext) {
    const lang = i18n.lang;
    return await this.categoryService.getCategories(lang);
  }
}
