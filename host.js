import { addFunctionModule } from "./node_modules/@webaudiomodules/sdk/dist/index.js";
import { initializeWamEnv } from "./node_modules/@webaudiomodules/sdk/dist/index.js";
import { initializeWamGroup } from "./node_modules/@webaudiomodules/sdk/dist/index.js";

const pluginUrl="./plugins/wimmics/disto_machine/src/index.js"

const player = document.querySelector('#player');
const mount = document.querySelector('#mount');

// Safari...
const AudioContext = window.AudioContext // Default
	|| window.webkitAudioContext // Safari and old versions of Chrome
	|| false;

const audioContext = new AudioContext();
const mediaElementSource = audioContext.createMediaElementSource(player);

// Very simple function to connect the plugin audionode to the host
const connectPlugin = (audioNode) => {
	mediaElementSource.connect(audioNode);
	audioNode.connect(audioContext.destination);
};

// Very simple function to append the plugin root dom node to the host
const mountPlugin = (domNode) => {
	mount.innerHtml = '';
	mount.appendChild(domNode);
};

(async () => {
	// Init WamEnv
	await addFunctionModule(audioContext.audioWorklet, initializeWamEnv);
	const hostGroupId = 'test-host';
	const hostGroupKey = performance.now().toString();
	await addFunctionModule(audioContext.audioWorklet, initializeWamGroup, hostGroupId, hostGroupKey);

	// Import WAM
	const { default: pluginFactory } = await import(pluginUrl);

	// Create a new instance of the plugin
	// You can can optionnally give more options such as the initial state of the plugin
	const pluginInstance = await pluginFactory.createInstance(hostGroupId, audioContext, {});

	window.instance = pluginInstance;
	// instance.enable();

	// Connect the audionode to the host
	connectPlugin(pluginInstance.audioNode);

	// Load the GUI if need (ie. if the option noGui was set to true)
	// And calls the method createElement of the Gui module
	const pluginDomNode = await pluginInstance.createGui();

	mountPlugin(pluginDomNode);
 
	player.onplay = () => {
		audioContext.resume(); // audio context must be resumed because browser restrictions
	};
})();