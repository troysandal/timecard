import { CheckpointTypes } from "../timekeeper";

export interface CheckDatum {
  type: CheckpointTypes,
  minute: number,
  seconds: number,
  drop: boolean
};
