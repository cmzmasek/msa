const view = require("backbone-viewj");
const dom = require("dom-helper");

const LabelView = view.extend({

  initialize: function(data) {
    this.seq = data.seq;
    this.g = data.g;

    return this.manageEvents();
  },

  manageEvents: function() {
    var events = {};
    if (this.g.config.get("registerMouseClicks")) {
      events.click = "_onclick";
    }
    if (this.g.config.get("registerMouseHover")) {
      events.mousein = "_onmousein";
      events.mouseout = "_onmouseout";
    }
    this.delegateEvents(events);
    this.listenTo(this.g.config, "change:registerMouseHover", this.manageEvents);
    this.listenTo(this.g.config, "change:registerMouseClick", this.manageEvents);
    this.listenTo(this.g.vis, "change:labelName change:labelId change:labelPartition change:labelCheckbox", this.render);
    this.listenTo( this.g.zoomer, "change:labelIdLength change:labelNameLength change:labelPartLength change:labelCheckLength", this.render
    );
    return this.listenTo( this.g.zoomer, "change:labelFontSize change:labelLineHeight change:labelWidth change:rowHeight", this.render
    );
  },

  render: function() {
    dom.removeAllChilds(this.el);

    this.el.style.width = `${this.g.zoomer.getLabelWidth()}px`;
    //@el.style.height = "#{@g.zoomer.get "rowHeight"}px"
    this.el.setAttribute("class", "biojs_msa_labels");

    if (this.g.vis.get("labelCheckbox")) {
      var checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.value = this.model.get('id');
      checkBox.name = "seq";
      checkBox.style.width= this.g.zoomer.get("labelCheckLength") + "px";
      this.el.appendChild(checkBox);
    }

    if (this.g.vis.get("labelId")) {
      var id = document.createElement("span");
      var val  = this.model.get("id");
      if (!isNaN(val)) {
        val++;
      }
      id.textContent = val;
      id.style.width = this.g.zoomer.get("labelIdLength") + "px";
      id.style.display = "inline-block";
      this.el.appendChild(id);
    }

    if (this.g.vis.get("labelPartition")) {
      var part = document.createElement("span");
      part.style.width= this.g.zoomer.get("labelPartLength") + "px";
      part.textContent = this.model.get("partition");
      part.style.display = "inline-block";
      this.el.appendChild(id);
      this.el.appendChild(part);
    }

    if (this.g.vis.get("labelName")) {
      var name = document.createElement("span");
      name.textContent = this.model.get("name");
      if (this.model.get("ref") && this.g.config.get("hasRef")) {
        name.style.fontWeight = "bold";
      }
      name.style.width= this.g.zoomer.get("labelNameLength") + "px";
      this.el.appendChild(name);
    }

    this.el.style.overflow = scroll;
    this.el.style.fontSize = `${this.g.zoomer.get('labelFontsize')}px`;
    return this;
  },

  _onclick: function(evt) {
    var seqId = this.model.get("id");
    //console.log( "clicked, seqId=" + seqId); //~~CZ~~
    this.model.collection.each(function(sseq) {
        sseq.set("selected", false);
    });


    if ( this.model.get("selected" ) == false) {  //~~CZ~~
        this.model.set("selected", true);
        //console.log(this.model.collection)
    }
    else {
        this.model.set("selected", false);
    }
 
    return this.g.trigger("row:click", {seqId:seqId, evt:evt});
  },

  _onmousein: function(evt) {
    var seqId = this.model.get("id");
    return this.g.trigger("row:mouseout", {seqId:seqId, evt:evt});
  },

  _onmouseout: function(evt) {
    var seqId = this.model.get("id");
    return this.g.trigger("row:mouseout", {seqId:seqId, evt:evt});
  }
  
  
});

export default LabelView;
