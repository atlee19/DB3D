/* 
Input:
   {type: "Scene", body: Array(4)}
   body: Array(4)
   0:
   arguments: Array(1)
   0: {type: "ObjectLiteral", value: "Scene"}
   length: 1
   __proto__: Array(0)
   name: "Black"
   type: "CallExpression"

   1: {type: "CallExpression", name: "Green", arguments: Array(1)}
   2: {type: "CallExpression", name: "Size", arguments: Array(1)}
   3: {type: "CallExpression", name: "Position", arguments: Array(3)}
*/ 

export default function transformer(AST){
    console.log(AST);
}