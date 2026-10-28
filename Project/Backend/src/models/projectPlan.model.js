import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const projectPlanSchema=new Schema(
    {
        title:{
            type:String,
            required:true
        },
        overview:{
            type:String,
        },
        objectives:{
            type:String
        },
        scope:{
            type:String,
        },
        milestones:{
            type:String,
        },
        challenges:{
            type:String,
        },
        student:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

export const ProjectPlan=mongoose.model("ProjectPlan",projectPlanSchema)