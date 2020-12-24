"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var url = 'https://jsonplaceholder.typicode.com/todos/1';
axios_1["default"].get(url).then(function (res) {
    return res.data;
}).then(function (data) {
    console.log("\n    The todo with id " + data.id + "\n    Has a title of " + data.title + "\n    Is it finished " + data.finished + "\n  ");
})["catch"](function (err) { return console.log(err); });
