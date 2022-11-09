function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/** @typedef {import('@webaudiomodules/api').WamDescriptor} WamDescriptor */
/** @typedef {import('@webaudiomodules/api').WamNode} WamNode */
/** @template T @typedef {import('@webaudiomodules/api').WebAudioModule} IWebAudioModule<T> */

/** @implements {IWebAudioModule<WamNode>} */
class WebAudioModule {
  static get isWebAudioModuleConstructor() {
    return true;
  }

  /**
   * @param {string} groupId
   * @param {BaseAudioContext} audioContext
   * @param {any} [initialState]
   * @returns {Promise<IWebAudioModule<any>>}
   */
  static createInstance(groupId, audioContext, initialState) {
    return new this(groupId, audioContext).initialize(initialState);
  }

  /** 
   * @param {string} groupId
   * @param {BaseAudioContext} audioContext 
   */
  constructor(groupId, audioContext) {
    this._groupId = groupId;
    this._audioContext = audioContext;
    this._initialized = false;
    /** @type {WamNode} */
    this._audioNode = undefined;
    this._timestamp = performance.now();
    /**
     * Url to load the plugin's GUI HTML
     * @type {string}
     */
    this._guiModuleUrl = undefined;
    /**
     * Url to load the plugin's `descriptor.json`
     * @type {string}
     */
    this._descriptorUrl = './descriptor.json';
    /** @type {WamDescriptor} */
    this._descriptor = {
      name: "WebAudioModule_".concat(this.constructor.name),
      vendor: 'WebAudioModuleVendor',
      description: '',
      version: '0.0.0',
      apiVersion: '2.0.0',
      thumbnail: '',
      keywords: [],
      isInstrument: false,
      website: '',
      hasAudioInput: true,
      hasAudioOutput: true,
      hasAutomationInput: true,
      hasAutomationOutput: true,
      hasMidiInput: true,
      hasMidiOutput: true,
      hasMpeInput: true,
      hasMpeOutput: true,
      hasOscInput: true,
      hasOscOutput: true,
      hasSysexInput: true,
      hasSysexOutput: true
    };
  }
  get isWebAudioModule() {
    return true;
  }
  get groupId() {
    return this._groupId;
  }
  get moduleId() {
    return this.vendor + this.name;
  }
  get instanceId() {
    return this.moduleId + this._timestamp;
  }
  get descriptor() {
    return this._descriptor;
  }
  get name() {
    return this.descriptor.name;
  }
  get vendor() {
    return this.descriptor.vendor;
  }
  get audioContext() {
    return this._audioContext;
  }
  get audioNode() {
    if (!this.initialized) console.warn('WAM should be initialized before getting the audioNode');
    return this._audioNode;
  }
  set audioNode(node) {
    this._audioNode = node;
  }
  get initialized() {
    return this._initialized;
  }
  set initialized(value) {
    this._initialized = value;
  }

  /**
   * @param {any} [initialState]
   * @returns {Promise<WamNode>}
   */
  createAudioNode(initialState) {
    return _asyncToGenerator(function* () {
      // should return a subclass of WamNode
      throw new TypeError('createAudioNode() not provided');
    })();
  }

  /**
   * @param {any} [state]
   * @returns {Promise<WebAudioModule>}
   */
  initialize(state) {
    var _this = this;
    return _asyncToGenerator(function* () {
      // await this._loadDescriptor();
      if (!_this._audioNode) _this.audioNode = yield _this.createAudioNode();
      _this.initialized = true;
      return _this;
    })();
  }
  _loadGui() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var url = _this2._guiModuleUrl;
      if (!url) throw new TypeError('Gui module not found');
      // @ts-ignore
      return import( /* webpackIgnore: true */url);
    })();
  }
  _loadDescriptor() {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      var url = _this3._descriptorUrl;
      if (!url) throw new TypeError('Descriptor not found');
      var response = yield fetch(url);
      var descriptor = yield response.json();
      Object.assign(_this3._descriptor, descriptor);
      return _this3._descriptor;
    })();
  }

  /**
   * @returns {Promise<HTMLElement>}
   */
  createGui() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      if (!_this4.initialized) console.warn('Plugin should be initialized before getting the gui');
      // Do not fail if no gui is present, just return undefined
      if (!_this4._guiModuleUrl) return undefined;
      var {
        createElement
      } = yield _this4._loadGui();
      return createElement(_this4);
    })();
  }
  destroyGui() {}
}

/** @typedef {import('@webaudiomodules/api').WamNode} WamNode */
/** @typedef {import('@webaudiomodules/api').WebAudioModule} WebAudioModule */

/**
 * @implements {WamNode}
 */
class CompositeAudioNode extends GainNode {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_output", undefined);
    _defineProperty(this, "_wamNode", undefined);
  }
  get groupId() {
    return this._wamNode.groupId;
  }
  get moduleId() {
    return this._wamNode.moduleId;
  }
  get instanceId() {
    return this._wamNode.instanceId;
  }
  get module() {
    return this._wamNode.module;
  }

  /**
   * @param {Parameters<WamNode['addEventListener']>} args
   */
  addEventListener() {
    return this._wamNode.addEventListener(...arguments);
  }

  /**
   * @param {Parameters<WamNode['removeEventListener']>} args
   */
  removeEventListener() {
    return this._wamNode.removeEventListener(...arguments);
  }

  /**
   * @param {Parameters<WamNode['dispatchEvent']>} args
   */
  dispatchEvent() {
    return this._wamNode.dispatchEvent(...arguments);
  }

  /**
   * @param {Parameters<WamNode['getParameterInfo']>} args
   */
  getParameterInfo() {
    return this._wamNode.getParameterInfo(...arguments);
  }

  /**
   * @param {Parameters<WamNode['getParameterValues']>} args
   */
  getParameterValues() {
    return this._wamNode.getParameterValues(...arguments);
  }

  /**
   * @param {Parameters<WamNode['setParameterValues']>} args
   */
  setParameterValues() {
    return this._wamNode.setParameterValues(...arguments);
  }
  getState() {
    return this._wamNode.getState();
  }

  /**
   * @param {Parameters<WamNode['setState']>} args
   */
  setState() {
    return this._wamNode.setState(...arguments);
  }
  getCompensationDelay() {
    return this._wamNode.getCompensationDelay();
  }

  /**
   * @param {Parameters<WamNode['scheduleEvents']>} args
   */
  scheduleEvents() {
    return this._wamNode.scheduleEvents(...arguments);
  }
  clearEvents() {
    return this._wamNode.clearEvents();
  }

  /**
   * @param {Parameters<WamNode['connectEvents']>} args
   */
  connectEvents() {
    return this._wamNode.connectEvents(...arguments);
  }

  /**
   * @param {Parameters<WamNode['disconnectEvents']>} args
   */
  disconnectEvents() {
    return this._wamNode.disconnectEvents(...arguments);
  }
  destroy() {
    return this._wamNode.destroy();
  }

  /**
   * @type {AudioNode}
   */

  set channelCount(count) {
    if (this._output) this._output.channelCount = count;else super.channelCount = count;
  }
  get channelCount() {
    if (this._output) return this._output.channelCount;
    return super.channelCount;
  }
  set channelCountMode(mode) {
    if (this._output) this._output.channelCountMode = mode;else super.channelCountMode = mode;
  }
  get channelCountMode() {
    if (this._output) return this._output.channelCountMode;
    return super.channelCountMode;
  }
  set channelInterpretation(interpretation) {
    if (this._output) this._output.channelInterpretation = interpretation;else super.channelInterpretation = interpretation;
  }
  get channelInterpretation() {
    if (this._output) return this._output.channelInterpretation;
    return super.channelInterpretation;
  }
  get numberOfInputs() {
    return super.numberOfInputs;
  }
  get numberOfOutputs() {
    if (this._output) return this._output.numberOfOutputs;
    return super.numberOfOutputs;
  }
  get gain() {
    return undefined;
  }
  connect() {
    // @ts-ignore
    if (this._output && this._output !== this) return this._output.connect(...arguments);
    // @ts-ignore
    return super.connect(...arguments);
  }
  disconnect() {
    // @ts-ignore
    if (this._output && this._output !== this) return this._output.disconnect(...arguments);
    // @ts-ignore
    return super.disconnect(...arguments);
  }
}

/**
 * Take a function, stringify it and inject to an AudioWorklet with parameters.
 *
 * @param {AudioWorklet} audioWorklet
 * @param {(...args: any[]) => any} processorFunction
 * @param {any[]} [injection]
 * @returns {Promise<void>}
 */
var addFunctionModule = function addFunctionModule(audioWorklet, processorFunction) {
  for (var _len = arguments.length, injection = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    injection[_key - 2] = arguments[_key];
  }
  var text = "(".concat(processorFunction.toString(), ")(").concat(injection.map(s => JSON.stringify(s)).join(', '), ");");
  var url = URL.createObjectURL(new Blob([text], {
    type: 'text/javascript'
  }));
  return audioWorklet.addModule(url);
};

/** @typedef {import('@webaudiomodules/api').WamProcessor} WamProcessor */
/** @typedef {import('@webaudiomodules/api').WamParameterInfoMap} WamParameterInfoMap */
/** @typedef {import('@webaudiomodules/api').WamParameterDataMap} WamParameterValueMap */
/** @typedef {import('@webaudiomodules/api').WamEvent} WamEvent */
/** @typedef {import('./types').ParamMgrOptions} ParamMgrProcessorOptions */
/** @typedef {import('./TypedAudioWorklet').AudioWorkletGlobalScope} AudioWorkletGlobalScope */
/** @typedef {import('./TypedAudioWorklet').TypedAudioWorkletProcessor} AudioWorkletProcessor */
/** @template M @typedef {import('./types').MessagePortRequest<M>} MessagePortRequest */
/** @template M @typedef {import('./types').MessagePortResponse<M>} MessagePortResponse */
/** @typedef {import('./types').ParamMgrCallFromProcessor} ParamMgrCallFromProcessor */
/** @typedef {import('./types').ParamMgrCallToProcessor} ParamMgrCallToProcessor */
/** @typedef {import('./types').ParamMgrAudioWorkletOptions} ParamMgrAudioWorkletOptions */
/** @typedef {import('./types').ParametersMapping} ParametersMapping */

/**
 * Main function to stringify as a worklet.
 *
 * @param {string} moduleId processor identifier
 * @param {WamParameterInfoMap} paramsConfig parameterDescriptors
 */
var processor = (moduleId, paramsConfig) => {
  /** @type {AudioWorkletGlobalScope} */
  // @ts-ignore
  var audioWorkletGlobalScope = globalThis;
  var {
    AudioWorkletProcessor,
    registerProcessor,
    webAudioModules
  } = audioWorkletGlobalScope;
  var supportSharedArrayBuffer = !!globalThis.SharedArrayBuffer;
  var SharedArrayBuffer = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;
  var normExp = (x, e) => e === 0 ? x : x ** 1.5 ** -e;
  var normalizeE = function normalizeE(x, min, max) {
    var e = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    return min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
  };
  var normalize = (x, min, max) => min === 0 && max === 1 ? x : (x - min) / (max - min) || 0;
  var denormalize = (x, min, max) => min === 0 && max === 1 ? x : x * (max - min) + min;
  var mapValue = (x, eMin, eMax, sMin, sMax, tMin, tMax) => denormalize(normalize(normalize(Math.min(sMax, Math.max(sMin, x)), eMin, eMax), normalize(sMin, eMin, eMax), normalize(sMax, eMin, eMax)), tMin, tMax);

  /**
   * @typedef {MessagePortRequest<ParamMgrCallToProcessor> & MessagePortResponse<ParamMgrCallFromProcessor>} MsgIn
   * @typedef {MessagePortResponse<ParamMgrCallToProcessor> & MessagePortRequest<ParamMgrCallFromProcessor>} MsgOut
   */
  /**
   * `ParamMgrNode`'s `AudioWorkletProcessor`
   *
   * @extends {AudioWorkletProcessor<MsgIn, MsgOut>}
   * @implements {WamProcessor}
   * @implements {ParamMgrCallToProcessor}
   */
  class ParamMgrProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return Object.entries(paramsConfig).map(_ref => {
        var [name, {
          defaultValue,
          minValue,
          maxValue
        }] = _ref;
        return {
          name,
          defaultValue,
          minValue,
          maxValue
        };
      });
    }

    /**
     * @param {ParamMgrProcessorOptions} options
     */
    constructor(options) {
      var _this;
      super(options);
      _this = this;
      this.destroyed = false;
      this.supportSharedArrayBuffer = supportSharedArrayBuffer;
      var {
        paramsMapping,
        internalParamsMinValues,
        internalParams,
        groupId,
        instanceId
      } = options.processorOptions;
      this.groupId = groupId;
      this.moduleId = moduleId;
      this.instanceId = instanceId;
      this.internalParamsMinValues = internalParamsMinValues;
      this.paramsConfig = paramsConfig;
      this.paramsMapping = paramsMapping;
      /** @type {Record<string, number>} */
      this.paramsValues = {};
      Object.entries(paramsConfig).forEach(_ref2 => {
        var [name, {
          defaultValue
        }] = _ref2;
        this.paramsValues[name] = defaultValue;
      });
      this.internalParams = internalParams;
      this.internalParamsCount = this.internalParams.length;
      this.buffer = new SharedArrayBuffer((this.internalParamsCount + 1) * Float32Array.BYTES_PER_ELEMENT);
      this.$lock = new Int32Array(this.buffer, 0, 1);
      this.$internalParamsBuffer = new Float32Array(this.buffer, 4, this.internalParamsCount);
      /** @type {WamEvent[]} */
      this.eventQueue = [];

      /** @type {(event: WamEvent) => any} */
      this.handleEvent = null;
      audioWorkletGlobalScope.webAudioModules.addWam(this);
      this.messagePortRequestId = -1;
      /** @type {Record<number, ((...args: any[]) => any)>} */
      var resolves = {};
      /** @type {Record<number, ((...args: any[]) => any)>} */
      var rejects = {};
      /**
       * @param {keyof ParamMgrCallFromProcessor} call
       * @param {any} args
       */
      this.call = function (call) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        return new Promise((resolve, reject) => {
          var id = _this.messagePortRequestId--;
          resolves[id] = resolve;
          rejects[id] = reject;
          _this.port.postMessage({
            id,
            call,
            args
          });
        });
      };
      this.handleMessage = _ref3 => {
        var {
          data
        } = _ref3;
        var {
          id,
          call,
          args,
          value,
          error
        } = data;
        if (call) {
          /** @type {any} */
          var r = {
            id
          };
          try {
            r.value = this[call](...args);
          } catch (e) {
            r.error = e;
          }
          this.port.postMessage(r);
        } else {
          if (error) {
            if (rejects[id]) rejects[id](error);
            delete rejects[id];
            return;
          }
          if (resolves[id]) {
            resolves[id](value);
            delete resolves[id];
          }
        }
      };
      this.port.start();
      this.port.addEventListener('message', this.handleMessage);
    }

    /**
     * @param {ParametersMapping} mapping
     */
    setParamsMapping(mapping) {
      this.paramsMapping = mapping;
    }
    getBuffer() {
      return {
        lock: this.$lock,
        paramsBuffer: this.$internalParamsBuffer
      };
    }
    getCompensationDelay() {
      return 128;
    }

    /**
     * @param {string[]} parameterIdQuery
     */
    getParameterInfo() {
      for (var _len2 = arguments.length, parameterIdQuery = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        parameterIdQuery[_key2] = arguments[_key2];
      }
      if (parameterIdQuery.length === 0) parameterIdQuery = Object.keys(this.paramsConfig);
      /** @type {WamParameterInfoMap} */
      var parameterInfo = {};
      parameterIdQuery.forEach(parameterId => {
        parameterInfo[parameterId] = this.paramsConfig[parameterId];
      });
      return parameterInfo;
    }

    /**
     * @param {boolean} [normalized]
     * @param {string[]} parameterIdQuery
     */
    getParameterValues(normalized) {
      for (var _len3 = arguments.length, parameterIdQuery = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        parameterIdQuery[_key3 - 1] = arguments[_key3];
      }
      if (parameterIdQuery.length === 0) parameterIdQuery = Object.keys(this.paramsConfig);
      /** @type {WamParameterValueMap} */
      var parameterValues = {};
      parameterIdQuery.forEach(parameterId => {
        if (!(parameterId in this.paramsValues)) return;
        var {
          minValue,
          maxValue,
          exponent
        } = this.paramsConfig[parameterId];
        var value = this.paramsValues[parameterId];
        parameterValues[parameterId] = {
          id: parameterId,
          value: normalized ? normalizeE(value, minValue, maxValue, exponent) : value,
          normalized
        };
      });
      return parameterValues;
    }

    /**
     * @param {WamEvent[]} events
     */
    scheduleEvents() {
      this.eventQueue.push(...arguments);
      var {
        currentTime
      } = audioWorkletGlobalScope;
      this.eventQueue.sort((a, b) => (a.time || currentTime) - (b.time || currentTime));
    }

    /**
     * @param {WamEvent[]} events
     */
    emitEvents() {
      for (var _len4 = arguments.length, events = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        events[_key4] = arguments[_key4];
      }
      webAudioModules.emitEvents(this, ...events);
    }
    clearEvents() {
      this.eventQueue = [];
    }
    lock() {
      if (globalThis.Atomics) Atomics.store(this.$lock, 0, 1);
    }
    unlock() {
      if (globalThis.Atomics) Atomics.store(this.$lock, 0, 0);
    }

    /**
     * Main process
     *
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     * @param {Record<string, Float32Array>} parameters
     */
    process(inputs, outputs, parameters) {
      if (this.destroyed) return false;
      var outputOffset = 1;
      this.lock();
      Object.entries(this.paramsConfig).forEach(_ref4 => {
        var [name, {
          minValue,
          maxValue
        }] = _ref4;
        var raw = parameters[name];
        if (name in this.paramsValues) this.paramsValues[name] = raw[raw.length - 1]; // Store to local temporary
        if (!this.paramsMapping[name]) return; // No need to output
        Object.entries(this.paramsMapping[name]).forEach(_ref5 => {
          var [targetName, targetMapping] = _ref5;
          var j = this.internalParams.indexOf(targetName);
          if (j === -1) return;
          var intrinsicValue = this.internalParamsMinValues[j]; // Output will be added to target intrinsicValue
          var {
            sourceRange,
            targetRange
          } = targetMapping;
          var [sMin, sMax] = sourceRange;
          var [tMin, tMax] = targetRange;
          var out;
          if (minValue !== tMin || maxValue !== tMax || minValue !== sMin || maxValue !== sMax) {
            // need to calculate with mapping
            out = raw.map(v => {
              var mappedValue = mapValue(v, minValue, maxValue, sMin, sMax, tMin, tMax);
              return mappedValue - intrinsicValue;
            });
          } else if (intrinsicValue) {
            // need to correct with intrinsicValue
            out = raw.map(v => v - intrinsicValue);
          } else {
            // No need to modify
            out = raw;
          }
          if (out.length === 1) outputs[j + outputOffset][0].fill(out[0]);else outputs[j + outputOffset][0].set(out);
          this.$internalParamsBuffer[j] = out[0];
        });
      });
      this.unlock();
      if (!this.supportSharedArrayBuffer) {
        this.call('setBuffer', {
          lock: this.$lock,
          paramsBuffer: this.$internalParamsBuffer
        });
      }
      var {
        currentTime
      } = audioWorkletGlobalScope;
      var $event;
      for ($event = 0; $event < this.eventQueue.length; $event++) {
        var event = this.eventQueue[$event];
        if (event.time && event.time > currentTime) break;
        if (typeof this.handleEvent === 'function') this.handleEvent(event);
        this.call('dispatchWamEvent', event);
      }
      if ($event) this.eventQueue.splice(0, $event);
      return true;
    }

    /**
     * @param {string} wamInstanceId
     * @param {number} [output]
     */
    connectEvents(wamInstanceId, output) {
      webAudioModules.connectEvents(this.groupId, this.instanceId, wamInstanceId, output);
    }

    /**
     * @param {string} [wamInstanceId]
     * @param {number} [output]
     */
    disconnectEvents(wamInstanceId, output) {
      if (typeof wamInstanceId === 'undefined') {
        webAudioModules.disconnectEvents(this.groupId, this.instanceId);
        return;
      }
      webAudioModules.disconnectEvents(this.groupId, this.instanceId, wamInstanceId, output);
    }
    destroy() {
      audioWorkletGlobalScope.webAudioModules.removeWam(this);
      this.destroyed = true;
      this.port.close();
    }
  }
  try {
    registerProcessor(moduleId, ParamMgrProcessor);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
};

