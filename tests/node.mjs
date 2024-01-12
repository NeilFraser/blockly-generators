import javascriptGenerator from '../javascript/javascriptGenerator.mjs';
import '../javascript/all.mjs';

const json = {
  "blocks": {
    "languageVersion": 0,
    "blocks": [
      {
        "type": "controls_if",
        "id": "g80.fEoPt;:gaGGPt6TJ",
        "x": 20,
        "y": 20,
        "inline": false,
        "extraState": {
          "hasElse": true
        },
        "inputs": {
          "IF0": {
            "block": {
              "type": "logic_compare",
              "id": "ntb_hXFS3JjzO*wa6s8R",
              "fields": {
                "OP": "EQ"
              },
              "inputs": {
                "A": {
                  "block": {
                    "type": "math_arithmetic",
                    "id": "Mm:kn2bOO]PQ1I%d`}}c",
                    "fields": {
                      "OP": "MULTIPLY"
                    },
                    "inputs": {
                      "A": {
                        "block": {
                          "type": "math_number",
                          "id": "JO%3$$3F;-+i:o@1:ZYF",
                          "fields": {
                            "NUM": 6
                          }
                        }
                      },
                      "B": {
                        "block": {
                          "type": "math_number",
                          "id": "W@1aKe4$,!6]ktNWTo_t",
                          "fields": {
                            "NUM": 7
                          }
                        }
                      }
                    }
                  }
                },
                "B": {
                  "block": {
                    "type": "math_number",
                    "id": "j;+4-L1br]Jloz]WGBrJ",
                    "fields": {
                      "NUM": 42
                    }
                  }
                }
              }
            }
          },
          "DO0": {
            "block": {
              "type": "text_print",
              "id": "_dJbsrk6|#Z$`Wv6$p[g",
              "inline": false,
              "inputs": {
                "TEXT": {
                  "block": {
                    "type": "text",
                    "id": "2]a#+F3MMHMNIC?sS7k^",
                    "fields": {
                      "TEXT": "Don't panic"
                    }
                  }
                }
              }
            }
          },
          "ELSE": {
            "block": {
              "type": "text_print",
              "id": "aJBGhxXR,J9(+x$-1Bon",
              "inline": false,
              "inputs": {
                "TEXT": {
                  "block": {
                    "type": "text",
                    "id": "ru1C}d=)YK#7DuB,BMeR",
                    "fields": {
                      "TEXT": "Panic"
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]
  }
};

const startTime = Date.now();
const code = javascriptGenerator.toCode(json);
const elapsedTime = Date.now() - startTime;

console.log(code);
console.log(`(${elapsedTime} ms)`);
