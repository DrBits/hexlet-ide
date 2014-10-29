/* global document window module require */

var expect = require("chai").expect;

module.exports = function(fileName) {
  return function(nightmare) {
    var selector = "[data-name='" + fileName + "'].tree-branch-name";

    var containerSelector = "[data-name='" + fileName + "'].tree-branch.tree-open";
    nightmare
    .exists(containerSelector, function(result)  {
      expect(result).to.equal(true);
    })
    .evaluate(function() { return document.querySelector("#hexlet-ide").innerHTML; }, function(res) { console.log(res); })
    .click(selector)
    .wait();
  };
};
