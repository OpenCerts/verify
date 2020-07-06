"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  verificationBuilder: true,
  openAttestationVerifiers: true,
  Verifier: true
};
Object.defineProperty(exports, "verificationBuilder", {
  enumerable: true,
  get: function get() {
    return _oaVerify.verificationBuilder;
  }
});
Object.defineProperty(exports, "openAttestationVerifiers", {
  enumerable: true,
  get: function get() {
    return _oaVerify.openAttestationVerifiers;
  }
});
Object.defineProperty(exports, "Verifier", {
  enumerable: true,
  get: function get() {
    return _oaVerify.Verifier;
  }
});

var _oaVerify = require("@govtechsg/oa-verify");

var _verify = require("./verify");

Object.keys(_verify).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _verify[key];
    }
  });
});