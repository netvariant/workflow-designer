<template>
  <div class="animated">
    <div class="block mb-0">
      <div class="block-content p-4">
        <b-button-toolbar class="mb-4">
          <div class="col-md-6 p-0">
            <b-button-group class="mr-2">
              <b-button @click="zoomIn">
                <i class="fas fa-search-plus"/>
              </b-button>
              <b-button @click="resetZoom">
                1:1
              </b-button>
              <b-button @click="zoomOut">
                <i class="fas fa-search-minus"/>
              </b-button>
            </b-button-group>
          </div>
        </b-button-toolbar>

        <div class="canvas-wrapper">
          <div onselectstart="javascript:/*IE8 hack*/return false" id="canvas" style="width: 3000px; height: 3000px;"></div>
        </div>

        <div class="mt-4" v-if="propsFormVisible" >
          <component :is="propsComponentName" :key="propsTimestamp" :userData="userData"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  name: 'workflow-preview',
  components: {
    ExitActivityProps,
    ConditionActivityProps,
    UserActivityProps,
    AdjustmentActivityProps,
    ServiceActivityProps,
    NotificationActivityProps
  },
  props: {
    modelData: {
      type: [Array, String, Object],
      default: null
    }
  },
  data () {
    return {
      canvas: null,
      shapeSelected: false,
      propsFormVisible: false,
      propsComponentName: null,
      propsTimestamp: Date.now(),
      selectedShape: null,
      userData: null
    }
  },
  mounted () {
    // extend base canvas
    var WorkflowCanvas = draw2d.Canvas.extend()

    // init canvas
    this.canvas = new WorkflowCanvas('canvas')
    this.canvas.installEditPolicy(new draw2d.policy.canvas.ShowGridEditPolicy())

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
  },
  methods: {
    zoomIn () {
      this.canvas.setZoom(this.canvas.getZoom() * 0.7, true)
    },
    resetZoom () {
      this.canvas.setZoom(1.0, true)
    },
    zoomOut () {
      this.canvas.setZoom(this.canvas.getZoom() * 1.3, true)
    }
  },
  watch: {
    modelData: function (val) {
      this.modelData = val
      if (this.modelData !== undefined && this.modelData !== '') {
        var reader = new draw2d.io.json.Reader()
        reader.unmarshal(this.canvas, this.modelData)
        this.canvas.figures.data.forEach(function (figure) {
          figure.setUserData(figure.getUserData())
        })
      }
    }
  }
}
</script>
