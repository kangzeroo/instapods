import {
  TPodId,
  TUserId,
  TKarmaPod,
  TAccessStage,
  TIsPublicPod,
  THashtag,
  TImageSourceProp,
  IInteractionCount
} from "../base.types";
import { IDrop_Fragment } from "../drop";

type TPod_hashtags = Array<THashtag>;

export interface IPod {
  id: TPodId;
  name: string;
  slug: string;
  publicDescription: string;
  privateDescription: string;
  image: Array<TImageSourceProp>;
  hashtags: TPod_hashtags;
  admins: Array<TUserId>;
  members: Array<TUserId>;
  recentDrops: Array<IDrop_Fragment>;
  isPublic: TIsPublicPod;
  karma: TKarmaPod;
  totalInteractionCounts: IInteractionCount;
  bts: {
    accessStage: TAccessStage;
    createdAt: Date;
    notes: string;
  };
}
