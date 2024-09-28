import { format } from "date-fns";
import mongoose from "mongoose";

const tenderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    entreprise: {
      type: String,
      required: true,
    },
    anep: {
      type: String,
    },
    journal: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "appel d'offre",
        "consultation",
        "avis d'attribution",
        "concours",
        "annulation",
        "prorogation de delais",
        "infructuosite",
        "mise en demeure",
        "vente et adjudication",
      ],
    },
    dateDebut: {
      type: Date,
      required: true,
      get: (value) => format(new Date(value), "dd-MM-yyyy"), // Format de la date
    },
    dateEchehance: {
      type: Date,
      required: true,
      get: (value) => format(new Date(value), "dd-MM-yyyy"), // Format de la date
    },
    // Avis de parution
    imageUrl: {
      type: String,
    },

    wilaya: {
      type: String,
      required: true,
      enum: [
        "Adrar",
        "Chlef",
        "Laghouat",
        "Oum El Bouaghi",
        "Batna",
        "Béjaïa",
        "Biskra",
        "Béchar",
        "Blida",
        "Bouira",
        "Tamanrasset",
        "Tébessa",
        "Tlemcen",
        "Tiaret",
        "Tizi Ouzou",
        "Alger",
        "Djelfa",
        "Jijel",
        "Sétif",
        "Saïda",
        "Skikda",
        "Sidi Bel Abbès",
        "Annaba",
        "Guelma",
        "Constantine",
        "Médéa",
        "Mostaganem",
        "M’Sila",
        "Mascara",
        "Ouargla",
        "Oran",
        "El Bayadh",
        "Illizi",
        "Bordj Bou Arreridj",
        "Boumerdès",
        "El Tarf",
        "Tindouf",
        "Tissemsilt",
        "El Oued",
        "Khenchela",
        "Souk Ahras",
        "Tipaza",
        "Mila",
        "Aïn Defla",
        "Naâma",
        "Aïn Témouchent",
        "Ghardaïa",
        "Relizane",
        "Timimoune",
        "Bordj Badji Mokhtar",
        "Ouled Djellal",
        "Béni Abbès",
        "In Salah",
        "In Guezzam",
        "Touggourt",
        "Djanet",
        "El M'Ghair",
        "El Meniaa",
      ],
    },
    sectors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Sector",
        required: true,
      },
    ],
  },
  // Journal de parution (source) (required)
  // Numero d'ANEP (not required)
  {
    Timestamp: true,
    toJSON: { getters: true }, // Pour activer les getters lors de la conversion en JSON
    toObject: { getters: true }, // Pour activer les getters lors de la conversion en objet
  }
);

export const Tender = mongoose.model("Tender", tenderSchema);
