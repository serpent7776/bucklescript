'use strict';

var Mt = require("./mt.js");
var List = require("../../lib/js/list.js");
var Block = require("../../lib/js/block.js");
var Genlex = require("../../lib/js/genlex.js");
var Stream = require("../../lib/js/stream.js");
var Caml_js_exceptions = require("../../lib/js/caml_js_exceptions.js");

var lexer = Genlex.make_lexer(/* :: */[
      "+",
      /* :: */[
        "-",
        /* :: */[
          "*",
          /* :: */[
            "/",
            /* :: */[
              "let",
              /* :: */[
                "=",
                /* :: */[
                  "(",
                  /* :: */[
                    ")",
                    /* [] */0
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]);

function to_list(s) {
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var v;
    try {
      v = Stream.next(s);
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.ExceptionID === Stream.Failure.ExceptionID) {
        return List.rev(acc);
      }
      throw exn;
    }
    _acc = /* :: */[
      v,
      acc
    ];
    continue ;
  };
}

var suites_000 = /* tuple */[
  "lexer_stream_genlex",
  (function (param) {
      return /* Eq */Block.__(0, [
                /* :: */[
                  /* Int */Block.__(2, [3]),
                  /* :: */[
                    /* Kwd */Block.__(0, ["("]),
                    /* :: */[
                      /* Int */Block.__(2, [3]),
                      /* :: */[
                        /* Kwd */Block.__(0, ["+"]),
                        /* :: */[
                          /* Int */Block.__(2, [2]),
                          /* :: */[
                            /* Int */Block.__(2, [-1]),
                            /* :: */[
                              /* Kwd */Block.__(0, [")"]),
                              /* [] */0
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ],
                to_list(lexer(Stream.of_string("3(3 + 2 -1)")))
              ]);
    })
];

var suites = /* :: */[
  suites_000,
  /* [] */0
];

Mt.from_pair_suites("Genlex_test", suites);

exports.lexer = lexer;
exports.to_list = to_list;
exports.suites = suites;
/* lexer Not a pure module */
