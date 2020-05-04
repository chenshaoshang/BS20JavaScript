var SetItem = document.getElementById('puzzle-item');
var Set_Rnd = document.getElementById('start');
var Get_Auto = document.getElementById('GoAuto')
var CutImg = document.querySelector('#gameset');
var imagebasic = document.querySelector('#gameset').selectedOptions[0].value;
var imgupdate = document.getElementById('inputGroupFile01')
var ChangeImg = document.getElementById('Change');
var ImgContrast = document.getElementById('Contrast')
var white = 1;
var Auto = [];
var puzzleImg = new Image(width = 540, height = 540);
puzzleImg.src = '1016-540x540.jpg';
var ItemArray = SetItem.querySelectorAll('div');
CutImg.addEventListener('change', function () {
    Get_Auto.disabled = true
    imagebasic = document.querySelector('#gameset').selectedOptions[0].value;
    SetItem.innerHTML = ''
    ImgSet();
    Auto = [];
})
ChangeImg.addEventListener('click', function () {
    if (!imgupdate.files[0]) {
        alert('請先上傳圖片')
    } else {
        puzzleImg.src = window.URL.createObjectURL(imgupdate.files[0])
        ImgContrast.src = window.URL.createObjectURL(imgupdate.files[0])
        ImgContrast.style.width = '540px'
        ImgContrast.style.height = '540px'
        SetItem.innerHTML = ''
        ImgSet()
    }

})
Set_Rnd.addEventListener('click', function () {
    if (white > Math.pow(imagebasic, 2)) {
        console.log(white)
        white = Math.floor(Math.random() * Math.pow(imagebasic, 2))
    }
    ItemArray = SetItem.querySelectorAll('div');
    ItemArray.forEach(el => {
        if (el.style.backgroundImage == '') {
            white = el.id
        }
    });
    for (let i = 0; i < 201; i++) {
        ImgRandom(white)
    }
    ImgClick();
    Get_Auto.disabled = false;
    ChangeImg.disabled = true;
})
Get_Auto.addEventListener('click', function () {
    ItemArray.forEach(el => {
        if (el.style.backgroundImage == '') {
            white = el.id
        }
    });
    ImgAuto()
    if (WinCheck()) {
        setTimeout(function () {
            alert('完成了');
        }, 500);
    }
    ChangeImg.disabled = false;
    Get_Auto.disabled = true;
})
Get_Auto.disabled = true;
ImgSet();
ImgClick();

function ImgSet() {
    var index = 1;
    for (let i = 0; i < imagebasic; i++) {
        for (let j = 0; j < imagebasic; j++) {
            let div = document.createElement('div')
            let imgwidth = puzzleImg.width / imagebasic;
            let imgheight = puzzleImg.height / imagebasic;
            div.id = index;
            div.innerText = index
            div.setAttribute('data-key', index)
            div.style.width = imgwidth + 'px'
            div.style.height = imgheight + 'px'
            div.style.backgroundImage = `url('${puzzleImg.src}')`
            div.style.backgroundSize = '540px 540px'
            div.style.backgroundPosition = `-${imgwidth*j}px -${imgheight*i}px`
            SetItem.appendChild(div)
            index++
        }
    }
}

function ImgAuto() {
    let index = Auto.length
    for (let i = 0; i < index; i++) {
        let tmp = Auto.pop();
        let my = ItemArray[white - 1];
        let other = ItemArray[tmp - 1];
        ImgChange(other, my)
        white = other.id;
    }
}

function ImgClick() {
    ItemArray.forEach(element => {
        element.addEventListener('click', function (e) {
            if (MoveCheck(e.target.id) != null) {
                let el = Number(e.target.id)
                let my = ItemArray[el - 1]
                let other = MoveCheck(e.target.id)
                ImgChange(other, my)
                if (WinCheck()) {
                    alert('完成了')
                    ChangeImg.disabled = false;
                }
                Auto.push(other.id)
            }
        })
    });
}

function ImgRandom(el) {
    Auto.push(white);
    imagebasic = Number(imagebasic)
    el = Number(el)
    let ImgArray = [];
    if (el - imagebasic > 0) {
        let div = ItemArray[el - imagebasic - 1]
        if (div.style.backgroundImage) {
            ImgArray.push(div)
        }
    }
    if (el + imagebasic < (Math.pow(imagebasic, 2) + 1)) {
        let div = ItemArray[el + imagebasic - 1]
        if (div.style.backgroundImage) {
            ImgArray.push(div)
        }
    }
    if (LFCheck(el, 1)) {
        let div = ItemArray[el + 1 - 1]
        if (div.style.backgroundImage) {
            ImgArray.push(div)
        }
    }
    if (LFCheck(el, -1)) {
        let div = ItemArray[el - 1 - 1];
        if (div.style.backgroundImage) {
            ImgArray.push(div)
        }
    }
    let r = Math.floor(Math.random() * ImgArray.length)
    let my = ItemArray[el - 1];
    let other = ImgArray[r];
    ImgChange(other, my)
    white = other.id;

}

function ImgChange(a1, a2) {
    if (a1.style.backgroundImage == '') {
        let temp = a2;
        a2 = a1;
        a1 = temp;
    }
    let tmp = a2.getAttribute('data-key')
    let ptmp = a2.style.backgroundPosition
    a2.setAttribute('data-key', a1.getAttribute('data-key'))
    a1.setAttribute('data-key', tmp)
    a2.style.backgroundImage = a1.style.backgroundImage;
    a2.style.backgroundPosition = a1.style.backgroundPosition;
    a1.style.backgroundPosition = ptmp;
    a1.style.backgroundImage = '';
}

function MoveCheck(el) {
    el = Number(el)
    if (el - imagebasic > 0) {
        let div = ItemArray[el - imagebasic - 1]
        if (div.style.backgroundImage == '') {
            return div
        }
    }
    if (el + imagebasic < (Math.pow(imagebasic, 2) + 1)) {
        let div = ItemArray[el + imagebasic - 1]
        if (div.style.backgroundImage == '') {
            return div
        }
    }
    if (LFCheck(el, 1)) {
        let div = ItemArray[el + 1 - 1]
        if (div.style.backgroundImage == '') {
            return div
        }
    }
    if (LFCheck(el, -1)) {
        let div = ItemArray[el - 1 - 1];
        if (div.style.backgroundImage == '') {
            return div
        }
    }
    return null
}

function LFCheck(el, lr) {
    return el + lr > 0 && parseInt((el - 1) / imagebasic) == parseInt((el + lr - 1) / imagebasic)
}

function WinCheck() {
    let condition = true;
    ItemArray.forEach(element => {
        if (element.getAttribute('data-key') != element.id) {
            condition = false;
        }
    });
    return condition
}