import getAllProd from "./getAllProd";

export default function(Senderid:string){
    let data = getAllProd()
    let product =  data.find((prod)=>prod.id==Senderid)
    return product
    
}