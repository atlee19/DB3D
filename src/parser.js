//3 syntax types 
//ObjectLiteral Shape
//NumberLiteral - 1, 0, 0, -1
//CallExpression Color Size, Position

//Color will call Shape. It feels a bit awkward because color
//feels more like a parameter but it will make sense in the long run.

//Goal: take this stream of tokens and build it into an AST
//Input: {type: "Color", value: "Green"}
/* Output: AST {
"type": "Scene",
  "Scene": [
   {
    "type": "CallExpression",
    "name": "Green",
    "arguments": [{ "type": "ObjectLiteral", "value": "Cube" }]
  }, 
   {
      "type": "CallExpression",
      "name": "Position",
      "arguments": [
        {
          "type": "NumberLiteral",
          "value": "0"
        },
        {
          "type": "NumberLiteral",
          "value": "0"
        },
        {
          "type": "NumberLiteral",
          "value": "-1"
        },
]
end of body
*/

//tokens:
    // 0: {type: "Color", value: "Green"}
    // 1: {type: "Shape", value: "Cube"}
    // 2: {type: "Size", value: "Size"}
    // 3: {type: "Number", value: 1}
    // 4: {type: "Position", value: "Position"}
    // 5: {type: "Number", value: 0}
    // 6: {type: "Number", value: 0}
    // 7: {type: "Number", value: -1}

export default function parser(tokens){
    

}