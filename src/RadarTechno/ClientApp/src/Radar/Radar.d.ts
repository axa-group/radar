import { ITechnology } from '../Technology/Technology';

export type IRadarColor = string[];

export interface IRadarColors {
  default: IRadarColor;
  infrastructures: IRadarColor;
  frameworks: IRadarColor;
  patterns: IRadarColor;
  platforms: IRadarColor;
  tools: IRadarColor;
  practices: IRadarColor;
}
