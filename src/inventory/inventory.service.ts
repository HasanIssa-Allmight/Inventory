import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Repository } from 'typeorm';
import { Inventory } from './entity';


@Injectable()
export class InventoryService {
    constructor(
    @InjectRepository(Inventory)
    private readonly repo: Repository<Inventory>,
  ) {}

  async get_amount(productId: string) {
    const product = await this.repo.findOne({
      where: { product__id: productId },
    });

    if (product) {
        return { quantity: product.quantity };
    }
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'product not found',
      });
  }

  async add_quantity(quantity : number , productId :string){
      const product = this.repo.create({
          quantity: quantity,
          product__id: productId
      });
      const savedStock = await this.repo.save(product);
      if(savedStock){
        return {message: "successfull"};
      }
        throw new RpcException({
          code: status.FAILED_PRECONDITION,
          message: 'faild to add quantity',
        });
  }
}
