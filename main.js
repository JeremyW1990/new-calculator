$(document).ready(initiateApp);

var inputStorage = ['0'];
const higerOrderOperators = ['×','÷'];
const operators = ['+', '-','×','÷'];
var lastCalculation = ['+', '0'];
var lastestKeyPressIsEqual = false;
var result = 0;


function initiateApp(){
    $('.number').click(numberClickHandler);
    $('.dot').click(dotClickHandler);
    $('.operator').click(operatorClickHandler);
    $('.clear').click(cButtonClickHandler);
    $('.clearEntry').click(cEButtonClickHandler);
    $('.equal').click(equalClickHandler);
}

// different button click handlers below

function operatorClickHandler(){
    lastestKeyPressIsEqual = false;
    console.log('before', inputStorage);
    var op = $(this).text();
    var lastValue = inputStorage[ inputStorage.length - 1 ];
    if (isOperators(lastValue)) 
        inputStorage[ inputStorage.length - 1 ] = op
    else 
        inputStorage.push(op);
    
    console.log('after', inputStorage);
    updateDisplay('.expression',inputStorage.join(''));
}
  
function numberClickHandler(){
    lastestKeyPressIsEqual = false;
    console.log('before', inputStorage);
    var val = $(this).text();
    var lastValue = inputStorage[ inputStorage.length - 1 ];

    if (isNaN(lastValue)) {
        inputStorage.push(val);
    } else {
        if (lastValue !== '0') 
            inputStorage[ inputStorage.length - 1 ] += val 
        else 
            inputStorage[ inputStorage.length - 1 ] = val;
    }
    console.log('after', inputStorage);
    updateDisplay('.expression', inputStorage.join(''));

}

function dotClickHandler(){
    lastestKeyPressIsEqual = false;
    console.log('before', inputStorage);
    var lastValue = inputStorage[ inputStorage.length - 1 ];
    if (isOperators(lastValue)){
        inputStorage.push('0.');
    } else {
        if (lastValue.indexOf('.') === -1) inputStorage[ inputStorage.length - 1 ] += '.'
    }
    updateDisplay('.expression', inputStorage.join(''));
    console.log('after', inputStorage);
}

function cButtonClickHandler(){
    lastestKeyPressIsEqual = false;
    console.log("E clicked");
    inputStorage = ['0'];
    updateDisplay('.expression', inputStorage.join(''));

}

function cEButtonClickHandler(){
    lastestKeyPressIsEqual = false;
    console.log('CE clicked.');
    inputStorage.pop(0);
    updateDisplay('.expression', inputStorage.join(''));


}

function equalClickHandler(){
    if (lastestKeyPressIsEqual) {
        result = operationRepeat(result, lastCalculation);
        updateDisplay('.expression', result);
        updateDisplay('.previousResult', result);
        return;
    }
    lastestKeyPressIsEqual = true;
    console.log('Equal click');
    console.log('inputStorage',inputStorage);
    if (inputStorage.length >=3) lastCalculation = inputStorage.slice(inputStorage.length - 2, inputStorage.length); 
    // record the last two user input for operation repeat .i.e 1 + 1 === 4;
    console.log('lastCalculation',lastCalculation);
    result = calculateWithHigherOrderOperators(inputStorage);
    if (result.length > 1) 
        result = calculateWithoutHigherOrderOperators(result) 
    else 
        result = result[0];
    console.log(result);
    updateDisplay('.expression', result);
    updateDisplay('.previousResult', result);
    console.log('inputStorage',inputStorage);

}


// core calculation logic below

function calculateWithOneOperator(expression){
    let result = 0;

    console.log('calculateWithOneOperator',expression)
    switch (expression[1]) {
        case '+':
            result = Number(expression[0]) + Number(expression[2]);
            break;
        case '-':
            result = +expression[0] - expression[2];
            break;
        case '×':
            result = +expression[0] * expression[2];
            break;
        case '÷':
            result = +expression[0] / expression[2];
            break;   
    }
    return result
}



function calculateWithHigherOrderOperators(expression){
    var stack = [];
    stack[0] = expression[0];
    stackIndex = 0;
    for (let i = 1; i < expression.length; i++){
        if (!isNaN(expression[i])){
            if (isHigherOrderOperators(stack[stackIndex])) {
                result = calculateWithOneOperator([stack[stackIndex-1], stack[stackIndex], expression[i]]);
                stack.splice(stackIndex - 1, 2, result);
                console.log(stack);
                stackIndex --;
            } else {
                stackIndex ++;
                stack.push(expression[i]);
            }
        }else {
            stackIndex ++;
            stack.push(expression[i]);
        }

    }
    console.log(stack)
    return stack;
}

function calculateWithoutHigherOrderOperators(expression) {
    while (expression.length > 3) {        
        var result = calculateWithoutHigherOrderOperators(expression.slice(0,3));
        console.log(result)
        expression = expression.slice(3)
        expression.unshift(result.toString());
        console.log('return expression' , expression);
    }
    return calculateWithOneOperator(expression);
}

function operationRepeat(result, lastCalculation) {
    console.log('operationRepeat', result, lastCalculation)
    return calculateWithOneOperator([result].concat(lastCalculation));

}



//auxllery function below

function isOperators(c) {
    return operators.indexOf(c) === -1 ? false : true;
}
function isHigherOrderOperators (c) {
    return higerOrderOperators.indexOf(c) === -1 ? false : true;
}

function updateDisplay(selector, value){
    $(selector).text(value);
}
