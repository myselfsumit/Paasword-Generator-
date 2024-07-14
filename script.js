const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');

const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox]'); 
const symbols = '~`!@#$%^&*(()_+{}|\-=";:<>,.?/';

//Initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//Set strength circle color to grey
setIndicator('#ccc'); 


//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch v krna chahie?
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow set krna hai
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));  
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,91)); 
}

function generateSymbol(){
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }         
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked) checkCount++;
    });

    //Special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', ()=>{

    if(checkCount == 0) return;

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the journey to start new password

    //firstly to remove old password
    password = "";

    //We do same task using different method
    // if(uppercaseCheck.checked) {
    //     password += generateUppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateUppercase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];

    if(uppercaseCheck.checked){
        funArr.push(generateUppercase);
    }

    if(lowercaseCheck.checked){
        funArr.push(generateLowercase);
    }

    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }

    //Compulsory Addition
    for(let i=0; i<funArr.length; i++)
    {
        password += funArr[i]();
    }

    //remaining addition
    for(let i=0; i<passwordLength-funArr.length; i++){
        let rndIndx = getRandomInteger(0, funArr.length);
        password += funArr[rndIndx]();        
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));
    
    //show in UI
    passwordDisplay.value = password;
    //calc the strength
    calcStrength();
});



 

