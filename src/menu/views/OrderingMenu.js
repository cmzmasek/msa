import MenuBuilder from "../menubuilder";
import {reduce} from "lodash";  // Added (CZ 2018/09/26)
const dom = require("dom-helper");
const arrowUp = "\u2191";
const arrowDown = "\u2193";

// Reorganized order of menu items (CZ 2018/09/28)

const OrderingMenu = MenuBuilder.extend({

  initialize: function(data) {
    this.g = data.g;
    this.order = "ID";
    return this.el.style.display = "inline-block";
  },

  setOrder: function(order) {
    this.order = order;
    return this.render();
  },

 
  render: function() {
    this.setName("Ordering");
    this.removeAllNodes();

    var comps = this.getComparators();
    for (var i = 0, m; i < comps.length; i++) {
      m = comps[i];
      this._addNode(m);
    }

    var el = this.buildDOM();

    
    dom.removeAllChilds(this.el);
    this.el.appendChild(el);
    return this;
  },

  _addNode(m) {
    var text = m.text;
    var style = {};
    if (text === this.order) {
      style.backgroundColor = "#77ED80";
    }
    return this.addNode(text, (() => {
      if ((m.precode != null)) { m.precode(); }
      this.model.comparator = m.comparator;
      this.model.sort();
      return this.setOrder(m.text);
    }
    ), {
        style: style
    });
  },

  getComparators: function() {
    var models = [];
    
    // Commented out (CZ 2018/09/26): No need to sort by ID:
    // models.push({text: "ID " + arrowUp, comparator: "id"});
    //
    // models.push({text: "ID " + arrowDown, comparator: function(a, b) {
      // auto converts to string for localeCompare
    //     return - ("" + a.get("id")).localeCompare("" + b.get("id"), [], {numeric: true} );
    // }});

    // var setIdent = () => {
    //  return this.ident = this.g.stats.identity();
    // };

    var setGaps = () => {
      this.gaps = {};
      return this.model.each((el) => {
        var seq = el.attributes.seq;
        return this.gaps[el.id] = reduce(seq, function(memo, c) { return c === '-' ? ++memo: memo; }, 0) / seq.length;
        
        // Bug (?) fixed (CZ 2018/09/26):
        // Original:
        // return this.gaps[el.id] = (seq.reduce(function(memo, c) { return c === '-' ? ++memo: undefined; }),0)/
        // seq.length;
        
      });
    };
 
    var setPosD = () => { //~~CZ~~
        var saw_selected = false;
        var i = 0;
        this.model.each(function(sseq) {
            if ( sseq.get("selected") ) {
                sseq.set("pos", i + 1);
                saw_selected = true;
            }
            else if (saw_selected) {
                saw_selected = false;
                sseq.set("pos", i - 1);
            }
            else {
                sseq.set("pos", i);
            }
            i++;
        });
    };
    
    var setPosU = () => { //~~CZ~~
        var i = 0;
        var prev = null;
        this.model.each(function(sseq) {
            if ( sseq.get("selected") && ( prev != null ) ) { 
                prev.set("pos", i);
                sseq.set("pos", i - 1);
            }
            else {
                sseq.set("pos", i);
            }
            i++;
            prev = sseq;
        });
    };
    
    var setPosI = () => { //~~CZ~~
        var i = 1000000;
        this.model.each(function(sseq) {
            sseq.set("pos", i);
            i--;
        });
    };

    // Commented out (CZ 2018/09/26):    
    // models.push({text: "Identity " + arrowUp,comparator: ((a,b) => {
    //   var val = this.ident[a.id] - this.ident[b.id];
    //   if (val > 0) { return 1; }
    //   if (val < 0) { return -1; }
    //   return 0;
    // }
    // ), precode: setIdent});
    //
    // models.push({text: "Identity " + arrowDown, comparator: ((a,b) => {
    //   var val = this.ident[a.id] - this.ident[b.id];
    //   if (val > 0) { return -1; }
    //   if (val < 0) { return 1; }
    //   return 0;
    // }
    // ), precode: setIdent});
  
    //~~CZ~~
  
    models.push({text: "Move Selected Up", comparator: "pos", precode: setPosU});
    
    models.push({text: "Move Selected Down", comparator: "pos", precode: setPosD});
  
    models.push({text: "Move Selected to Top", comparator(seq) {
        return !seq.get("selected");
    }});

    models.push({text: "Move Selected to Bottom", comparator(seq) {
        return seq.get("selected");
    }});
    
    models.push({text: "Invert Order", comparator: "pos", precode: setPosI});
   
    //~~CZ~~

    models.push({text: "Sort by Gaps " + arrowUp, comparator: ((a,b) => {
      var val = this.gaps[a.id] - this.gaps[b.id];
      if (val > 0) { return 1; }
      if (val < 0) { return -1; }
      return 0;
    }
    ), precode: setGaps});

    models.push({text: "Sort by Gaps " + arrowDown, comparator: ((a,b) => {
      var val = this.gaps[a.id] - this.gaps[b.id];
      if (val < 0) { return 1; }
      if (val > 0) { return -1; }
      return 0;
    }
    ), precode: setGaps});
    
    models.push({text: "Sort by Label " + arrowUp, comparator: "name"});

    models.push({text: "Sort by Label " + arrowDown, comparator: function(a, b) {
        return - a.get("name").localeCompare(b.get("name"));
    }});

    models.push({text: "Sort by Molecular Sequence " + arrowUp, comparator: "seq"});

    models.push({text: "Sort by Molecular Sequence " + arrowDown, comparator: function(a,b) {
        return - a.get("seq").localeCompare(b.get("seq"));
    }});

    //models.push({text: "Consensus to Top", comparator(seq) { ~~CZ~~
    //    return !seq.get("ref");
    //}});

    return models;
  }
});
export default OrderingMenu;
