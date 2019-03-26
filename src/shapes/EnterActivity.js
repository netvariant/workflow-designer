/* eslint-disable */
let EnterActivity = draw2d.shape.layout.VerticalLayout.extend({

  /**
   * Shape name.
   */
  NAME: "EnterActivity",

  /**
   * Configuration defaults.
   */
  DEFAULTS: {
    activityIcon: "\uf144",
    activityName: "Enter",
    bgColor: "#82b54b",
    borderColor: "#648c3a",
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

    // activity name
    this.activityName = new draw2d.shape.basic.Label({
      text: this.DEFAULTS.activityName,
      cssClass: "workflow-activity-text",
      fontColor: this.DEFAULTS.primaryColor,
      fontSize: 13,
      stroke: 0,
      bold: true
    });

    // header
    let header = new draw2d.shape.layout.HorizontalLayout({
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

    // success port
    let successPort = this.createPort("output", new draw2d.layout.locator.OutputPortLocator());
    successPort.setBackgroundColor("#18F300");
    successPort.setName("SUCCESS");
    successPort.setMaxFanOut(20);
  },

  /**
   * Attach data to the shape.
   */
  setUserData: function (object) {
    this._super(object);
  }
});

window.EnterActivity = EnterActivity;
