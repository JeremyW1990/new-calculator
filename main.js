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



