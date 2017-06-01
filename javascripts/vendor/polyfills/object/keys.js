// Object.prototype.keys
//
// The Object.keys() method returns an array of a given object's own enumerable properties, in the same order as that
// provided by a for...in loop (the difference being that a for-in loop enumerates properties in the prototype chain
// as well).
//
// Object.keys is natively supported in:
//   Chrome 5+
//   Firefox 4+
//   IE 9+
//   Opera 12+
//   Safari 5+
//
// Originally from: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}