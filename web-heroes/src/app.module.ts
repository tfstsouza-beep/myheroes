import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroController } from './controllers/hero.controller';
import { HeroRepository } from './repository/hero.repository';
import { HeroService } from './service/hero.service';

@Module({
  imports: [],
  controllers: [AppController, HeroController],
  providers: [
    AppService,
    HeroRepository,
    {
      provide: HeroService,
      useFactory: (repo: HeroRepository) => new HeroService(repo),
      inject: [HeroRepository],
    },
  ],
})
export class AppModule {}
