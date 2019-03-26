<template>
  <section>
    <h4 class="card-title">Workflow Designer</h4>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <!-- Page Content -->
            <div class="element-box">
              <b-alert :show="alertCountDown" dismissible :variant="alertVariant" @dismissed="alertCountDown=0" @dismiss-count-down="alertCountDownChanged" class="mb-4">
                <p>{{ alertMessage }}</p>
                <b-progress :variant="alertVariant" :max="alertDisplaySeconds" :value="alertCountDown" height="4px"/>
              </b-alert>

              <b-button-toolbar class="mb-4">
                <b-button @click="cancel" class="mr-2" variant="secondary">
                  <i class="fas fa-times"></i> Cancel
                </b-button>
                <b-button @click="clearCanvas" class="mr-2" title="New">
                  <i class="far fa-file"></i>
                </b-button>
                <b-button-group class="mr-2">
                  <b-button @click="undo" :disabled="!canUndo" title="Undo">
                    <i class="fas fa-undo"></i>
                  </b-button>
                  <b-button @click="redo" :disabled="!canRedo" title="Redo">
                    <i class="fas fa-redo"></i>
                  </b-button>
                </b-button-group>
                <b-button @click="deleteShape" class="mr-2" :disabled="!shapeSelected" title="Delete">
                  <i class="far fa-trash-alt"></i>
                </b-button>
                <b-button-group class="mr-2">
                  <b-button @click="zoomIn" title="Zoom In">
                    <i class="fas fa-search-plus"></i>
                  </b-button>
                  <b-button @click="resetZoom" title="Reset Zoom">
                    1:1
                  </b-button>
                  <b-button @click="zoomOut" title="Zoom Out">
                    <i class="fas fa-search-minus"></i>
                  </b-button>
                </b-button-group>
                <b-button-group class="mr-2">
                  <b-button @click="togglePalette" title="Toggle Palette">
                    <i class="fas fa-th"></i>
                  </b-button>
                  <b-button @click="toggleFullScreen" title="Toggle Fullscreen">
                    <i :class="toggleFullScreenIcon"></i>
                  </b-button>
                </b-button-group>
                <b-button @click="exportFigurePNG" class="mr-2" title="Download">
                  <i class="fas fa-download"></i>
                </b-button>
                <div class="h-flex-space"></div>
                <b-button @click="saveWorkflow" variant="primary">
                  <i class="far fa-save"></i> Save
                </b-button>
              </b-button-toolbar>

              <div class="gutters-tiny mb-4" v-show="paletteVisible">
                <div v-for="(tool, index) in paletteTools" :key="index">
                  <div :data-shape="tool.shapeName" class="float-left workflow-tool mr-2 draw2d_droppable">
                    <div class="icon">
                      <i :class="paletteToolStyle(tool)"></i>
                    </div>
                    <span class="font-w600">{{ tool.label }}</span>
                  </div>
                </div>
                <div class="clearfix"></div>
              </div>

              <div class="designer-wrapper">
                <div class="canvas-wrapper">
                  <div onselectstart="javascript:/*IE8 hack*/return false" id="canvas" style="width: 3000px; height: 3000px;"></div>
                </div>
                <transition name="slide-fade">
                  <div class="props-wrapper bg-gray-lighter p-3" v-if="propsFormVisible">
                    <component
                    :is="propsComponentName"
                    :key="propsTimestamp"
                    :userData="userData"
                    :workflow="workflow"
                    @save="saveProps"
                    @cancel="hidePropsForm">
                  </component>
                </div>
              </transition>
            </div>
          </div>
          <!-- END Page Content -->
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import AlertMixin from '@/mixins/AlertMixin'
import WorkflowService from '@/services/WorkflowService'
import main from '@/assets/js/main'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/droppable.js'
import draw2d from 'draw2d/dist/draw2d.js'
import ExitActivityProps from '@/components/secure/workflow-props/ExitActivityProps'
import ConditionActivityProps from '@/components/secure/workflow-props/ConditionActivityProps'
import UserActivityProps from '@/components/secure/workflow-props/UserActivityProps'
import AdjustmentActivityProps from '@/components/secure/workflow-props/AdjustmentActivityProps'
import ServiceActivityProps from '@/components/secure/workflow-props/ServiceActivityProps'
import NotificationActivityProps from '@/components/secure/workflow-props/NotificationActivityProps'

