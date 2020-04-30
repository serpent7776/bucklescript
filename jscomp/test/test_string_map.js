'use strict';

var Curry = require("../../lib/js/curry.js");
var Caml_primitive = require("../../lib/js/caml_primitive.js");

function height(param) {
  if (param) {
    return param[/* h */4];
  } else {
    return 0;
  }
}

function create(l, x, d, r) {
  var hl = height(l);
  var hr = height(r);
  return /* Node */[
          /* l */l,
          /* v */x,
          /* d */d,
          /* r */r,
          /* h */hl >= hr ? hl + 1 | 0 : hr + 1 | 0
        ];
}

function bal(l, x, d, r) {
  var hl = l ? l[/* h */4] : 0;
  var hr = r ? r[/* h */4] : 0;
  if (hl > (hr + 2 | 0)) {
    if (l) {
      var lr = l[/* r */3];
      var ld = l[/* d */2];
      var lv = l[/* v */1];
      var ll = l[/* l */0];
      if (height(ll) >= height(lr)) {
        return create(ll, lv, ld, create(lr, x, d, r));
      }
      if (lr) {
        return create(create(ll, lv, ld, lr[/* l */0]), lr[/* v */1], lr[/* d */2], create(lr[/* r */3], x, d, r));
      }
      throw {
            ExceptionID: -3,
            _1: "Map.bal",
            Debug: "Invalid_argument"
          };
    }
    throw {
          ExceptionID: -3,
          _1: "Map.bal",
          Debug: "Invalid_argument"
        };
  }
  if (hr <= (hl + 2 | 0)) {
    return /* Node */[
            /* l */l,
            /* v */x,
            /* d */d,
            /* r */r,
            /* h */hl >= hr ? hl + 1 | 0 : hr + 1 | 0
          ];
  }
  if (r) {
    var rr = r[/* r */3];
    var rd = r[/* d */2];
    var rv = r[/* v */1];
    var rl = r[/* l */0];
    if (height(rr) >= height(rl)) {
      return create(create(l, x, d, rl), rv, rd, rr);
    }
    if (rl) {
      return create(create(l, x, d, rl[/* l */0]), rl[/* v */1], rl[/* d */2], create(rl[/* r */3], rv, rd, rr));
    }
    throw {
          ExceptionID: -3,
          _1: "Map.bal",
          Debug: "Invalid_argument"
        };
  }
  throw {
        ExceptionID: -3,
        _1: "Map.bal",
        Debug: "Invalid_argument"
      };
}

function add(x, data, m) {
  if (!m) {
    return /* Node */[
            /* l : Empty */0,
            /* v */x,
            /* d */data,
            /* r : Empty */0,
            /* h */1
          ];
  }
  var r = m[/* r */3];
  var d = m[/* d */2];
  var v = m[/* v */1];
  var l = m[/* l */0];
  var c = Caml_primitive.caml_string_compare(x, v);
  if (c === 0) {
    if (d === data) {
      return m;
    } else {
      return /* Node */[
              /* l */l,
              /* v */x,
              /* d */data,
              /* r */r,
              /* h */m[/* h */4]
            ];
    }
  }
  if (c < 0) {
    var ll = add(x, data, l);
    if (l === ll) {
      return m;
    } else {
      return bal(ll, v, d, r);
    }
  }
  var rr = add(x, data, r);
  if (r === rr) {
    return m;
  } else {
    return bal(l, v, d, rr);
  }
}

function find(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      var c = Caml_primitive.caml_string_compare(x, param[/* v */1]);
      if (c === 0) {
        return param[/* d */2];
      }
      _param = c < 0 ? param[/* l */0] : param[/* r */3];
      continue ;
    }
    throw {
          ExceptionID: -6,
          Debug: "Not_found"
        };
  };
}

function timing(label, f) {
  console.time(label);
  Curry._1(f, undefined);
  console.timeEnd(label);
  
}

function assertion_test(param) {
  var m = {
    contents: /* Empty */0
  };
  timing("building", (function (param) {
          for(var i = 0; i <= 1000000; ++i){
            m.contents = add(String(i), String(i), m.contents);
          }
          
        }));
  return timing("querying", (function (param) {
                for(var i = 0; i <= 1000000; ++i){
                  find(String(i), m.contents);
                }
                
              }));
}

exports.assertion_test = assertion_test;
/* No side effect */
