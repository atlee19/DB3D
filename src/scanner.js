//case sensitive -> yes

//4 Token types
//color
//shape
//size
//position

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
    - What about new line? \n
*/

export default function scanner(source){
    var tokens = [];
    //there's no identifiers in this language
    //only keywords. so no reason to sift through each char we can split each word
    const words = source.split(' ');
    //array["Green", "Cube", "Size", "1", "Position", "0", "0", "-1"]
    var no_error_present = true;

    const keywords = new Map([
        ['Red', 'Color'],
        ['Green', 'Color'],
        ['Blue', 'Color'],
        ['Cube', 'Shape'],
        ['Sphere', 'Shape'],
        ['Cone', 'Shape'],
        ['Size', 'Size'],
        ['Position', 'Position']
    ])

    words.every(word => {
       //if it matches a keyword in the color map
       //the token should look like this 'Color' : 'Green'
       if(isNaN(word)){
           if (keywords.has(word)){
                tokens.push({ type : keywords.get(word), value : word });
                return no_error_present;
           }
           else {
               //we should keep a list of unrecognized words causing errors
               //instead of pausing execution? And then when theres an error 
               //in the ast we can display them all.
               console.log(`%c Unrecognized word: ${word}`, 'color : red');
               no_error_present = false;
               return no_error_present;
           }
       }
       else {
           //what about floats?
           tokens.push({ type : 'Number', value : parseFloat(word) });
           return no_error_present;
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