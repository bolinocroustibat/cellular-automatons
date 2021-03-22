import { CCA1DcreateContext, CCA1Dstart, CCA1DrenderInterval } from "./cca-1d.js";
import { CCA2DcreateContext, CCA2Dstart, CCA2DrenderInterval } from "./cca-2d.js";
import { entropyCreateContext, entropyStart, entropyRenderInterval } from "./entropy.js";
import Tweakpane from 'https://cdn.skypack.dev/tweakpane';


var pane;
var settings;
var CCA1Dcontext;
var CCA2Dcontext;
var entropyContext;

window.onload = function () {

	pane = new Tweakpane();
	const artSelector = pane.addInput(
		{ art: '2' },
		'art',
		{
			index: 1,
			label: "Algorithm",
			options:
			{
				"1 dimension Cyclic Cellular Automaton": '1',
				"2 dimensions Cyclic Cellular Automaton": '2',
				"2 dimensions Entropy Automaton": "E"
			}
		}
	);
	pane.addSeparator();
	const cca1dColorsCountPane = pane.addInput(
		{ cca1dColorsCount: 4 },
		'cca1dColorsCount',
		{ label: "Number of colors", min: 2, max: 5, step: 1 }
	);
	const cca2dColorsCountPane = pane.addInput(
		{ cca2dColorsCount: 8 },
		'cca2dColorsCount',
		{ label: "Number of colors", min: 2, max: 20, step: 1 }
	);
	const cca2dThresholdPane = pane.addInput(
		{ cca2dThreshold: 2 },
		'cca2dThreshold',
		{ label: "Threshold", min: 1, max: 8, step: 1 }
	);
	const cca2dResolutionPane = pane.addInput(
		{ cca2dResolution: 6 },
		'cca2dResolution',
		{ label: "Resolution", min: 4, max: 10, step: 1 }
	);
	const entropyColorsCountPane = pane.addInput(
		{ entropyColorsCount: 4 },
		'entropyColorsCount',
		{ label: "Number of colors", min: 2, max: 20, step: 1 }
	);
	const entropyResolutionPane = pane.addInput(
		{ entropyResolution: 8 },
		'entropyResolution',
		{ label: "Resolution", min: 6, max: 10, step: 1 }
	);
	const resetBtn = pane.addButton({
		title: 'Reset with those values',
	});
	pane.addSeparator();
	const startBtn = pane.addButton({
		index: 10,
		title: 'Start',
	});

	// Set default
	cca1dColorsCountPane.hidden = true;
	cca2dColorsCountPane.hidden = false;
	cca2dThresholdPane.hidden = false;
	cca2dResolutionPane.hidden = false;
	entropyColorsCountPane.hidden = true;
	entropyResolutionPane.hidden = true;

	resetContext();

	artSelector.on('change', function (value) {

		if (value == "1") {
			cca1dColorsCountPane.hidden = false;
			cca2dColorsCountPane.hidden = true;
			cca2dThresholdPane.hidden = true;
			cca2dResolutionPane.hidden = true;
			entropyColorsCountPane.hidden = true;
			entropyResolutionPane.hidden = true;
		}

		else if (value == "2") {
			cca1dColorsCountPane.hidden = true;
			cca2dColorsCountPane.hidden = false;
			cca2dThresholdPane.hidden = false;
			cca2dResolutionPane.hidden = false;
			entropyColorsCountPane.hidden = true;
			entropyResolutionPane.hidden = true;
		}

		else if (value == "E") {
			cca1dColorsCountPane.hidden = true;
			cca2dColorsCountPane.hidden = true;
			cca2dThresholdPane.hidden = true;
			cca2dResolutionPane.hidden = true;
			entropyColorsCountPane.hidden = false;
			entropyResolutionPane.hidden = false;
		}

		resetContext();

	});

	resetBtn.on('click', () => {
		resetContext();
	});

	startBtn.on('click', () => {
		clearInterval(CCA1DrenderInterval);
		clearInterval(CCA2DrenderInterval);
		clearInterval(entropyRenderInterval);
		if (settings.art == '1') {
			CCA1Dstart(CCA1Dcontext);
		}
		else if (settings.art == '2') {
			CCA2Dstart(CCA2Dcontext, 400);
		}
		else if (settings.art == 'E') {
			entropyStart(entropyContext, 2500);
		}
	});

}

function resetContext() {
	clearInterval(CCA1DrenderInterval);
	clearInterval(CCA2DrenderInterval);
	clearInterval(entropyRenderInterval);
	settings = pane.exportPreset();
	settings.canvasEl = document.getElementById('canvas');
	settings.width = window.innerWidth;
	settings.height = window.innerHeight;
	if (settings.art == '1') {
		CCA1Dcontext = CCA1DcreateContext(settings);
	}
	else if (settings.art == '2') {
		CCA2Dcontext = CCA2DcreateContext(settings);
	}
	else if (settings.art == 'E') {
		entropyContext = entropyCreateContext(settings);
	}
}

window.onresize = function () {
	resetContext();
}
