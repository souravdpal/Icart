import React from 'react'
import {Star,IndianRupee} from 'lucide-react'

interface HomeCardModel {
    img: string,
    Title: string,
    Discribe: string,
    Rate: number,
    Price : number,
}
const Card = (props: HomeCardModel) => {
    let card_image: string = props.img || "/img/no_image";
    let car_Title :string = props.Title || "Not found ,Error"
    let card_discribe :string =props.Discribe|| "No description found"
    return (
        <div className='gap-3 group max-w-sm rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition bg-white cursor-pointer'>

            <div className=' ml-8 h-60 w-60 bg-white/15 backdrop-blur-md boder boder-white/20 shadow-xl text-white overflow-hidden rounded-2xl items-center'>
                <img src={card_image} className='mb-2 p-3 rounded-4 xl size-60 static' />


            </div>
            <div>
                <p className="text-black text-bol p-2 text-center font-medium text-clamp-3 group-hover:underline">
                    {car_Title}
                </p>
            </div>
            <div className='translate-x-27 m-2 flex gap-3'>
             <Star color='#facc15' fill='#facc15' className='bg-linear-r from-yellow-300 to-25%'/> {props.Rate}
            </div>
            <div className="flex gap-1 p-3 translate-x-27 items-center">
                <IndianRupee className='font-extrabold'/>
                <p className='font-semibold'>{props.Price}</p>
            </div>
            <div>
                <p className="text-black text-bol p-2 text-center font-medium text-clamp-3 group-hover:underline">
                    {card_discribe}
                </p>
            </div>
        </div>
    )
}

export default Card
