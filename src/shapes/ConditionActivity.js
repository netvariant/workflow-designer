/* eslint-disable */
let ConditionActivity = draw2d.shape.basic.Diamond.extend({

  /**
   * Shape name.
   */
  NAME: "ConditionActivity",

  /**
   * Configuration defaults.
   */
  DEFAULTS: {
    activityName: "Condition",
    bgColor: "#ffffff",
    borderColor: "#745af2",
    primaryColor: "#745af2"
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
      width: 110,
      height: 110,
      stroke: 2,
      padding: 5,
      radius: 4
    }, attr));

    // init user data
    this.userData = {
      conditionTypeEnumId: 'WF_CONDITION_FIELD',
      joinOperator: 'AND',
      conditions: []
    };

    // activity name
    this.activityName = new draw2d.shape.basic.Label({
      text: this.DEFAULTS.activityName,
      cssClass: "workflow-activity-text text-center",
      fontColor: this.DEFAULTS.primaryColor,
      fontSize: 13,
      stroke: 0,
      bold: true
    });
    this.activityName.on("dblclick", function (emitter, event) {
      self.fireEvent("dblclick", {emitter: self, event: event})
    });

    // edit policy
    this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

    // add elements
    this.add(this.activityName, new draw2d.layout.locator.CenterLocator())

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
    let failurePort = this.createPort("output", new draw2d.layout.locator.BottomLocator());
    failurePort.setBackgroundColor("#F30000");
    failurePort.setName("FAILURE");
    failurePort.setMaxFanOut(20);
  },

  /**
   * Attach data to the shape.
   */
  setUserData: function (object) {
    this._super(object);

    this.activityName.setText("Condition (" + this.userData.conditions.length + ")");
  }
});

window.ConditionActivity = ConditionActivity;
