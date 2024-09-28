import { format } from "date-fns";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Essai", "Basic", "Silver", "Gold"],
      required: true,
    },
    dateDeb: {
      type: Date,
      get: (value) => (value ? format(new Date(value), "dd-MM-yyyy") : value), // Format de la date
    },
    dateFin: {
      type: Date,
      get: (value) => (value ? format(new Date(value), "dd-MM-yyyy") : value), // Format de la date
    },
    sectors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Sector",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["updated", "expired", "deleted", "asked"],
      default: "updated",
    },
  },
  {
    toJSON: { getters: true }, // Pour activer les getters lors de la conversion en JSON
    toObject: { getters: true }, // Pour activer les getters lors de la conversion en objet
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
