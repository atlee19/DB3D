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

//how can we transform this so this so it's more three.js friendly?
//how do we form appropriate objects

/*
Output:
{
  "tag": "Scene", //is scene mandatory like main() or no?
  "attr": {
    "background": white (by default unless otherwise),
    "camera": 100, ?
    "viewBox": "0 0 100 100",
    "version": "1.1"
  },
  "body": [
  {               
    "tag": "SceneObject_1",    //here is where we have to form ENTIRE objects
    "attr": {
      "color": green or #0x00ff00,   //how do we handle color translations?
      "geometry": cube,
      "size": 1,
      "position": {x : 0 , y : 0, z: -1},
    },
  }] END OF BODY
}
*/
export default function transformer(AST){
    var three_ast = { //this could also be called a concrete syntax tree
        tag : 'Scene',
        attr : {
            background : 0xffffff,
        },
        body : []
    };
    var scene_object_count = 0;

    while(AST.body.length > 0){
        var node = AST.body.shift();
        if(node.start_of_expression){
            //it can be a scene literal where we grab 1 thing in itself
            if(node.arguments[0].type === 'SceneLiteral'){
                var scene_alteration = {
                    tag : 'SceneAlteration',
                    attr: {
                        background : node.name,
                    }
                }
                three_ast.body.push(scene_alteration);
            }
            //or it can or a shape literal where we have to grab next 3 things
            else if(node.arguments[0].type === 'ShapeLiteral'){
                var scene_object = {
                    tag : `SceneObject_${++scene_object_count}`,
                    attr : {
                        color : node.name,
                        geometry : node.arguments[0].value,
                    }
                }
                //add size
                var size = AST.body.shift();
                scene_object.attr.size = size.arguments[0].value;
                //add position
                var pos = AST.body.shift();
                scene_object.attr.pos = {
                    x : pos.arguments[0].value,
                    y : pos.arguments[1].value,
                    z : pos.arguments[2].value,
                }

                three_ast.body.push(scene_object);
            }
        }
            
    }//end of while loop
    
    return three_ast;
}