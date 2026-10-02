import prodDataBase from "@/fake_data.json"


export default function(){
   let NewProd = prodDataBase.filter((newProduct)=>newProduct.isNew==true)
   return NewProd
}