/** @typedef {import('@webaudiomodules/api').WamParameterInfo} IWamParameterInfo */
/** @typedef {typeof import('@webaudiomodules/api').WamParameterInfo} WamParameterInfoConstructor */
/** @typedef {import('@webaudiomodules/api').WamParameterType} WamParameterType */
/** @typedef {import('@webaudiomodules/api').WamParameterConfiguration} WamParameterConfiguration */
/** @typedef {import('@webaudiomodules/api').AudioWorkletGlobalScope} AudioWorkletGlobalScope */
/** @typedef {import('./types').WamSDKBaseModuleScope} WamSDKBaseModuleScope */

/**
 * @param {string} [moduleId]
 * @returns {WamParameterInfoConstructor}
 */
var getWamParameterInfo = moduleId => {
  /** @type {AudioWorkletGlobalScope} */
  // @ts-ignore
  var audioWorkletGlobalScope = globalThis;

  /**
   * @param {number} x
   * @param {number} e
   */
  var normExp = (x, e) => e === 0 ? x : x ** 1.5 ** -e;

  /**
   * @param {number} x
   * @param {number} e
   */
  var denormExp = (x, e) => e === 0 ? x : x ** 1.5 ** e;

  /**
   * @param {number} x
   * @param {number} min
   * @param {number} max
   */
  var normalize = function normalize(x, min, max) {
    var e = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    return min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);
  };

  /**
   * @param {any} x
   * @param {number} min
   * @param {number} max
   */
  var denormalize = function denormalize(x, min, max) {
    var e = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    return min === 0 && max === 1 ? denormExp(x, e) : denormExp(x, e) * (max - min) + min;
  };

  /**
   * @param {number} x
   * @param {number} min
   * @param {number} max
   */
  var inRange = (x, min, max) => x >= min && x <= max;

  /**
   * @implements {IWamParameterInfo}
   */
  class WamParameterInfo {
    /**
     * @param {string} id
     * @param {WamParameterConfiguration} [config]
     */
    constructor(id) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var {
        type,
        label,
        defaultValue,
        minValue,
        maxValue,
        discreteStep,
        exponent,
        choices,
        units
      } = config;
      if (type === undefined) type = 'float';
      if (label === undefined) label = '';
      if (defaultValue === undefined) defaultValue = 0;
      if (choices === undefined) choices = [];
      if (type === 'boolean' || type === 'choice') {
        discreteStep = 1;
        minValue = 0;
        if (choices.length) maxValue = choices.length - 1;else maxValue = 1;
      } else {
        if (minValue === undefined) minValue = 0;
        if (maxValue === undefined) maxValue = 1;
        if (discreteStep === undefined) discreteStep = 0;
        if (exponent === undefined) exponent = 0;
        if (units === undefined) units = '';
      }
      var errBase = "Param config error | ".concat(id, ": ");
      if (minValue >= maxValue) throw Error(errBase.concat('minValue must be less than maxValue'));
      if (!inRange(defaultValue, minValue, maxValue)) throw Error(errBase.concat('defaultValue out of range'));
      if (discreteStep % 1 || discreteStep < 0) {
        throw Error(errBase.concat('discreteStep must be a non-negative integer'));
      } else if (discreteStep > 0 && (minValue % 1 || maxValue % 1 || defaultValue % 1)) {
        throw Error(errBase.concat('non-zero discreteStep requires integer minValue, maxValue, and defaultValue'));
      }
      if (type === 'choice' && !choices.length) {
        throw Error(errBase.concat('choice type parameter requires list of strings in choices'));
      }

      /**
       * The parameter's unique identifier.
       * @readonly @type {string}
       */
      this.id = id;

      /**
       * The parameter's human-readable name.
       * @readonly @type {string}
       */
      this.label = label;

      /**
       * The parameter's data type.
       * @readonly @type {WamParameterType}
       */
      this.type = type;

      /**
       * The parameter's default value. Must be
       * within range `[minValue, maxValue]`.
       * @readonly @type {number}
       */
      this.defaultValue = defaultValue;

      /**
       * The minimum valid value of the parameter's range.
       * @readonly @type {number}
       */
      this.minValue = minValue;

      /**
       * The maximum valid value of the parameter's range.
       * @readonly @type {number}
       */
      this.maxValue = maxValue;

      /**
       * The distance between adjacent valid integer
       * values, if applicable.
       * @readonly @type {number}
       */
      this.discreteStep = discreteStep;

      /**
       * The nonlinear (exponential) skew of the parameter's
       * range, if applicable.
       *  @readonly @type {number}
       */
      this.exponent = exponent;

      /**
       * A list of human-readable choices corresponding to each
       * valid integer value in the parameter's range, if applicable.
       * @readonly @type {string[]}
       */
      this.choices = choices;

      /**
       * A human-readable string representing the units of the
       * parameter's range, if applicable.
       * @readonly @type {string}
       */
      this.units = units;
    }

    /**
     * Convert a value from the parameter's denormalized range
     * `[minValue, maxValue]` to normalized range `[0, 1]`.
     * @param {number} value
     */
    normalize(value) {
      return normalize(value, this.minValue, this.maxValue, this.exponent);
    }

    /**
     * Convert a value from normalized range `[0, 1]` to the
     * parameter's denormalized range `[minValue, maxValue]`.
     * @param {number} valueNorm
     */
    denormalize(valueNorm) {
      return denormalize(valueNorm, this.minValue, this.maxValue, this.exponent);
    }

    /**
     * Get a human-readable string representing the given value,
     * including units if applicable.
     * @param {number} value
     */
    valueString(value) {
      if (this.choices) return this.choices[value];
      if (this.units !== '') return "".concat(value, " ").concat(this.units);
      return "".concat(value);
    }
  }
  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    /** @type {WamSDKBaseModuleScope} */
    var ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.WamParameterInfo) ModuleScope.WamParameterInfo = WamParameterInfo;
  }
  return WamParameterInfo;
};
var WamParameterInfo = getWamParameterInfo();
class ParamMappingConfigurator {
  /**
   * @param {ParametersMappingConfiguratorOptions} [options = {}]
   */
  constructor() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _defineProperty(this, "_paramsConfig", undefined);
    _defineProperty(this, "_internalParamsConfig", undefined);
    _defineProperty(this, "_paramsMapping", {});
    var {
      paramsConfig,
      paramsMapping,
      internalParamsConfig
    } = options;
    this._paramsConfig = paramsConfig;
    this._paramsMapping = paramsMapping;
    this._internalParamsConfig = internalParamsConfig;
  }

  /**
   * @private
   * @type {Record<string, WamParameterConfiguration>}
   */

  /**
   * Auto-completed `paramsConfig`:
   *
   * if no `paramsConfig` is defined while initializing, this will be be filled from the internalParamsConfig;
   *
   * if a parameter is not fully configured, the incompleted properties will have the same value as in the internalParamsConfig.
   *
   * @type {WamParameterInfoMap}
   */
  get paramsConfig() {
    var {
      internalParamsConfig
    } = this;
    return Object.entries(this._paramsConfig || internalParamsConfig).reduce((configs, _ref) => {
      var _config$label, _config$defaultValue, _config$minValue, _config$maxValue;
      var [id, config] = _ref;
      var internalParam = internalParamsConfig[id];
      configs[id] = new WamParameterInfo(id, _objectSpread2(_objectSpread2({}, config), {}, {
        label: (_config$label = config.label) !== null && _config$label !== void 0 ? _config$label : id,
        defaultValue: (_config$defaultValue = config.defaultValue) !== null && _config$defaultValue !== void 0 ? _config$defaultValue : internalParam === null || internalParam === void 0 ? void 0 : internalParam.defaultValue,
        minValue: (_config$minValue = config.minValue) !== null && _config$minValue !== void 0 ? _config$minValue : internalParam === null || internalParam === void 0 ? void 0 : internalParam.minValue,
        maxValue: (_config$maxValue = config.maxValue) !== null && _config$maxValue !== void 0 ? _config$maxValue : internalParam === null || internalParam === void 0 ? void 0 : internalParam.maxValue
      }));
      return configs;
    }, {});
  }

  /**
   * @private
   * @type {InternalParametersDescriptor}
   */

  /**
   * Auto-completed configuration of the `internalParamsConfig`
   *
   * Internal Parameters Config contains all the automatable parameters' information.
   *
   * An automatable parameter could be a `WebAudio` `AudioParam`
   * or a config with an `onChange` callback that will be called while the value has been changed.
   *
   * @type {InternalParametersDescriptor}
   */
  get internalParamsConfig() {
    return Object.entries(this._internalParamsConfig || {}).reduce((configs, _ref2) => {
      var [name, config] = _ref2;
      if (config instanceof AudioParam) configs[name] = config;else {
        var defaultConfig = {
          minValue: 0,
          maxValue: 1,
          defaultValue: 0,
          automationRate: 30
        };
        configs[name] = _objectSpread2(_objectSpread2({}, defaultConfig), config);
      }
      return configs;
    }, {});
  }

  /**
   * @private
   * @type {ParametersMapping}
   */

  /**
   * Auto-completed `paramsMapping`,
   * the mapping can be omitted while initialized,
   * but is useful when an exposed param (in the `paramsConfig`) should automate
   * several internal params (in the `internalParamsConfig`) or has a different range there.
   *
   * If a parameter is present in both `paramsConfig` and `internalParamsConfig` (or the `paramsConfig` is not configured),
   * a map of this parameter will be there automatically, if not declared explicitly.
   *
   * @type {ParametersMapping}
   */
  get paramsMapping() {
    var declared = this._paramsMapping || {};
    var externalParams = this.paramsConfig;
    var internalParams = this.internalParamsConfig;
    return Object.entries(externalParams).reduce((mapping, _ref3) => {
      var [name, {
        minValue,
        maxValue
      }] = _ref3;
      var sourceRange = [minValue, maxValue];
      var defaultMapping = {
        sourceRange,
        targetRange: [...sourceRange]
      };
      if (declared[name]) {
        var declaredTargets = Object.entries(declared[name]).reduce((targets, _ref4) => {
          var [targetName, targetMapping] = _ref4;
          if (internalParams[targetName]) {
            targets[targetName] = _objectSpread2(_objectSpread2({}, defaultMapping), targetMapping);
          }
          return targets;
        }, {});
        mapping[name] = declaredTargets;
      } else if (internalParams[name]) {
        mapping[name] = {
          [name]: _objectSpread2({}, defaultMapping)
        };
      }
      return mapping;
    }, {});
  }
}

/** @typedef {import('@webaudiomodules/api').WamParameter} WamParameter */
/** @typedef {import('@webaudiomodules/api').WamParameterInfo} WamParameterInfo */

/**
 * @extends {AudioParam}
 * @implements {WamParameter}
 */
class MgrAudioParam extends AudioParam {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_info", undefined);
  }
  get exponent() {
    return this.info.exponent;
  }

  /**
   * @type {WamParameterInfo}
   */

  get info() {
    return this._info;
  }
  set info(info) {
    this._info = info;
  }
  set normalizedValue(valueIn) {
    this.value = this.info.denormalize(valueIn);
  }
  get normalizedValue() {
    return this.info.normalize(this.value);
  }
  setValueAtTime(value, startTime) {
    return super.setValueAtTime(value, startTime);
  }
  setNormalizedValueAtTime(valueIn, startTime) {
    var value = this.info.denormalize(valueIn);
    return this.setValueAtTime(value, startTime);
  }
  linearRampToValueAtTime(value, endTime) {
    return super.linearRampToValueAtTime(value, endTime);
  }
  linearRampToNormalizedValueAtTime(valueIn, endTime) {
    var value = this.info.denormalize(valueIn);
    return this.linearRampToValueAtTime(value, endTime);
  }
  exponentialRampToValueAtTime(value, endTime) {
    return super.exponentialRampToValueAtTime(value, endTime);
  }
  exponentialRampToNormalizedValueAtTime(valueIn, endTime) {
    var value = this.info.denormalize(valueIn);
    return this.exponentialRampToValueAtTime(value, endTime);
  }
  setTargetAtTime(target, startTime, timeConstant) {
    return super.setTargetAtTime(target, startTime, timeConstant);
  }
  setNormalizedTargetAtTime(targetIn, startTime, timeConstant) {
    var target = this.info.denormalize(targetIn);
    return this.setTargetAtTime(target, startTime, timeConstant);
  }
  setValueCurveAtTime(values, startTime, duration) {
    return super.setValueCurveAtTime(values, startTime, duration);
  }
  setNormalizedValueCurveAtTime(valuesIn, startTime, duration) {
    var values = Array.from(valuesIn).map(v => this.info.denormalize(v));
    return this.setValueCurveAtTime(values, startTime, duration);
  }
  cancelScheduledParamValues(cancelTime) {
    return super.cancelScheduledValues(cancelTime);
  }
  cancelAndHoldParamAtTime(cancelTime) {
    return super.cancelAndHoldAtTime(cancelTime);
  }
}

/** @typedef {import('@webaudiomodules/api').WebAudioModule} WebAudioModule */
/** @typedef {import('@webaudiomodules/api').WamNode} WamNode */
/** @typedef {import('@webaudiomodules/api').WamParameterDataMap} WamParameterValueMap */
/** @typedef {import('@webaudiomodules/api').WamEvent} WamEvent */
/** @typedef {import('@webaudiomodules/api').WamAutomationEvent} WamAutomationEvent */
/** @typedef {import('./types').ParamMgrOptions} ParamMgrOptions */
/** @typedef {import('./types').ParamMgrCallFromProcessor} ParamMgrCallFromProcessor */
/** @typedef {import('./types').ParamMgrCallToProcessor} ParamMgrCallToProcessor */
/** @typedef {import('./types').ParamMgrNodeMsgIn} ParamMgrNodeMsgIn */
/** @typedef {import('./types').ParamMgrNodeMsgOut} ParamMgrNodeMsgOut */
/** @typedef {import('./types').ParamMgrNode} IParamMgrNode */

/** @type {typeof import('./TypedAudioWorklet').TypedAudioWorkletNode} */
// @ts-ignore
var AudioWorkletNode = globalThis.AudioWorkletNode;

/**
 * @extends {AudioWorkletNode<ParamMgrNodeMsgIn, ParamMgrNodeMsgOut>}
 * @implements {IParamMgrNode}
 */
