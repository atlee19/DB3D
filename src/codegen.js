//alot of what we'll be doing in here involves metaprogramming

//should we create a file or return one large string?

export default function codegen(three_ast){
    // console.log(three_ast);
    var code_result = ``;

    //intial scene setup
    code_result += `const scene = new THREE.Scene(); \n`;
    let default_color = three_ast.attr.background;
    code_result += `scene.background = new THREE.Color( ${default_color} ); \n`;
    code_result += `const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); \n`;
    code_result += `const renderer = new THREE.WebGLRenderer(); \n`;
    code_result += `renderer.setSize( window.innerWidth, window.innerHeight ); \n`;
    code_result += `document.body.appendChild( renderer.domElement ); \n`
    code_result += `\n`

    //add our scene objects and check for scene alterations
    while(three_ast.body.length > 0){
        var current_node = three_ast.body.shift();
        // console.log(current_node);
        switch(current_node.tag){
            case 'SceneAlteration':
                let color = current_node.attr.background;
                let new_color = `0x${color_transform(color)}`
                code_result += `scene.background = new THREE.Color( ${new_color} ); \n`;
                break;

            case 'SceneObject':
                //pass
                break;
        }
    }

    //animation
    code_result += `const animate = function () { \n`
    code_result += `    requestAnimationFrame( animate ); \n`
    code_result += `    renderer.render( scene, camera ); \n`
    code_result += `}; \n`;
    code_result += `animate();`;

    console.log(code_result);
    return code_result;
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