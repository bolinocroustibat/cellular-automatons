import {
  CCA1DcreateContext,
  CCA1Dstart,
  CCA1DrenderInterval
} from './cca-1d.js'
import {
  CCA2DcreateContext,
  CCA2Dstart,
  CCA2DrenderInterval
} from './cca-2d.js'
import {
  langtonCreateContext,
  langtonStart,
  langtonRenderInterval
} from './langton.js'
import {
  entropyCreateContext,
  entropyStart,
  entropyRenderInterval
} from './entropy.js'
import { Pane } from 'https://cdn.skypack.dev/pin/tweakpane@v4.0.1-GxPFd91hBXjDU4rkpV6U/mode=imports,min/optimized/tweakpane.js'

var pane
var options
var CCA1Dcontext
var CCA2Dcontext
var langtonContext
var entropyContext

window.onload = () => {
  pane = new Pane()
  const artSelector = pane.addBinding({ art: '2' }, 'art', {
    index: 1,
    label: 'Algorithm',
    options: {
      '1 dimension Cyclic Cellular Automaton': '1',
      '2 dimensions Cyclic Cellular Automaton': '2',
      "Langton's ant": 'L',
      '2 dimensions Entropy Automaton': 'E'
    }
  })
  // pane.addBlade()
  const cca1dColorsCountPane = pane.addBinding(
    { cca1dColorsCount: 4 },
    'cca1dColorsCount',
    { label: 'Number of colors', min: 3, max: 5, step: 1 }
  )
  const cca2dColorsCountPane = pane.addBinding(
    { cca2dColorsCount: 8 },
    'cca2dColorsCount',
    { label: 'Number of colors', min: 2, max: 20, step: 1 }
  )
  const cca2dThresholdPane = pane.addBinding(
    { cca2dThreshold: 2 },
    'cca2dThreshold',
    { label: 'Threshold', min: 1, max: 3, step: 1 }
  )
  const cca2dResolutionPane = pane.addBinding(
    { cca2dResolution: 10 },
    'cca2dResolution',
    { label: 'Resolution', min: 4, max: 20, step: 1 }
  )
  const entropyColorsCountPane = pane.addBinding(
    { entropyColorsCount: 4 },
    'entropyColorsCount',
    { label: 'Number of colors', min: 2, max: 20, step: 1 }
  )
  const langtonResolutionPane = pane.addBinding(
    { langtonResolution: 10 },
    'langtonResolution',
    { label: 'Resolution', min: 6, max: 20, step: 1 }
  )
  const entropyResolutionPane = pane.addBinding(
    { entropyResolution: 10 },
    'entropyResolution',
    { label: 'Resolution', min: 6, max: 20, step: 1 }
  )
  const resetBtn = pane.addButton({
    title: 'Reset with those values'
  })
  // pane.addBlade()
  const startBtn = pane.addButton({
    index: 10,
    title: 'Start'
  })

  // Set default
  cca1dColorsCountPane.hidden = true
  cca2dColorsCountPane.hidden = false
  cca2dThresholdPane.hidden = false
  cca2dResolutionPane.hidden = false
  langtonResolutionPane.hidden = true
  entropyColorsCountPane.hidden = true
  entropyResolutionPane.hidden = true

  resetContext()

  artSelector.on('change', function (event) {
    switch (event.value) {
      case '1':
        cca1dColorsCountPane.hidden = false
        cca2dColorsCountPane.hidden = true
        cca2dThresholdPane.hidden = true
        cca2dResolutionPane.hidden = true
        langtonResolutionPane.hidden = true
        entropyColorsCountPane.hidden = true
        entropyResolutionPane.hidden = true
        break
      case '2':
        cca1dColorsCountPane.hidden = true
        cca2dColorsCountPane.hidden = false
        cca2dThresholdPane.hidden = false
        cca2dResolutionPane.hidden = false
        langtonResolutionPane.hidden = true
        entropyColorsCountPane.hidden = true
        entropyResolutionPane.hidden = true
        break
      case 'L':
        cca1dColorsCountPane.hidden = true
        cca2dColorsCountPane.hidden = true
        cca2dThresholdPane.hidden = true
        cca2dResolutionPane.hidden = true
        langtonResolutionPane.hidden = false
        entropyColorsCountPane.hidden = true
        entropyResolutionPane.hidden = true
        break
      case 'E':
        cca1dColorsCountPane.hidden = true
        cca2dColorsCountPane.hidden = true
        cca2dThresholdPane.hidden = true
        cca2dResolutionPane.hidden = true
        langtonResolutionPane.hidden = true
        entropyColorsCountPane.hidden = false
        entropyResolutionPane.hidden = false
        break
    }
    resetContext()
  })

  resetBtn.on('click', () => {
    resetContext()
  })

  startBtn.on('click', () => {
    clearInterval(CCA1DrenderInterval)
    clearInterval(CCA2DrenderInterval)
    clearInterval(langtonRenderInterval)
    clearInterval(entropyRenderInterval)
    switch (options.art) {
      case '1':
        CCA1Dstart(CCA1Dcontext)
        break
      case '2':
        CCA2Dstart(CCA2Dcontext, 2500)
        break
      case 'L':
        langtonStart(langtonContext, 12000)
        break
      case 'E':
        entropyStart(entropyContext, 2500)
        break
    }
  })
}

const resetContext = () => {
  clearInterval(CCA1DrenderInterval)
  clearInterval(CCA2DrenderInterval)
  clearInterval(langtonRenderInterval)
  clearInterval(entropyRenderInterval)
  const state = pane.exportState()
  // Convert Tweakpane state to a clean "options" object
  options = {}
  for (const s of state.children) {
    if (s.binding) {
      options[s.binding.key] = s.binding.value
    }
  }
  // Add more keys/values to the "options" object
  options.canvasEl = document.getElementById('canvas')
  options.width = window.innerWidth
  options.height = window.innerHeight
  // Create the context
  switch (options.art) {
    case '1':
      CCA1Dcontext = CCA1DcreateContext(options)
      break
    case '2':
      CCA2Dcontext = CCA2DcreateContext(options)
      break
    case 'L':
      langtonContext = langtonCreateContext(options)
      break
    case 'E':
      entropyContext = entropyCreateContext(options)
      break
  }
}

window.onresize = () => {
  resetContext()
}
