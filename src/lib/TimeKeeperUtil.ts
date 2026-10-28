import { CheckpointTypes } from "../models/timekeeper";

export interface CheckDatum {
  type: CheckpointTypes,
  minute: number,
  seconds: number,
  drop: boolean
};
