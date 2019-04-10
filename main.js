$(document).ready(initiateApp);

const higerOrderOperators = ['×','÷'];
const operators = ['+', '-','×','÷'];


var result = 0;
var inputStorage = ['0'];
var lastCalculation = [];
var operationRolloverType = null;

var lastKeypressRecord = {
    isClearButton : true,
    isEqualSign : false,
    isDecimalPoint : false,
    operators : null,
    numbers : null
}



function initiateApp(){
    $('.number').click(numberClickHandler);
    $('.dot').click(decimalPointClickHandler);
    $('.operator').click(operatorClickHandler);
    $('.clear').click(clearButtonClickHandler);
    $('.clearEntry').click(clearEntryButtonClickHandler);
    $('.equal').click(equalClickHandler);
}

// ******************** DIFFERENT BUTTON CLICK HANDLERS BELOW ***********************************

function numberClickHandler(){
    console.log('before', inputStorage);
    var val = $(this).text();
    
    if (lastKeypressRecord.isClearButton) {
        inputStorage[0] = val;
    } 
    else if (lastKeypressRecord.numbers || lastKeypressRecord.isDecimalPoint) {
        inputStorage[ inputStorage.length - 1 ] += val;
    } 
    else if (lastKeypressRecord.isEqualSign){
        inputStorage = [];
        inputStorage.push(val);
    } 
    else if (lastKeypressRecord.operators) {
        inputStorage.push(val);
    }
    console.log('after', inputStorage);
    updateDisplay('.expression', inputStorage.join(''));
    resetLastKeypressRecord();
    lastKeypressRecord.numbers = val;
}

function operatorClickHandler(){
    console.log('before', inputStorage);
    var op = $(this).text();
    if (lastKeypressRecord.operators) {
        inputStorage.pop();
        inputStorage.push(op);
    }
    else inputStorage.push(op);
    console.log('after', inputStorage);
    updateDisplay('.expression', inputStorage.join(''));
    resetLastKeypressRecord();
    lastKeypressRecord.operators = op;
}
  


function decimalPointClickHandler(){

    console.log('before', inputStorage);
    var lastValue = inputStorage[ inputStorage.length - 1 ];
    if (lastKeypressRecord.isOperators){
        inputStorage.push('0.');
        resetLastKeypressRecord();
        lastKeypressRecord.isDecimalPoint = true;

    } 
    else if (lastValue.indexOf('.') === -1) {
        inputStorage[ inputStorage.length - 1 ] += '.'
        resetLastKeypressRecord();
        lastKeypressRecord.isDecimalPoint = true;
    }
    updateDisplay('.expression', inputStorage.join(''));
    console.log('after', inputStorage);
}

function clearButtonClickHandler(){
    
    console.log("Clear clicked");
    inputStorage = ['0'];
    lastCalculation = [];
    operationRolloverType = null;
    resetLastKeypressRecord();
    lastKeypressRecord.isClearButton = true;
    updateDisplay('.expression', inputStorage.join(''));
}

function clearEntryButtonClickHandler(){

    console.log('Clear Entry clicked.');
    inputStorage.pop();
    updateDisplay('.expression', inputStorage.join(''));
    resetLastKeypressRecord();
}

function equalClickHandler(){
    console.log('Equal click');
    if (lastKeypressRecord.isEqualSign) {
        console.log('Successive Equal Sign Detected...');
        result = calculateWhenEqualSignSuccessivePressed(result, lastCalculation);
        inputStorage = [result];
        updateDisplay('.expression', result);
        updateDisplay('.previousResult', result);
        return;
    }
    
    if (lastKeypressRecord.operators){
        console.log('Operation Rollover Detected...')
        operationRolloverType = isHigherOrderOperators(lastKeypressRecord.operators) ? 'higherOperators' : 'normalOperators';
    }
    
    calculationInit();
    console.log('inputStorage',inputStorage);
    inputStorage = [result];
    console.log('inputStorage',inputStorage);
    console.log('finaly result:', result);
    updateDisplay('.expression', result);
    updateDisplay('.previousResult', result);
    resetLastKeypressRecord();
    lastKeypressRecord.isEqualSign = true;
}


// **************************  CORE CALCULATION LOGIC BELOW  *********************************

function calculationInit() {
    if (inputStorage.length === 1) {
        result = inputStorage[0];
    }else {
        result = calculateWithHigherOrderOperators(inputStorage);
        if (operationRolloverType === 'higherOperators') calculateOperationRolloverCase(operationRolloverType);
    }

    if (typeof result === 'object' && result.length > 1) {
        result = calculateWithoutHigherOrderOperators(result);
        if (operationRolloverType === 'normalOperators') calculateOperationRolloverCase(operationRolloverType);
    }
    return result;

}

function calculateWithOneOperator(expression){
    if (expression.length < 3 ) return expression;
    recordLastCalculation(expression[1], expression[2]);

    console.log('calculateWithOneOperator', expression)
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
        if ( (!isNaN(expression[i]) && (isHigherOrderOperators(stack[stackIndex])))) { //if it is a number
                result = calculateWithOneOperator([stack[stackIndex-1], stack[stackIndex], expression[i]]);
                stack.splice(stackIndex - 1, 2, result);
                console.log(stack);
                stackIndex --;
        } else {
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
        expression = expression.slice(3)
        expression.unshift(result.toString());
        console.log('return expression' , expression);
    }
    return calculateWithOneOperator(expression);
}


// Special case :  Equal Sign Repeat 1 + 1 === 4;
function calculateWhenEqualSignSuccessivePressed(result, lastCalculation) {
    console.log('calculateWhenEqualSignSuccessivePressed:');
    console.log('result: ', result);
    console.log('lastCalculation:' , lastCalculation);
    return calculateWithOneOperator([result].concat(lastCalculation));

}

// Special case :  operation rollover 1 + 1 + = + = 8
function calculateOperationRolloverCase (operationRolloverType){
    
    console.log("operationRolloverType :" , operationRolloverType);
    result.push(result[result.length -2]);
    console.log('After rollover munipulation result ', result);
    result = operationRolloverType === 'higherOperators' ? calculateWithHigherOrderOperators(result) : calculateWithoutHigherOrderOperators(result);
}


//*************************************AUXILLARY FUNCTION BELOW ******************************** 

function resetLastKeypressRecord(){
    console.log(lastKeypressRecord);
    lastKeypressRecord = {
        isClearButton : false,
        isEqualSign : false,
        isDecimalPoint : false,
        operators : null,
        numbers : null
    }
}

function recordLastCalculation(operator, number){
    lastCalculation = [operator, number];
    console.log("recordLastCalculation: ", lastCalculation)
}

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
