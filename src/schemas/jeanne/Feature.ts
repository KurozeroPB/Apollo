import FeatureModel from "~/types/jeanne/Feature";
import { Schema } from "mongoose";

const Feature: Schema<FeatureModel> = new Schema<FeatureModel>({
    title: String,
    desc: String
});

export default Feature;
