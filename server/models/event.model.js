import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
    },
    image : {
        type : String,
        default : ""
    },
    description : {
        type : String,
        required : true,
        trim : true,
    },
    theme : {
        type : String,
        trim : true,
        default : "",
    },
    location : {
        type : String,
        required : true,
        trim : true,
    },
    startDate : {
        type : Date,
        required : true,
    },
    endDate : {
        type : Date,
        required : true,
    },
    status : {
        type : String,
        enum : ["draft", "published", "cancelled"],
        default : "draft",
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    }
}, {
    timestamps : true
});

eventSchema.pre("validate", function() {
    if(
        this.startDate &&
        this.endDate &&
        this.endDate < this.startDate
    ) {
        this.invalidate("endDate", "End date cannot be before start date");
    };
});

const Event =mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;