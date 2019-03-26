/* eslint-disable */
let AdjustmentActivity = draw2d.shape.layout.VerticalLayout.extend({

  /**
   * Shape name.
   */
  NAME: "AdjustmentActivity",

  /**
   * Configuration defaults.
   */
  DEFAULTS: {
    activityIcon: "\uf303",
    activityName: "Adjustment",
    activityNotDescribed: "No description provided",
    bgColor: "#ffffff",
    borderColor: "#6c757d",
    primaryColor: "#6c757d",
    secondaryColor: "#545454"
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
      adjustmentTypeEnumId: 'WF_ADJUST_STATUS',
      statusId: '',
      statusDescription: '',
      variableId: '',
      variableName: '',
      definedValue: '',
    };

    // activity icon
    this.activityIcon = new draw2d.shape.basic.Label({
      text: this.DEFAULTS.activityIcon,
      cssClass: "workflow-activity-icon",
      fontColor: this.DEFAULTS.primaryColor,
      fontSize: 13,
      stroke: 0,
      padding: {top: 6, left: 0, right: 0, bottom: 0},
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

    // activity description
    this.activityDescription = new draw2d.shape.basic.Label({
      text: this.DEFAULTS.activityNotDescribed,
      cssClass: "workflow-activity-text",
      fontColor: this.DEFAULTS.secondaryColor,
      fontSize: 12,
      padding: 5,
      stroke: 0
    });
    this.activityDescription.on("dblclick", function (emitter, event) {
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

    // footer
    let footer = new draw2d.shape.layout.HorizontalLayout({
    });
    footer.on("dblclick", function (emitter, event) {
      self.fireEvent("dblclick", {emitter: self, event: event})
    });
    footer.add(this.activityDescription);

    // add elements
    this.add(header);
    this.add(footer);

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

    // success port
    let successPort = this.createPort("output", new draw2d.layout.locator.OutputPortLocator());
    successPort.setBackgroundColor("#18F300");
    successPort.setName("SUCCESS");
    successPort.setMaxFanOut(20);

    // failure port
    let failurePort = this.createPort("output", new draw2d.layout.locator.OutputPortLocator());
    failurePort.setBackgroundColor("#F30000");
    failurePort.setName("FAILURE");
    failurePort.setMaxFanOut(20);
  },

  /**
   * Attach data to the shape.
   */
  setUserData: function (object) {
    this._super(object);

    if (this.userData.activityDescription === '') {
      this.activityDescription.setText(this.DEFAULTS.activityNotDescribed);
    } else {
      this.activityDescription.setText(this.userData.activityDescription);
    }
  }
});

window.AdjustmentActivity = AdjustmentActivity;
