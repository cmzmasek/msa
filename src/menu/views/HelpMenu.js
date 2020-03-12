import MenuBuilder from "../menubuilder";

const HelpMenu = MenuBuilder.extend({

  initialize: function(data) {
    return this.g = data.g;
  },

  render: function() {
    this.setName("Help");
    this.addNode("Version 2.1.0 beta1 (2020/03/12)");
    this.addNode("About the project", () => {
      return window.open("https://github.com/cmzmasek/msa");
    });
    this.addNode("Report issues", () => {
      return window.open("https://github.com/cmzmasek/msa");
    });
    this.addNode("User manual", () => {
      return window.open("https://github.com/cmzmasek/msa/wiki/User-manual");
    });
    this.el.style.display = "inline-block";
    this.el.appendChild(this.buildDOM());
    return this;
  }
});
export default HelpMenu;
