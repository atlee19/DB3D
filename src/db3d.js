import scanner from './scanner.js';


var db3d = {}
db3d.version = '0.0.1';
db3d.scanner = scanner;
// db3d.parser = parser;
// db3d.transformer = transformer;
// db3d.codegen = codegen;

db3d.transpile = function(code){
    this.scanner(code);
}

//good code
const code = 'Green Cube Size 1 Position 0 0 -1'; 

//spelling mistake
// const code = 'Green Cube Size 1 Postion 0 0 -1'

//unrecognized word
// const code = 'sdaa Cube Size 1 Position 0 0 -1';
const transpiled_result = db3d.transpile(code);
//document append script