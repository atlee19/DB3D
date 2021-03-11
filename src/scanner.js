//case sensitive -> yes

//5 Token types
//color
//shape
//size
//position
//light

//you really need to emphasize the difference between the scanner 
//and the parser

//Input: Green Cube Size 1 Position 0 0 -1
/*Expected output: tokens:[
    { type : 'Color', value : 'Green' },
    { type : 'Shape', value : 'Cube' },
    { type : 'Size', value : 1},
    { type : 'Position', values : [0,0,-1]}
]  
*/

/*
    Possibile errors:
    - Might need to create a seperate error reporting object
*/

export default function scanner(source){
    var tokens = [];
    //there's no identifiers in this language
    //only keywords. so no reason to sift through each char we can split each word
    //ignore all whitespace
    const words = source.replaceAll(/\s/g, ' ').split(' ');
    //array["Green", "Cube", "Size", "1", "Position", "0", "0", "-1"]

    //idea: ['Color', ['Red', 'Green', 'Blue', ...]]
    const keywords = new Map([
        ['Red', 'Color'],
        ['Green', 'Color'],
        ['Blue', 'Color'],
        ['Black', 'Color'],
        ['White', 'Color'],
        ['Gray', 'Color'], 
        ['Cube', 'Shape'],
        ['Sphere', 'Shape'],
        ['Scene', 'Scene'],
        ['Size', 'Size'],
        ['Position', 'Position'],
        ['Light', 'Light'],
    ])

    words.forEach(word => {
       //if it matches a keyword in the color map
       //the token should look like this 'Color' : 'Green'
       if(isNaN(word)){
           if (keywords.has(word)){
                tokens.push({ type : keywords.get(word), value : word });
           }
           //not in our keyword map
           else 
           {
                //we should keep a list of unrecognized words causing errors
                //instead of pausing execution? And then when theres an error 
                //in the ast we can display them all.
                console.log(`%c [Scanning error]: Unrecognized word: ${word}`, 'color : red');
                //consume it and the parser will take care of it - not best solution
                tokens.push({ type : 'unrecognized', value : word });
           }
       }
       //is a number or whitespace
       else { 
           if(word != ""){
                //don't do type conversion yet
                tokens.push({ type : 'Number', value : word });
           }
       }

       //match a keyword in the shapes map
       //the token should look like this 'Shape' : 'Cube'


      //there are 2 possible styles for the rest

      //match a param-oriented keywords map 
      //NOPE - this is not the job of a scanner/lexer 
      //the token should be 'Size' : 1 and 'Position' : {x : 0, y : 0, z : 0}
      //in this manner checks can be performed right away

      //what about information pertaining to line error?

    });

    return tokens;

}