class ParamMgrNode extends AudioWorkletNode {
  /**
      * @param {WebAudioModule} module
      * @param {ParamMgrOptions} options
      */
  constructor(module, options) {
    var _this;
    super(module.audioContext, module.moduleId, {
      numberOfInputs: 0,
      numberOfOutputs: 1 + options.processorOptions.internalParams.length,
      parameterData: options.parameterData,
      processorOptions: options.processorOptions
    });
    _this = this;
    _defineProperty(this, "requestDispatchIParamChange", name => {
      var config = this.internalParamsConfig[name];
      if (!('onChange' in config)) return;
      var {
        automationRate,
        onChange
      } = config;
      if (typeof automationRate !== 'number' || !automationRate) return;
      var interval = 1000 / automationRate;
      var i = this.internalParams.indexOf(name);
      if (i === -1) return;
      if (i >= this.internalParams.length) return;
      if (typeof this.paramsUpdateCheckFnRef[i] === 'number') {
        window.clearTimeout(this.paramsUpdateCheckFnRef[i]);
      }
      this.paramsUpdateCheckFn[i] = () => {
        var prev = this.$prevParamsBuffer[i];
        var cur = this.$paramsBuffer[i];
        if (cur !== prev) {
          onChange(cur, prev);
          this.$prevParamsBuffer[i] = cur;
        }
        this.paramsUpdateCheckFnRef[i] = window.setTimeout(this.paramsUpdateCheckFn[i], interval);
      };
      this.paramsUpdateCheckFn[i]();
    });
    var {
      processorOptions,
      internalParamsConfig
    } = options;
    this.initialized = false;
    this.module = module;
    this.paramsConfig = processorOptions.paramsConfig;
    this.internalParams = processorOptions.internalParams;
    this.internalParamsConfig = internalParamsConfig;
    this.$prevParamsBuffer = new Float32Array(this.internalParams.length);
    this.paramsUpdateCheckFn = [];
    this.paramsUpdateCheckFnRef = [];
    this.messageRequestId = 0;
    Object.entries(this.getParams()).forEach(_ref => {
      var [name, param] = _ref;
      Object.setPrototypeOf(param, MgrAudioParam.prototype);
      param._info = this.paramsConfig[name];
    });

    /** @type {Record<number, ((...args: any[]) => any)>} */
    var resolves = {};
    /** @type {Record<number, ((...args: any[]) => any)>} */
    var rejects = {};
    /**
     * @param {keyof ParamMgrCallToProcessor} call
     * @param {any} args
     */
    this.call = function (call) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var id = _this.messageRequestId;
      _this.messageRequestId += 1;
      return new Promise((resolve, reject) => {
        resolves[id] = resolve;
        rejects[id] = reject;
        _this.port.postMessage({
          id,
          call,
          args
        });
      });
    };
    this.handleMessage = _ref2 => {
      var {
        data
      } = _ref2;
      var {
        id,
        call,
        args,
        value,
        error
      } = data;
      if (call) {
        /** @type {any} */
        var r = {
          id
        };
        try {
          r.value = this[call](...args);
        } catch (e) {
          r.error = e;
        }
        this.port.postMessage(r);
      } else {
        if (error) {
          if (rejects[id]) rejects[id](error);
          delete rejects[id];
          return;
        }
        if (resolves[id]) {
          resolves[id](value);
          delete resolves[id];
        }
      }
    };
    this.port.start();
    this.port.addEventListener('message', this.handleMessage);
  }

  /**
   * @returns {ReadonlyMap<string, MgrAudioParam>}
   */
  get parameters() {
    // @ts-ignore
    return super.parameters;
  }
  get groupId() {
    return this.module.groupId;
  }
  get moduleId() {
    return this.module.moduleId;
  }
  get instanceId() {
    return this.module.instanceId;
  }
  initialize() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      /** @type {ReturnType<ParamMgrCallToProcessor['getBuffer']>} */
      var response = yield _this2.call('getBuffer');
      var {
        lock,
        paramsBuffer
      } = response;
      _this2.$lock = lock;
      _this2.$paramsBuffer = paramsBuffer;
      var offset = 1;
      Object.entries(_this2.internalParamsConfig).forEach((_ref3, i) => {
        var [name, config] = _ref3;
        if (_this2.context.state === 'suspended') _this2.$paramsBuffer[i] = config.defaultValue;
        if (config instanceof AudioParam) {
          try {
            config.automationRate = 'a-rate';
            // eslint-disable-next-line no-empty
          } catch (_unused) {} finally {
            config.value = Math.max(0, config.minValue);
            _this2.connect(config, offset + i);
          }
        } else if (config instanceof AudioNode) {
          _this2.connect(config, offset + i);
        } else {
          _this2.requestDispatchIParamChange(name);
        }
      });
      _this2.connect(_this2.module.audioContext.destination, 0, 0);
      _this2.initialized = true;
      return _this2;
    })();
  }

  /**
   * @param {ReturnType<ParamMgrCallToProcessor['getBuffer']>} buffer
   */
  setBuffer(_ref4) {
    var {
      lock,
      paramsBuffer
    } = _ref4;
    this.$lock = lock;
    this.$paramsBuffer = paramsBuffer;
  }
  setParamsMapping(paramsMapping) {
    return this.call('setParamsMapping', paramsMapping);
  }
  getCompensationDelay() {
    return this.call('getCompensationDelay');
  }
  getParameterInfo() {
    for (var _len2 = arguments.length, parameterIdQuery = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      parameterIdQuery[_key2] = arguments[_key2];
    }
    return this.call('getParameterInfo', ...parameterIdQuery);
  }
  getParameterValues(normalized) {
    for (var _len3 = arguments.length, parameterIdQuery = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      parameterIdQuery[_key3 - 1] = arguments[_key3];
    }
    return this.call('getParameterValues', normalized, ...parameterIdQuery);
  }

  /**
   * @param {WamAutomationEvent} event
   */
  scheduleAutomation(event) {
    var time = event.time || this.context.currentTime;
    var {
      id,
      normalized,
      value
    } = event.data;
    var audioParam = this.getParam(id);
    if (!audioParam) return;
    if (audioParam.info.type === 'float') {
      if (normalized) audioParam.linearRampToNormalizedValueAtTime(value, time);else audioParam.linearRampToValueAtTime(value, time);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (normalized) audioParam.setNormalizedValueAtTime(value, time);else audioParam.setValueAtTime(value, time);
    }
  }

  /**
   * @param {WamEvent[]} events
   */
  scheduleEvents() {
    for (var _len4 = arguments.length, events = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      events[_key4] = arguments[_key4];
    }
    events.forEach(event => {
      if (event.type === 'wam-automation') {
        this.scheduleAutomation(event);
      }
    });
    this.call('scheduleEvents', ...events);
  }

  /**
   * @param {WamEvent[]} events
   */
  emitEvents() {
    for (var _len5 = arguments.length, events = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      events[_key5] = arguments[_key5];
    }
    this.call('emitEvents', ...events);
  }
  clearEvents() {
    this.call('clearEvents');
  }

  /**
   * @param {WamEvent} event
   */
  dispatchWamEvent(event) {
    if (event.type === 'wam-automation') {
      this.scheduleAutomation(event);
    } else {
      this.dispatchEvent(new CustomEvent(event.type, {
        detail: event
      }));
    }
  }

  /**
   * @param {WamParameterValueMap} parameterValues
   */
  setParameterValues(parameterValues) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      Object.keys(parameterValues).forEach(parameterId => {
        var parameterUpdate = parameterValues[parameterId];
        var parameter = _this3.parameters.get(parameterId);
        if (!parameter) return;
        if (!parameterUpdate.normalized) parameter.value = parameterUpdate.value;else parameter.normalizedValue = parameterUpdate.value;
      });
    })();
  }
  getState() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      return _this4.getParamsValues();
    })();
  }
  setState(state) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      _this5.setParamsValues(state);
    })();
  }
  convertTimeToFrame(time) {
    return Math.round(time * this.context.sampleRate);
  }
  convertFrameToTime(frame) {
    return frame / this.context.sampleRate;
  }

  /**
   * @param {string} name
   */

  /**
   * @param {string} name
   */
  getIParamIndex(name) {
    var i = this.internalParams.indexOf(name);
    return i === -1 ? null : i;
  }

  /**
   * @param {string} name
   * @param {AudioParam | AudioNode} dest
   * @param {number} index
   */
  connectIParam(name, dest, index) {
    var offset = 1;
    var i = this.getIParamIndex(name);
    if (i !== null) {
      if (dest instanceof AudioNode) {
        if (typeof index === 'number') this.connect(dest, offset + i, index);else this.connect(dest, offset + i);
      } else {
        this.connect(dest, offset + i);
      }
    }
  }

  /**
   * @param {string} name
   * @param {AudioParam | AudioNode} dest
   * @param {number} index
   */
  disconnectIParam(name, dest, index) {
    var offset = 1;
    var i = this.getIParamIndex(name);
    if (i !== null) {
      if (dest instanceof AudioNode) {
        if (typeof index === 'number') this.disconnect(dest, offset + i, index);else this.disconnect(dest, offset + i);
      } else {
        this.disconnect(dest, offset + i);
      }
    }
  }
  getIParamValue(name) {
    var i = this.getIParamIndex(name);
    return i !== null ? this.$paramsBuffer[i] : null;
  }
  getIParamsValues() {
    /** @type {Record<string, number>} */
    var values = {};
    this.internalParams.forEach((name, i) => {
      values[name] = this.$paramsBuffer[i];
    });
    return values;
  }
  getParam(name) {
    return this.parameters.get(name) || null;
  }
  getParams() {
    // @ts-ignore
    return Object.fromEntries(this.parameters);
  }
  getParamValue(name) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.value;
  }
  setParamValue(name, value) {
    var param = this.parameters.get(name);
    if (!param) return;
    param.value = value;
  }
  getParamsValues() {
    /** @type {Record<string, number>} */
    var values = {};
    this.parameters.forEach((v, k) => {
      values[k] = v.value;
    });
    return values;
  }

  /**
   * @param {Record<string, number>} values
   */
  setParamsValues(values) {
    if (!values) return;
    Object.entries(values).forEach(_ref5 => {
      var [k, v] = _ref5;
      this.setParamValue(k, v);
    });
  }
  getNormalizedParamValue(name) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.normalizedValue;
  }
  setNormalizedParamValue(name, value) {
    var param = this.parameters.get(name);
    if (!param) return;
    param.normalizedValue = value;
  }
  getNormalizedParamsValues() {
    var values = {};
    this.parameters.forEach((v, k) => {
      values[k] = this.getNormalizedParamValue(k);
    });
    return values;
  }
  setNormalizedParamsValues(values) {
    if (!values) return;
    Object.entries(values).forEach(_ref6 => {
      var [k, v] = _ref6;
      this.setNormalizedParamValue(k, v);
    });
  }
  setParamValueAtTime(name, value, startTime) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.setValueAtTime(value, startTime);
  }
  setNormalizedParamValueAtTime(name, value, startTime) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.setNormalizedValueAtTime(value, startTime);
  }
  linearRampToParamValueAtTime(name, value, endTime) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.linearRampToValueAtTime(value, endTime);
  }
  linearRampToNormalizedParamValueAtTime(name, value, endTime) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.linearRampToNormalizedValueAtTime(value, endTime);
  }
  exponentialRampToParamValueAtTime(name, value, endTime) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.exponentialRampToValueAtTime(value, endTime);
  }
  exponentialRampToNormalizedParamValueAtTime(name, value, endTime) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.exponentialRampToNormalizedValueAtTime(value, endTime);
  }
  setParamTargetAtTime(name, target, startTime, timeConstant) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.setTargetAtTime(target, startTime, timeConstant);
  }
  setNormalizedParamTargetAtTime(name, target, startTime, timeConstant) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.setNormalizedTargetAtTime(target, startTime, timeConstant);
  }
  setParamValueCurveAtTime(name, values, startTime, duration) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.setValueCurveAtTime(values, startTime, duration);
  }
  setNormalizedParamValueCurveAtTime(name, values, startTime, duration) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.setNormalizedValueCurveAtTime(values, startTime, duration);
  }
  cancelScheduledParamValues(name, cancelTime) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.cancelScheduledValues(cancelTime);
  }
  cancelAndHoldParamAtTime(name, cancelTime) {
    var param = this.parameters.get(name);
    if (!param) return null;
    return param.cancelAndHoldAtTime(cancelTime);
  }

  /**
   * @param {string} toId
   * @param {number} [output]
   */
  connectEvents(toId, output) {
    this.call('connectEvents', toId, output);
  }

  /**
   * @param {string} [toId]
   * @param {number} [output]
   */
  disconnectEvents(toId, output) {
    this.call('disconnectEvents', toId, output);
  }
  destroy() {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      _this6.disconnect();
      _this6.paramsUpdateCheckFnRef.forEach(ref => {
        if (typeof ref === 'number') window.clearTimeout(ref);
      });
      yield _this6.call('destroy');
      _this6.port.close();
    })();
  }
}

/** @typedef {import('@webaudiomodules/api').WebAudioModule} WebAudioModule */
/** @typedef {import('./types').ParametersMappingConfiguratorOptions} ParametersMappingConfiguratorOptions */
/** @typedef {import('./types').ParamMgrOptions} ParamMgrOptions */
/** @typedef {import('./types').AudioWorkletRegister} AudioWorkletRegister */

class ParamMgrFactory {
  /**
   * @param {WebAudioModule} module
   * @param {ParametersMappingConfiguratorOptions} [optionsIn = {}]
   */
  static create(module) {
    var _arguments = arguments;
    return _asyncToGenerator(function* () {
      var optionsIn = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : {};
      var {
        audioContext,
        groupId,
        moduleId,
        instanceId
      } = module;
      var {
        paramsConfig,
        paramsMapping,
        internalParamsConfig
      } = new ParamMappingConfigurator(optionsIn);
      var initialParamsValue = Object.entries(paramsConfig).reduce((currentParams, _ref) => {
        var [name, {
          defaultValue
        }] = _ref;
        currentParams[name] = defaultValue;
        return currentParams;
      }, {});
      var serializableParamsConfig = Object.entries(paramsConfig).reduce((currentParams, _ref2) => {
        var [name, {
          id,
          label,
          type,
          defaultValue,
          minValue,
          maxValue,
          discreteStep,
          exponent,
          choices,
          units
        }] = _ref2;
        currentParams[name] = {
          id,
          label,
          type,
          defaultValue,
          minValue,
          maxValue,
          discreteStep,
          exponent,
          choices,
          units
        };
        return currentParams;
      }, {});
      yield addFunctionModule(audioContext.audioWorklet, processor, moduleId, serializableParamsConfig);
      /** @type {ParamMgrOptions} */
      var options = {
        internalParamsConfig,
        parameterData: initialParamsValue,
        processorOptions: {
          paramsConfig,
          paramsMapping,
          internalParamsMinValues: Object.values(internalParamsConfig).map(config => Math.max(0, (config === null || config === void 0 ? void 0 : config.minValue) || 0)),
          internalParams: Object.keys(internalParamsConfig),
          groupId,
          instanceId,
          moduleId
        }
      };
      var node = new ParamMgrNode(module, options);
      yield node.initialize();
      return node;
    })();
  }
}
var cache = new Map();
var fetchModule = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (url) {
    if (cache.has(url)) return cache.get(url);
    var exported;
    var toExport = {};
    window.exports = toExport;
    window.module = {
      exports: toExport
    };
    var esm = yield import( /* webpackIgnore: true */url);
    var esmKeys = Object.keys(esm);
    if (esmKeys.length) exported = esm;else exported = window.module.exports;
    delete window.exports;
    delete window.module;
    cache.set(url, exported);
    return exported;
  });
  return function fetchModule(_x) {
    return _ref.apply(this, arguments);
  };
}();

/* *
 *
 *  WebAudio-Controls is based on
 *    webaudio-knob by Eiji Kitamura http://google.com/+agektmr
 *    webaudio-slider by RYoya Kawai https://plus.google.com/108242669191458983485/posts
 *    webaudio-switch by Keisuke Ai http://d.hatena.ne.jp/aike/
 *  Integrated and enhanced by g200kg http://www.g200kg.com/
 *
 *	Copyright 2013 Eiji Kitamura / Ryoya KAWAI / Keisuke Ai / g200kg(Tatsuya Shinyagaito)
 *
 *	 Licensed under the Apache License, Version 2.0 (the "License");
 *	 you may not use this file except in compliance with the License.
 *	 You may obtain a copy of the License at
 *
 *	 http://www.apache.org/licenses/LICENSE-2.0
 *
 *	 Unless required by applicable law or agreed to in writing, software
 *	 distributed under the License is distributed on an "AS IS" BASIS,
 *	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *	 See the License for the specific language governing permissions and
 *	 limitations under the License.
 *
 * */
