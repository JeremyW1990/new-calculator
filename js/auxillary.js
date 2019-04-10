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
