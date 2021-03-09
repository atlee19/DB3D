import scanner from './scanner.js';
import parser from './parser.js';

var db3d = {}
db3d.version = '0.0.1';
db3d.scanner = scanner;
db3d.parser = parser;
// db3d.transformer = transformer;
// db3d.codegen = codegen;

db3d.transpile = function(code){
    let tokens = this.scanner(code);
    console.log('TOKENS:');
    console.log(tokens);
    this.parser(tokens);
}

//good code
// const code = 'Green Cube Size 1 Position 0 0 -1'; 

//spelling mistake
// const code = 'Green Cube Size 1 Postion 0 0 -1'

//unrecognized word
// const code = 'sdaa Cube Size 1 Position 0 0 -1';

//is scene creation optional or mandatory?
// const code = 'Black Scene'; 
//it should be optional. Like in DBN if paper is not present then its just white

const code = `
    Black Scene
    Green Cube Size 1 Position 0 0 -1
`;

//faulty arugments
// const code = `
//     Black Scene
//     Green Cube Size aa Position 0 0 -1
// `;

const transpiled_result = db3d.transpile(code);
//document append script