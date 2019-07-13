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

