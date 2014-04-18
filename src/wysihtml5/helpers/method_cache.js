var methodCache = function(invoke) {
  var cache;
  return function() {
    if (cache !== undefined) {
      return cache;
    } else {
      cache = invoke.apply(this, arguments)
      return cache;
    }
  }
}

export default = methodCache;
