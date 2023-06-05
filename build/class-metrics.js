"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassMetrics = void 0;
var property_metrics_1 = require("./property-metrics");
var ClassMetrics = /** @class */ (function () {
    function ClassMetrics() {
        this.className = "";
        this.classPath = "";
        this.parentClass = "";
        this.doi = 0;
        this.noc = 0;
        this.methods = new property_metrics_1.PropertyMetrics("methods");
        this.attributes = new property_metrics_1.PropertyMetrics("attributes");
    }
    return ClassMetrics;
}());
exports.ClassMetrics = ClassMetrics;
