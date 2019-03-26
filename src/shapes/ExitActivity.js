/* eslint-disable */
let ExitActivity = draw2d.shape.layout.VerticalLayout.extend({

  /**
   * Shape name.
   */
  NAME: "ExitActivity",

  /**
   * Configuration defaults.
   */
  DEFAULTS: {
    activityIcon: "\uf28d",
    activityName: "Exit",
    bgColor: "#e04f1a",
    borderColor: "#b84115",
    primaryColor: "#ffffff"
  },

  /**
   * Initializes the shape.
   */
  init: function (attr) {

    // init super
    let self = this;
    this._super($.extend({
      bgColor: this.DEFAULTS.bgColor,
      color: this.DEFAULTS.borderColor,
      stroke: 2,
      padding: 5,
      radius: 10
    }, attr));

    // init user data
    this.userData = {
      resultCode: 0
    };

    // activity icon
    this.activityIcon = new draw2d.shape.basic.Label({
      text: this.DEFAULTS.activityIcon,
      cssClass: "workflow-activity-icon",
      fontColor: this.DEFAULTS.primaryColor,
      fontSize: 13,
      padding: {top: 6, left: 0, right: 0, bottom: 0},
      stroke: 0,
      bold: true
    });
    this.activityIcon.on("dblclick", function (emitter, event) {
      self.fireEvent("dblclick", {emitter: self, event: event})
    });

    // activity name
    this.activityName = new draw2d.shape.basic.Label({
      text: this.DEFAULTS.activityName,
      cssClass: "workflow-activity-text",
      fontColor: this.DEFAULTS.primaryColor,
      fontSize: 13,
      stroke: 0,
      bold: true
    });
    this.activityName.on("dblclick", function (emitter, event) {
      self.fireEvent("dblclick", {emitter: self, event: event})
    });

    // header
    let header = new draw2d.shape.layout.HorizontalLayout({
    });
    header.on("dblclick", function (emitter, event) {
      self.fireEvent("dblclick", {emitter: self, event: event})
    });
    header.add(this.activityIcon)
    header.add(this.activityName)

    // add elements
    this.add(header);

    // add ports
    this.addPorts();
  },

  /**
   * Add shape ports.
   */
  addPorts: function (object) {

    // input port
    let inputPort = this.createPort("input", new draw2d.layout.locator.InputPortLocator());
    inputPort.setBackgroundColor("#FFFFFF");
    inputPort.setName("INPUT");
    inputPort.setMaxFanOut(20);
  },

  /**
   * Attach data to the shape.
   */
  setUserData: function (object) {
    this._super(object);

    this.activityName.setText(this.DEFAULTS.activityName + " (" + this.userData.resultCode + ")");
  }
});

window.ExitActivity = ExitActivity;
