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
    let default_bg_color = three_ast.attr.background;
    code_result += `scene.background = new THREE.Color( ${default_bg_color} ); \n`;
    code_result += `const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); \n`;
    code_result += `camera.position.z = 5; \n`;
    code_result += `const renderer = new THREE.WebGLRenderer({ antialias: true}); \n`;
    code_result += `renderer.setSize( window.innerWidth, window.innerHeight ); \n`;
    code_result += `document.body.appendChild( renderer.domElement ); \n`
    code_result += `\n`
    
    //setup default lighting - I don't love this implmentation
    var default_light_color = three_ast.attr.color;
    var default_intensity = three_ast.attr.intensity;
    code_result += `const directionalLight = new THREE.DirectionalLight( ${default_light_color}, ${default_intensity} ); \n`;
    code_result += `directionalLight.position.set(1, 1, 0.5) \n`;
    code_result += `scene.add( directionalLight ); \n`;
    //default_intensity / 2
    code_result += `const ambientLight = new THREE.AmbientLight( ${default_light_color}, 0.5 ); \n`;
    code_result += `scene.add( ambientLight ); \n`
    code_result += `\n`;

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
                /*optimization idea: if we have mulptile instances of the same geometry
                  then we can just duplicate the same geometry and save a little bit of memory?
                */

                let id = current_node.id;
                let objectName = `${current_node.attr.geometry}_${id}`;
                //setup geometry
                let geometry_type = shape_transform(current_node.attr.geometry);
                let size = parseFloat(current_node.attr.size);
                let geo_params = universal_geo_transform(geometry_type, size);
                code_result += `const geometry_${id} = new THREE.${geometry_type}(${geo_params.param1}, ${geo_params.param2}, ${geo_params.param3}); \n`;
                //set color
                let shape_color = current_node.attr.color;
                shape_color = `0x${color_transform(shape_color)}`;
                code_result += `const material_${id} = new THREE.MeshPhongMaterial( { color: ${shape_color} } ); \n`;
                code_result += `const ${objectName} = new THREE.Mesh( geometry_${id}, material_${id} ); \n`;
                //add to scene
                code_result += `scene.add(${objectName}); \n`;
                //set position
                let x = parseFloat(current_node.attr.pos.x);
                let y = parseFloat(current_node.attr.pos.y);
                let z = parseFloat(current_node.attr.pos.z);
                code_result += `${objectName}.position.set(${x}, ${y}, ${z}); \n`;

                code_result += `\n`;
                break;

            case 'SceneLightAlteration': //since we have a default then this is more of an alteration
                let new_light_color = current_node.attr.color;
                new_light_color = `0x${color_transform(new_light_color)}`;
                code_result += `directionalLight.color.setHex(${new_light_color}); \n`;
                code_result += `ambientLight.color.setHex(${new_light_color}); \n`;
                code_result += `\n`;

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


function universal_geo_transform(geometry, size){
    let geo_params = {
        param1 : 0,
        param2 : 0,
        param3 : 0,
    }
    switch(geometry){
        case 'BoxGeometry':
            geo_params.param1 = size; //ugh feels so repetitive
            geo_params.param2 = size;
            geo_params.param3 = size;
            break;
        
        case 'SphereGeometry':
            geo_params.param1 = size;
            geo_params.param2 = 64;
            geo_params.param3 = 64;
            break;
    }

    return geo_params;
}


function shape_transform(shape){
    var shape_three_map = new Map([
        ['Cube', 'BoxGeometry'],
        ['Sphere', 'SphereGeometry']
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
        ['White', 'ffffff'],
        ['Gray', '808080']
    ])

    return hex_color_map.get(color);
}