"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var weixinAuthProvider_1 = require("./weixinAuthProvider");
var listener_1 = require("./listener");
var base_1 = require("./base");
var listener_2 = require("./listener");
var cache_1 = require("../lib/cache");
var types_1 = require("../types");
var Auth = (function (_super) {
    __extends(Auth, _super);
    function Auth(config) {
        var _this = _super.call(this, config) || this;
        _this.config = config;
        return _this;
    }
    Auth.prototype.weixinAuthProvider = function (_a) {
        var appid = _a.appid, scope = _a.scope, loginMode = _a.loginMode, state = _a.state;
        return new weixinAuthProvider_1.default(this.config, appid, scope, loginMode, state);
    };
    Auth.prototype.signOut = function () {
        var cache = new cache_1.Cache(this.config.persistence);
        cache.removeStore(types_1.REFRESH_TOKEN + "_" + this.config.env);
        cache.removeStore(types_1.ACCESS_TOKEN + "_" + this.config.env);
        cache.removeStore(types_1.ACCESS_TOKEN_Expire + "_" + this.config.env);
        var action = "auth.logout";
        return this.httpRequest.send(action, {}).then(function (res) {
            return res;
        });
    };
    Auth.prototype.getAccessToken = function () {
        var _this = this;
        var cache = new cache_1.Cache(this.config.persistence);
        return new Promise(function (resolve, reject) {
            if (!cache.getStore(_this.refreshTokenKey)) {
                listener_2.activateEvent("LoginStateExpire");
                reject({ err: { message: "LoginStateExpire" } });
            }
            else {
                _this.getJwt()
                    .then(function (res) {
                    console.log("get jwt res:", res);
                    if (res.code === "REFRESH_TOKEN_Expired") {
                        reject({ err: { message: "REFRESH_TOKEN_Expired" } });
                    }
                    if (!res.code) {
                        var accessToken = cache.getStore(_this.accessTokenKey);
                        console.log("get access_token*********:", accessToken);
                        resolve({
                            accessToken: accessToken,
                            env: _this.config.env
                        });
                    }
                })
                    .catch(function (err) {
                    reject({ err: err });
                });
            }
        });
    };
    Auth.prototype.onLoginStateExpire = function (callback) {
        listener_1.addEventListener("LoginStateExpire", callback);
    };
    Auth.prototype.getUserInfo = function () {
        var action = "auth.getUserInfo";
        return this.httpRequest.send(action, {}).then(function (res) {
            if (res.code) {
                return res;
            }
            else {
                return __assign({}, res.data, { requestId: res.seqId });
            }
        });
    };
    return Auth;
}(base_1.default));
exports.default = Auth;
