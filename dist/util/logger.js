"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogger = exports.error = exports.info = exports.trace = void 0;

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _debug.default)("@govtechsg/opencerts-verify");

const trace = namespace => logger.extend(`trace:${namespace}`);

exports.trace = trace;

const info = namespace => logger.extend(`info:${namespace}`);

exports.info = info;

const error = namespace => logger.extend(`error:${namespace}`);

exports.error = error;

const getLogger = namespace => ({
  trace: trace(namespace),
  info: info(namespace),
  error: error(namespace)
});

exports.getLogger = getLogger;