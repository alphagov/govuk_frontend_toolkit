// Object.prototype.assign
//
// The Object.assign() method is used to copy the values of all enumerable own properties from one or more source
// objects to a target object. It will return the target object.
//
// Object.assign is natively supported in:
//   Chrome 45+
//   Firefox 34+
//   Opera 32+
//   Safari 9+
//
// Originally from: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}