import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { DataSource, Repository } from 'typeorm';
import { Inventory } from './entity';


@Injectable()
export class InventoryService {
    constructor(@InjectRepository(Inventory)
    private readonly repo: Repository<Inventory>,
    private datasource: DataSource
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

  async check_amount(productId : Array<string> , amount : Array<number>){
      console.log(productId)
      return await this.datasource.transaction(async (t) =>{
          const repo = t.getRepository(Inventory)
          for(let i=0 ; i<productId.length ; i++){

            const product = await repo.findOne({
                where :{
                    product__id : productId[i]
                },
                lock: { mode: 'pessimistic_write' }
            })
            if(product){
              if(product.quantity >= amount[i]){
                  product.quantity -= amount[i]; 
                  await repo.save(product)
              }
              else{
                  throw new RpcException({
                        code: status.OUT_OF_RANGE,
                        message: 'product amount less than 1',
                  })
              }
            }
            else{
              throw new RpcException({
                        code: status.NOT_FOUND,
                        message: `product ${i} not found`,
                })
            }
          }
          return {
            message : "successfull"
          }
      })
  }
}
