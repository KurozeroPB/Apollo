import { Document } from "mongoose";

interface IFeature {
    title: string;
    desc: string;
}

interface IFeatureModel extends IFeature, Document {};

export default IFeatureModel;
