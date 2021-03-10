//3 syntax types 
//ObjectLiteral Shape Scene
//NumberLiteral - 1, 0, 0, -1
//CallExpression Color, Size, Position

//Color will call Shape. It feels a bit awkward because color
//feels more like a parameter but it will make sense in the long run.

//Define our grammer (how strict it is)

//---> Color Shape Size Number Position Number Number Number

//its only strict in the sense of our syntax types. 
//A call expression should always have correct # arugments but the whole 
//sentence above is not required (ex. Black Scene)

//The AST is responsbile for a lot of error handling 

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
    var scene_obj_present=false;
    //just send an error saying 'Scene has already been declared'

    while(tokens.length > 0){
        const current_token = tokens.shift(); //grabs token at beginning of array

        //should we use switch case instead?
        switch(current_token.type){
            case 'Color':
                //build a call expression
                var color_expression = {
                    type : 'CallExpression',
                    name : current_token.value,
                    start_of_expression : true,
                    arguments : []
                }
                //get the arguments - can either be a shape OR scene
                var color_argument = tokens.shift();
                if(color_argument.type == 'Shape'){
                    color_expression.arguments.push({
                        type : 'ShapeLiteral',
                        value : color_argument.value
                    });
                    //add to AST
                    AST.body.push(color_expression);
                }
                else if(color_argument.type == 'Scene'){
                    if(!scene_obj_present){ //scene can only happen once
                        color_expression.arguments.push({
                            type : 'SceneLiteral',
                            value : color_argument.value
                        })
                        AST.body.push(color_expression);
                        scene_obj_present = true;
                    } 
                    else{
                        throw 'Scene has already been declared';
                    }
                }
                else //we don't know what is following color
                {
                    throw '[Syntax error]: A Color must be followed by either a Shape or Scene.'; 
                }
                break;
                
            case 'Size':
                    var size_expression = {
                        type : 'CallExpression',
                        name : current_token.value,
                        start_of_expression : false,
                        arguments : []
                    }
                    //get size argument HAS to be a Number
                    var size_argument = tokens.shift();
                    if(size_argument.type == 'Number'){
                        size_expression.arguments.push({
                            type : 'NumberLiteral',
                            value : size_argument.value
                        })
                        //add to AST
                        AST.body.push(size_expression)
                    }
                    else
                    {
                        throw '[Syntax error]: Size must be followed by a Number';
                    }

                break;

            case 'Position':
                var position_expression = {
                    type : 'CallExpression',
                    name : current_token.value,
                    start_of_expression : false,
                    arguments : []
                }
                let EXPECTED_NUM_ARGS=3;
                for(let i=0; i < EXPECTED_NUM_ARGS; i++){
                    var position_argument = tokens.shift();
                    if(position_argument != undefined){
                        if(position_argument.type == 'Number'){
                            position_expression.arguments.push({
                                type : 'NumberLiteral',
                                value : position_argument.value
                            })
                        }
                        else
                        {
                            throw '[Syntax error]: Position takes a Number';
                        }
                    }

                }
                let num_args_found = position_expression.arguments.length;

                if(num_args_found == EXPECTED_NUM_ARGS)
                    AST.body.push(position_expression); //add to AST
                else 
                    throw `[Syntax error]: Position takes (3) Number arguments. There are ${num_args_found} found.`;
                
                break;

            default:
                //could we provide more information?
                throw '[Syntax error]: missing one of the following commands: Color, Size, or Position';
        }

    }//end of while loop

    return AST;

}