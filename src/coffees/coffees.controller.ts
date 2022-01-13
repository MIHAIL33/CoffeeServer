import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query, Res, SetMetadata, UsePipes, ValidationPipe } from '@nestjs/common';
import { response } from 'express';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('coffees')
@UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeesService: CoffeesService) {

    }


    @ApiForbiddenResponse(
        {
            description: 'Forbidden.'
        }
    )
    @UsePipes(ValidationPipe)
    //@SetMetadata('isPublic', true)
    @Public()
    @Get()
    async findAll(
        @Protocol('https') protocol: string,
        @Query() paginationQuery: PaginationQueryDto
    ) {
        //const { limit, offset} = paginationQuery
        //await new Promise(resolve => setTimeout(resolve, 5000))
        return this.coffeesService.findAll(paginationQuery)
    }

    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.coffeesService.findOne('' + id)
    }

    @Post()
    @HttpCode(HttpStatus.GONE)
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        //console.log(createCoffeeDto instanceof CreateCoffeeDto)
        return this.coffeesService.create(createCoffeeDto)
    }


    @Patch(':id')
    update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id)
    }

}
