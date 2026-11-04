import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("roles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Post()
  // @ApiOperation({ summary: "Create a new role" })
  // @ApiResponse({ status: 201, description: "Role created successfully" })
  // @ApiResponse({ status: 400, description: "Bad request" })
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.create(createRoleDto);
  // }

  // @Get()
  // @ApiOperation({ summary: "Get all roles" })
  // @ApiResponse({ status: 200, description: "Return all roles" })
  // findAll() {
  //   return this.rolesService.findAll();
  // }

  // @Get(":id")
  // @ApiOperation({ summary: "Get a role by ID" })
  // @ApiResponse({ status: 200, description: "Return the role" })
  // @ApiResponse({ status: 404, description: "Role not found" })
  // findOne(@Param("id") id: number) {
  //   return this.rolesService.findOne(id);
  // }

  // @Patch(":id")
  // @ApiOperation({ summary: "Update a role" })
  // @ApiResponse({ status: 200, description: "Role updated successfully" })
  // @ApiResponse({ status: 404, description: "Role not found" })
  // update(@Param("id") id: number, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(id, updateRoleDto);
  // }

  // @Delete(":id")
  // @ApiOperation({ summary: "Delete a role" })
  // @ApiResponse({ status: 200, description: "Role deleted successfully" })
  // @ApiResponse({ status: 404, description: "Role not found" })
  // remove(@Param("id") id: number) {
  //   return this.rolesService.remove(id);
  // }
}
