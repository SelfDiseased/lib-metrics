"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = __importDefault(require("typescript"));
var path_1 = __importDefault(require("path"));
var analyzer_1 = require("./analyzer");
var pathInput = process.argv[2];
if (!pathInput) {
    throw new Error("Path was not provided");
}
var program = typescript_1.default.createProgram({
    rootNames: [pathInput],
    options: {},
});
var typeChecker = program.getTypeChecker();
var analyzer = new analyzer_1.Analyzer(typeChecker);
var files = program
    .getSourceFiles()
    .filter(function (file) { return !path_1.default.parse(file.fileName).dir.includes("node_modules"); });
var result = analyzer.process(files);
console.log(result);
