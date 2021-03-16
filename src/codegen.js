//alot of what we'll be doing in here involves metaprogramming
//this is really where the transpiling takes place. Javascript/three.js 
//is our target.
//should we create a file or return one large string?
//go with 1 large string for now.

export default function codegen(three_ast){
    // console.log(three_ast);
    var code_result = ``;

    //intial scene setup
    code_result += `var scene = new THREE.Scene(); \n`;
    let default_bg_color = three_ast.attr.background;
    code_result += `scene.background = new THREE.Color( ${default_bg_color} ); \n`;
    code_result += `var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight , 0.1, 1000 ); \n`;
    code_result += `camera.position.z = 5; \n`;
    code_result += `var dbcanvas = document.getElementById( 'db3d-canvas' ); \n` //specific to demo page
    code_result += `var container = document.getElementById( 'scene-container' ); \n`
    code_result += `var renderer = new THREE.WebGLRenderer({ antialias: true, canvas : dbcanvas }); \n`;
    code_result += `renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 ); \n`;
    code_result += `renderer.gammaFactor = 2.2; \n`;
    code_result += `renderer.outputEncoding = THREE.sRGBEncoding; \n`;
    code_result += `container.appendChild( renderer.domElement ); \n`
    code_result += `\n`
    
    //window resizing code
    code_result += `window.addEventListener('resize', function(){
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width / 2, height / 2);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    })
\n`;
    
    //setup default lighting - I don't love this implmentation
    var default_light_color = three_ast.attr.color;
    var default_intensity = three_ast.attr.intensity;
    code_result += `var directionalLight = new THREE.DirectionalLight( ${default_light_color}, ${default_intensity} ); \n`;
    code_result += `directionalLight.position.set(1, 1, 0.5) \n`;
    code_result += `scene.add( directionalLight ); \n`;
    //default_intensity / 2
    code_result += `var ambientLight = new THREE.AmbientLight( ${default_light_color}, 0.5 ); \n`;
    code_result += `scene.add( ambientLight ); \n`
    code_result += `\n`;
    // code_result += `var hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4); \n`;
    // code_result += `scene.add(hemiLight);\n`;

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
                // let geo_params = universal_geo_transform(geometry_type, size);
                let geo_func = param_transform(geometry_type, size);
                code_result += `var geometry_${id} = new THREE.${geo_func}; \n`;
                //set color
                let shape_color = current_node.attr.color;
                shape_color = `0x${color_transform(shape_color)}`;
                code_result += `var material_${id} = new THREE.MeshPhongMaterial( { color: ${shape_color} } ); \n`;
                code_result += `material_${id}.color.convertSRGBToLinear(); \n`;
                code_result += `var ${objectName} = new THREE.Mesh( geometry_${id}, material_${id} ); \n`;
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
    code_result += `var animate = function () { \n`
    code_result += `    requestAnimationFrame( animate ); \n`
    code_result += `    renderer.render( scene, camera ); \n`
    code_result += `}; \n`;
    code_result += `animate();`;

    return code_result;
}


function param_transform(geometry, size){
    let completed_func = geometry; 
    let func_args = '';
    switch (geometry){
        case 'BoxGeometry':
            func_args = `(${size}, ${size}, ${size})`;
            completed_func += func_args;
            break;

        case 'SphereGeometry':
            func_args = `(${size}, 64, 64)`;
            completed_func += func_args;
            break;

        case 'CylinderGeometry':
            func_args = `(${size}, ${size}, ${size}, 64)`;
            completed_func += func_args;
            break;
        
        case 'ConeGeometry':
            func_args = `(${size}, 2, 64)`;
            completed_func += func_args;
            break;

    }
    return completed_func;
}


function shape_transform(shape){
    var shape_three_map = new Map([
        ['Cube', 'BoxGeometry'],
        ['Sphere', 'SphereGeometry'],
        ['Cylinder', 'CylinderGeometry'],
        ['Cone', 'ConeGeometry'],
        //add etc.
    ])

    return shape_three_map.get(shape);
}


function color_transform(color){
    var hex_color_map = new Map([
        ['Red', 'f94144'],
        ['Green', '40916c'],
        ['Lime', '70e000'],
        ['Blue', '118ab2'],
        ['Aqua', '9bf6ff'],
        ['Purple', '9d4edd'],
        ['Yellow', 'ffba08'],
        ['Orange', 'f3722c'],
        ['Black', '212529'],
        ['White', 'fffffc'],
        ['Gray', 'adb5bd']
    ])

    return hex_color_map.get(color);
}