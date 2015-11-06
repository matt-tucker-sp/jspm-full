System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "ExactTarget/fuelux": "github:ExactTarget/fuelux@3.11.5",
    "angular": "github:angular/bower-angular@1.3.15",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@0.13.0",
    "angular-translate": "github:angular-translate/bower-angular-translate@2.8.1",
    "angular-ui/bootstrap-bower": "github:angular-ui/bootstrap-bower@0.13.0",
    "babel": "npm:babel-core@5.8.33",
    "babel-runtime": "npm:babel-runtime@5.8.29",
    "bootstrap": "github:twbs/bootstrap@3.3.4",
    "core-js": "npm:core-js@1.2.5",
    "fuelux": "npm:fuelux@3.11.5",
    "moment": "npm:moment@2.10.6",
    "ng-sortable": "github:a5hik/ng-sortable@1.3.1",
    "rendro/easy-pie-chart": "github:rendro/easy-pie-chart@2.1.6",
    "tbosch/autofill-event": "github:tbosch/autofill-event@1.0.0",
    "text": "github:systemjs/plugin-text@0.0.3",
    "github:a5hik/ng-sortable@1.3.1": {
      "angular": "github:angular/bower-angular@1.3.15",
      "css": "github:systemjs/plugin-css@0.1.19"
    },
    "github:angular-translate/bower-angular-translate@2.8.1": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:angular-ui/bootstrap-bower@0.13.0": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:twbs/bootstrap@3.3.4": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.29": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bootstrap@3.3.5": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.5": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:fuelux@3.11.5": {
      "bootstrap": "npm:bootstrap@3.3.5",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "jquery": "npm:jquery@2.1.4",
      "moment": "npm:moment@2.10.6",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jquery@2.1.4": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:moment@2.10.6": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
