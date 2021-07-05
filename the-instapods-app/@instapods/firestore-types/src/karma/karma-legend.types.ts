import { TDropId, TUserId, TPodId, TEngagementId } from "../base.types";

export type TDropKey = number;
export type TDropLegend = {
  key: TDropKey;
  value: TDropId;
};

export type TPodKey = number;
export type TPodLegend = {
  key: TPodKey;
  value: TPodId;
};

export type TUserKey = number;
export type TUserLegend = {
  key: TUserKey;
  value: TUserId;
};

export type TEngagementKey = number;
export type TEngagementLegend = {
  key: TEngagementKey;
  value: TEngagementId;
};

export type TLegendClassNames =
  | "dropLegend"
  | "engagementLegend"
  | "userLegend"
  | "podLegend";

export interface IKarmaLegendMap {
  [key: string]: Array<TKarmaLegend>;
  dropLegend: Array<TDropLegend>;
  engagementLegend: Array<TEngagementLegend>;
  userLegend: Array<TUserLegend>;
  podLegend: Array<TPodLegend>;
}

export type TKarmaLegend =
  | TDropLegend
  | TPodLegend
  | TUserLegend
  | TEngagementLegend;
