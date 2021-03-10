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

//good multiline
const code = `
    Black Scene
    Green Cube Size 1 Position 0 0 -1
    Blue Cube Size 1 Position 2 0 -1
    Red Cube Size 1 Position -2 0 -1
`;

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




const transpiled_result = db3d.transpile(code);
//document append script