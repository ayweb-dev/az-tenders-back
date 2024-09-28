import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  googleId: {
    //si il s'est connecté avec Google
    type: String,
    unique: true,
    sparse: true,
  },
  tel: {
    type: String,
    validate: {
      validator: function (v) {
        return /^0\d{9}$/.test(v);
      },
      message: (props) =>
        `${props.value} n'est pas un numéro de telephone valide!`,
    },
  },
  wilaya: {
    type: String,
    enum: [  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
      "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
      "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
      "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
      "M’Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj",
      "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
      "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa","Relizane",
      'Timimoune', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès', 'In Salah', 'In Guezzam',
      'Touggourt', 'Djanet', "El M'Ghair",'El Meniaa'],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: [8, "Le mot de passe doit contenir au moins 8 caractère"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "super admin"], //super admin ?
    default: "user",
  },
  nbrTenders: {
    //que pour l'admin : le nombre de tenders ajoutés par cet admin
    type: Number,
    default: 0,
  },
  favorites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tender",
    },
  ],
});

userSchema.path('password').validate(function (value) {
  // Si googleId est absent, un mot de passe doit être fourni
  if (!this.googleId && !value) {
    return false;
  }
  return true;
}, 'Please provide a password');

// Encrypter le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  // Si le mot de passe n'est pas modifié ou s'il est absent (utilisateur Google), on ne fait rien
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  // Si le mot de passe est modifié et présent, on le hache
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const User = mongoose.model("User", userSchema);
