(function (root) {
  "use strict";
  var loadedScripts = 0,
      totalScripts,
      merge,
      loadScript,
      runJasmine,
      manifestScript;

  merge = function (arrays) {
    var resultingArray = [],
        workingArray,
        a, b, x, y;

    for (a = 0, b = arrays.length; a < b; a++) {
      workingArray = arrays[a];
      for (x = 0, y = workingArray.length; x < y; x++) {
        resultingArray.push(workingArray[x]);
      }
    }
    return resultingArray;
  };
  loadScript = function (src, nextIdx) {
    var script = document.createElement('script'),
        nextScript; 

    script.type = 'text/javascript';
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);
    if (nextIdx === undefined) { return script; }
    script.onload = function () {
      if (nextIdx < totalScripts.length) {
        loadScript(totalScripts[nextIdx], nextIdx + 1);
      } else {
        runJasmine();
      }
    };
    return script;
  };
  runJasmine = function () {
    var console_reporter = new jasmine.ConsoleReporter();
    jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
    jasmine.getEnv().addReporter(console_reporter);
    jasmine.getEnv().execute();
  };
  manifestScript = loadScript('../manifest.js');

  manifestScript.onload = function () {
    var idx = 0;
  
    totalScripts = merge([manifest.support, manifest.test]);
    loadScript(totalScripts[idx], idx + 1);
  };
}).call(this);
