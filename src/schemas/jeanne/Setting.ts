import SettingModel from "~/types/jeanne/Setting";
import { Schema } from "mongoose";

const Setting: Schema<SettingModel> = new Schema<SettingModel>({
    title: String,
    description: String
});

export default Setting;
