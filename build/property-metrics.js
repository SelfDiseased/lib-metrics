"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyMetrics = void 0;
var typescript_1 = __importDefault(require("typescript"));
var PropertyMetrics = /** @class */ (function () {
    function PropertyMetrics(propType) {
        this.propType = propType;
        this.arrtibutesCheckers = [
            typescript_1.default.isPropertyDeclaration,
            typescript_1.default.isParameter,
            typescript_1.default.isGetAccessorDeclaration,
        ];
        this.privateModifiers = [
            typescript_1.default.SyntaxKind.PrivateKeyword,
            typescript_1.default.SyntaxKind.PrivateIdentifier,
        ];
        this.privateCount = 0;
        this.inherited = [];
        this.overridden = [];
        this.own = [];
    }
    PropertyMetrics.prototype.allProps = function () {
        return __spreadArray(__spreadArray(__spreadArray([], this.inherited, true), this.overridden, true), this.own, true);
    };
    PropertyMetrics.prototype.length = function () {
        return this.allProps().length + this.privateCount;
    };
    PropertyMetrics.prototype.analyze = function (parentClassMetrics, classType) {
        var _a, _b;
        var parentProps = (((_a = parentClassMetrics === null || parentClassMetrics === void 0 ? void 0 : parentClassMetrics[this.propType]) === null || _a === void 0 ? void 0 : _a.allProps()) ||
            []);
        var _loop_1 = function (property) {
            var propertyDeclaration = (_b = property.declarations) === null || _b === void 0 ? void 0 : _b[0];
            if (!this_1.isMethodOrAttributeDeclaration(this_1.propType, propertyDeclaration)) {
                return "continue";
            }
            if (this_1.isPrivate(propertyDeclaration)) {
                this_1.privateCount += 1;
            }
            var declName = propertyDeclaration.name.getText();
            var isInherited = parentProps.some(function (prop) { return prop.name.getText() === declName; });
            if (!isInherited) {
                this_1.own.push(propertyDeclaration);
                return "continue";
            }
            var classDecl = classType.symbol.declarations[0];
            var arr = propertyDeclaration.parent === classDecl ? "overridden" : "inherited";
            this_1[arr].push(propertyDeclaration);
        };
        var this_1 = this;
        for (var _i = 0, _c = classType.getProperties(); _i < _c.length; _i++) {
            var property = _c[_i];
            _loop_1(property);
        }
    };
    PropertyMetrics.prototype.isMethodOrAttributeDeclaration = function (propType, propDecl) {
        if (!propDecl)
            return false;
        if (propType === "methods")
            return !!typescript_1.default.isMethodDeclaration(propDecl);
        return this.arrtibutesCheckers.some(function (is) { return is(propDecl); });
    };
    PropertyMetrics.prototype.isPrivate = function (decl) {
        var _this = this;
        var _a;
        return !!((_a = decl.modifiers) === null || _a === void 0 ? void 0 : _a.some(function (modifier) {
            return _this.privateModifiers.includes(modifier.kind);
        }));
    };
    return PropertyMetrics;
}());
exports.PropertyMetrics = PropertyMetrics;
