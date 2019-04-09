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


function updateDisplay(selector, value){
    $(selector).text(value);
}

function operatorClickHandler(){
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
        if (lastValue !== '0') 
            inputStorage[ inputStorage.length - 1 ] += val 
        else 
            inputStorage[ inputStorage.length - 1 ] = val;
    }
    console.log('after', inputStorage);
    updateDisplay('.expression', inputStorage.join(''));

}

function dotClickHandler(){
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
    console.log("E clicked");
    inputStorage = ['0'];
    updateDisplay('.expression', inputStorage.join(''));

}

function cEButtonClickHandler(){
    console.log('CE clicked.');
    inputStorage.pop(0);
    updateDisplay('.expression', inputStorage.join(''));


}

function equalClickHandler(){
    console.log('Equal click')
    let  result = calculateWithHigherOrderOperators(inputStorage);
    if (result.length > 1) 
        result = calculateWithoutHigherOrderOperators(result) 
    else 
        result = result[0];
    console.log(result);
    updateDisplay('.expression', result);
    updateDisplay('.previousResult', result);

}


function calculateWithOneOperator(expression){
    let result = 0;
    switch (expression[1]) {
        case '+':
            result = expression[0] + expression[2];
            break;
        case '-':
            result = expression[0] - expression[2];
            break;
        case '×':
            result = expression[0] * expression[2];
            break;
        case '÷':
            result = expression[0] / expression[2];
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


function isOperators(c) {
    return operators.indexOf(c) === -1 ? false : true;
}
function isHigherOrderOperators (c) {
    return higerOrderOperators.indexOf(c) === -1 ? false : true;
}

