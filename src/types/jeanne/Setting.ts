import { Document } from "mongoose";

interface ISetting {
    title: string;
    description: string;
}

interface ISettingModel extends ISetting, Document {}

export default ISettingModel;
