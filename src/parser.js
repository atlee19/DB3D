//3 syntax types 
//ObjectLiteral Shape
//NumberLiteral - 1, 0, 0, -1
//CallExpression Color Size, Position

//Color will call Shape. It feels a bit awkward because color
//feels more like a parameter but it will make sense in the long run.

//Define our grammer (how strict it is)

//Color Shape Size Number Position Number Number Number

//its only strict in the sense of our syntax types. 
//A call expression should always have correct # arugments but the whole 
//sentence above is not required

//Goal: take this stream of tokens and build it into an AST 
//      that adheres to our grammer
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
    var AST = {
        type : 'Scene',
        body : []
    }
    //we need to prevent duplication of scene objects 
    // var scene_obj_present=false;
    //just send an error saying 'Scene has already been declared'

    while(tokens.length > 0){
        const current_token = tokens.shift(); //grabs token at beginning of array

        //should we use switch case instead?
        
        if(current_token.type == 'Color'){
            //build a call expression
            var expression = {
                type : 'CallExpression',
                name : current_token.value,
                arguments : []
            }
            //get the arguments
            var argument = tokens.shift();
            if(argument.type == 'Shape'){
                expression.arguments.push({
                    type : 'ObjectLiteral',
                    value : argument.value
                });
                //add to AST
                AST.body.push(expression);
            }
            else 
            {
                //this isn't incredibly descriptive
                throw 'Color must be followed by a ObjectLiteral.'; 
            }
        }

    }//end of while loop

    console.log(AST);

}