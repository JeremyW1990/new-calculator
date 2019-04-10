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
    if (lastKeypressRecord.operators){
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
    updateDisplay('.previousResult', '0');

}

function clearEntryButtonClickHandler(){

    console.log('Clear Entry clicked.');
    inputStorage.pop();
    updateDisplay('.expression', inputStorage.join(''));
    resetLastKeypressRecord();
    var lastValue = inputStorage[inputStorage.length -1];
    if (lastValue) {
        if (isOperators(lastValue)) 
            lastKeypressRecord.operators = lastValue
        else 
            lastKeypressRecord.numbers = lastValue;
    } else {
            lastKeypressRecord.isClearButton = true;
            inputStorage = ['0'];
            updateDisplay('.expression', inputStorage.join(''))
    }

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

