"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chain_registry_1 = require("chain-registry");
function chainInfo(chain) {
    var _a, _b;
    var chainInfo = chain_registry_1.chains.find(function (_a) {
        var chain_name = _a.chain_name;
        return chain_name === chain;
    });
    // console.log(chainInfo)
    if (!chainInfo) {
        // handle the case when assetList is undefined
    }
    else {
        return ((_a = chainInfo.logo_URIs) === null || _a === void 0 ? void 0 : _a.svg) || ((_b = chainInfo.logo_URIs) === null || _b === void 0 ? void 0 : _b.png);
    }
}
exports.default = chainInfo;
console.log(chainInfo("osmosis"));
