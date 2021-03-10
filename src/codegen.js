//alot of what we'll be doing in here involves metaprogramming
//this is really where the transpiling takes place. Javascript/three.js 
//is our target.
//should we create a file or return one large string?
//go with 1 large string for now.

export default function codegen(three_ast){
    // console.log(three_ast);
    var code_result = ``;

    //intial scene setup
    code_result += `const scene = new THREE.Scene(); \n`;
    let default_color = three_ast.attr.background;
    code_result += `scene.background = new THREE.Color( ${default_color} ); \n`;
    code_result += `const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); \n`;
    code_result += `camera.position.z = 5; \n`;
    code_result += `const renderer = new THREE.WebGLRenderer(); \n`;
    code_result += `renderer.setSize( window.innerWidth, window.innerHeight ); \n`;
    code_result += `document.body.appendChild( renderer.domElement ); \n`
    code_result += `\n`

    //add our scene objects and check for scene alterations
    while(three_ast.body.length > 0){
        var current_node = three_ast.body.shift();
        switch(current_node.tag){
            case 'SceneAlteration':
                //generate new background color
                let bg_color = current_node.attr.background;
                let new_bg_color = `0x${color_transform(bg_color)}`;
                code_result += `scene.background = new THREE.Color( ${new_bg_color} ); \n`;
                code_result += `\n`
                break;

            case 'SceneObject':
                let id = current_node.id;
                let objectName = `${current_node.attr.geometry}_${id}`;
                //setup geometry
                let shapeType = shape_transform(current_node.attr.geometry);
                code_result += `const geometry_${id} = new THREE.${shapeType}(); \n`;
                //set color
                let shape_color = current_node.attr.color;
                shape_color = `0x${color_transform(shape_color)}`;
                code_result += `const material_${id} = new THREE.MeshBasicMaterial( { color: ${shape_color} } ); \n`;
                code_result += `const ${objectName} = new THREE.Mesh( geometry_${id}, material_${id} ); \n`;
                //add to scene
                code_result += `scene.add(${objectName}); \n`;
                //set position
                let x = parseFloat(current_node.attr.pos.x);
                let y = parseFloat(current_node.attr.pos.y);
                let z = parseFloat(current_node.attr.pos.z);
                code_result += `${objectName}.position.set(${x}, ${y}, ${z}); \n`;

                code_result += `\n`
                break;
        }
    }

    //animation
    code_result += `const animate = function () { \n`
    code_result += `    requestAnimationFrame( animate ); \n`
    code_result += `    renderer.render( scene, camera ); \n`
    code_result += `}; \n`;
    code_result += `animate();`;

    return code_result;
}

function shape_transform(shape){
    var shape_three_map = new Map([
        ['Cube', 'BoxGeometry']
        //add sphere
        //add etc.
    ])

    return shape_three_map.get(shape);
}


function color_transform(color){
    var hex_color_map = new Map([
        ['Red', 'ff002f'],
        ['Green', '09ff00'],
        ['Blue', '0091ff'],
        ['Black', '000000'],
    ])

    return hex_color_map.get(color);
}