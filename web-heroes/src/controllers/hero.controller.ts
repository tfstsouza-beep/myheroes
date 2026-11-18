import  {
  HeroService,
  CreateHeroDTO,
  UpdateHeroDTO,
  PatchHeroDTO,
} from '../service/hero.service';
import type { Hero } from '../repository/hero.repository';
import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';

@Controller('heroes')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  findAll(): Hero[] | Hero {
    // Chama o método find() sem parâmetros da HeroService
    return this.heroService.find();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Hero | Hero[] {
    try {
      // Chama o método find(id) passando o identificador numérico
      return this.heroService.find(id);
    } catch (error: any) {
      // Se a service disparar erro de não encontrado, devolvemos 404 Not Found HTTP
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  create(@Body() body: CreateHeroDTO): Hero {
    try {
      // Repassa os dados validados para o método create() da service
      return this.heroService.create(body);
    } catch (error: any) {
      // Se a mensagem indicar duplicidade de nome, respondemos 409 Conflict
      if (error.message.includes('Já existe')) {
        throw new ConflictException(error.message);
      }
      // Qualquer outro erro de validação (tamanho, formato) responde 400 Bad Request
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHeroDTO,
  ): Hero {
    try {
      return this.heroService.update(id, body);
    } catch (error: any) {
      if (error.message.includes('não foi encontrado')) {
        throw new NotFoundException(error.message);
      }
      if (error.message.includes('Já existe')) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: PatchHeroDTO,
  ): Hero {
    try {
      return this.heroService.patch(id, body);
    } catch (error: any) {
      if (error.message.includes('não foi encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): void {
    try {
      this.heroService.delete(id);
    } catch (error: any) {
      throw new NotFoundException(error.message);
    }
  }
}

