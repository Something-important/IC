"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determinepaths = void 0;
var chain_registry_1 = require("chain-registry");
var encoding_1 = require("@cosmjs/encoding");
function determinepaths(sourceChain, destinationChain, tokenindenom, fromAddress, amount) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    console.log(sourceChain, destinationChain, tokenindenom, fromAddress);
    var chainFrom = sourceChain;
    var counterparty;
    var from = fromAddress;
    var denom = tokenindenom;
    var ready = false;
    var paths = [];
    if (typeof denom === 'string') {
        if (denom.slice(0, 3) === "ibc") {
            var _loop_1 = function () {
                // search for assets on sspecific chain
                var assetList = chain_registry_1.assets.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                });
                // search for asset info with specific denom identity
                var filteredArray = assetList === null || assetList === void 0 ? void 0 : assetList.assets.filter(function (obj) { return obj.base === denom; });
                // looking for specific info
                if (!filteredArray) { }
                else {
                    if (!filteredArray[0].traces) { }
                    else {
                        var counterpartyChain_1 = filteredArray[0].traces[0].counterparty.chain_name;
                        var counterpartyBaseDenom = filteredArray[0].traces[0].counterparty.base_denom;
                        var channelid = filteredArray[0].traces[0].chain.channel_id;
                        // determine from address
                        var nakedaddress = (0, encoding_1.fromBech32)(from).data;
                        prefix = (_a = chain_registry_1.chains.find(function (_a) {
                            var chain_name = _a.chain_name;
                            return chain_name === counterpartyChain_1;
                        })) === null || _a === void 0 ? void 0 : _a.bech32_prefix;
                        feeDenom = (_c = (_b = chain_registry_1.chains.find(function (_a) {
                            var chain_name = _a.chain_name;
                            return chain_name === chainFrom;
                        })) === null || _b === void 0 ? void 0 : _b.fees) === null || _c === void 0 ? void 0 : _c.fee_tokens[0].denom;
                        minFee = (_e = (_d = chain_registry_1.chains.find(function (_a) {
                            var chain_name = _a.chain_name;
                            return chain_name === chainFrom;
                        })) === null || _d === void 0 ? void 0 : _d.fees) === null || _e === void 0 ? void 0 : _e.fee_tokens[0].low_gas_price;
                        toAddress = (0, encoding_1.toBech32)(prefix, nakedaddress);
                        // setting amount
                        decimalPlacesToMove = filteredArray[0].denom_units[1].exponent;
                        TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
                        amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
                        // push required data to array
                        paths.push({ chainFrom: chainFrom, from: from, counterpartyChain: counterpartyChain_1, toAddress: toAddress, denom: denom, channelid: channelid, feeDenom: feeDenom, minFee: minFee, amountToTransfer: amountToTransfer });
                        // update data for new cycle
                        chainFrom = counterpartyChain_1;
                        denom = counterpartyBaseDenom;
                        from = toAddress;
                        if (counterpartyBaseDenom.slice(0, 3) === "ibc") {
                        }
                        else {
                            ready = true;
                        }
                    }
                }
            };
            var prefix, feeDenom, minFee, toAddress, decimalPlacesToMove, TokenDecimals, amountToTransfer;
            while (ready == false) {
                _loop_1();
            }
            var sortedChain_1 = [chainFrom, destinationChain].sort(function (a, b) { return a.localeCompare(b); });
            var match = chain_registry_1.ibc.find(function (item) {
                return item.chain_1.chain_name === sortedChain_1[0] &&
                    item.chain_2.chain_name === sortedChain_1[1];
            });
            if (chainFrom === sortedChain_1[0]) {
                var channel_id = match === null || match === void 0 ? void 0 : match.channels[0].chain_1.channel_id;
                // determine from address
                var nakedaddress = (0, encoding_1.fromBech32)(from).data;
                var prefix = (_f = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === destinationChain;
                })) === null || _f === void 0 ? void 0 : _f.bech32_prefix;
                var feeDenom = (_h = (_g = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                })) === null || _g === void 0 ? void 0 : _g.fees) === null || _h === void 0 ? void 0 : _h.fee_tokens[0].denom;
                var minFee = (_k = (_j = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                })) === null || _j === void 0 ? void 0 : _j.fees) === null || _k === void 0 ? void 0 : _k.fee_tokens[0].low_gas_price;
                var toAddress = (0, encoding_1.toBech32)(prefix, nakedaddress);
                // setting amount
                // search for assets on sspecific chain
                var assetList = chain_registry_1.assets.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                });
                // search for asset info with specific denom identity
                var filteredArray = assetList === null || assetList === void 0 ? void 0 : assetList.assets.filter(function (obj) { return obj.base === denom; });
                var decimalPlacesToMove = filteredArray[0].denom_units[1].exponent;
                var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
                var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
                // push required data to array
                paths.push({ chainFrom: chainFrom, from: from, destinationChain: destinationChain, toAddress: toAddress, denom: denom, channel_id: channel_id, feeDenom: feeDenom, minFee: minFee, amountToTransfer: amountToTransfer });
            }
            else {
                var channel_id = match === null || match === void 0 ? void 0 : match.channels[0].chain_2.channel_id;
                // determine from address
                var nakedaddress = (0, encoding_1.fromBech32)(from).data;
                var prefix = (_l = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === destinationChain;
                })) === null || _l === void 0 ? void 0 : _l.bech32_prefix;
                var feeDenom = (_o = (_m = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                })) === null || _m === void 0 ? void 0 : _m.fees) === null || _o === void 0 ? void 0 : _o.fee_tokens[0].denom;
                var minFee = (_q = (_p = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                })) === null || _p === void 0 ? void 0 : _p.fees) === null || _q === void 0 ? void 0 : _q.fee_tokens[0].low_gas_price;
                var toAddress = (0, encoding_1.toBech32)(prefix, nakedaddress);
                // setting amount
                // search for assets on sspecific chain
                var assetList = chain_registry_1.assets.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                });
                // search for asset info with specific denom identity
                var filteredArray = assetList === null || assetList === void 0 ? void 0 : assetList.assets.filter(function (obj) { return obj.base === denom; });
                var decimalPlacesToMove = filteredArray[0].denom_units[1].exponent;
                var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
                var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
                // push required data to array
                paths.push({ chainFrom: chainFrom, from: from, destinationChain: destinationChain, toAddress: toAddress, denom: denom, channel_id: channel_id, feeDenom: feeDenom, minFee: minFee, amountToTransfer: amountToTransfer });
            }
        }
        else {
            var sortedChain_2 = [chainFrom, destinationChain].sort(function (a, b) { return a.localeCompare(b); });
            var match = chain_registry_1.ibc.find(function (item) {
                return item.chain_1.chain_name === sortedChain_2[0] &&
                    item.chain_2.chain_name === sortedChain_2[1];
            });
            if (sourceChain === sortedChain_2[0]) {
                var channel_id = match === null || match === void 0 ? void 0 : match.channels[0].chain_1.channel_id;
                // determine from address
                var nakedaddress = (0, encoding_1.fromBech32)(from).data;
                var prefix = (_r = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === destinationChain;
                })) === null || _r === void 0 ? void 0 : _r.bech32_prefix;
                var feeDenom = (_t = (_s = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                })) === null || _s === void 0 ? void 0 : _s.fees) === null || _t === void 0 ? void 0 : _t.fee_tokens[0].denom;
                var minFee = (_v = (_u = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                })) === null || _u === void 0 ? void 0 : _u.fees) === null || _v === void 0 ? void 0 : _v.fee_tokens[0].low_gas_price;
                var toAddress = (0, encoding_1.toBech32)(prefix, nakedaddress);
                // setting amount
                // search for assets on sspecific chain
                var assetList = chain_registry_1.assets.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                });
                // search for asset info with specific denom identity
                var filteredArray = assetList === null || assetList === void 0 ? void 0 : assetList.assets.filter(function (obj) { return obj.base === denom; });
                var decimalPlacesToMove = filteredArray[0].denom_units[1].exponent;
                var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
                var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
                // push required data to array
                paths.push({ chainFrom: chainFrom, from: from, destinationChain: destinationChain, toAddress: toAddress, denom: denom, channel_id: channel_id, feeDenom: feeDenom, minFee: minFee, amountToTransfer: amountToTransfer });
            }
            else {
                var channel_id = match === null || match === void 0 ? void 0 : match.channels[0].chain_2.channel_id;
                // determine from address
                var nakedaddress = (0, encoding_1.fromBech32)(from).data;
                var prefix = (_w = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === destinationChain;
                })) === null || _w === void 0 ? void 0 : _w.bech32_prefix;
                var feeDenom = (_y = (_x = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                })) === null || _x === void 0 ? void 0 : _x.fees) === null || _y === void 0 ? void 0 : _y.fee_tokens[0].denom;
                var minFee = (_0 = (_z = chain_registry_1.chains.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                })) === null || _z === void 0 ? void 0 : _z.fees) === null || _0 === void 0 ? void 0 : _0.fee_tokens[0].low_gas_price;
                var toAddress = (0, encoding_1.toBech32)(prefix, nakedaddress);
                // setting amount
                // search for assets on sspecific chain
                var assetList = chain_registry_1.assets.find(function (_a) {
                    var chain_name = _a.chain_name;
                    return chain_name === chainFrom;
                });
                // search for asset info with specific denom identity
                var filteredArray = assetList === null || assetList === void 0 ? void 0 : assetList.assets.filter(function (obj) { return obj.base === denom; });
                var decimalPlacesToMove = filteredArray[0].denom_units[1].exponent;
                var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
                var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
                // push required data to array
                paths.push({ chainFrom: chainFrom, from: from, destinationChain: destinationChain, toAddress: toAddress, denom: denom, channel_id: channel_id, feeDenom: feeDenom, minFee: minFee, amountToTransfer: amountToTransfer });
            }
        }
    }
    else { }
    return paths;
}
exports.determinepaths = determinepaths;
var Usdc = "ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F";
var Osmo = "uosmo";
var Natom = "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9";
var ntrn = "untrn";
var Atom = "uatom";
var address = "kujira1mtcjwphtmu3lhs27u0smqrps9ctfm3mup32vyn";
var n = "neutron1mtcjwphtmu3lhs27u0smqrps9ctfm3mu5xpkn7";
var amount = "1";
var paths = determinepaths("kujira", "osmosis", "uusk", address, amount);
paths.forEach(function (element) {
    console.log(element);
});