require('@/shapes/EnterActivity')
require('@/shapes/ExitActivity')
require('@/shapes/ConditionActivity')
require('@/shapes/UserActivity')
require('@/shapes/AdjustmentActivity')
require('@/shapes/ServiceActivity')
require('@/shapes/NotificationActivity')

export default {
  name: 'workflow-designer',
  mixins: [AlertMixin],
  components: {
    ExitActivityProps,
    ConditionActivityProps,
    UserActivityProps,
    AdjustmentActivityProps,
    ServiceActivityProps,
    NotificationActivityProps
  },
  data () {
    return {
      canvas: null,
      workflow: {},
      shapeSelected: false,
      fullScreen: false,
      propsFormVisible: false,
      propsComponentName: null,
      propsTimestamp: Date.now(),
      selectedShape: null,
      userData: null,
      canUndo: false,
      canRedo: false,
      paletteVisible: true,
      paletteTools: [{
        shapeName: 'ExitActivity',
        iconName: 'fas fa-stop-circle',
        label: 'Exit',
        labelStyle: 'text-danger'
      }, {
        shapeName: 'ConditionActivity',
        iconName: 'fas fa-question-circle',
        label: 'Condition',
        labelStyle: 'text-info'
      }, {
        shapeName: 'UserActivity',
        iconName: 'fas fa-user-circle',
        label: 'User',
        labelStyle: 'text-primary'
      }, {
        shapeName: 'AdjustmentActivity',
        iconName: 'fas fa-pencil-alt',
        label: 'Adjustment',
        labelStyle: 'text-secondary'
      }, {
        shapeName: 'ServiceActivity',
        iconName: 'fas fa-cog',
        label: 'Service',
        labelStyle: 'text-success'
      }, {
        shapeName: 'NotificationActivity',
        iconName: 'fas fa-bell',
        label: 'Notification',
        labelStyle: 'text-warning'
      }]
    }
  },
  computed: {
    toggleFullScreenIcon () {
      return 'far ' + (this.fullScreen ? 'fa-window-restore' : 'fa-window-maximize')
    }
  },
  methods: {
    async load () {
      // extend base canvas
      let self = this
      var WorkflowCanvas = draw2d.Canvas.extend({
        init: function (id) {
          this._super(id)
          this.setScrollArea('#' + id)
          this.currentDropConnection = null
        },
        onDrop: function (droppedDomNode, x, y, shiftKey, ctrlKey) {
          // eslint-disable-next-line
          var figure = eval('new ' + $(droppedDomNode).data('shape') + '({resizeable: false})')
          figure.on('dblclick', self.onFigureDoubleClicked)

          var command = new draw2d.command.CommandAdd(this, figure, x, y)
          this.getCommandStack().execute(command)
        }
      })

      // init canvas
      this.canvas = new WorkflowCanvas('canvas')
      this.canvas.installEditPolicy(new draw2d.policy.canvas.ShowGridEditPolicy())
      this.canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: function () {
          var connection = new draw2d.Connection({
            stroke: 2,
            outlineStroke: 1,
            outlineColor: '#CCD1D9',
            color: '#AAB2BD',
            router: new draw2d.layout.connection.ManhattanConnectionRouter()
          })
          return connection
        }
      }))
      this.canvas.on('select', this.onShapeSelected)

      // scroll fix
      this.canvas.fromDocumentToCanvasCoordinate = $.proxy(function (x, y) {
        return new draw2d.geo.Point(
          (x + window.pageXOffset - this.getAbsoluteX() + this.getScrollLeft()) * this.zoomFactor,
          (y + window.pageYOffset - this.getAbsoluteY() + this.getScrollTop()) * this.zoomFactor)
      }, this.canvas)
      this.canvas.fromCanvasToDocumentCoordinate = $.proxy(function (x, y) {
        return new draw2d.geo.Point(
          ((x * (1 / this.zoomFactor)) + this.getAbsoluteX() - this.getScrollLeft() - window.pageXOffset),
          ((y * (1 / this.zoomFactor)) + this.getAbsoluteY() - this.getScrollTop() - window.pageYOffset))
      }, this.canvas)

      // undo & redo listeners
      this.canvas.getCommandStack().addEventListener(function (event) {
        self.canUndo = event.getStack().canUndo()
        self.canRedo = event.getStack().canRedo()
      })

      // load figure data
      WorkflowService.workflows({
        workflowId: this.$route.params.id
      }).then(function (response) {
        self.workflow = response.data.workflowList[0] || {}
        if (self.workflow.modelData === undefined || self.workflow.modelData === '') {
          self.populateEmptyCanvas()
        } else {
          var reader = new draw2d.io.json.Reader()
          reader.unmarshal(self.canvas, self.workflow.modelData)
          self.canvas.figures.data.forEach(function (figure) {
            figure.on('dblclick', self.onFigureDoubleClicked)
            figure.setUserData(figure.getUserData())
          })
        }
      })
    },
    zoomIn () {
      this.canvas.setZoom(this.canvas.getZoom() * 0.7, true)
    },
    resetZoom () {
      this.canvas.setZoom(1.0, true)
    },
    zoomOut () {
      this.canvas.setZoom(this.canvas.getZoom() * 1.3, true)
    },
    undo () {
      this.canvas.getCommandStack().undo()
      this.hidePropsForm()
    },
    redo () {
      this.canvas.getCommandStack().redo()
      this.hidePropsForm()
    },
    deleteShape () {
      var node = this.canvas.getPrimarySelection()
      if (node && node.NAME !== 'EnterActivity') {
        var command = new draw2d.command.CommandDelete(node)
        this.canvas.getCommandStack().execute(command)
        this.hidePropsForm()
      }
    },
    clearCanvas () {
      this.canvas.clear()
      this.populateEmptyCanvas()
    },
    populateEmptyCanvas () {
      this.canvas.add(new window.EnterActivity({ x: 50, y: 150, resizeable: false }))
    },
    togglePalette () {
      this.paletteVisible = !this.paletteVisible
    },
    toggleFullScreen () {
      main.toggle_full_screen('#workflow-designer')
      this.fullScreen = !this.fullScreen
    },
    exportFigurePNG () {
      var writer = new draw2d.io.png.Writer()
      writer.marshal(this.canvas, function (png) {
        var downloadLink = document.createElement('a')
        downloadLink.href = png
        downloadLink.download = 'workflow-design.png'

        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      })
    },
    paletteToolStyle (tool) {
      return tool.iconName + ' ' + tool.labelStyle + ' fa-2x'
    },
    showShapeProps (shape) {
      this.selectedShape = shape
      this.userData = shape.getUserData()
      this.propsComponentName = shape.NAME + 'Props'
      this.propsTimestamp = Date.now()
      this.propsFormVisible = true
    },
    saveProps (userData) {
      this.hidePropsForm()
      this.selectedShape.setUserData(userData)
    },
    hidePropsForm () {
      this.propsFormVisible = false
    },
    onShapeSelected (emitter, event) {
      this.shapeSelected = event.figure !== null && event.figure.NAME !== 'EnterActivity'
    },
    onFigureDoubleClicked (emitter, event) {
      if (emitter.NAME && emitter.NAME !== 'EnterActivity') {
        this.showShapeProps(emitter)
      }
    },
    saveWorkflow () {
      var modelData = ''
      var writer = new draw2d.io.json.Writer()
      writer.marshal(this.canvas, function (json) {
        modelData = JSON.stringify(json, null, 2)
      })

      let self = this
      WorkflowService.designWorkflow({
        workflowId: this.$route.params.id,
        modelData: modelData
      }).then(function (response) {
        if (response.status === 200) {
          if (self.fullScreen) {
            main.toggle_full_screen('#workflow-designer')
          }
          self.$router.go(-1)
        }
      }).catch(function (error) {
        self.showDangerAlert(error.response.data.errors)
      })
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  mounted: function () {
    this.load()
  },
  destroyed: function () {
    if ($('body').hasClass('window-full-screen')) {
      main.toggle_full_screen('#workflow-designer')
    }
  }
}
</script>
