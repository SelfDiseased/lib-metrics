"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analyzer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var class_metrics_1 = require("./class-metrics");
var Analyzer = /** @class */ (function () {
    function Analyzer(typeChecker) {
        this.typeChecker = typeChecker;
        this.classes = [];
    }
    Analyzer.prototype.process = function (nodes) {
        var _this = this;
        nodes.forEach(function (node) { return _this.analyzeClass(node); });
        var _a = this.classes.reduce(function (acc, classObject) {
            var methods = classObject.methods, attributes = classObject.attributes;
            acc.methodsCount += methods.length();
            acc.privateMethodsCount += methods.privateCount;
            acc.inheritedMethodsCount += methods.inherited.length;
            acc.ownMethodsCount += methods.own.length;
            acc.inheritedAndOverridenCount +=
                methods.inherited.length + methods.overridden.length;
            acc.ownMethodsForChildrenCount += methods.own.length * classObject.noc;
            acc.attributesCount += attributes.length();
            acc.privateAttributesCount += attributes.privateCount;
            acc.inheritedAttributesCount += attributes.inherited.length;
            acc.ownAttributesCount += attributes.own.length;
            return acc;
        }, {
            methodsCount: 0,
            privateMethodsCount: 0,
            inheritedMethodsCount: 0,
            ownMethodsCount: 0,
            inheritedAndOverridenCount: 0,
            ownMethodsForChildrenCount: 0,
            attributesCount: 0,
            privateAttributesCount: 0,
            inheritedAttributesCount: 0,
            ownAttributesCount: 0,
        }), methodsCount = _a.methodsCount, privateMethodsCount = _a.privateMethodsCount, inheritedMethodsCount = _a.inheritedMethodsCount, ownMethodsCount = _a.ownMethodsCount, inheritedAndOverridenCount = _a.inheritedAndOverridenCount, ownMethodsForChildrenCount = _a.ownMethodsForChildrenCount, attributesCount = _a.attributesCount, privateAttributesCount = _a.privateAttributesCount, inheritedAttributesCount = _a.inheritedAttributesCount, ownAttributesCount = _a.ownAttributesCount;
        return this.prettifyResult({
            classes: this.classes,
            mhf: this.calculateMetric(privateMethodsCount, methodsCount),
            ahf: this.calculateMetric(privateAttributesCount, attributesCount),
            mif: this.calculateMetric(inheritedMethodsCount + ownMethodsCount, methodsCount),
            aif: this.calculateMetric(inheritedAttributesCount + ownAttributesCount, attributesCount),
            pof: this.calculateMetric(inheritedAndOverridenCount, ownMethodsForChildrenCount),
        });
    };
    Analyzer.prototype.calculateMetric = function (x, y) {
        return +(x / y).toFixed(3) || 0;
    };
    Analyzer.prototype.analyzeClass = function (potentialClass) {
        var _this = this;
        if (typescript_1.default.isClassLike(potentialClass)) {
            var classType = this.typeChecker.getTypeAtLocation(potentialClass);
            this.getClassMetrics(classType);
        }
        potentialClass.forEachChild(function (node) { return _this.analyzeClass(node); });
    };
    Analyzer.prototype.getClassMetrics = function (classType) {
        var _a;
        var className = this.typeChecker.typeToString(classType);
        var typeDecl = (_a = classType.symbol.declarations) === null || _a === void 0 ? void 0 : _a[0];
        var classPath = typeDecl ? this.getAbsolutePosition(typeDecl) : "";
        var isAlreadyAnalyzed = this.classes.find(function (classObject) {
            return classObject.className === className &&
                classObject.classPath === classPath;
        });
        if (isAlreadyAnalyzed) {
            return isAlreadyAnalyzed;
        }
        var result = new class_metrics_1.ClassMetrics();
        result.className = className;
        result.classPath = classPath;
        var parentClass = this.getParentClass(classType);
        var parentClassMetrics = parentClass && this.getClassMetrics(parentClass);
        if (parentClassMetrics) {
            parentClassMetrics.noc += 1;
            result.doi += 1 + parentClassMetrics.doi;
            result.parentClass = parentClassMetrics.className;
        }
        result.methods.analyze(parentClassMetrics, classType);
        result.attributes.analyze(parentClassMetrics, classType);
        this.classes.push(result);
        return result;
    };
    Analyzer.prototype.getParentClass = function (classType) {
        var baseTypes = classType.getBaseTypes();
        if (!(baseTypes === null || baseTypes === void 0 ? void 0 : baseTypes.length)) {
            return null;
        }
        if (baseTypes.length > 1) {
            throw Error("> 1 base types; not sure which one to pick!");
        }
        return baseTypes[0];
    };
    Analyzer.prototype.getAbsolutePosition = function (node) {
        var file = node.getSourceFile();
        var pos = file.getLineAndCharacterOfPosition(node.getStart());
        return "".concat(file.fileName, ":").concat(pos.line + 1, ":").concat(pos.character + 1);
    };
    Analyzer.prototype.prettifyResult = function (result) {
        return __assign(__assign(__assign({}, result), { classes: result.classes.map(function (_a) {
                var className = _a.className, parentClass = _a.parentClass, noc = _a.noc, doi = _a.doi;
                return ({
                    className: className,
                    parentClass: parentClass || null,
                    noc: noc,
                    doi: doi,
                });
            }) }), result.classes.reduce(function (acc, _a) {
            var noc = _a.noc, doi = _a.doi;
            if (noc > acc.maxNoc) {
                acc.maxNoc = noc;
            }
            if (doi > acc.maxDoi) {
                acc.maxDoi = doi;
            }
            return acc;
        }, {
            maxNoc: 0,
            maxDoi: 0,
        }));
    };
    return Analyzer;
}());
exports.Analyzer = Analyzer;
