import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';



@Controller('inventory')
export class InventoryController {   
    constructor(private readonly inventoryServ :InventoryService){}

    @GrpcMethod('InventoryService' , 'GetAmount')
    getAmount(data: {product_id: string}){
      return  this.inventoryServ.get_amount(data.product_id);
    }

    @GrpcMethod('InventoryService' , 'AddQuantity')
    addQuantity(data: {quantity: number , product_id: string}){
        return this.inventoryServ.add_quantity(data.quantity , data.product_id);
    }

    @GrpcMethod('InventoryService' , 'CheckAmount')
    checkAmount (data : {product_id : Array<string> , amount : Array<number>}){
        return this.inventoryServ.check_amount(data.product_id , data.amount)
    }
  }
