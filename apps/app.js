const btnTimes = document.getElementById('ocultar');
const btnBars = document.getElementById('listarnav');
const signIn = document.getElementById('signIn');
const sectionLogin = document.getElementById('sectionLogin');

const myFunc = (navCondition) => {
    if (navCondition === 'open') {
        btnTimes.style.display = "block";
        btnBars.style.display = "none";       
    } else if (navCondition === 'close') {
        btnTimes.style.display = "none";
        btnBars.style.display = "block";
    }
}

const login = (navCondition) => {
    if (navCondition === 'true') {
        sectionLogin.style.display = "grid";
    } else {
        sectionLogin.style.display = "none";
    }
}

signIn.addEventListener('click', () => {
    const isLoginVisible = sectionLogin.style.display === "block";
    login(isLoginVisible ? 'false' : 'true');
});

btnBars.addEventListener('click', () => myFunc('open'));
btnTimes.addEventListener('click', () => myFunc('close'));
