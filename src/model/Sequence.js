const Model = require("backbone-thin").Model;
import FeatureCol from "./FeatureCol";

const Sequence = Model.extend({

  defaults: {
    name: "",
    id: "",
    seq: "",
    height: 1,
    ref: false, // reference: the sequence used in BLAST or the consensus seq
    selected: false, //~~CZ~~
    pos: 0 //~~CZ~~
  },

  initialize: function() {
    // residues without color
    this.set("grey", []);
    if (!(this.get("features") != null)) {
      return this.set("features", new FeatureCol());
    }
  }
});
export default Sequence;
