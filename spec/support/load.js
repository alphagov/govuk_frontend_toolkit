(function (root) {
  "use strict"
  var loadedScripts = 0,
      totalScripts,
      loadScript,
      runJasmine,
      manifestScript;

  loadScript = function (src) {
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = function () {
      loadedScripts++;
      if (loadedScripts === totalScripts) {
        runJasmine();
      }
    };
    return script;
  };
  runJasmine = function () {
    var console_reporter = new jasmine.ConsoleReporter()
    jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
    jasmine.getEnv().addReporter(console_reporter);
    jasmine.getEnv().execute();
  };
  manifestScript = loadScript('./manifest.js');

  manifestScript.onload = function () {
    var idx = 0,
        supportFilesLength = manifest.support.length,
        testFilesLength = manifest.test.length;
  
    totalScripts = supportFilesLength + testFilesLength;
    while (idx < supportFilesLength) {
      loadScript(manifest.support[idx]);
      idx++
    }
    idx = 0;
    while (idx < testFilesLength) {
      loadScript(manifest.test[idx]);
      idx++
    }
  };
}).call(this);
