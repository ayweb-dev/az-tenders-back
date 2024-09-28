import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Veuillez insérer votre nom"],
  },
  tel: {
    type: String,
    required: [true, "Veuillez insérer votre numéro de téléphone"],
    validate: {
      validator: function (v) {
        return /^0\d{9}$/.test(v);
      },
      message: (props) =>
        `${props.value} n'est pas un numéro de telephone valide!`,
    },
  },
  email: {
    type: String,
    required: [true, "Veuillez saisir votre email."],
    lowercase: true,
  },
  body: {
    type: String,
    required: [true, "Veuillez saisir votre message."],
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

export const Message = mongoose.model("Message", messageSchema);