if (window.customElements) {
  var styles = document.createElement("style");
  styles.innerHTML = "#webaudioctrl-context-menu {\n  display: none;\n  position: absolute;\n  z-index: 10;\n  padding: 0;\n  width: 100px;\n  color:#eee;\n  background-color: #268;\n  border: solid 1px #888;\n  box-shadow: 1px 1px 2px #888;\n  font-family: sans-serif;\n  font-size: 11px;\n  line-height:1.7em;\n  text-align:center;\n  cursor:pointer;\n  color:#fff;\n  list-style: none;\n}\n#webaudioctrl-context-menu.active {\n  display: block;\n}\n.webaudioctrl-context-menu__item {\n  display: block;\n  margin: 0;\n  padding: 0;\n  color: #000;\n  background-color:#eee;\n  text-decoration: none;\n}\n.webaudioctrl-context-menu__title{\n  font-weight:bold;\n}\n.webaudioctrl-context-menu__item:last-child {\n  margin-bottom: 0;\n}\n.webaudioctrl-context-menu__item:hover {\n  background-color: #b8b8b8;\n}\n";
  document.head.appendChild(styles);
  var midimenu = document.createElement("ul");
  midimenu.id = "webaudioctrl-context-menu";
  midimenu.innerHTML = "<li class=\"webaudioctrl-context-menu__title\">MIDI Learn</li>\n<li class=\"webaudioctrl-context-menu__item\" id=\"webaudioctrl-context-menu-learn\" onclick=\"webAudioControlsMidiManager.contextMenuLearn()\">Learn</li>\n<li class=\"webaudioctrl-context-menu__item\" onclick=\"webAudioControlsMidiManager.contextMenuClear()\">Clear</li>\n<li class=\"webaudioctrl-context-menu__item\" onclick=\"webAudioControlsMidiManager.contextMenuClose()\">Close</li>\n";
  var opt = {
    useMidi: 0,
    midilearn: 0,
    mididump: 0,
    outline: 0,
    knobSrc: null,
    knobSprites: 0,
    knobWidth: 0,
    knobHeight: 0,
    knobDiameter: 64,
    knobColors: "#fff;#000;#000",
    sliderSrc: null,
    sliderKnobsrc: null,
    sliderWidth: 0,
    sliderHeight: 0,
    sliderKnobwidth: 0,
    sliderKnobheight: 0,
    sliderDitchlength: 0,
    sliderColors: "#bbb;#444;#fff",
    switchWidth: 0,
    switchHeight: 0,
    switchDiameter: 24,
    switchColors: "#e00;#000;#fcc",
    paramWidth: 32,
    paramHeight: 16,
    paramColors: "#fff;#000"
  };
  if (window.WebAudioControlsOptions) Object.assign(opt, window.WebAudioControlsOptions);
  class WebAudioControlsWidget extends HTMLElement {
    constructor() {
      super();
      this.addEventListener("keydown", this.keydown);
      this.addEventListener("mousedown", this.pointerdown, {
        passive: false
      });
      this.addEventListener("touchstart", this.pointerdown, {
        passive: false
      });
      this.addEventListener("wheel", this.wheel, {
        passive: true
      });
      this.addEventListener("mouseover", this.pointerover);
      this.addEventListener("mouseout", this.pointerout);
      this.addEventListener("contextmenu", this.contextMenu);
      this.hover = this.drag = 0;
      document.body.appendChild(midimenu);
      this.basestyle = "\n.webaudioctrl-tooltip{\n  display:inline-block;\n  position:absolute;\n  margin:0 -1000px;\n  z-index: 999;\n  background:#eee;\n  color:#000;\n  border:1px solid #666;\n  border-radius:4px;\n  padding:5px 10px;\n  text-align:center;\n  left:0; top:0;\n  font-size:11px;\n  opacity:0;\n  visibility:hidden;\n}\n.webaudioctrl-tooltip:before{\n  content: \"\";\n\tposition: absolute;\n\ttop: 100%;\n\tleft: 50%;\n \tmargin-left: -8px;\n\tborder: 8px solid transparent;\n\tborder-top: 8px solid #666;\n}\n.webaudioctrl-tooltip:after{\n  content: \"\";\n\tposition: absolute;\n\ttop: 100%;\n\tleft: 50%;\n \tmargin-left: -6px;\n\tborder: 6px solid transparent;\n\tborder-top: 6px solid #eee;\n}\n";
    }
    sendEvent(ev) {
      var event;
      event = document.createEvent("HTMLEvents");
      event.initEvent(ev, false, true);
      this.dispatchEvent(event);
    }
    getAttr(n, def) {
      var v = this.getAttribute(n);
      if (v == "" || v == null) return def;
      switch (typeof def) {
        case "number":
          if (v == "true") return 1;
          v = +v;
          if (isNaN(v)) return 0;
          return v;
      }
      return v;
    }
    showtip(d) {
      function numformat(s, x) {
        var i = s.indexOf("%");
        var c = [0, 0],
          type = 0,
          m = 0,
          r = "",
          j = i + 1;
        for (; j < s.length; ++j) {
          if ("dfxXs".indexOf(s[j]) >= 0) {
            type = s[j];
            break;
          }
          if (s[j] == ".") m = 1;else c[m] = c[m] * 10 + parseInt(s[j]);
        }
        switch (type) {
          case "x":
            r = (x | 0).toString(16);
            break;
          case "X":
            r = (x | 0).toString(16).toUpperCase();
            break;
          case "d":
            r = (x | 0).toString();
            break;
          case "f":
            r = x.toFixed(c[1]);
            break;
          case "s":
            r = x.toString();
            break;
        }
        if (c[0] > 0) r = ("               " + r).slice(-c[0]);
        r = s.replace(/%.*[xXdfs]/, r);
        return r;
      }
      var s = this.tooltip;
      if (this.drag || this.hover) {
        if (this.valuetip) {
          if (s == null) s = "%.".concat(this.digits, "f");else if (s.indexOf("%") < 0) s += " : %.".concat(this.digits, "f");
        }
        if (s) {
          this.ttframe.innerHTML = numformat(s, this.convValue);
          this.ttframe.style.display = "inline-block";
          this.ttframe.style.width = "auto";
          this.ttframe.style.height = "auto";
          this.ttframe.style.transition = "opacity 0.5s " + d + "s,visibility 0.5s " + d + "s";
          this.ttframe.style.opacity = 0.9;
          this.ttframe.style.visibility = "visible";
          var rc = this.getBoundingClientRect(),
            rc2 = this.ttframe.getBoundingClientRect();
          document.documentElement.getBoundingClientRect();
          this.ttframe.style.left = (rc.width - rc2.width) * 0.5 + 1000 + "px";
          this.ttframe.style.top = -rc2.height - 8 + "px";
          return;
        }
      }
      this.ttframe.style.transition = "opacity 0.1s " + d + "s,visibility 0.1s " + d + "s";
      this.ttframe.style.opacity = 0;
      this.ttframe.style.visibility = "hidden";
    }
    pointerover(e) {
      this.hover = 1;
      this.showtip(0.6);
    }
    pointerout(e) {
      this.hover = 0;
      this.showtip(0);
    }
    contextMenu(e) {
      if (window.webAudioControlsMidiManager && this.midilearn) {
        webAudioControlsMidiManager.contextMenuOpen(e, this);
      }
      e.preventDefault();
      e.stopPropagation();
    }
    setMidiController(channel, cc) {
      if (this.listeningToThisMidiController(channel, cc)) return;
      this.midiController = {
        'channel': channel,
        'cc': cc
      };
      console.log("Added mapping for channel=" + channel + " cc=" + cc + " tooltip=" + this.tooltip);
    }
    listeningToThisMidiController(channel, cc) {
      var c = this.midiController;
      if ((c.channel === channel || c.channel < 0) && c.cc === cc) return true;
      return false;
    }
    processMidiEvent(event) {
      var channel = event.data[0] & 0xf;
      var controlNumber = event.data[1];
      if (this.midiMode == 'learn') {
        this.setMidiController(channel, controlNumber);
        webAudioControlsMidiManager.contextMenuClose();
        this.midiMode = 'normal';
      }
      if (this.listeningToThisMidiController(channel, controlNumber)) {
        if (this.tagName == "WEBAUDIO-SWITCH") {
          switch (this.type) {
            case "toggle":
              if (event.data[2] >= 64) this.setValue(1 - this.value, true);
              break;
            case "kick":
              this.setValue(event.data[2] >= 64 ? 1 : 0);
              break;
            case "radio":
              var els = document.querySelectorAll("webaudio-switch[type='radio'][group='" + this.group + "']");
              for (var i = 0; i < els.length; ++i) {
                if (els[i] == this) els[i].setValue(1);else els[i].setValue(0);
              }
              break;
          }
        } else {
          var val = this.min + (this.max - this.min) * event.data[2] / 127;
          this.setValue(val, true);
        }
      }
    }
  }
  try {
    customElements.define("webaudio-knob", class WebAudioKnob extends WebAudioControlsWidget {
      constructor() {
        super();
      }
      connectedCallback() {
        var root;
        //      if(this.attachShadow)
        //        root=this.attachShadow({mode: 'open'});
        //      else
        root = this;
        root.innerHTML = "<style>\n".concat(this.basestyle, "\nwebaudio-knob{\n  display:inline-block;\n  position:relative;\n  margin:0;\n  padding:0;\n  cursor:pointer;\n  font-family: sans-serif;\n  font-size: 11px;\n}\n.webaudio-knob-body{\n  display:inline-block;\n  position:relative;\n  z-index:1;\n  margin:0;\n  padding:0;\n}\n</style>\n<div class='webaudio-knob-body' tabindex='1' touch-action='none'></div><div class='webaudioctrl-tooltip'></div>\n");
        this.elem = root.childNodes[2];
        this.ttframe = root.childNodes[3];
        this.enable = this.getAttr("enable", 1);
        this._src = this.getAttr("src", opt.knobSrc);
        if (!this.hasOwnProperty("src")) Object.defineProperty(this, "src", {
          get: () => {
            return this._src;
          },
          set: v => {
            this._src = v;
            this.setupImage();
          }
        });
        this._value = this.getAttr("value", 0);
        if (!this.hasOwnProperty("value")) Object.defineProperty(this, "value", {
          get: () => {
            return this._value;
          },
          set: v => {
            this._value = v;
            this.redraw();
          }
        });
        this.defvalue = this.getAttr("defvalue", 0);
        this._min = this.getAttr("min", 0);
        if (!this.hasOwnProperty("min")) Object.defineProperty(this, "min", {
          get: () => {
            return this._min;
          },
          set: v => {
            this._min = +v;
            this.redraw();
          }
        });
        this._max = this.getAttr("max", 100);
        if (!this.hasOwnProperty("max")) Object.defineProperty(this, "max", {
          get: () => {
            return this._max;
          },
          set: v => {
            this._max = +v;
            this.redraw();
          }
        });
        this._step = this.getAttr("step", 1);
        if (!this.hasOwnProperty("step")) Object.defineProperty(this, "step", {
          get: () => {
            return this._step;
          },
          set: v => {
            this._step = +v;
            this.redraw();
          }
        });
        this._sprites = this.getAttr("sprites", opt.knobSprites);
        if (!this.hasOwnProperty("sprites")) Object.defineProperty(this, "sprites", {
          get: () => {
            return this._sprites;
          },
          set: v => {
            this._sprites = v;
            this.setupImage();
          }
        });
        this._width = this.getAttr("width", opt.knobWidth);
        if (!this.hasOwnProperty("width")) Object.defineProperty(this, "width", {
          get: () => {
            return this._width;
          },
          set: v => {
            this._width = v;
            this.setupImage();
          }
        });
        this._height = this.getAttr("height", opt.knobHeight);
        if (!this.hasOwnProperty("height")) Object.defineProperty(this, "height", {
          get: () => {
            return this._height;
          },
          set: v => {
            this._height = v;
            this.setupImage();
          }
        });
        this._diameter = this.getAttr("diameter", opt.knobDiameter);
        if (!this.hasOwnProperty("diameter")) Object.defineProperty(this, "diameter", {
          get: () => {
            return this._diameter;
          },
          set: v => {
            this._diameter = v;
            this.setupImage();
          }
        });
        this._colors = this.getAttr("colors", opt.knobColors);
        if (!this.hasOwnProperty("colors")) Object.defineProperty(this, "colors", {
          get: () => {
            return this._colors;
          },
          set: v => {
            this._colors = v;
            this.setupImage();
          }
        });
        this.outline = this.getAttr("outline", opt.outline);
        this.sensitivity = this.getAttr("sensitivity", 1);
        this.valuetip = this.getAttr("valuetip", 1);
        this.tooltip = this.getAttr("tooltip", null);
        this.conv = this.getAttr("conv", null);
        if (this.conv) this.convValue = eval(this.conv)(this._value);else this.convValue = this._value;
        this.midilearn = this.getAttr("midilearn", opt.midilearn);
        this.midicc = this.getAttr("midicc", null);
        this.midiController = {};
        this.midiMode = "normal";
        if (this.midicc) {
          var ch = parseInt(this.midicc.substring(0, this.midicc.lastIndexOf("."))) - 1;
          var cc = parseInt(this.midicc.substring(this.midicc.lastIndexOf(".") + 1));
          this.setMidiController(ch, cc);
        }
        this.setupImage();
        this.digits = 0;
        this.coltab = ["#e00", "#000", "#000"];
        if (window.webAudioControlsMidiManager)
          //        window.webAudioControlsMidiManager.updateWidgets();
          window.webAudioControlsMidiManager.addWidget(this);
      }
      disconnectedCallback() {}
      setupImage() {
        this.kw = this.width || this.diameter;
        this.kh = this.height || this.diameter;
        if (!this.src) {
          if (this.colors) this.coltab = this.colors.split(";");
          if (!this.coltab) this.coltab = ["#e00", "#000", "#000"];
          var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"64\" height=\"6464\" preserveAspectRatio=\"none\">\n<radialGradient id=\"gr\" cx=\"30%\" cy=\"30%\"><stop offset=\"0%\" stop-color=\"".concat(this.coltab[2], "\"/><stop offset=\"100%\" stop-color=\"").concat(this.coltab[1], "\"/></radialGradient>\n<defs><circle id=\"B\" cx=\"32\" cy=\"32\" r=\"30\" fill=\"url(#gr)\"/></defs>\n<defs><line id=\"K\" x1=\"32\" y1=\"28\" x2=\"32\" y2=\"7\" stroke-linecap=\"round\" stroke-width=\"6\" stroke=\"").concat(this.coltab[0], "\"/></defs>");
          for (var i = 0; i < 101; ++i) {
            svg += "<use xlink:href=\"#B\" y=\"".concat(64 * i, "\"/>");
            svg += "<use xlink:href=\"#K\" y=\"".concat(64 * i, "\" transform=\"rotate(").concat((-135 + 270 * i / 101).toFixed(2), ",32,").concat(64 * i + 32, ")\"/>");
          }
          svg += "</svg>";
          this.elem.style.backgroundImage = "url(data:image/svg+xml;base64," + btoa(svg) + ")";
          //        this.elem.style.backgroundSize = "100% 10100%";
          this.elem.style.backgroundSize = "".concat(this.kw, "px ").concat(this.kh * 101, "px");
        } else {
          this.elem.style.backgroundImage = "url(" + this.src + ")";
          if (!this.sprites) this.elem.style.backgroundSize = "100% 100%";else {
            //          this.elem.style.backgroundSize = `100% ${(this.sprites+1)*100}%`;
            this.elem.style.backgroundSize = "".concat(this.kw, "px ").concat(this.kh * (this.sprites + 1), "px");
          }
        }
        this.elem.style.outline = this.outline ? "" : "none";
        this.elem.style.width = this.kw + "px";
        this.elem.style.height = this.kh + "px";
        this.redraw();
      }
      redraw() {
        this.digits = 0;
        if (this.step && this.step < 1) {
          for (var n = this.step; n < 1; n *= 10) {
            ++this.digits;
          }
        }
        if (this.value < this.min) {
          this.value = this.min;
          return;
        }
        if (this.value > this.max) {
          this.value = this.max;
          return;
        }
        var range = this.max - this.min;
        var style = this.elem.style;
        var sp = this.src ? this.sprites : 100;
        if (sp >= 1) {
          var offset = sp * (this.value - this.min) / range | 0;
          style.backgroundPosition = "0px " + -offset * this.kh + "px";
          style.transform = 'rotate(0deg)';
        } else {
          var deg = 270 * ((this.value - this.min) / range - 0.5);
          style.backgroundPosition = "0px 0px";
          style.transform = 'rotate(' + deg + 'deg)';
        }
      }
      _setValue(v) {
        if (this.step) v = Math.round((v - this.min) / this.step) * this.step + this.min;
        this._value = Math.min(this.max, Math.max(this.min, v));
        if (this._value != this.oldvalue) {
          this.oldvalue = this._value;
          if (this.conv) this.convValue = eval(this.conv)(this._value);else this.convValue = this._value;
          this.redraw();
          this.showtip(0);
          return 1;
        }
        return 0;
      }
      setValue(v, f) {
        if (this._setValue(v) && f) this.sendEvent("input"), this.sendEvent("change");
      }
      wheel(e) {
        var delta = (this.max - this.min) * 0.01;
        delta = e.deltaY > 0 ? -delta : delta;
        if (!e.shiftKey) delta *= 5;
        if (Math.abs(delta) < this.step) delta = delta > 0 ? +this.step : -this.step;
        this.setValue(+this.value + delta, true);
        e.preventDefault();
        e.stopPropagation();
      }
      pointerdown(ev) {
        if (!this.enable) return;
        var e = ev;
        if (ev.touches) {
          e = ev.changedTouches[0];
          this.identifier = e.identifier;
        } else {
          if (e.buttons != 1 && e.button != 0) return;
        }
        this.elem.focus();
        this.drag = 1;
        this.showtip(0);
        var pointermove = ev => {
          var e = ev;
          if (ev.touches) {
            for (var i = 0; i < ev.touches.length; ++i) {
              if (ev.touches[i].identifier == this.identifier) {
                e = ev.touches[i];
                break;
              }
            }
          }
          if (this.lastShift !== e.shiftKey) {
            this.lastShift = e.shiftKey;
            this.startPosX = e.pageX;
            this.startPosY = e.pageY;
            this.startVal = this.value;
          }
          var offset = (this.startPosY - e.pageY - this.startPosX + e.pageX) * this.sensitivity;
          this._setValue(this.min + ((this.startVal + (this.max - this.min) * offset / ((e.shiftKey ? 4 : 1) * 128) - this.min) / this.step | 0) * this.step);
          this.sendEvent("input");
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          return false;
        };
        var pointerup = ev => {
          var e = ev;
          if (ev.touches) {
            for (var i = 0;;) {
              if (ev.changedTouches[i].identifier == this.identifier) {
                break;
              }
              if (++i >= ev.changedTouches.length) return;
            }
          }
          this.drag = 0;
          this.showtip(0);
          this.startPosX = this.startPosY = null;
          window.removeEventListener('mousemove', pointermove);
          window.removeEventListener('touchmove', pointermove, {
            passive: false
          });
          window.removeEventListener('mouseup', pointerup);
          window.removeEventListener('touchend', pointerup);
          window.removeEventListener('touchcancel', pointerup);
          document.body.removeEventListener('touchstart', preventScroll, {
            passive: false
          });
          this.sendEvent("change");
        };
        var preventScroll = e => {
          e.preventDefault();
        };
        if (e.ctrlKey || e.metaKey) this.setValue(this.defvalue, true);else {
          this.startPosX = e.pageX;
          this.startPosY = e.pageY;
          this.startVal = this.value;
          window.addEventListener('mousemove', pointermove);
          window.addEventListener('touchmove', pointermove, {
            passive: false
          });
        }
        window.addEventListener('mouseup', pointerup);
        window.addEventListener('touchend', pointerup);
        window.addEventListener('touchcancel', pointerup);
        document.body.addEventListener('touchstart', preventScroll, {
          passive: false
        });
        ev.preventDefault();
        ev.stopPropagation();
        return false;
      }
    });
  } catch (error) {
    //console.log("webaudio-knob already defined");
  }
  try {
    customElements.define("webaudio-slider", class WebAudioSlider extends WebAudioControlsWidget {
      constructor() {
        super();
      }
      connectedCallback() {
        var root;
        //      if(this.attachShadow)
        //        root=this.attachShadow({mode: 'open'});
        //      else
        root = this;
        root.innerHTML = "<style>\n".concat(this.basestyle, "\nwebaudio-slider{\n  display:inline-block;\n  position:relative;\n  margin:0;\n  padding:0;\n  font-family: sans-serif;\n  font-size: 11px;\n  cursor:pointer;\n}\n.webaudio-slider-body{\n  display:inline-block;\n  position:relative;\n  margin:0;\n  padding:0;\n}\n.webaudio-slider-knob{\n  display:inline-block;\n  position:absolute;\n  margin:0;\n  padding:0;\n}\n</style>\n<div class='webaudio-slider-body' tabindex='1' touch-action='none'><div class='webaudio-slider-knob' touch-action='none'></div></div><div class='webaudioctrl-tooltip'></div>\n");
        this.elem = root.childNodes[2];
        this.knob = this.elem.childNodes[0];
        this.ttframe = root.childNodes[3];
        this.enable = this.getAttr("enable", 1);
        this._src = this.getAttr("src", opt.sliderSrc);
        if (!this.hasOwnProperty("src")) Object.defineProperty(this, "src", {
          get: () => {
            return this._src;
          },
          set: v => {
            this._src = v;
            this.setupImage();
          }
        });
        this._knobsrc = this.getAttr("knobsrc", opt.sliderKnobsrc);
        if (!this.hasOwnProperty("knobsrc")) Object.defineProperty(this, "knobsrc", {
          get: () => {
            return this._knobsrc;
          },
          set: v => {
            this._knobsrc = v;
            this.setupImage();
          }
        });
        this._value = this.getAttr("value", 0);
        if (!this.hasOwnProperty("value")) Object.defineProperty(this, "value", {
          get: () => {
            return this._value;
          },
          set: v => {
            this._value = v;
            this.redraw();
          }
        });
        this.defvalue = this.getAttr("defvalue", 0);
        this._min = this.getAttr("min", 0);
        if (!this.hasOwnProperty("min")) Object.defineProperty(this, "min", {
          get: () => {
            return this._min;
          },
          set: v => {
            this._min = v;
            this.redraw();
          }
        });
        this._max = this.getAttr("max", 100);
        if (!this.hasOwnProperty("max")) Object.defineProperty(this, "max", {
          get: () => {
            return this._max;
          },
          set: v => {
            this._max = v;
            this.redraw();
          }
        });
        this._step = this.getAttr("step", 1);
        if (!this.hasOwnProperty("step")) Object.defineProperty(this, "step", {
          get: () => {
            return this._step;
          },
          set: v => {
            this._step = v;
            this.redraw();
          }
        });
        this._sprites = this.getAttr("sprites", 0);
        if (!this.hasOwnProperty("sprites")) Object.defineProperty(this, "sprites", {
          get: () => {
            return this._sprites;
          },
          set: v => {
            this._sprites = v;
            this.setupImage();
          }
        });
        this._direction = this.getAttr("direction", null);
        if (!this.hasOwnProperty("direction")) Object.defineProperty(this, "direction", {
          get: () => {
            return this._direction;
          },
          set: v => {
            this._direction = v;
            this.setupImage();
          }
        });
        this._width = this.getAttr("width", opt.sliderWidth);
        if (!this.hasOwnProperty("width")) Object.defineProperty(this, "width", {
          get: () => {
            return this._width;
          },
          set: v => {
            this._width = v;
            this.setupImage();
          }
        });
        this._height = this.getAttr("height", opt.sliderHeight);
        if (!this.hasOwnProperty("height")) Object.defineProperty(this, "height", {
          get: () => {
            return this._height;
          },
          set: v => {
            this._height = v;
            this.setupImage();
          }
        });
        if (this._direction == "horz") {
          if (this._width == 0) this._width = 128;
          if (this._height == 0) this._height = 24;
        } else {
          if (this._width == 0) this._width = 24;
          if (this._height == 0) this._height = 128;
        }
        this._knobwidth = this.getAttr("knobwidth", opt.sliderKnobwidth);
        Object.defineProperty(this, "knobwidth", {
          get: () => {
            return this._knobwidth;
          },
          set: v => {
            this._knobwidth = v;
            this.setupImage();
          }
        });
        this._knobheight = this.getAttr("knbheight", opt.sliderKnobheight);
        Object.defineProperty(this, "knobheight", {
          get: () => {
            return this._knobheight;
          },
          set: v => {
            this._knobheight = v;
            this.setupImage();
          }
        });
        this._ditchlength = this.getAttr("ditchlength", opt.sliderDitchlength);
        Object.defineProperty(this, "ditchlength", {
          get: () => {
            return this._ditchlength;
          },
          set: v => {
            this._ditchlength = v;
            this.setupImage();
          }
        });
        this._colors = this.getAttr("colors", opt.sliderColors);
        Object.defineProperty(this, "colors", {
          get: () => {
            return this._colors;
          },
          set: v => {
            this._colors = v;
            this.setupImage();
          }
        });
        this.outline = this.getAttr("outline", opt.outline);
        this.sensitivity = this.getAttr("sensitivity", 1);
        this.valuetip = this.getAttr("valuetip", 1);
        this.tooltip = this.getAttr("tooltip", null);
        this.conv = this.getAttr("conv", null);
        if (this.conv) this.convValue = eval(this.conv)(this._value);else this.convValue = this._value;
        this.midilearn = this.getAttr("midilearn", opt.midilearn);
        this.midicc = this.getAttr("midicc", null);
        this.midiController = {};
        this.midiMode = "normal";
        if (this.midicc) {
          var ch = parseInt(this.midicc.substring(0, this.midicc.lastIndexOf("."))) - 1;
          var cc = parseInt(this.midicc.substring(this.midicc.lastIndexOf(".") + 1));
          this.setMidiController(ch, cc);
        }
        this.setupImage();
        this.digits = 0;
        if (window.webAudioControlsMidiManager)
          //        window.webAudioControlsMidiManager.updateWidgets();
          window.webAudioControlsMidiManager.addWidget(this);
        this.elem.onclick = e => {
          e.stopPropagation();
        };
      }
      disconnectedCallback() {}
      setupImage() {
        this.coltab = this.colors.split(";");
        this.dr = this.direction;
        this.dlen = this.ditchlength;
        if (!this.width) {
          if (this.dr == "horz") this.width = 128;else this.width = 24;
        }
        if (!this.height) {
          if (this.dr == "horz") this.height = 24;else this.height = 128;
        }
        if (!this.dr) this.dr = this.width <= this.height ? "vert" : "horz";
        if (this.dr == "vert") {
          if (!this.dlen) this.dlen = this.height - this.width;
        } else {
          if (!this.dlen) this.dlen = this.width - this.height;
        }
        this.knob.style.backgroundSize = "100% 100%";
        this.elem.style.backgroundSize = "100% 100%";
        this.elem.style.width = this.width + "px";
        this.elem.style.height = this.height + "px";
        this.kwidth = this.knobwidth || (this.dr == "horz" ? this.height : this.width);
        this.kheight = this.knobheight || (this.dr == "horz" ? this.height : this.width);
        this.knob.style.width = this.kwidth + "px";
        this.knob.style.height = this.kheight + "px";
        if (!this.src) {
          var r = Math.min(this.width, this.height) * 0.5;
          var svgbody = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(this.width, "\" height=\"").concat(this.height, "\" preserveAspectRatio=\"none\">\n<rect x=\"1\" y=\"1\" rx=\"").concat(r, "\" ry=\"").concat(r, "\" width=\"").concat(this.width - 2, "\" height=\"").concat(this.height - 2, "\" fill=\"").concat(this.coltab[1], "\"/></svg>");
          this.elem.style.backgroundImage = "url(data:image/svg+xml;base64," + btoa(svgbody) + ")";
        } else {
          this.elem.style.backgroundImage = "url(" + this.src + ")";
        }
        if (!this.knobsrc) {
          var svgthumb = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(this.kwidth, "\" height=\"").concat(this.kheight, "\" preserveAspectRatio=\"none\">\n<radialGradient id=\"gr\" cx=\"30%\" cy=\"30%\"><stop offset=\"0%\" stop-color=\"").concat(this.coltab[2], "\"/><stop offset=\"100%\" stop-color=\"").concat(this.coltab[0], "\"/></radialGradient>\n<rect x=\"2\" y=\"2\" width=\"").concat(this.kwidth - 4, "\" height=\"").concat(this.kheight - 4, "\" rx=\"").concat(this.kwidth * 0.5, "\" ry=\"").concat(this.kheight * 0.5, "\" fill=\"url(#gr)\"/></svg>");
          this.knob.style.backgroundImage = "url(data:image/svg+xml;base64," + btoa(svgthumb) + ")";
        } else {
          this.knob.style.backgroundImage = "url(" + this.knobsrc + ")";
        }
        this.elem.style.outline = this.outline ? "" : "none";
        this.redraw();
      }
      redraw() {
        this.digits = 0;
        if (this.step && this.step < 1) {
          for (var n = this.step; n < 1; n *= 10) {
            ++this.digits;
          }
        }
        if (this.value < this.min) {
          this.value = this.min;
          return;
        }
        if (this.value > this.max) {
          this.value = this.max;
          return;
        }
        var range = this.max - this.min;
        var style = this.knob.style;
        if (this.dr == "vert") {
          style.left = (this.width - this.kwidth) * 0.5 + "px";
          style.top = (1 - (this.value - this.min) / range) * this.dlen + "px";
          this.sensex = 0;
          this.sensey = 1;
        } else {
          style.top = (this.height - this.kheight) * 0.5 + "px";
          style.left = (this.value - this.min) / range * this.dlen + "px";
          this.sensex = 1;
          this.sensey = 0;
        }
      }
      _setValue(v) {
        v = Math.round((v - this.min) / this.step) * this.step + this.min;
        this._value = Math.min(this.max, Math.max(this.min, v));
        if (this._value != this.oldvalue) {
          this.oldvalue = this._value;
          if (this.conv) this.convValue = eval(this.conv)(this._value);else this.convValue = this._value;
          this.redraw();
          this.showtip(0);
          return 1;
        }
        return 0;
      }
      setValue(v, f) {
        if (this._setValue(v) && f) this.sendEvent("input"), this.sendEvent("change");
      }
      wheel(e) {
        var delta = (this.max - this.min) * 0.01;
        delta = e.deltaY > 0 ? -delta : delta;
        if (!e.shiftKey) delta *= 5;
        if (Math.abs(delta) < this.step) delta = delta > 0 ? +this.step : -this.step;
        this.setValue(+this.value + delta, true);
        e.preventDefault();
        e.stopPropagation();
        this.redraw();
      }
      pointerdown(ev) {
        if (!this.enable) return;
        var e = ev;
        if (ev.touches) {
          e = ev.changedTouches[0];
          this.identifier = e.identifier;
        } else {
          if (e.buttons != 1 && e.button != 0) return;
        }
        this.elem.focus();
        this.drag = 1;
        this.showtip(0);
        var pointermove = ev => {
          var e = ev;
          if (ev.touches) {
            for (var i = 0; i < ev.touches.length; ++i) {
              if (ev.touches[i].identifier == this.identifier) {
                e = ev.touches[i];
                break;
              }
            }
          }
          if (this.lastShift !== e.shiftKey) {
            this.lastShift = e.shiftKey;
            this.startPosX = e.pageX;
            this.startPosY = e.pageY;
            this.startVal = this.value;
          }
          var offset = ((this.startPosY - e.pageY) * this.sensey - (this.startPosX - e.pageX) * this.sensex) * this.sensitivity;
          this._setValue(this.min + ((this.startVal + (this.max - this.min) * offset / ((e.shiftKey ? 4 : 1) * this.dlen) - this.min) / this.step | 0) * this.step);
          this.sendEvent("input");
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          return false;
        };
        var pointerup = ev => {
          var e = ev;
          if (ev.touches) {
            for (var i = 0;;) {
              if (ev.changedTouches[i].identifier == this.identifier) {
                break;
              }
              if (++i >= ev.changedTouches.length) return;
            }
          }
          this.drag = 0;
          this.showtip(0);
          this.startPosX = this.startPosY = null;
          window.removeEventListener('mousemove', pointermove);
          window.removeEventListener('touchmove', pointermove, {
            passive: false
          });
          window.removeEventListener('mouseup', pointerup);
          window.removeEventListener('touchend', pointerup);
          window.removeEventListener('touchcancel', pointerup);
          document.body.removeEventListener('touchstart', preventScroll, {
            passive: false
          });
          this.sendEvent("change");
        };
        var preventScroll = e => {
          e.preventDefault();
        };
        if (e.touches) e = e.touches[0];
        if (e.ctrlKey || e.metaKey) this.setValue(this.defvalue, true);else {
          this.startPosX = e.pageX;
          this.startPosY = e.pageY;
          this.startVal = this.value;
          window.addEventListener('mousemove', pointermove);
          window.addEventListener('touchmove', pointermove, {
            passive: false
          });
        }
        window.addEventListener('mouseup', pointerup);
        window.addEventListener('touchend', pointerup);
        window.addEventListener('touchcancel', pointerup);
        document.body.addEventListener('touchstart', preventScroll, {
          passive: false
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  } catch (error) {
    //console.log("webaudio-slider already defined");
  }
  try {
    customElements.define("webaudio-switch", class WebAudioSwitch extends WebAudioControlsWidget {
      constructor() {
        super();
      }
      connectedCallback() {
        var root;
        //      if(this.attachShadow)
        //        root=this.attachShadow({mode: 'open'});
        //      else
        root = this;
        root.innerHTML = "<style>\n".concat(this.basestyle, "\nwebaudio-switch{\n  display:inline-block;\n  margin:0;\n  padding:0;\n  font-family: sans-serif;\n  font-size: 11px;\n  cursor:pointer;\n}\n.webaudio-switch-body{\n  display:inline-block;\n  margin:0;\n  padding:0;\n}\n</style>\n<div class='webaudio-switch-body' tabindex='1' touch-action='none'><div class='webaudioctrl-tooltip'></div></div>\n");
        this.elem = root.childNodes[2];
        this.ttframe = this.elem.childNodes[0];
        this.enable = this.getAttr("enable", 1);
        this._src = this.getAttr("src", null);
        if (!this.hasOwnProperty("src")) Object.defineProperty(this, "src", {
          get: () => {
            return this._src;
          },
          set: v => {
            this._src = v;
            this.setupImage();
          }
        });
        this._value = this.getAttr("value", 0);
        if (!this.hasOwnProperty("value")) Object.defineProperty(this, "value", {
          get: () => {
            return this._value;
          },
          set: v => {
            this._value = v;
            this.redraw();
          }
        });
        this.defvalue = this.getAttr("defvalue", 0);
        this.type = this.getAttr("type", "toggle");
        this.group = this.getAttr("group", "");
        this._width = this.getAttr("width", 0);
        if (!this.hasOwnProperty("width")) Object.defineProperty(this, "width", {
          get: () => {
            return this._width;
          },
          set: v => {
            this._width = v;
            this.setupImage();
          }
        });
        this._height = this.getAttr("height", 0);
        if (!this.hasOwnProperty("height")) Object.defineProperty(this, "height", {
          get: () => {
            return this._height;
          },
          set: v => {
            this._height = v;
            this.setupImage();
          }
        });
        this._diameter = this.getAttr("diameter", 0);
        if (!this.hasOwnProperty("diameter")) Object.defineProperty(this, "diameter", {
          get: () => {
            return this._diameter;
          },
          set: v => {
            this._diameter = v;
            this.setupImage();
          }
        });
        this.invert = this.getAttr("invert", 0);
        this._colors = this.getAttr("colors", opt.switchColors);
        if (!this.hasOwnProperty("colors")) Object.defineProperty(this, "colors", {
          get: () => {
            return this._colors;
          },
          set: v => {
            this._colors = v;
            this.setupImage();
          }
        });
        this.outline = this.getAttr("outline", opt.outline);
        this.valuetip = 0;
        this.tooltip = this.getAttr("tooltip", null);
        this.midilearn = this.getAttr("midilearn", opt.midilearn);
        this.midicc = this.getAttr("midicc", null);
        this.midiController = {};
        this.midiMode = "normal";
        if (this.midicc) {
          var ch = parseInt(this.midicc.substring(0, this.midicc.lastIndexOf("."))) - 1;
          var cc = parseInt(this.midicc.substring(this.midicc.lastIndexOf(".") + 1));
          this.setMidiController(ch, cc);
        }
        this.setupImage();
        this.digits = 0;
        if (window.webAudioControlsMidiManager)
          //        window.webAudioControlsMidiManager.updateWidgets();
          window.webAudioControlsMidiManager.addWidget(this);
        this.elem.onclick = e => {
          e.stopPropagation();
        };
      }
      disconnectedCallback() {}
      setupImage() {
        var w = this.width || this.diameter || opt.switchWidth || opt.switchDiameter;
        var h = this.height || this.diameter || opt.switchHeight || opt.switchDiameter;
        if (!this.src) {
          this.coltab = this.colors.split(";");
          var mm = Math.min(w, h);
          var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(w, "\" height=\"").concat(h * 2, "\" preserveAspectRatio=\"none\">\n<radialGradient id=\"gr\" cx=\"30%\" cy=\"30%\"><stop offset=\"0%\" stop-color=\"").concat(this.coltab[2], "\"/><stop offset=\"100%\" stop-color=\"").concat(this.coltab[0], "\"/></radialGradient>\n<rect x=\"").concat(w * 0.05, "\" y=\"").concat(h * 0.05, "\" width=\"").concat(w * 0.9, "\" height=\"").concat(h * 0.9, "\" rx=\"").concat(mm * 0.1, "\" ry=\"").concat(mm * 0.1, "\" fill=\"").concat(this.coltab[1], "\"/>\n<rect x=\"").concat(w * 0.05, "\" y=\"").concat(h * 1.05, "\" width=\"").concat(w * 0.9, "\" height=\"").concat(h * 0.9, "\" rx=\"").concat(mm * 0.1, "\" ry=\"").concat(mm * 0.1, "\" fill=\"").concat(this.coltab[1], "\"/>\n<circle cx=\"").concat(w * 0.5, "\" cy=\"").concat(h * 0.5, "\" r=\"").concat(mm * 0.3, "\" stroke=\"").concat(this.coltab[0], "\" stroke-width=\"2\"/>\n<circle cx=\"").concat(w * 0.5, "\" cy=\"").concat(h * 1.5, "\" r=\"").concat(mm * 0.3, "\" stroke=\"").concat(this.coltab[0], "\" stroke-width=\"2\" fill=\"url(#gr)\"/></svg>");
          this.elem.style.backgroundImage = "url(data:image/svg+xml;base64," + btoa(svg) + ")";
          this.elem.style.backgroundSize = "100% 200%";
        } else {
          this.elem.style.backgroundImage = "url(" + this.src + ")";
          if (!this.sprites) this.elem.style.backgroundSize = "100% 200%";else this.elem.style.backgroundSize = "100% ".concat((this.sprites + 1) * 100, "%");
        }
        this.elem.style.width = w + "px";
        this.elem.style.height = h + "px";
        this.elem.style.outline = this.outline ? "" : "none";
        this.redraw();
      }
      redraw() {
        var style = this.elem.style;
        if (this.value ^ this.invert) style.backgroundPosition = "0px -100%";else style.backgroundPosition = "0px 0px";
      }
      setValue(v, f) {
        console.log(v, f);
        this.value = v;
        this.checked = !!v;
        if (this.value != this.oldvalue) {
          this.redraw();
          this.showtip(0);
          if (f) {
            this.sendEvent("input");
            this.sendEvent("change");
          }
          this.oldvalue = this.value;
        }
      }
      pointerdown(ev) {
        if (!this.enable) return;
        var e = ev;
        if (ev.touches) {
          e = ev.changedTouches[0];
          this.identifier = e.identifier;
        } else {
          if (e.buttons != 1 && e.button != 0) return;
        }
        this.elem.focus();
        this.drag = 1;
        this.showtip(0);
        var pointermove = e => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        };
        var pointerup = e => {
          this.drag = 0;
          this.showtip(0);
          window.removeEventListener('mousemove', pointermove);
          window.removeEventListener('touchmove', pointermove, {
            passive: false
          });
          window.removeEventListener('mouseup', pointerup);
          window.removeEventListener('touchend', pointerup);
          window.removeEventListener('touchcancel', pointerup);
          document.body.removeEventListener('touchstart', preventScroll, {
            passive: false
          });
          if (this.type == "kick") {
            this.value = 0;
            this.checked = false;
            this.redraw();
            this.sendEvent("change");
          }
          this.sendEvent("click");
          e.preventDefault();
          e.stopPropagation();
        };
        var preventScroll = e => {
          e.preventDefault();
        };
        switch (this.type) {
          case "kick":
            this.setValue(1);
            this.sendEvent("change");
            break;
          case "toggle":
            if (e.ctrlKey || e.metaKey) this.value = defvalue;else this.value = 1 - this.value;
            this.checked = !!this.value;
            this.sendEvent("change");
            break;
          case "radio":
            var els = document.querySelectorAll("webaudio-switch[type='radio'][group='" + this.group + "']");
            for (var i = 0; i < els.length; ++i) {
              if (els[i] == this) els[i].setValue(1);else els[i].setValue(0);
            }
            this.sendEvent("change");
            break;
        }
        window.addEventListener('mouseup', pointerup);
        window.addEventListener('touchend', pointerup);
        window.addEventListener('touchcancel', pointerup);
        document.body.addEventListener('touchstart', preventScroll, {
          passive: false
        });
        this.redraw();
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  } catch (error) {
    //console.log("webaudio-switch already defined");
  }
  try {
    customElements.define("webaudio-param", class WebAudioParam extends WebAudioControlsWidget {
      constructor() {
        super();
        this.addEventListener("keydown", this.keydown);
        this.addEventListener("mousedown", this.pointerdown, {
          passive: false
        });
        this.addEventListener("touchstart", this.pointerdown, {
          passive: false
        });
        this.addEventListener("wheel", this.wheel);
        this.addEventListener("mouseover", this.pointerover);
        this.addEventListener("mouseout", this.pointerout);
        this.addEventListener("contextmenu", this.contextMenu);
      }
      connectedCallback() {
        var root;
        //      if(this.attachShadow)
        //        root=this.attachShadow({mode: 'open'});
        //      else
        root = this;
        root.innerHTML = "<style>\n".concat(this.basestyle, "\nwebaudio-param{\n  display:inline-block;\n  user-select:none;\n  margin:0;\n  padding:0;\n  font-family: sans-serif;\n  font-size: 8px;\n  cursor:pointer;\n}\n.webaudio-param-body{\n  display:inline-block;\n  text-align:center;\n  vertical-align:middle;\n  position:relative;\n  border:1px solid #888;\n  background:none;\n  border-radius:4px;\n  margin:0;\n  padding:0;\n  font-family:sans-serif;\n  font-size:11px;\n}\n</style>\n<input class='webaudio-param-body' value='0' tabindex='1' touch-action='none'/><div class='webaudioctrl-tooltip'></div>\n");
        this.elem = root.childNodes[2];
        this.ttframe = root.childNodes[3];
        this.enable = this.getAttr("enable", 1);
        this._value = this.getAttr("value", 0);
        if (!this.hasOwnProperty("value")) Object.defineProperty(this, "value", {
          get: () => {
            return this._value;
          },
          set: v => {
            this._value = v;
            this.redraw();
          }
        });
        this.defvalue = this.getAttr("defvalue", 0);
        this._fontsize = this.getAttr("fontsize", 9);
        if (!this.hasOwnProperty("fontsize")) Object.defineProperty(this, "fontsize", {
          get: () => {
            return this._fontsize;
          },
          set: v => {
            this._fontsize = v;
            this.setupImage();
          }
        });
        this._src = this.getAttr("src", null);
        if (!this.hasOwnProperty("src")) Object.defineProperty(this, "src", {
          get: () => {
            return this._src;
          },
          set: v => {
            this._src = v;
            this.setupImage();
          }
        });
        this.link = this.getAttr("link", "");
        this._width = this.getAttr("width", 32);
        if (!this.hasOwnProperty("width")) Object.defineProperty(this, "width", {
          get: () => {
            return this._width;
          },
          set: v => {
            this._width = v;
            this.setupImage();
          }
        });
        this._height = this.getAttr("height", 16);
        if (!this.hasOwnProperty("height")) Object.defineProperty(this, "height", {
          get: () => {
            return this._height;
          },
          set: v => {
            this._height = v;
            this.setupImage();
          }
        });
        this._colors = this.getAttr("colors", "#fff;#000");
        if (!this.hasOwnProperty("colors")) Object.defineProperty(this, "colors", {
          get: () => {
            return this._colors;
          },
          set: v => {
            this._colors = v;
            this.setupImage();
          }
        });
        this.outline = this.getAttr("outline", opt.outline);
        this.midiController = {};
        this.midiMode = "normal";
        if (this.midicc) {
          var ch = parseInt(this.midicc.substring(0, this.midicc.lastIndexOf("."))) - 1;
          var cc = parseInt(this.midicc.substring(this.midicc.lastIndexOf(".") + 1));
          this.setMidiController(ch, cc);
        }
        this.setupImage();
        if (window.webAudioControlsMidiManager)
          //        window.webAudioControlsMidiManager.updateWidgets();
          window.webAudioControlsMidiManager.addWidget(this);
        this.fromLink = (e => {
          this.setValue(e.target.convValue.toFixed(e.target.digits));
        }).bind(this);
        this.elem.onchange = () => {
          var le = document.getElementById(this.link);
          if (le) le.setValue(+this.elem.value);
        };
      }
      disconnectedCallback() {}
      setupImage() {
        this.coltab = this.colors.split(";");
        this.elem.style.color = this.coltab[0];
        if (!this.src) {
          this.elem.style.backgroundColor = this.coltab[1];
        } else {
          this.elem.style.backgroundImage = "url(" + this.src + ")";
          this.elem.style.backgroundSize = "100% 100%";
        }
        this.elem.style.width = this.width + "px";
        this.elem.style.height = this.height + "px";
        this.elem.style.fontSize = this.fontsize + "px";
        this.elem.style.outline = this.outline ? "" : "none";
        var l = document.getElementById(this.link);
        if (l) {
          this.setValue(l.value.toFixed(l.digits));
          l.addEventListener("input", e => {
            this.setValue(l.value.toFixed(l.digits));
          });
        }
        this.redraw();
      }
      redraw() {
        this.elem.value = this.value;
      }
      setValue(v, f) {
        this.value = v;
        if (this.value != this.oldvalue) {
          this.redraw();
          this.showtip(0);
          if (f) {
            var event = document.createEvent("HTMLEvents");
            event.initEvent("change", false, true);
            this.dispatchEvent(event);
          }
          this.oldvalue = this.value;
        }
      }
      pointerdown(ev) {
        if (!this.enable) return;
        var e = ev;
        if (ev.touches) e = ev.touches[0];else {
          if (e.buttons != 1 && e.button != 0) return;
        }
        this.elem.focus();
        this.drag = 1;
        this.showtip(0);
        var pointermove = e => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        };
        var pointerup = e => {
          this.drag = 0;
          this.showtip(0);
          window.removeEventListener('mouseup', pointerup);
          window.removeEventListener('touchend', pointerup);
          window.removeEventListener('touchcancel', pointerup);
          document.body.removeEventListener('touchstart', preventScroll, {
            passive: false
          });
        };
        var preventScroll = e => {
          e.preventDefault();
        };
        window.addEventListener('mouseup', pointerup);
        window.addEventListener('touchend', pointerup);
        window.addEventListener('touchcancel', pointerup);
        document.body.addEventListener('touchstart', preventScroll, {
          passive: false
        });
        this.redraw();
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        return false;
      }
    });
  } catch (error) {
    //console.log("webaudio-param already defined");
  }
  try {
    customElements.define("webaudio-keyboard", class WebAudioKeyboard extends WebAudioControlsWidget {
      constructor() {
        super();
      }
      connectedCallback() {
        var root;
        //      if(this.attachShadow)
        //        root=this.attachShadow({mode: 'open'});
        //      else
        root = this;
        root.innerHTML = "<style>\n".concat(this.basestyle, "\nwebaudio-keyboard{\n  display:inline-block;\n  position:relative;\n  margin:0;\n  padding:0;\n  font-family: sans-serif;\n  font-size: 11px;\n}\n.webaudio-keyboard-body{\n  display:inline-block;\n  margin:0;\n  padding:0;\n}\n</style>\n<canvas class='webaudio-keyboard-body' tabindex='1' touch-action='none'></canvas><div class='webauioctrl-tooltip'></div>\n");
        this.cv = root.childNodes[2];
        this.ttframe = root.childNodes[3];
        this.ctx = this.cv.getContext("2d");
        this._values = [];
        this.enable = this.getAttr("enable", 1);
        this._width = this.getAttr("width", 480);
        if (!this.hasOwnProperty("width")) Object.defineProperty(this, "width", {
          get: () => {
            return this._width;
          },
          set: v => {
            this._width = v;
            this.setupImage();
          }
        });
        this._height = this.getAttr("height", 128);
        if (!this.hasOwnProperty("height")) Object.defineProperty(this, "height", {
          get: () => {
            return this._height;
          },
          set: v => {
            this._height = v;
            this.setupImage();
          }
        });
        this._min = this.getAttr("min", 0);
        if (!this.hasOwnProperty("min")) Object.defineProperty(this, "min", {
          get: () => {
            return this._min;
          },
          set: v => {
            this._min = +v;
            this.redraw();
          }
        });
        this._keys = this.getAttr("keys", 25);
        if (!this.hasOwnProperty("keys")) Object.defineProperty(this, "keys", {
          get: () => {
            return this._keys;
          },
          set: v => {
            this._keys = +v;
            this.setupImage();
          }
        });
        this._colors = this.getAttr("colors", "#222;#eee;#ccc;#333;#000;#e88;#c44;#c33;#800");
        if (!this.hasOwnProperty("colors")) Object.defineProperty(this, "colors", {
          get: () => {
            return this._colors;
          },
          set: v => {
            this._colors = v;
            this.setupImage();
          }
        });
        this.outline = this.getAttr("outline", opt.outline);
        this.midilearn = this.getAttr("midilearn", 0);
        this.midicc = this.getAttr("midicc", null);
        this.press = 0;
        this.keycodes1 = [90, 83, 88, 68, 67, 86, 71, 66, 72, 78, 74, 77, 188, 76, 190, 187, 191, 226];
        this.keycodes2 = [81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85, 73, 57, 79, 48, 80, 192, 222, 219];
        this.addEventListener("keyup", this.keyup);
        this.midiController = {};
        this.midiMode = "normal";
        if (this.midicc) {
          var ch = parseInt(this.midicc.substring(0, this.midicc.lastIndexOf("."))) - 1;
          var cc = parseInt(this.midicc.substring(this.midicc.lastIndexOf(".") + 1));
          this.setMidiController(ch, cc);
        }
        this.setupImage();
        this.digits = 0;
        this.addEventListener("mousemove", this.pointermove);
        this.addEventListener("touchmove", this.pointermove, {
          passive: false
        });
        this.addEventListener("mouseup", this.pointerup);
        this.addEventListener("touchend", this.pointerup);
        this.addEventListener("touchcancel", this.pointerup);
        if (window.webAudioControlsMidiManager)
          //        window.webAudioControlsMidiManager.updateWidgets();
          window.webAudioControlsMidiManager.addWidget(this);
      }
      disconnectedCallback() {}
      setupImage() {
        this.cv.style.width = this.width + "px";
        this.cv.style.height = this.height + "px";
        this.bheight = this.height * 0.55;
        this.kp = [0, 7 / 12, 1, 3 * 7 / 12, 2, 3, 6 * 7 / 12, 4, 8 * 7 / 12, 5, 10 * 7 / 12, 6];
        this.kf = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
        this.ko = [0, 0, 7 * 2 / 12 - 1, 0, 7 * 4 / 12 - 2, 7 * 5 / 12 - 3, 0, 7 * 7 / 12 - 4, 0, 7 * 9 / 12 - 5, 0, 7 * 11 / 12 - 6];
        this.kn = [0, 2, 4, 5, 7, 9, 11];
        this.coltab = this.colors.split(";");
        this.cv.width = this.width;
        this.cv.height = this.height;
        this.cv.style.width = this.width + 'px';
        this.cv.style.height = this.height + 'px';
        this.cv.style.outline = this.outline ? "" : "none";
        this.bheight = this.height * 0.55;
        this.max = this.min + this.keys - 1;
        this.dispvalues = [];
        this.valuesold = [];
        if (this.kf[this.min % 12]) --this.min;
        if (this.kf[this.max % 12]) ++this.max;
        this.redraw();
      }
      redraw() {
        function rrect(ctx, x, y, w, h, r, c1, c2) {
          if (c2) {
            var g = ctx.createLinearGradient(x, y, x + w, y);
            g.addColorStop(0, c1);
            g.addColorStop(1, c2);
            ctx.fillStyle = g;
          } else ctx.fillStyle = c1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y);
          ctx.fill();
        }
        this.ctx.fillStyle = this.coltab[0];
        this.ctx.fillRect(0, 0, this.width, this.height);
        var x0 = 7 * (this.min / 12 | 0) + this.kp[this.min % 12];
        var x1 = 7 * (this.max / 12 | 0) + this.kp[this.max % 12];
        var n = x1 - x0;
        this.wwidth = (this.width - 1) / (n + 1);
        this.bwidth = this.wwidth * 7 / 12;
        var h2 = this.bheight;
        var r = Math.min(8, this.wwidth * 0.2);
        for (var i = this.min, j = 0; i <= this.max; ++i) {
          if (this.kf[i % 12] == 0) {
            var x = this.wwidth * j++ + 1;
            if (this.dispvalues.indexOf(i) >= 0) rrect(this.ctx, x, 1, this.wwidth - 1, this.height - 2, r, this.coltab[5], this.coltab[6]);else rrect(this.ctx, x, 1, this.wwidth - 1, this.height - 2, r, this.coltab[1], this.coltab[2]);
          }
        }
        r = Math.min(8, this.bwidth * 0.3);
        for (var _i = this.min; _i < this.max; ++_i) {
          if (this.kf[_i % 12]) {
            var _x = this.wwidth * this.ko[this.min % 12] + this.bwidth * (_i - this.min) + 1;
            if (this.dispvalues.indexOf(_i) >= 0) rrect(this.ctx, _x, 1, this.bwidth, h2, r, this.coltab[7], this.coltab[8]);else rrect(this.ctx, _x, 1, this.bwidth, h2, r, this.coltab[3], this.coltab[4]);
            this.ctx.strokeStyle = this.coltab[0];
            this.ctx.stroke();
          }
        }
      }
      _setValue(v) {
        if (this.step) v = Math.round((v - this.min) / this.step) * this.step + this.min;
        this._value = Math.min(this.max, Math.max(this.min, v));
        if (this._value != this.oldvalue) {
          this.oldvalue = this._value;
          this.redraw();
          this.showtip(0);
          return 1;
        }
        return 0;
      }
      setValue(v, f) {
        if (this._setValue(v) && f) this.sendEvent("input"), this.sendEvent("change");
      }
      wheel(e) {}
      keydown(e) {
        var m = Math.floor((this.min + 11) / 12) * 12;
        var k = this.keycodes1.indexOf(e.keyCode);
        if (k < 0) {
          k = this.keycodes2.indexOf(e.keyCode);
          if (k >= 0) k += 12;
        }
        if (k >= 0) {
          k += m;
          if (this.currentKey != k) {
            this.currentKey = k;
            this.sendEventFromKey(1, k);
            this.setNote(1, k);
          }
        }
      }
      keyup(e) {
        var m = Math.floor((this.min + 11) / 12) * 12;
        var k = this.keycodes1.indexOf(e.keyCode);
        if (k < 0) {
          k = this.keycodes2.indexOf(e.keyCode);
          if (k >= 0) k += 12;
        }
        if (k >= 0) {
          k += m;
          this.currentKey = -1;
          this.sendEventFromKey(0, k);
          this.setNote(0, k);
        }
      }
      pointerdown(e) {
        this.cv.focus();
        //      document.body.addEventListener('touchstart',this.preventScroll,{passive:false});
        if (this.enable) {
          ++this.press;
          this.pointermove(e);
        }
        e.preventDefault();
      }
      pointermove(e) {
        if (!this.enable) return;
        var r = this.getBoundingClientRect();
        var v = [],
          p;
        if (e.touches) p = e.targetTouches;else if (this.press) p = [e];else p = [];
        if (p.length > 0) this.drag = 1;
        for (var i = 0; i < p.length; ++i) {
          var px = p[i].clientX - r.left;
          var py = p[i].clientY - r.top;
          var x = void 0,
            k = void 0,
            ko = void 0;
          if (py < this.bheight) {
            x = px - this.wwidth * this.ko[this.min % 12];
            k = this.min + (x / this.bwidth | 0);
          } else {
            k = px / this.wwidth | 0;
            ko = this.kp[this.min % 12];
            k += ko;
            k = this.min + (k / 7 | 0) * 12 + this.kn[k % 7] - this.kn[ko % 7];
          }
          if (k >= this.min && k <= this.max) v.push(k);
        }
        v.sort();
        this.values = v;
        this.sendevent();
        this.redraw();
      }
      pointerup(e) {
        if (this.enable) {
          --this.press;
          this.pointermove(e);
          this.sendevent();
          this.redraw();
        }
        this.drag = 0;
        e.preventDefault();
      }
      sendEventFromKey(s, k) {
        var ev = document.createEvent('HTMLEvents');
        ev.initEvent('change', true, true);
        ev.note = [s, k];
        this.dispatchEvent(ev);
      }
      sendevent() {
        var notes = [];
        for (var i = 0, j = this.valuesold.length; i < j; ++i) {
          if (this.values.indexOf(this.valuesold[i]) < 0) notes.push([0, this.valuesold[i]]);
        }
        for (var _i2 = 0, _j = this.values.length; _i2 < _j; ++_i2) {
          if (this.valuesold.indexOf(this.values[_i2]) < 0) notes.push([1, this.values[_i2]]);
        }
        if (notes.length) {
          this.valuesold = this.values;
          for (var _i3 = 0; _i3 < notes.length; ++_i3) {
            this.setdispvalues(notes[_i3][0], notes[_i3][1]);
            var ev = document.createEvent('HTMLEvents');
            ev.initEvent('change', true, true);
            ev.note = notes[_i3];
            this.dispatchEvent(ev);
          }
        }
      }
      setdispvalues(state, note) {
        var n = this.dispvalues.indexOf(note);
        if (state) {
          if (n < 0) this.dispvalues.push(note);
        } else {
          if (n >= 0) this.dispvalues.splice(n, 1);
        }
      }
      setNote(state, note) {
        this.setdispvalues(state, note);
        this.redraw();
      }
    });
  } catch (error) {
    //console.log("webaudio-keyboard already defined");
  }

  // FOR MIDI LEARN
  class WebAudioControlsMidiManager {
    constructor() {
      this.midiAccess = null;
      this.listOfWidgets = [];
      this.listOfExternalMidiListeners = [];
      this.updateWidgets();
      this.initWebAudioControls();
    }
    addWidget(w) {
      this.listOfWidgets.push(w);
    }
    updateWidgets() {
      //      this.listOfWidgets = document.querySelectorAll("webaudio-knob,webaudio-slider,webaudio-switch");
    }
    initWebAudioControls() {
      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(ma => {
          this.midiAccess = ma, this.enableInputs();
        }, err => {
          console.log("MIDI not initialized - error encountered:" + err.code);
        });
      }
    }
    enableInputs() {
      var inputs = this.midiAccess.inputs.values();
      //console.log("Found " + this.midiAccess.inputs.size + " MIDI input(s)");
      for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        //console.log("Connected input: " + input.value.name);
        input.value.onmidimessage = this.handleMIDIMessage.bind(this);
      }
    }
    midiConnectionStateChange(e) {
      // console.log("connection: " + e.port.name + " " + e.port.connection + " " + e.port.state);
      enableInputs();
    }
    onMIDIStarted(midi) {
      this.midiAccess = midi;
      midi.onstatechange = this.midiConnectionStateChange;
      enableInputs(midi);
    }
    // Add hooks for external midi listeners support
    addMidiListener(callback) {
      this.listOfExternalMidiListeners.push(callback);
    }
    getCurrentConfigAsJSON() {
      return currentConfig.stringify();
    }
    handleMIDIMessage(event) {
      this.listOfExternalMidiListeners.forEach(function (externalListener) {
        externalListener(event);
      });
      if ((event.data[0] & 0xf0) == 0xf0 || (event.data[0] & 0xf0) == 0xb0 && event.data[1] >= 120) return;
      for (var w of this.listOfWidgets) {
        if (w.processMidiEvent) w.processMidiEvent(event);
      }
      if (opt.mididump) console.log(event.data);
    }
    contextMenuOpen(e, knob) {
      if (!this.midiAccess) return;
      var menu = document.getElementById("webaudioctrl-context-menu");
      menu.style.left = e.pageX + "px";
      menu.style.top = e.pageY + "px";
      menu.knob = knob;
      menu.classList.add("active");
      menu.knob.focus();
      //      document.activeElement.onblur=this.contextMenuClose;
      menu.knob.addEventListener("keydown", this.contextMenuCloseByKey.bind(this));
    }
    contextMenuCloseByKey(e) {
      if (e.keyCode == 27) this.contextMenuClose();
    }
    contextMenuClose() {
      var menu = document.getElementById("webaudioctrl-context-menu");
      menu.knob.removeEventListener("keydown", this.contextMenuCloseByKey);
      menu.classList.remove("active");
      var menuItemLearn = document.getElementById("webaudioctrl-context-menu-learn");
      menuItemLearn.innerHTML = 'Learn';
      menu.knob.midiMode = 'normal';
    }
    contextMenuLearn() {
      var menu = document.getElementById("webaudioctrl-context-menu");
      var menuItemLearn = document.getElementById("webaudioctrl-context-menu-learn");
      menuItemLearn.innerHTML = 'Listening...';
      menu.knob.midiMode = 'learn';
    }
    contextMenuClear(e) {
      var menu = document.getElementById("webaudioctrl-context-menu");
      menu.knob.midiController = {};
      this.contextMenuClose();
    }
  }
  if (window.UseWebAudioControlsMidi || opt.useMidi) window.webAudioControlsMidiManager = new WebAudioControlsMidiManager();
}
var getBaseURL = () => {
  var base = new URL('.', import.meta.url);
  return "".concat(base);
};
class lowCutGui extends HTMLElement {
  constructor(plug) {
    super();
    _defineProperty(this, "handleAnimationFrame", () => {
      this._root.getElementById('/low-freq_shelving_cut/attenuation').value = this._plug.audioNode.getParamValue('/low-freq_shelving_cut/attenuation');
      this._root.getElementById('/low-freq_shelving_cut/freq').value = this._plug.audioNode.getParamValue('/low-freq_shelving_cut/freq');
      window.requestAnimationFrame(this.handleAnimationFrame);
    });
    this._plug = plug;
    this._plug.gui = this;
    console.log(this._plug);
    this._root = this.attachShadow({
      mode: 'open'
    });
    this._root.innerHTML = "<style>.my-pedal {align-content:normal;align-items:normal;align-self:auto;aspect-ratio:auto;backface-visibility:visible;border-collapse:separate;border-image-repeat:stretch;box-decoration-break:slice;box-sizing:border-box;break-inside:auto;caption-side:top;clear:none;color-interpolation:srgb;color-interpolation-filters:linearrgb;column-count:auto;column-fill:balance;column-span:none;contain:none;direction:ltr;display:block;dominant-baseline:auto;empty-cells:show;flex-direction:row;flex-wrap:nowrap;float:none;font-kerning:auto;font-optical-sizing:auto;font-size-adjust:none;font-stretch:100%;font-style:normal;font-synthesis:weight style small-caps;font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;font-weight:400;grid-auto-flow:row;hyphens:manual;image-orientation:from-image;image-rendering:auto;ime-mode:auto;isolation:auto;justify-content:normal;justify-items:normal;justify-self:auto;line-break:auto;list-style-position:outside;mask-type:luminance;mix-blend-mode:normal;-moz-box-align:stretch;-moz-box-direction:normal;-moz-box-orient:horizontal;-moz-box-pack:start;-moz-float-edge:content-box;-moz-force-broken-image-icon:0;-moz-orient:inline;-moz-osx-font-smoothing:auto;-moz-text-size-adjust:auto;-moz-user-focus:none;-moz-user-input:auto;-moz-user-modify:read-only;-moz-window-dragging:default;object-fit:fill;offset-rotate:auto;outline-style:none;overflow-anchor:auto;overflow-wrap:normal;paint-order:normal;pointer-events:auto;position:unset;print-color-adjust:economy;resize:none;ruby-align:space-around;ruby-position:alternate;scroll-behavior:auto;scroll-snap-align:none;scroll-snap-stop:normal;scroll-snap-type:none;scrollbar-gutter:auto;scrollbar-width:auto;shape-rendering:auto;stroke-linecap:butt;stroke-linejoin:miter;table-layout:auto;text-align:center;text-align-last:auto;text-anchor:start;text-combine-upright:none;text-decoration-line:none;text-decoration-skip-ink:auto;text-decoration-style:solid;text-emphasis-position:over right;text-justify:auto;text-orientation:mixed;text-rendering:auto;text-transform:none;text-underline-position:auto;touch-action:none;transform-box:border-box;transform-style:flat;unicode-bidi:isolate;user-select:auto;vector-effect:none;visibility:visible;-webkit-line-clamp:none;white-space:normal;word-break:normal;writing-mode:horizontal-tb;z-index:auto;appearance:none;break-after:auto;break-before:auto;clip-rule:nonzero;fill-rule:nonzero;fill-opacity:1;stroke-opacity:1;-moz-box-ordinal-group:1;order:0;flex-grow:0;flex-shrink:1;-moz-box-flex:0;stroke-miterlimit:4;overflow-block:visible;overflow-inline:visible;overflow-x:visible;overflow-y:visible;overscroll-behavior-block:auto;overscroll-behavior-inline:auto;overscroll-behavior-x:auto;overscroll-behavior-y:auto;flood-opacity:1;opacity:1;shape-image-threshold:0;stop-opacity:1;border-block-end-style:solid;border-block-start-style:solid;border-bottom-style:solid;border-inline-end-style:solid;border-inline-start-style:solid;border-left-style:solid;border-right-style:solid;border-top-style:solid;column-rule-style:none;accent-color:auto;animation-delay:0s;animation-direction:normal;animation-duration:0s;animation-fill-mode:none;animation-iteration-count:1;animation-name:none;animation-play-state:running;animation-timing-function:ease;backdrop-filter:none;background-attachment:scroll;background-blend-mode:normal;background-clip:border-box;background-image:none;background-origin:padding-box;background-position-x:0%;background-position-y:0%;background-repeat:repeat;background-size:contain;border-image-outset:0;border-image-slice:100%;border-image-width:1;border-spacing:0px 0px;box-shadow:rgba(0, 0, 0, 0.7) 4px 5px 6px 0px, rgba(0, 0, 0, 0.2) -2px -2px 5px 0px inset, rgba(255, 255, 255, 0.2) 3px 1px 1px 4px inset, rgba(0, 0, 0, 0.9) 1px 0px 1px 0px, rgba(0, 0, 0, 0.9) 0px 2px 1px 0px, rgba(0, 0, 0, 0.9) 1px 1px 1px 0px;caret-color:rgb(33, 37, 41);clip-path:none;color:rgb(33, 37, 41);color-scheme:normal;column-width:auto;content:normal;counter-increment:none;counter-reset:none;counter-set:none;cursor:auto;d:none;filter:none;flex-basis:auto;font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";font-feature-settings:normal;font-language-override:normal;font-size:16px;font-variant-alternates:normal;font-variation-settings:normal;grid-template-areas:none;hyphenate-character:auto;letter-spacing:normal;line-height:24px;list-style-type:disc;mask-clip:border-box;mask-composite:add;mask-image:none;mask-mode:match-source;mask-origin:border-box;mask-position-x:0%;mask-position-y:0%;mask-repeat:repeat;mask-size:auto;offset-anchor:auto;offset-path:none;perspective:none;quotes:auto;rotate:none;scale:none;scrollbar-color:auto;shape-outside:none;stroke-dasharray:none;stroke-dashoffset:0px;stroke-width:1px;tab-size:8;text-decoration-thickness:auto;text-emphasis-style:none;text-overflow:clip;text-shadow:none;transition-delay:0s;transition-duration:0s;transition-property:all;transition-timing-function:ease;translate:none;vertical-align:baseline;will-change:auto;word-spacing:0px;clip:auto;-moz-image-region:auto;object-position:50% 50%;perspective-origin:43px 123.25px;fill:rgb(0, 0, 0);stroke:none;transform-origin:43px 123.25px;grid-template-columns:none;grid-template-rows:none;border-image-source:none;list-style-image:none;grid-auto-columns:auto;grid-auto-rows:auto;transform:none;column-gap:normal;row-gap:normal;marker-end:none;marker-mid:none;marker-start:none;grid-column-end:auto;grid-column-start:auto;grid-row-end:auto;grid-row-start:auto;max-block-size:none;max-height:none;max-inline-size:none;max-width:none;cx:0px;cy:0px;offset-distance:0px;text-indent:0px;x:0px;y:0px;border-bottom-left-radius:15px;border-bottom-right-radius:15px;border-end-end-radius:15px;border-end-start-radius:15px;border-start-end-radius:15px;border-start-start-radius:15px;border-top-left-radius:15px;border-top-right-radius:15px;block-size:246.5px;height:246.5px;inline-size:86px;min-block-size:0px;min-height:0px;min-inline-size:0px;min-width:0px;width:86px;padding-block-end:1px;padding-block-start:1px;padding-bottom:1px;padding-inline-end:1px;padding-inline-start:1px;padding-left:1px;padding-right:1px;padding-top:1px;r:0px;shape-margin:0px;rx:auto;ry:auto;scroll-padding-block-end:auto;scroll-padding-block-start:auto;scroll-padding-bottom:auto;scroll-padding-inline-end:auto;scroll-padding-inline-start:auto;scroll-padding-left:auto;scroll-padding-right:auto;scroll-padding-top:auto;border-block-end-width:1px;border-block-start-width:1px;border-bottom-width:1px;border-inline-end-width:1px;border-inline-start-width:1px;border-left-width:1px;border-right-width:1px;border-top-width:1px;column-rule-width:0px;outline-width:0px;-webkit-text-stroke-width:0px;outline-offset:0px;overflow-clip-margin:0px;scroll-margin-block-end:0px;scroll-margin-block-start:0px;scroll-margin-bottom:0px;scroll-margin-inline-end:0px;scroll-margin-inline-start:0px;scroll-margin-left:0px;scroll-margin-right:0px;scroll-margin-top:0px;bottom:124.217px;inset-block-end:124.217px;inset-block-start:58.2833px;inset-inline-end:925px;inset-inline-start:212px;left:212px;margin-block-end:2px;margin-block-start:2px;margin-bottom:2px;margin-inline-end:2px;margin-inline-start:2px;margin-left:2px;margin-right:2px;margin-top:2px;right:925px;text-underline-offset:auto;top:58.2833px;background-color:rgb(128, 128, 128);border-block-end-color:rgb(73, 73, 73);border-block-start-color:rgb(73, 73, 73);border-bottom-color:rgb(73, 73, 73);border-inline-end-color:rgb(73, 73, 73);border-inline-start-color:rgb(73, 73, 73);border-left-color:rgb(73, 73, 73);border-right-color:rgb(73, 73, 73);border-top-color:rgb(73, 73, 73);column-rule-color:rgb(33, 37, 41);flood-color:rgb(0, 0, 0);lighting-color:rgb(255, 255, 255);outline-color:rgb(33, 37, 41);stop-color:rgb(0, 0, 0);text-decoration-color:rgb(33, 37, 41);text-emphasis-color:rgb(33, 37, 41);-webkit-text-fill-color:rgb(33, 37, 41);-webkit-text-stroke-color:rgb(33, 37, 41);background:rgb(128, 128, 128) 0% 0% / contain;background-position:0% 0%;border-color:rgb(73, 73, 73);border-style:solid;border-width:1px;border-top:1px solid rgb(73, 73, 73);border-right:1px solid rgb(73, 73, 73);border-bottom:1px solid rgb(73, 73, 73);border-left:1px solid rgb(73, 73, 73);border-block-start:1px solid rgb(73, 73, 73);border-block-end:1px solid rgb(73, 73, 73);border-inline-start:1px solid rgb(73, 73, 73);border-inline-end:1px solid rgb(73, 73, 73);border:1px solid rgb(73, 73, 73);border-radius:15px;border-image:none 100% / 1 / 0 stretch;border-block-width:1px;border-block-style:solid;border-block-color:rgb(73, 73, 73);border-inline-width:1px;border-inline-style:solid;border-inline-color:rgb(73, 73, 73);border-block:1px solid rgb(73, 73, 73);border-inline:1px solid rgb(73, 73, 73);overflow:visible;overscroll-behavior:auto;page-break-before:auto;page-break-after:auto;page-break-inside:auto;offset:none;columns:auto auto;column-rule:3px none rgb(33, 37, 41);font:400 16px / 1.5 -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";font-variant:normal;marker:none;text-emphasis:none rgb(33, 37, 41);-webkit-text-stroke:0px rgb(33, 37, 41);list-style:outside;margin:2px;margin-block:2px;margin-inline:2px;scroll-margin:0px;scroll-margin-block:0px;scroll-margin-inline:0px;outline:rgb(33, 37, 41) 0px;padding:1px;padding-block:1px;padding-inline:1px;scroll-padding:auto;scroll-padding-block:auto;scroll-padding-inline:auto;flex-flow:row nowrap;flex:0 1 auto;gap:normal;grid-row:auto;grid-column:auto;grid-area:auto;grid-template:none;grid:none;place-content:normal;place-self:auto;place-items:normal legacy;inset:58.2833px auto auto 212px;inset-block:58.2833px auto;inset-inline:212px auto;mask:none;mask-position:0% 0%;text-decoration:rgb(33, 37, 41);transition:all 0s ease 0s;animation:0s ease 0s 1 normal none running none;-webkit-background-clip:border-box;-webkit-background-origin:padding-box;-webkit-background-size:contain;-moz-border-start-color:rgb(73, 73, 73);-moz-border-start-style:solid;-moz-border-start-width:1px;-moz-border-end-color:rgb(73, 73, 73);-moz-border-end-style:solid;-moz-border-end-width:1px;-webkit-border-top-left-radius:15px;-webkit-border-top-right-radius:15px;-webkit-border-bottom-right-radius:15px;-webkit-border-bottom-left-radius:15px;-moz-transform:none;-webkit-transform:none;-moz-perspective:none;-webkit-perspective:none;-moz-perspective-origin:43px 123.25px;-webkit-perspective-origin:43px 123.25px;-moz-backface-visibility:visible;-webkit-backface-visibility:visible;-moz-transform-style:flat;-webkit-transform-style:flat;-moz-transform-origin:43px 123.25px;-webkit-transform-origin:43px 123.25px;-moz-appearance:none;-webkit-appearance:none;-webkit-box-shadow:rgba(0, 0, 0, 0.7) 4px 5px 6px 0px, rgba(0, 0, 0, 0.2) -2px -2px 5px 0px inset, rgba(255, 255, 255, 0.2) 3px 1px 1px 4px inset, rgba(0, 0, 0, 0.9) 1px 0px 1px 0px, rgba(0, 0, 0, 0.9) 0px 2px 1px 0px, rgba(0, 0, 0, 0.9) 1px 1px 1px 0px;-webkit-filter:none;-moz-font-feature-settings:normal;-moz-font-language-override:normal;color-adjust:economy;-moz-hyphens:manual;-webkit-text-size-adjust:auto;word-wrap:normal;-moz-tab-size:8;-moz-margin-start:2px;-moz-margin-end:2px;-moz-padding-start:1px;-moz-padding-end:1px;-webkit-flex-direction:row;-webkit-flex-wrap:nowrap;-webkit-justify-content:normal;-webkit-align-content:normal;-webkit-align-items:normal;-webkit-flex-grow:0;-webkit-flex-shrink:1;-webkit-align-self:auto;-webkit-order:0;-webkit-flex-basis:auto;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;grid-column-gap:normal;grid-row-gap:normal;-webkit-mask-repeat:repeat;-webkit-mask-position-x:0%;-webkit-mask-position-y:0%;-webkit-mask-clip:border-box;-webkit-mask-origin:border-box;-webkit-mask-size:auto;-webkit-mask-composite:add;-webkit-mask-image:none;-moz-user-select:auto;-webkit-user-select:auto;-moz-transition-duration:0s;-webkit-transition-duration:0s;-moz-transition-timing-function:ease;-webkit-transition-timing-function:ease;-moz-transition-property:all;-webkit-transition-property:all;-moz-transition-delay:0s;-webkit-transition-delay:0s;-moz-animation-name:none;-webkit-animation-name:none;-moz-animation-duration:0s;-webkit-animation-duration:0s;-moz-animation-timing-function:ease;-webkit-animation-timing-function:ease;-moz-animation-iteration-count:1;-webkit-animation-iteration-count:1;-moz-animation-direction:normal;-webkit-animation-direction:normal;-moz-animation-play-state:running;-webkit-animation-play-state:running;-moz-animation-fill-mode:none;-webkit-animation-fill-mode:none;-moz-animation-delay:0s;-webkit-animation-delay:0s;-webkit-box-align:stretch;-webkit-box-direction:normal;-webkit-box-flex:0;-webkit-box-orient:horizontal;-webkit-box-pack:start;-webkit-box-ordinal-group:1;-moz-border-start:1px solid rgb(73, 73, 73);-moz-border-end:1px solid rgb(73, 73, 73);-webkit-border-radius:15px;-moz-border-image:none 100% / 1 / 0 stretch;-webkit-border-image:none 100% / 1 / 0 stretch;-webkit-flex-flow:row nowrap;-webkit-flex:0 1 auto;grid-gap:normal;-webkit-mask:none;-webkit-mask-position:0% 0%;-moz-transition:all 0s ease 0s;-webkit-transition:all 0s ease 0s;-moz-animation:0s ease 0s 1 normal none running none;-webkit-animation:0s ease 0s 1 normal none running none;};</style>\n<div id=\"lowCut\" style=\"border: 1px solid rgb(73, 73, 73); text-align: center; display: inline-block; vertical-align: baseline; padding: 1px; margin: 2px; box-sizing: border-box; background-size: contain; box-shadow: rgba(0, 0, 0, 0.7) 4px 5px 6px, rgba(0, 0, 0, 0.2) -2px -2px 5px 0px inset, rgba(255, 255, 255, 0.2) 3px 1px 1px 4px inset, rgba(0, 0, 0, 0.9) 1px 0px 1px 0px, rgba(0, 0, 0, 0.9) 0px 2px 1px 0px, rgba(0, 0, 0, 0.9) 1px 1px 1px 0px; border-radius: 15px; background-color: grey; touch-action: none; width: 86px; position: relative; top: 0px; left: 0px; height: 246.5px;\" class=\"resize-drag my-pedal\"><div style=\"padding: 1px; margin: 1px; text-align: center; display: inline-block; box-sizing: border-box; touch-action: none; position: absolute; top: 81px; left: 1px; width: 87.5333px; height: 79.25px;\" class=\"drag\"><webaudio-knob id=\"/low-freq_shelving_cut/attenuation\" style=\"touch-action: none; display: block;\" src=\"./img/knobs/MiniMoog_Main.png\" sprites=\"100\" min=\"-96\" max=\"10\" step=\"0.1\" width=\"40\" height=\"40\"><style>\n\n.webaudioctrl-tooltip{\n  display:inline-block;\n  position:absolute;\n  margin:0 -1000px;\n  z-index: 999;\n  background:#eee;\n  color:#000;\n  border:1px solid #666;\n  border-radius:4px;\n  padding:5px 10px;\n  text-align:center;\n  left:0; top:0;\n  font-size:11px;\n  opacity:0;\n  visibility:hidden;\n}\n.webaudioctrl-tooltip:before{\n  content: \"\";\n\tposition: absolute;\n\ttop: 100%;\n\tleft: 50%;\n \tmargin-left: -8px;\n\tborder: 8px solid transparent;\n\tborder-top: 8px solid #666;\n}\n.webaudioctrl-tooltip:after{\n  content: \"\";\n\tposition: absolute;\n\ttop: 100%;\n\tleft: 50%;\n \tmargin-left: -6px;\n\tborder: 6px solid transparent;\n\tborder-top: 6px solid #eee;\n}\n\nwebaudio-knob{\n  display:inline-block;\n  position:relative;\n  margin:0;\n  padding:0;\n  cursor:pointer;\n  font-family: sans-serif;\n  font-size: 11px;\n}\n.webaudio-knob-body{\n  display:inline-block;\n  position:relative;\n  z-index:1;\n  margin:0;\n  padding:0;\n}\n</style>\n<div class=\"webaudio-knob-body\" tabindex=\"1\" touch-action=\"none\" style=\"background-image: url(&quot;./img/knobs/MiniMoog_Main.png&quot;); background-size: 40px 4040px; outline: none; width: 40px; height: 40px; background-position: 0px -3600px; transform: rotate(0deg);\"></div><div class=\"webaudioctrl-tooltip\"></div>\n</webaudio-knob></div><div style=\"padding: 1px; margin: 1px; text-align: center; display: inline-block; box-sizing: border-box; touch-action: none; position: absolute; top: 162.25px; left: 20px; width: 42px; height: 79.25px;\" class=\"drag\"><webaudio-knob id=\"/low-freq_shelving_cut/freq\" style=\"touch-action: none; display: block;\" src=\"./img/knobs/MiniMoog_Main.png\" sprites=\"100\" min=\"20\" max=\"5000\" step=\"1\" width=\"40\" height=\"40\"><style>\n\n.webaudioctrl-tooltip{\n  display:inline-block;\n  position:absolute;\n  margin:0 -1000px;\n  z-index: 999;\n  background:#eee;\n  color:#000;\n  border:1px solid #666;\n  border-radius:4px;\n  padding:5px 10px;\n  text-align:center;\n  left:0; top:0;\n  font-size:11px;\n  opacity:0;\n  visibility:hidden;\n}\n.webaudioctrl-tooltip:before{\n  content: \"\";\n\tposition: absolute;\n\ttop: 100%;\n\tleft: 50%;\n \tmargin-left: -8px;\n\tborder: 8px solid transparent;\n\tborder-top: 8px solid #666;\n}\n.webaudioctrl-tooltip:after{\n  content: \"\";\n\tposition: absolute;\n\ttop: 100%;\n\tleft: 50%;\n \tmargin-left: -6px;\n\tborder: 6px solid transparent;\n\tborder-top: 6px solid #eee;\n}\n\nwebaudio-knob{\n  display:inline-block;\n  position:relative;\n  margin:0;\n  padding:0;\n  cursor:pointer;\n  font-family: sans-serif;\n  font-size: 11px;\n}\n.webaudio-knob-body{\n  display:inline-block;\n  position:relative;\n  z-index:1;\n  margin:0;\n  padding:0;\n}\n</style>\n<div class=\"webaudio-knob-body\" tabindex=\"1\" touch-action=\"none\" style=\"background-image: url(&quot;./img/knobs/MiniMoog_Main.png&quot;); background-size: 40px 4040px; outline: none; width: 40px; height: 40px; background-position: 0px 0px; transform: rotate(0deg);\"></div><div class=\"webaudioctrl-tooltip\"></div>\n</webaudio-knob></div><label for=\"low-freq shelving cut\" style=\"display: block; touch-action: none; position: absolute; z-index: 1; width: 82px; left: 2px; top: 4.28334px; border: medium none;\" class=\"drag target-style-label\" contenteditable=\"false\">low-freq shelving cut</label><label for=\"attenuation\" style=\"text-align: center; display: block; touch-action: none; position: absolute; z-index: 1; width: 85.5333px; left: 4px; top: 131.533px;\" class=\"drag\" contenteditable=\"false\">attenuation</label><label for=\"freq\" style=\"text-align: center; display: block; touch-action: none; position: absolute; z-index: 1; width: 40px; left: 23px; top: 212.783px;\" class=\"drag\" contenteditable=\"false\">freq</label></div>";
    this.isOn;
    this.state = new Object();
    this.setKnobs();
    this.setSliders();
    this.setSwitches();
    //this.setSwitchListener();
    this.setInactive();
    // Change #pedal to .my-pedal for use the new builder
    this._root.querySelector('.my-pedal').style.transform = 'none';
    //this._root.querySelector("#test").style.fontFamily = window.getComputedStyle(this._root.querySelector("#test")).getPropertyValue('font-family');

    // Compute base URI of this main.html file. This is needed in order
    // to fix all relative paths in CSS, as they are relative to
    // the main document, not the plugin's main.html
    this.basePath = getBaseURL();
    console.log("basePath = " + this.basePath);

    // Fix relative path in WebAudio Controls elements
    this.fixRelativeImagePathsInCSS();

    // optionnal : set image background using a relative URI (relative
    // to this file)
    //this.setImageBackground("/img/BigMuffBackground.png");

    // Monitor param changes in order to update the gui
    window.requestAnimationFrame(this.handleAnimationFrame);
  }
  fixRelativeImagePathsInCSS() {
    // change webaudiocontrols relative paths for spritesheets to absolute
    var webaudioControls = this._root.querySelectorAll('webaudio-knob, webaudio-slider, webaudio-switch, img');
    webaudioControls.forEach(e => {
      var currentImagePath = e.getAttribute('src');
      if (currentImagePath !== undefined) {
        //console.log("Got wc src as " + e.getAttribute("src"));
        var imagePath = e.getAttribute('src');
        e.setAttribute('src', this.basePath + '/' + imagePath);
        //console.log("After fix : wc src as " + e.getAttribute("src"));
      }
    });

    var sliders = this._root.querySelectorAll('webaudio-slider');
    sliders.forEach(e => {
      var currentImagePath = e.getAttribute('knobsrc');
      if (currentImagePath !== undefined) {
        var imagePath = e.getAttribute('knobsrc');
        e.setAttribute('knobsrc', this.basePath + '/' + imagePath);
      }
    });

    // BMT Get all fonts
    // Need to get the attr font
    var usedFonts = "";
    var fonts = this._root.querySelectorAll('label[font]');
    fonts.forEach(e => {
      if (!usedFonts.includes(e.getAttribute("font"))) usedFonts += "family=" + e.getAttribute("font") + "&";
    });
    var link = document.createElement('link');
    link.rel = "stylesheet";
    if (usedFonts.slice(0, -1)) link.href = "https://fonts.googleapis.com/css2?" + usedFonts.slice(0, -1) + "&display=swap";
    document.querySelector('head').appendChild(link);

    // BMT Adapt for background-image
    var divs = this._root.querySelectorAll('div');
    divs.forEach(e => {
      if ('background-image' in e.style) {
        var currentImagePath = e.style.backgroundImage.slice(4, -1);
        if (currentImagePath !== undefined) {
          var imagePath = e.style.backgroundImage.slice(5, -2);
          if (imagePath != "") e.style.backgroundImage = 'url(' + this.basePath + '/' + imagePath + ')';
        }
      }
    });
  }
  setImageBackground() {
    // check if the shadowroot host has a background image
    var mainDiv = this._root.querySelector('#main');
    mainDiv.style.backgroundImage = 'url(' + this.basePath + '/' + imageRelativeURI + ')';

    //console.log("background =" + mainDiv.style.backgroundImage);
    //this._root.style.backgroundImage = "toto.png";
  }

  attributeChangedCallback() {
    console.log('Custom element attributes changed.');
    this.state = JSON.parse(this.getAttribute('state'));
    var tmp = '/PingPongDelayFaust/bypass';
    if (this.state[tmp] == 1) {
      this._root.querySelector('#switch1').value = 0;
      this.isOn = false;
    } else if (this.state[tmp] == 0) {
      this._root.querySelector('#switch1').value = 1;
      this.isOn = true;
    }
    this.knobs = this._root.querySelectorAll('.knob');
    console.log(this.state);
    for (var i = 0; i < this.knobs.length; i++) {
      this.knobs[i].setValue(this.state[this.knobs[i].id], false);
      console.log(this.knobs[i].value);
    }
  }
  get properties() {
    this.boundingRect = {
      dataWidth: {
        type: Number,
        value: null
      },
      dataHeight: {
        type: Number,
        value: null
      }
    };
    return this.boundingRect;
  }
  static get observedAttributes() {
    return ['state'];
  }
  setKnobs() {
    this._root.getElementById("/low-freq_shelving_cut/attenuation").addEventListener("input", e => this._plug.audioNode.setParamValue("/low-freq_shelving_cut/attenuation", e.target.value));
    this._root.getElementById("/low-freq_shelving_cut/freq").addEventListener("input", e => this._plug.audioNode.setParamValue("/low-freq_shelving_cut/freq", e.target.value));
  }
  setSliders() {}
  setSwitches() {}
  setInactive() {
    var switches = this._root.querySelectorAll(".switch webaudio-switch");
    switches.forEach(s => {
      console.log("### SWITCH ID = " + s.id);
      this._plug.audioNode.setParamValue(s.id, 0);
    });
  }
}
try {
  customElements.define('wap-lowcut', lowCutGui);
  console.log("Element defined");
} catch (error) {
  console.log(error);
  console.log("Element already defined");
}

/**
 * A mandatory method if you want a gui for your plugin
 * @param {WebAudioModule} plugin - the plugin instance
 * @returns {Elem} - the HTML element that contains the GUI
 */
function createElement(_x) {
  return _createElement.apply(this, arguments);
}
function _createElement() {
  _createElement = _asyncToGenerator(function* (plugin) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    // here we return the WebComponent GUI but it could be
    // any DOM node
    return new lowCutGui(plugin, ...args);
  });
  return _createElement.apply(this, arguments);
}
class lowCutNode extends CompositeAudioNode {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_wamNode", void 0);
  }
  setup(output, paramMgr) {
    this.connect(output, 0, 0);
    paramMgr.addEventListener('wam-midi', e => output.midiMessage(e.detail.data.bytes));
    this._wamNode = paramMgr;
    this._output = output;
  }
  destroy() {
    super.destroy();
    if (this._output) this._output.destroy();
  }
  getParamValue(name) {
    return this._wamNode.getParamValue(name);
  }
  setParamValue(name, value) {
    return this._wamNode.setParamValue(name, value);
  }
}
var getBasetUrl = relativeURL => {
  var baseURL = relativeURL.href.substring(0, relativeURL.href.lastIndexOf('/'));
  return baseURL;
};

// Definition of a new plugin
class lowCutPlugin extends WebAudioModule {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_PluginFactory", void 0);
    _defineProperty(this, "_baseURL", getBasetUrl(new URL('.', import.meta.url)));
    _defineProperty(this, "_descriptorUrl", this._baseURL + "/descriptor.json");
  }
  _loadDescriptor() {
    var _this = this;
    return _asyncToGenerator(function* () {
      var url = _this._descriptorUrl;
      if (!url) throw new TypeError('Descriptor not found');
      var response = yield fetch(url);
      var descriptor = yield response.json();
      Object.assign(_this.descriptor, descriptor);
    })();
  }
  initialize(state) {
    var _superprop_getInitialize = () => super.initialize,
      _this2 = this;
    return _asyncToGenerator(function* () {
      yield _this2._loadDescriptor();
      var imported = yield fetchModule('./Node.js');
      _this2._PluginFactory = imported[Object.keys(imported)[0]];
      return _superprop_getInitialize().call(_this2, state);
    })();
  }

  // The plugin redefines the async method createAudionode()
  // that must return an <Audionode>
  // It also listen to plugin state change event to update the audionode internal state
  createAudioNode(initialState) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      var factory = new _this3._PluginFactory(_this3.audioContext, _this3._baseURL);
      var faustNode = yield factory.load();
      var paramMgrNode = yield ParamMgrFactory.create(_this3, {
        internalParamsConfig: Object.fromEntries(faustNode.parameters)
      });
      var node = new lowCutNode(_this3.audioContext);
      node.setup(faustNode, paramMgrNode);
      if (initialState) node.setState(initialState);
      return node;
    })();
  }
  createGui() {
    return createElement(this);
  }
}

export { lowCutPlugin as default };
//# sourceMappingURL=index.js.map
