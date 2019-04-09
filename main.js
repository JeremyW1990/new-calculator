$(document).ready(initiateApp);

var inputStorage = ['0'];
const higerOrderOperators = ['×','÷'];
const operators = ['+', '-','×','÷'];

function initiateApp(){
    $('.number').click(numberClickHandler);
    $('.dot').click(dotClickHandler);
    $('.operator').click(operatorClickHandler);
    $('.clear').click(cButtonClickHandler);
    $('.clearEntry').click(cEButtonClickHandler);
    $('.equal').click(equalClickHandler);
}

function operatorClickHandler(){
    console.log('before', inputStorage);
    var op = $(this).text();
    var lastValue = inputStorage[ inputStorage.length - 1 ];
    if (isOperators(lastValue)) 
        inputStorage[ inputStorage.length - 1 ] = op
    else 
        inputStorage.push(op)
    
    console.log('after', inputStorage);
}
  
function numberClickHandler(){
    console.log('before', inputStorage);
    var val = $(this).text();
    var lastValue = inputStorage[ inputStorage.length - 1 ];

    if (isNaN(lastValue)) {
        inputStorage.push(val);
    } else {
        inputStorage[ inputStorage.length - 1 ] += val;
    }
    console.log('after', inputStorage);
}

function dotClickHandler(){
    console.log('before', inputStorage);
    var lastValue = inputStorage[ inputStorage.length - 1 ];
    if (lastValue.indexOf('.') === -1) inputStorage[ inputStorage.length - 1 ] += '.';
    console.log('after', inputStorage);

}

function cButtonClickHandler(){
    console.log("E clicked");
    inputStorage = ['0'];
}

function cEButtonClickHandler(){
    console.log('CE clicked.')
}

function equalClickHandler(){
    console.log('Equal click')
    let  result = calculateWithHigherOrderOperators(inputStorage);
    if (result.length > 1) 
        result = calculateWithoutHigherOrderOperators(result) 
    else 
        result = result[0];
    console.log(result);
}


function calculateWithOneOperator(express){
    let result = 0;
    express[0] = + express[0];
    express[2] = + express[2];   
    switch (express[1]) {
        case '+':
            result = express[0] + express[2];
            break;
        case '-':
            result = express[0] - express[2];
            break;
        case '×':
            result = express[0] * express[2];
            break;
        case '÷':
            result = express[0] / express[2];
            break;   
    }
    return result
}



function calculateWithHigherOrderOperators(express){
    var stack = [];
    stack[0] = express[0];
    stackIndex = 0;
    for (let i = 1; i < express.length; i++){
        if (!isNaN(express[i])){
            if (isHigherOrderOperators(stack[stackIndex])) {
                result = calculateWithOneOperator([stack[stackIndex-1], stack[stackIndex], express[i]]);
                stack.splice(stackIndex - 1, 2, result);
                console.log(stack);
                stackIndex --;
            } else {
                stackIndex ++;
                stack.push(express[i]);
            }
        }else {
            stackIndex ++;
            stack.push(express[i]);
        }

    }
    console.log(stack)
    return stack;
}

function calculateWithoutHigherOrderOperators(express) {
    while (express.length > 3) {        
        var result = calculateWithoutHigherOrderOperators(express.slice(0,3));
        console.log(result)
        express = express.slice(3)
        express.unshift(result.toString());
        console.log('return express' , express);
    }
    return calculateWithOneOperator(express);
}


function isOperators(c) {
    return operators.indexOf(c) === -1 ? false : true;
}
function isHigherOrderOperators (c) {
    return higerOrderOperators.indexOf(c) === -1 ? false : true;
}