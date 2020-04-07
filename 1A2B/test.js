var guess = '';

function SetRandom() {
    while (guess.length < 4) {
        let temp = Math.floor(Math.random() * 10);
        if (!guess.includes(temp.toString())) {
            guess += temp;
        }
    }
}
for (let i = 0; i < 100; i++) {
    SetRandom(guess);
    guess = '';
}