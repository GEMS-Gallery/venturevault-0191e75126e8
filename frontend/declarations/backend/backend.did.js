export const idlFactory = ({ IDL }) => {
  const Opportunity = IDL.Record({
    'oid' : IDL.Text,
    'title' : IDL.Text,
    'source' : IDL.Opt(IDL.Text),
    'description' : IDL.Text,
    'partner' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'addOpportunity' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [],
        [],
      ),
    'deleteOpportunity' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getOpportunity' : IDL.Func([IDL.Text], [IDL.Opt(Opportunity)], ['query']),
    'listOpportunities' : IDL.Func([], [IDL.Vec(Opportunity)], ['query']),
    'searchOpportunityByOID' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(Opportunity)],
        ['query'],
      ),
    'updateOpportunity' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
