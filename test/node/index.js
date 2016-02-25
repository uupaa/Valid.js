// Valid test

require("../../lib/WebModule.js");

WebModule.verify  = true;
WebModule.verbose = true;
WebModule.publish = true;

require("../../node_modules/uupaa.task.js/lib/Task.js");
require("../../node_modules/uupaa.task.js/lib/TaskMap.js");
require("../wmtools.js");
require("../../lib/Valid.js");
require("../../release/Valid.n.min.js");
require("../testcase.js");

