import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Opportunity {
  'oid' : string,
  'title' : string,
  'source' : [] | [string],
  'description' : string,
  'partner' : [] | [string],
}
export interface _SERVICE {
  'addOpportunity' : ActorMethod<
    [string, string, string, [] | [string], [] | [string]],
    undefined
  >,
  'deleteOpportunity' : ActorMethod<[string], boolean>,
  'getOpportunity' : ActorMethod<[string], [] | [Opportunity]>,
  'listOpportunities' : ActorMethod<[], Array<Opportunity>>,
  'updateOpportunity' : ActorMethod<
    [string, string, string, [] | [string], [] | [string]],
    boolean
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
