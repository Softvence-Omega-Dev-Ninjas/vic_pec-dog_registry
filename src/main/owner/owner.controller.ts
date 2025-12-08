import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateOwnerDto } from "./dto/create-owner.dto";
import { QueryOwnerDto } from "./dto/query-owner.dto";
import { UpdateOwnerDto } from "./dto/update-owner.dto";
import { OwnerService } from "./owner.service";

@ApiTags("owners")
@Controller("owners")
export class OwnerController {
    constructor(private readonly ownerService: OwnerService) {}

    @Post()
    @ApiOperation({ summary: "Create a new owner" })
    create(@Body() dto: CreateOwnerDto) {
        return this.ownerService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: "Get all owners" })
    @ApiQuery({ type: QueryOwnerDto })
    findAll(@Query() query: QueryOwnerDto) {
        return this.ownerService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get owner by id" })
    @ApiParam({ name: "id", description: "Owner ID" })
    findOne(@Param("id") id: string) {
        return this.ownerService.findOne(id);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update owner" })
    @ApiParam({ name: "id", description: "Owner ID" })
    update(@Param("id") id: string, @Body() dto: UpdateOwnerDto) {
        return this.ownerService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete owner" })
    @ApiParam({ name: "id", description: "Owner ID" })
    remove(@Param("id") id: string) {
        return this.ownerService.remove(id);
    }
}
