const testCases = [
  {
    id: 1,
    expression: "1+2=",
    expect: 3,
  },

  {
    id: 2,
    expression: "1-2=",
    expect: -1,
  },

  {
    id: 3,
    expression: "1×2=",
    expect: 2,
  },

  {
    id: 4,
    expression: "1÷2=",
    expect: 0.5,
  },

  {
    id: 5,
    expression: "1+1+2=",
    expect:4,
  },

  {
    id: 6,
    expression: "1.1+1.1=",
    expect: 2.2,
  },

  {
    id: 7,
    expression: "1...1+1...1=",
    expect: 2.2,
  },

  {
    id: 8,
    expression: "1+++++2=",
    expect: 3,
  },

  {
    id: 9,
    expression: "1+-×÷2=",
    expect: 0.5,
  },

  {
    id: 10,
    expression: "1÷0=",
    expect: "Error",
  },

  {
    id: 11,
    expression: "+++++1×3=",
    expect: 3,
  },

  {
    id: 12,
    expression: "3×=",
    expect: 9,
  },

  {
    id: 13,
    expression: "3=",
    expect: 3,
  },

  {
    id: 14,
    expression: "====",
    expect: 0,
  },

  {
    id: 15,
    expression: "1+3÷4+10×2=",
    expect: 21.75,
  },

  {
    id: 16,
    expression: "1+1===",
    expect: 4,
  },

  {
    id: 17,
    expression: "1+1+=+=",
    expect: 8,
  },

  {
    id: 18,
    expression: "1+1+=+=",
    expect: 'Wrong on purpose',
  },

];


function renderTestCaseToTable(){

  for (var testCase of testCases){
    $('tbody').append(`  
      <tr class="test-row ${testCase.id}">
        <td>${testCase.id}</th>
        <td>${testCase.expression}</td>
        <td>${testCase.expect}</td>
        <td></td>
      </tr>`
    )
  }
};


function autoInputTestCases(expression){
  /* Clear the previous test case result */
  $('.clear').click();

  for (var input of expression){
    $(`button:contains(${input})`).click();
  }


}

function verifyResult(actualResult, expect){
   return actualResult == expect;
}

function renderTestResult(id, pass, actualResult){

  const resultClass = pass ? 'success' : 'danger';
  $(`.test-row.${id} > td:last-of-type`).text(actualResult);
  $(`.test-row.${id}`).addClass(resultClass);
}

function runRegressionTest(){
  for (var testCase of testCases){
    autoInputTestCases(testCase.expression);
    const actualResult = $('.expression').text();
    var pass = verifyResult(actualResult , testCase.expect);
    renderTestResult(testCase.id, pass, actualResult)
  }
  $('.clear').click();

}
