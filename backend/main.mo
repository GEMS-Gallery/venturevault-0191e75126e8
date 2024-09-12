import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";

actor {
  // Define the Opportunity type
  type Opportunity = {
    oid: Text;
    title: Text;
    description: Text;
    source: ?Text;
    partner: ?Text;
  };

  // Create a stable variable to store opportunities
  stable var opportunitiesEntries : [(Text, Opportunity)] = [];
  var opportunities = HashMap.HashMap<Text, Opportunity>(0, Text.equal, Text.hash);

  // Initialize the opportunities HashMap from stable storage
  opportunities := HashMap.fromIter<Text, Opportunity>(opportunitiesEntries.vals(), 1, Text.equal, Text.hash);

  // Function to add a new opportunity
  public func addOpportunity(oid: Text, title: Text, description: Text, source: ?Text, partner: ?Text) : async () {
    let opportunity : Opportunity = {
      oid = oid;
      title = title;
      description = description;
      source = source;
      partner = partner;
    };
    opportunities.put(oid, opportunity);
  };

  // Function to get an opportunity by OID
  public query func getOpportunity(oid: Text) : async ?Opportunity {
    opportunities.get(oid)
  };

  // Function to list all opportunities
  public query func listOpportunities() : async [Opportunity] {
    Iter.toArray(opportunities.vals())
  };

  // Function to update an opportunity
  public func updateOpportunity(oid: Text, title: Text, description: Text, source: ?Text, partner: ?Text) : async Bool {
    switch (opportunities.get(oid)) {
      case (null) { false };
      case (?existingOpportunity) {
        let updatedOpportunity : Opportunity = {
          oid = oid;
          title = title;
          description = description;
          source = source;
          partner = partner;
        };
        opportunities.put(oid, updatedOpportunity);
        true
      };
    }
  };

  // Function to delete an opportunity
  public func deleteOpportunity(oid: Text) : async Bool {
    switch (opportunities.remove(oid)) {
      case (null) { false };
      case (?removedOpportunity) { true };
    }
  };

  // Function to search for an opportunity by OID
  public query func searchOpportunityByOID(oid: Text) : async ?Opportunity {
    opportunities.get(oid)
  };

  // Pre-upgrade hook to store opportunities in stable storage
  system func preupgrade() {
    opportunitiesEntries := Iter.toArray(opportunities.entries());
  };

  // Post-upgrade hook to restore opportunities from stable storage
  system func postupgrade() {
    opportunities := HashMap.fromIter<Text, Opportunity>(opportunitiesEntries.vals(), 1, Text.equal, Text.hash);
    opportunitiesEntries := [];
  };
}
