import scanner from './scanner.js';
import parser from './parser.js';
import transformer from './transformer.js';
import codegen from './codegen.js';

var db3d = {}
db3d.version = '0.0.1';
db3d.scanner = scanner;
db3d.parser = parser;
db3d.transformer = transformer;
db3d.codegen = codegen;

db3d.transpile = function(code){
    let tokens = this.scanner(code);
    // console.log('TOKENS:');
    // console.log(tokens);
    let ast = this.parser(tokens);
    // console.log('AST:');
    // console.log(ast);
    let three_ast = this.transformer(ast);
    // console.log('Three AST:')
    // console.log(three_ast);
    let code_result = this.codegen(three_ast);
    console.log(code_result);

    //later on we might want to seperate this logic from transpile function
    let script = document.createElement('script');
    script.innerHTML = code_result;
    document.body.appendChild(script);
}

//TEST CASES

//good code
// const code = 'Green Cube Size 1 Position 0 0 -1'; 

//spelling mistake
// const code = 'Green Cube Size 1 Postion 0 0 -1'

//unrecognized word
// const code = 'sdaa Cube Size 1 Position 0 0 -1';

//is scene creation optional or mandatory?
// const code = 'Black Scene'; 
//it should be optional. Like in DBN if paper is not present then its just white

//transformation error - no size or pos
// const code = 'Blue Cube';

//good multiline
const code = `
    Gray Scene
    White Light
    Lime Sphere Size 0.7 Position 0 0 -1
    Orange Cube Size 1 Position 2 0 -1
    White Cube Size 1 Position -2 0 -1
`;

// const code = `
//     Black Scene
//     Blue Sphere Size 0.5 Position 0 0 0
//     Blue Sphere Size 0.5 Position 0 1.5 0
//     Blue Sphere Size 0.5 Position 0 -1.5 0

//     Green Sphere Size 0.4 Position 1.5 0 0
//     Green Sphere Size 0.4 Position -1.5 0 0

//     Red Sphere Size 0.3 Position 2.5 0 0
//     Red Sphere Size 0.3 Position -2.5 0 0

//     Purple Sphere Size 0.3 Position 1.5 1.5 0
//     Purple Sphere Size 0.3 Position -1.5 1.5 0
// `;

// const code = `
//     White Scene
//     White Light
    
//     Green Cube Size 1 Position 0 0 -1
//     Blue Cube Size 1 Position 2 0 -1
//     Red Cube Size 1 Position -2 0 -1

//     Green Cube Size 1 Position 0 -2 -1
//     Red Cube Size 1 Position -2 -2 -1
//     Blue Cube Size 1 Position 2 -2 -1

//     Green Cube Size 1 Position 0 2 -1
//     Red Cube Size 1 Position -2 2 -1
//     Blue Cube Size 1 Position 2 2 -1
// `;

//not our error: Blue Cube

//White Light //default light
//or
//White DirectionalLight Position 0 10 0
//White AmbientLight

//faulty arugments
// const code = `
//     Black Scene
//     Green Cube Size 1 Position 11 -1
// `;
/*
    If a user fixes 1 syntax error then another pops up right after they fix it
    they're going to get stuck in a game of wackamole. Since we have such a simplistic
    language we might not need to handles this but take it under consideration.
*/

db3d.transpile(code);
