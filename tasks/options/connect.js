module.exports = {
  server: {},

  options: {
    hostname: "0.0.0.0",
    port: (process.env.PORT || 8000),
    base: ".",
    middleware: function(connect, options) {
      return [
        connect.static(options.base)
      ];
    }

  }
};
