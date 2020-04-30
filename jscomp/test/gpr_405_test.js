'use strict';

var Curry = require("../../lib/js/curry.js");
var Hashtbl = require("../../lib/js/hashtbl.js");
var Caml_primitive = require("../../lib/js/caml_primitive.js");
var Caml_js_exceptions = require("../../lib/js/caml_js_exceptions.js");

function Make(funarg) {
  var $$let = funarg.V;
  var H = Hashtbl.Make({
        equal: $$let.equal,
        hash: $$let.hash
      });
  var find_default = function (htbl, x) {
    try {
      return Curry._2(H.find, htbl, x);
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.ExceptionID === /* Not_found */-6) {
        return false;
      }
      throw exn;
    }
  };
  var min_cutset = function (gr, first_node) {
    var n_labels = Curry._1(H.create, 97);
    var l_labels = Curry._1(H.create, 97);
    var already_processed = Curry._1(H.create, 97);
    var on_the_stack = Curry._1(H.create, 97);
    var cut_set = {
      contents: /* [] */0
    };
    var counter = {
      contents: 1
    };
    var step2 = function (top, rest_of_stack) {
      if (find_default(already_processed, top)) {
        throw {
              ExceptionID: -9,
              _1: /* tuple */[
                "gpr_405_test.ml",
                43,
                6
              ],
              Debug: "Assert_failure"
            };
      }
      if (find_default(on_the_stack, top)) {
        throw {
              ExceptionID: -9,
              _1: /* tuple */[
                "gpr_405_test.ml",
                44,
                6
              ],
              Debug: "Assert_failure"
            };
      }
      Curry._3(H.add, on_the_stack, top, true);
      Curry._3(H.add, n_labels, top, counter.contents);
      counter.contents = counter.contents + 1 | 0;
      Curry._3(H.add, l_labels, top, 0);
      Curry._3(H.add, already_processed, top, true);
      var _successors = Curry._2(funarg.succ, gr, top);
      var _top = top;
      var _rest_of_stack = rest_of_stack;
      while(true) {
        var rest_of_stack$1 = _rest_of_stack;
        var top$1 = _top;
        var successors = _successors;
        if (successors) {
          var successor = successors[0];
          if (!find_default(already_processed, successor)) {
            return step2(successor, /* :: */[
                        /* tuple */[
                          top$1,
                          successors
                        ],
                        rest_of_stack$1
                      ]);
          }
          var x = find_default(on_the_stack, successor) ? Curry._2(H.find, n_labels, successor) : Curry._2(H.find, l_labels, successor);
          Curry._3(H.add, l_labels, top$1, Caml_primitive.caml_int_max(Curry._2(H.find, l_labels, top$1), x));
          _successors = successors[1];
          continue ;
        }
        if (Curry._2(H.find, l_labels, top$1) === Curry._2(H.find, n_labels, top$1)) {
          cut_set.contents = /* :: */[
            top$1,
            cut_set.contents
          ];
          Curry._3(H.add, l_labels, top$1, 0);
        }
        if (Curry._2(H.find, l_labels, top$1) > Curry._2(H.find, n_labels, top$1)) {
          throw {
                ExceptionID: -3,
                _1: "Graph.Mincut: graph not reducible",
                Debug: "Invalid_argument"
              };
        }
        if (!rest_of_stack$1) {
          return cut_set.contents;
        }
        var match = rest_of_stack$1[0];
        var new_top = match[0];
        Curry._3(H.add, on_the_stack, top$1, false);
        Curry._3(H.add, l_labels, new_top, Caml_primitive.caml_int_max(Curry._2(H.find, l_labels, top$1), Curry._2(H.find, l_labels, new_top)));
        _rest_of_stack = rest_of_stack$1[1];
        _top = new_top;
        _successors = match[1];
        continue ;
      };
    };
    return step2(first_node, /* [] */0);
  };
  return {
          min_cutset: min_cutset
        };
}

exports.Make = Make;
/* No side effect */
