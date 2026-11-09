import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        startTime: {
            type: Date,
            required: true
        },

        endTime: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

sessionSchema.pre("validate", function () {
    if (
        this.startTime &&
        this.endTime &&
        this.endTime <= this.startTime
    ) {
        this.invalidate(
            "endTime",
            "End time must be after start time"
        );
    }
});


const Session = mongoose.model("Session", sessionSchema);

export default Session;