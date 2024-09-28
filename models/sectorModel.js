import mongoose from 'mongoose';

const sectorSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
    }
)


export const Sector = mongoose.model('Sector', sectorSchema)