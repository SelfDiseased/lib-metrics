"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.c = void 0;
var a = /** @class */ (function () {
    function a() {
        this.a = "a";
    }
    return a;
}());
var b = /** @class */ (function (_super) {
    __extends(b, _super);
    function b() {
        var _this = _super.call(this) || this;
        _this.b = "b";
        return _this;
    }
    return b;
}(a));
var bChild = /** @class */ (function (_super) {
    __extends(bChild, _super);
    function bChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return bChild;
}(b));
var c = /** @class */ (function (_super) {
    __extends(c, _super);
    function c(c) {
        if (c === void 0) { c = "c"; }
        var _this = _super.call(this) || this;
        _this.privateProp = "prop c";
        return _this;
    }
    c.prototype.privateMethod = function () {
        return;
    };
    c.prototype.method = function () {
        return;
    };
    return c;
}(b));
exports.c = c;
