async function runTests() {
    const length = Number(lengthLabel.innerHTML);
    console.log('length: ', length);
    const passwords = []
    for (let i = 0; i < 1000; i++) {
        const password = await generatePassword(length);
        passwords.push(password);
    }
    const lowCaseChars = new Symbols('abcdefghijklmnopqrstuvwxyz', /[a-z]/);
    const upperCaseChars = new Symbols('ABCDEFGHIJKLMNOPQRSTUVWXYZ', /[A-Z]/);
    const numbers = new Symbols('0123456789', /\d/);
    const specialSymbols = new Symbols('!#$%&()*+,-./:;<=>?@[\]^_{|}~', /[!#$%&()\*\+,-.\/:;<=>?@\[\]\^_{|}~]/);

    let counter = {
        tests: 0,
        wrong: 0,
        wrongs: [],
        wrongTypes: [],
    };
    passwords.forEach((pass) => {
        if (!lowCaseChars.getRegex().test(pass)) {
            console.log('no lowCaseChars!');
            counter.wrong++;
            counter.wrongs.push(pass);
            if (!counter.wrongTypes.includes('lowCaseChars')) {
                counter.wrongTypes.push('lowCaseChars');
            }
        } else if (!upperCaseChars.getRegex().test(pass)) {
            console.log('no upperCasechars!');
            counter.wrong++;
            counter.wrongs.push(pass);
            if (!counter.wrongTypes.includes('upperCaseChars')) {
                counter.wrongTypes.push('upperCaseChars');
            }
        } else if (!numbers.getRegex().test(pass)) {
            console.log('no numbers!');
            counter.wrong++;
            counter.wrongs.push(pass);
            if (!counter.wrongTypes.includes('numbers')) {
                counter.wrongTypes.push('numbers');
            }
        } else if (!specialSymbols.getRegex().test(pass)) {
            console.log('no special symbols!');
            counter.wrong++;
            counter.wrongs.push(pass);
            if (!counter.wrongTypes.includes('specialSymbols')) {
                counter.wrongTypes.push('specialSymbols');
            }
        }
        counter.tests++
        console.log('counter.tests: ', counter.tests);
    });
    console.log('wrongTypes: ', counter.wrongTypes);
    console.log('counter.Wrongs: ', counter.wrongs);
}

const testButton = document.querySelector('button[name=test]');
testButton.addEventListener('click', runTests);