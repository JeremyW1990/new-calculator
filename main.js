$(document).ready(initiateApp);

const higerOrderOperators = ['×','÷'];
const operators = ['+', '-','×','÷'];
var lastCalculation = ['+', '0'];

var inputStorage = ['0'];
var latestKeyPressIsEqual = false;
var latestKeyPressIsOperators = false;
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
    latestKeyPressIsEqual = false;
    latestKeyPressIsOperators = true;
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
    console.log('before', inputStorage);
    var val = $(this).text();
    var lastValue = inputStorage[ inputStorage.length - 1 ];
    
    if (isNaN(lastValue)) {
        inputStorage.push(val);
    } else {
        if (lastValue !== '0') {
            if (latestKeyPressIsEqual){
                inputStorage = [];
                lastCalculation = ['+', '0'];
                inputStorage.push(val);
            } else {
                inputStorage[ inputStorage.length - 1 ] += val;
            }
        }
        else 
        inputStorage[ inputStorage.length - 1 ] = val;
    }
    latestKeyPressIsOperators = false;
    latestKeyPressIsEqual = false;
    console.log('after', inputStorage);
    updateDisplay('.expression', inputStorage.join(''));

}

function dotClickHandler(){
    latestKeyPressIsOperators = false;
    latestKeyPressIsEqual = false;
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
    latestKeyPressIsEqual = false;
    latestKeyPressIsOperators = false;
    console.log("E clicked");
    inputStorage = ['0'];
    lastCalculation = ['+', '0'];
    updateDisplay('.expression', inputStorage.join(''));

}

function cEButtonClickHandler(){
    latestKeyPressIsEqual = false;
    latestKeyPressIsOperators = false;
    console.log('CE clicked.');
    inputStorage.pop();
    updateDisplay('.expression', inputStorage.join(''));


}

function equalClickHandler(){
    if (latestKeyPressIsEqual) {
        result = operationRepeat(result, lastCalculation);
        inputStorage = [result];

        updateDisplay('.expression', result);
        updateDisplay('.previousResult', result);
        return;
    }
    console.log('Equal click');
    console.log('inputStorage',inputStorage);
    if (inputStorage.length >=3){

        lastCalculation = inputStorage.slice(inputStorage.length - 2, inputStorage.length); 
    }     
    // record the last two user input for operation repeat .i.e 1 + 1 === 4;
    console.log('lastCalculation',lastCalculation);
    result = calculateWithHigherOrderOperators(inputStorage);
    if (result.length >= 3) {
        result = calculateWithoutHigherOrderOperators(result) 
    }


    if (result.length === 2 ){
        operationRollover()
    };
    result = typeof result ==='number'? result: result[0];
    latestKeyPressIsOperators = false;
    latestKeyPressIsEqual = true;
    
    console.log('finaly result:' , result);
    inputStorage = [result];
    updateDisplay('.expression', result);
    updateDisplay('.previousResult', result);
    console.log('inputStorage',inputStorage);
}


// core calculation logic below

function calculateWithOneOperator(expression){
    let result = 0;
    if (expression.length < 3) return expression;
    console.log('calculateWithOneOperator',expression)
    switch (expression[1]) {
        case '+':
            result = Number(expression[0]) + Number(expression[2]);
            break;
        case '-':
            result = +expression[0] - expression[2];
            break;
        case '×':
            result = +expression[0] *  expression[2];
            break;
        case '÷':
            result = +expression[0] / expression[2];
            break;   
    }
    return result;
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


// Special case :  Operation Repeat 1 + 1 === 4;
function operationRepeat(result, lastCalculation) {
    console.log('operationRepeat:');
    console.log('result: ', result);
    console.log('lastCalculation:' , lastCalculation);
    return calculateWithOneOperator([result].concat(lastCalculation));

}

// Special case :  operation rollover 1 + 1 + = + = 8
function operationRollover (){
    result.push(result[0]);
    lastCalculation = result.slice(result.length - 2, result.length);
    console.log('operationRollover:');
    console.log('lastCalculation:' , lastCalculation);
    result = calculateWithoutHigherOrderOperators(result);
}





//auxllery function below

function isOperators(c) {
    return operators.indexOf(c) === -1 ? false : true;
}
function isHigherOrderOperators (c) {
    return higerOrderOperators.indexOf(c) === -1 ? false : true;
}

function updateDisplay(selector, value){
    if (value == 'Infinity') value = "Error";
    $(selector).text(value);

}
