import { Injectable, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Connection } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// class MockCoffeesService {}
// providers: [{ provide: CoffeesService, useValue: new MockCoffeesService() }]
//{ provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe']}
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
    async create(): Promise<string[]> {
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
        return coffeeBrands
    }
}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        CoffeeBrandsFactory,
        { 
            provide: ConfigService, 
            useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService : ProductionConfigService},
        { provide: COFFEE_BRANDS, useFactory: (brandsFactory: CoffeeBrandsFactory) => brandsFactory.create(), inject: [CoffeeBrandsFactory], scope: Scope.TRANSIENT}
    ],
    exports: [CoffeesService]
})
export class CoffeesModule {}
