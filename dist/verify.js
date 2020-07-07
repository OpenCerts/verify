"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verify = exports.isValid = exports.registryVerifier = exports.OpencertsRegistryCode = exports.name = exports.type = void 0;

var _oaVerify = require("@govtechsg/oa-verify");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _openAttestation = require("@govtechsg/open-attestation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const type = "ISSUER_IDENTITY";
exports.type = type;
const name = "OpencertsRegistryVerifier"; // NEVER EVER REPLACE OR CHANGE A VALUE :)
// code for errors and invalid fragment

exports.name = name;
let OpencertsRegistryCode;
exports.OpencertsRegistryCode = OpencertsRegistryCode;

(function (OpencertsRegistryCode) {
  OpencertsRegistryCode[OpencertsRegistryCode["INVALID_IDENTITY"] = 0] = "INVALID_IDENTITY";
  OpencertsRegistryCode[OpencertsRegistryCode["SKIPPED"] = 1] = "SKIPPED";
})(OpencertsRegistryCode || (exports.OpencertsRegistryCode = OpencertsRegistryCode = {}));

const storeToFragment = (registry, store) => {
  const key = Object.keys(registry.issuers).find(k => k.toLowerCase() === store.toLowerCase());

  if (key) {
    return {
      status: "VALID",
      type,
      name,
      data: _objectSpread({
        status: "VALID",
        value: store
      }, registry.issuers[key])
    };
  }

  return {
    status: "INVALID",
    type,
    name,
    data: {
      value: store,
      status: "INVALID",
      reason: {
        code: OpencertsRegistryCode.INVALID_IDENTITY,
        codeString: OpencertsRegistryCode[OpencertsRegistryCode.INVALID_IDENTITY],
        message: `Document store ${store} not found in the registry`
      }
    },
    reason: {
      code: OpencertsRegistryCode.INVALID_IDENTITY,
      codeString: OpencertsRegistryCode[OpencertsRegistryCode.INVALID_IDENTITY],
      message: `Document store ${store} not found in the registry`
    }
  };
};

const registryVerifier = {
  test: document => {
    if (_openAttestation.utils.isWrappedV3Document(document)) {
      const documentData = (0, _openAttestation.getData)(document);
      return documentData.proof.method === _openAttestation.v3.Method.DocumentStore;
    }

    const documentData = (0, _openAttestation.getData)(document);
    return documentData.issuers.some(issuer => "documentStore" in issuer || "certificateStore" in issuer);
  },
  skip: () => {
    return Promise.resolve({
      status: "SKIPPED",
      type,
      name,
      reason: {
        code: OpencertsRegistryCode.SKIPPED,
        codeString: OpencertsRegistryCode[OpencertsRegistryCode.SKIPPED],
        message: `Document issuers doesn't have "documentStore" or "certificateStore" property or ${_openAttestation.v3.Method.DocumentStore} method`
      }
    });
  },
  verify: function () {
    var _verify = _asyncToGenerator(function* (document, options) {
      var _issuerFragments$find;

      const apiKey = options.googleApiKey || process.env.GOOGLE_API_KEY;
      const spreadsheetId = "1nhhD3XvHh2Ql_hW27LNw01fC-_I6Azt_XzYiYGhkmAU";
      const range = "Registry!A:H";
      const data = yield (0, _nodeFetch.default)(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueRenderOption=UNFORMATTED_VALUE&key=${apiKey}`).then(res => res.json());
      const registry = {
        issuers: {}
      };
      data.values.forEach(row => {
        // 0: documentStore, 1: name, 2: displayCard, 3: website, 4: email, 5: phone, 6: logo, 7: id, 8: group
        registry.issuers[row[0]] = {
          name: row[1],
          displayCard: /true/i.test(row[2])
        };

        if (row[2]) {
          registry.issuers[row[0]] = _objectSpread({}, registry.issuers[row[0]], {
            website: row[3],
            email: row[4],
            phone: row[5],
            logo: row[6],
            id: row[7]
          });
        }
      });

      if (_openAttestation.utils.isWrappedV3Document(document)) {
        const documentData = (0, _openAttestation.getData)(document);
        return storeToFragment(registry, documentData.proof.value);
      }

      const documentData = (0, _openAttestation.getData)(document);
      const issuerFragments = documentData.issuers.map(issuer => storeToFragment(registry, issuer.documentStore || issuer.certificateStore)); // if one issuer is valid => fragment status is valid otherwise if all issuers are invalid => invalid

      const status = issuerFragments.some(fragment => fragment.status === "VALID") ? "VALID" : "INVALID";
      return {
        type,
        name,
        status,
        data: issuerFragments.map(fragment => fragment.data),
        reason: (_issuerFragments$find = issuerFragments.find(fragment => fragment.reason)) === null || _issuerFragments$find === void 0 ? void 0 : _issuerFragments$find.reason
      };
    });

    function verify(_x, _x2) {
      return _verify.apply(this, arguments);
    }

    return verify;
  }()
};
exports.registryVerifier = registryVerifier;

const isValid = (verificationFragments, types = ["DOCUMENT_STATUS", "DOCUMENT_INTEGRITY", "ISSUER_IDENTITY"]) => {
  if (verificationFragments.length < 1) {
    throw new Error("Please provide at least one verification fragment to check");
  }

  if (types.length < 1) {
    throw new Error("Please provide at least one type to check");
  }

  return types.every(currentType => {
    var _fragmentForDnsVerifi, _fragmentForDnsVerifi2, _fragmentForDnsVerifi3;

    const verificationFragmentsForType = verificationFragments.filter(fragment => fragment.type === currentType); // return true if at least one fragment is valid
    // and all fragments are valid or skipped

    const defaultCheck = verificationFragmentsForType.some(fragment => fragment.status === "VALID") && verificationFragmentsForType.every(fragment => fragment.status === "VALID" || fragment.status === "SKIPPED"); // return defaultCheck if it's true or if type is DOCUMENT_INTEGRITY or DOCUMENT_STATUS

    if (currentType === "DOCUMENT_STATUS" || currentType === "DOCUMENT_INTEGRITY" || defaultCheck) {
      return defaultCheck;
    } // if default check is false and type is issuer identity we need to perform further checks


    const fragmentForDnsVerifier = verificationFragmentsForType.find(fragment => fragment.name === "OpenAttestationDnsTxt");
    const fragmentForRegistryVerifier = verificationFragmentsForType.find(fragment => fragment.name === name);
    return (fragmentForRegistryVerifier === null || fragmentForRegistryVerifier === void 0 ? void 0 : fragmentForRegistryVerifier.status) === "VALID" || // if registry fragment is valid then issuer identity is valid
    (fragmentForDnsVerifier === null || fragmentForDnsVerifier === void 0 ? void 0 : (_fragmentForDnsVerifi = fragmentForDnsVerifier.data) === null || _fragmentForDnsVerifi === void 0 ? void 0 : _fragmentForDnsVerifi.status) === "VALID" || ( // otherwise if there is one issuer and it's dns entry is valid then issuer identity is valid
    fragmentForDnsVerifier === null || fragmentForDnsVerifier === void 0 ? void 0 : (_fragmentForDnsVerifi2 = fragmentForDnsVerifier.data) === null || _fragmentForDnsVerifi2 === void 0 ? void 0 : (_fragmentForDnsVerifi3 = _fragmentForDnsVerifi2.every) === null || _fragmentForDnsVerifi3 === void 0 ? void 0 : _fragmentForDnsVerifi3.call(_fragmentForDnsVerifi2, d => d.status === "VALID")) // otherwise if there are multiple issuers and all of them have valid dns entry then issuer identity is valid
    ;
  });
};

exports.isValid = isValid;
const verify = (0, _oaVerify.verificationBuilder)([..._oaVerify.openAttestationVerifiers, registryVerifier]);
exports.verify = verify;