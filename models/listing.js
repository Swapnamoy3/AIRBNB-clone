const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review = require("./reviews.js");
const url="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIsAiwMBIgACEQEDEQH/xAAbAAEBAQEBAQEBAAAAAAAAAAAAAQQFAwIGB//EADgQAAIBAgMDCAgFBQAAAAAAAAABAgMEERIhMVFhBRMiMjVBcZEUUlVzkrLB0TNCU6GiFSNyseH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/uICAEBQBAUAQAAAUgFBABQQAUEAFBABQAAAAAAAAAAAAAAAAZ7i6p0Jwg05Tm8FGOr8TQAAAAAAAAAAAHy5RTwckvFkzw9ePmYK1CnccrOFWOaKo47WtcT4vKPJ1pFZ6GMnsipPX9wOlzkPXj5jnIevHzOTZx5PuZ5PR3Ce1Jzev7nu7Xk9XKt3S6bjj1n9wN+eHrx8xnh68fMzf0yz/R/k/uP6ZZ/o/wAn9wNOeHrx8zwu7tUIxjBZ6s+pFGS8t7K3ShCgp1pdSGZv6nvbWMVGUrjp1aiwk8cMFuWAFs6EaTdavUjOvPrSx2cEbDl8o2NtRs6lSnSUZJrB4vejpw6kfACgAAAAKCFAAADCu2Ze4+qMvLVvUc41oxcoqODw7jVHtmXuPqjawPztjGVOp6RJNU6WrbW3geMq9SVfn8f7mbNjxN3LNznqK3i+jDWXFnN2Afp7WurijGou9arczzvLpUEoQWetPSEDl2FarbUpYRcnV/Dp97e/wOnZ2rpt1qzz15daW7ggFnauk3VrPPXn1pbuCNZ5zqwpuKnJJzeEce9n2Bk5X7Pq+MfmRqp9SPgZeV+z6vjH5kaodSPgB9AgAoIACKCAUAAYV2zL3H1R7Xtwra3lU/Nsit7PFdsy9x9UczlW55+4yxfQp6LjvYGNtybk3i3q2e9ClpGc4uTl+HTX53vfAUKWCjKcczl+HT758XwPqvWyZoxnmqS0nUWz/FcAFaq4OSjLNVl16i/1Hgdiyu41rTnJvBwWE/ufntD6U2oyipNRl1lvA9r25lc13PZFaQW5HX5Mu/SaWWb/ALkNHx4nAPS3rSoVY1Ke1d28Ducr9n1fGPzI1w6kfBGHlCtCvyTOpB6Sy/MjdDqR8AKCgCFAAgKAIAAMFxC4hfOvRoqpF08mssO8zTy0ujUsaKqy0hCLxbe/wN95dKglCEc9aekIrvPmztXScqtZ568+tLdwQGWFvcUZN+jqvOawlKUkkuC4Dmavsyj8SOqAOVzVX2ZR+JDmavsyj8SOqAOVzNX2bR+JDmavsyj8SOqAOTVpXU7aVCnZQpxk03lmt51YaRSe1IoApAAKCAACgCAoA+XCLkpNLMtjw1RXsKAPGFxTnHNF4rNl8HieiknsaeG3Bmb0WXQakk1LGXFY4+Z9UKEqcouWVKMMvR/NxYHrGpFrbhwZc8dOktdmu0zeivXFxeLjtW6Tf1Erab0i4qObNpph0sdwGnPHVZlituuw+k01inijBGhOWZZWntxemHSxw/6a6EObhg9NW9uIHoUACAoAAAACIoEAAAAAUjAAAAAgAAAAFIAAAAFAAAAAAAAAAAAAAAAAAAAAAAB//9k=";




const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:url,
        set: (v)=>{
           return v===""?url:v;
        }
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:String,

    reviews:[{
        type: Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }


});




listingSchema.post("findOneAndDelete",async (data)=>{
    console.log("data ",data)
    if(data)
    await Review.deleteMany({_id:{$in:data.reviews}});
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing