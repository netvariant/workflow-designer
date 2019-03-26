/*
Main javascript functions to init most of the elements
#1. FORM STEPS FUNCTIONALITY
*/

import $ from 'jquery'
// Launch full Screen
function launchIntoFullscreen (element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  }
}
// Exit fullscreen
function exitFullscreen () {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}
export default {
  form_steps_trigger_v2 () {
    // #7. FORM STEPS FUNCTIONALITY
    $('.step-trigger-btn').on('click', function () {
      var btnHref = $(this).attr('href')
      $('.step-trigger[href="' + btnHref + '"]').click()
      return false
    })

    // FORM STEP CLICK
    $('.step-trigger').on('click', function () {
      var prevTrigger = $(this).prev('.step-trigger')
      if (prevTrigger.length && !prevTrigger.hasClass('active') && !prevTrigger.hasClass('complete')) return false
      var contentId = $(this).attr('href')
      $(this).closest('.step-triggers').find('.step-trigger').removeClass('active')
      $(this).prev('.step-trigger').addClass('complete')
      $(this).addClass('active')
      $('.step-content').removeClass('active')
      $('.step-content' + contentId).addClass('active')
      return false
    })
    // END STEPS FUNCTIONALITY
  },
  toggle_full_screen (elementId) {
    var docElm = document.documentElement
    if ($('body').hasClass('window-full-screen')) {
      exitFullscreen()
      $(elementId).removeClass('element-full-screen-mode')
      $('#sidebar').show()
    } else {
      launchIntoFullscreen(docElm)
      $(elementId).addClass('element-full-screen-mode')
      $('#sidebar').hide()
    }
    return false
  },
  full_screen_toggler () {
    // Full Screen Toggler
    $('.full-screen-toggle').on('click', function () {
      var docElm = document.documentElement
      if ($('body').hasClass('window-full-screen')) {
        exitFullscreen()
      } else {
        launchIntoFullscreen(docElm)
      }
      return false
    })
  },
  full_screen () {
    $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function (e) {
      var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
      if (state) {
        $('body').addClass('window-full-screen')
      } else {
        $('body').removeClass('window-full-screen')
        $('#sidebar').show()
      }
    })
  }
}
