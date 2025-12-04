import { Schema, model } from 'mongoose';

// Interface pour un véhicule
export interface IVehicule {

  _id?: string;

  marque: string;
  modele: string;
  immatriculation: string;
  categorie: 'Économique' | 'Standard' | 'SUV' | 'Luxe';
  prixJour: number;
  annee: number;
  disponible: boolean;
  dateMiseEnService?: Date;
  options: string[];
  dateCreation?: Date;
}

const VehiculeSchema = new Schema<IVehicule>({
  marque: {
    type: String,
    required: [true, "Le champ 'marque' est requis."],
    trim: true,
  },

  modele: {
    type: String,
    required: [true, "Le champ 'modele' est requis."],
    trim: true,
  },

  immatriculation: {
    type: String,
    required: [true, "Le champ 'immatriculation' est requis."],
    unique: true,
    trim: true,
  },

  categorie: {
    type: String,
    required: [true, "Le champ 'categorie' est requis."],
    enum: ['Économique', 'Standard', 'SUV', 'Luxe'],
  },

  prixJour: {
    type: Number,
    required: [true, "Le champ 'prixJour' est requis."],
    min: [20, "Le prix par jour doit être d'au moins 20 $."],
    max: [500, "Le prix par jour ne doit pas dépasser 500 $."],
  },

  annee: {
    type: Number,
    required: [true, "Le champ 'annee' est requis."],
    min: [2005, "L'année du véhicule doit être 2005 ou plus."],
    max: [new Date().getFullYear(), "L'année du véhicule ne peut pas dépasser l'année courante."],
  },

  disponible: {
    type: Boolean,
    default: true,
  },

  dateMiseEnService: {
    type: Date,
  },

  options: {
    type: [String],
    default: [],
    validate: {
      validator: (v: string[]) => v.length <= 10,
      message: "Le nombre d'options ne doit pas dépasser 10.",
    },
  },

  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

// Validation personnalisée 1 : catégorie Luxe → prix minimum
VehiculeSchema.path('prixJour').validate(function (this: IVehicule, value: number) {
  if (this.categorie === 'Luxe' && value < 80) {
    return false;
  }
  return true;
}, "Pour un véhicule de catégorie Luxe, le prix par jour doit être d'au moins 80 $.");

// Validation personnalisée 2 : cohérence année / date de mise en service
VehiculeSchema.path('dateMiseEnService').validate(function (this: IVehicule, value: Date) {
  if (value && this.annee) {
    const anneeMiseEnService = value.getFullYear();
    if (anneeMiseEnService < this.annee) {
      return false;
    }
  }
  return true;
}, "La date de mise en service ne peut pas être antérieure à l'année du véhicule.");

export const Vehicule = model<IVehicule>('Vehicule', VehiculeSchema);
export default Vehicule;
