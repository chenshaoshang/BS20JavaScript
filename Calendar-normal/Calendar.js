var StartDay = new Date()
var Condition = new Date()
var tbody = document.getElementById('tbody');
var tds = document.getElementsByClassName('mon')
var save = document.getElementById('save')
var localchange = document.getElementById('change')
var key = '';
var tempkey = '';
CreateTable();
document.getElementById('left').addEventListener('click', function () {
    Condition.setMonth((Condition.getMonth() - 1))
    CreateTable();
})
document.getElementById('right').addEventListener('click', function () {
    Condition.setMonth((Condition.getMonth() + 1))
    CreateTable();
})

function CreateTable() {
    tbody.innerHTML = '';
    StartDay = new Date(Condition.getFullYear(), Condition.getMonth());
    StartDay.setDate(1);
    document.getElementById('year').innerText = StartDay.getFullYear();
    document.getElementById('month').innerText = StartDay.getMonth() + 1;
    while (StartDay.getDay() != 0) {
        StartDay.setDate(StartDay.getDate() - 1)
    }
    for (let i = 0; i < 6; i++) {
        let trs = document.createElement('tr')
        tbody.appendChild(trs);
        for (let j = 0; j < 7; j++) {
            let mon = StartDay.getMonth() + 1
            let day = StartDay.getDate();
            let tds = document.createElement('td')
            let num = document.createElement('span')
            num.innerText = StartDay.getDate();
            tds.appendChild(num)
            trs.appendChild(tds)
            if (StartDay.getMonth() != Condition.getMonth()) {
                tds.classList.add('last_mon')
            } else {
                tds.classList.add('mon')
                tds.addEventListener('click', function (e) {
                    $('#exampleModal').modal('show');
                    let save = document.getElementById('save')
                    save.classList.remove('d-none')
                    save.classList.add('d-inline-block')
                    let change = document.getElementById('change')
                    change.classList.remove('d-inline-block')
                    change.classList.add('d-none')
                    let labelshow = document.getElementById('localdate')
                    labelshow.innerText = `日期：${StartDay.getFullYear()}年${mon}月${day}日`
                    tempkey = `${StartDay.getFullYear()}${mon}${day}`
                    document.getElementById('localtime').value = '',
                        document.getElementById('localtxt').value = ''
                })
            }
            if (StartDay.getDate() == Condition.getDate()) {
                tds.classList.add('StartDay')
            }
            if (StartDay.getDay() == 0 || StartDay.getDay() == 6) {
                tds.classList.add('weekend')
            } else {
                tds.classList.add('WeekDays')
            }
            key = StartDay.getFullYear();

            if (StartDay.getMonth() + 1 < 10) {
                mon = mon.toString().padStart(2, '0');
                key += mon
            } else {
                key += mon.toString();
            }
            if (StartDay.getDate() < 10) {
                day = day.toString().padStart(2, '0');
                key += day
            } else {
                key += day.toString();
            }
            if (localStorage.getItem(key) != null) {
                let total = document.createElement('button')
                let el = JSON.parse(localStorage.getItem(key))
                total.innerText = el.schedule.length + '件'
                total.value = el.schedule.length
                tds.appendChild(total)
                total.classList.add('btn', 'btn-primary', 'item')
                total.addEventListener('click', (e) => {
                    $('#modalitem').modal('show')
                    $('#exampleModal').modal('hide')
                    document.getElementById('modalTitle').innerText = el.date
                    localcreate(el)
                    e.stopPropagation();
                })
            }
            StartDay.setDate(StartDay.getDate() + 1)
        }
    }
}


save.addEventListener('click', function () {
    if (document.getElementById('localtime').value == '' || document.getElementById('localtxt').value == '') {
        save.removeAttribute('data-dismiss')
    } else {
        modallit()
        save.setAttribute('data-dismiss', 'modal')
        CreateTable()
    }
})

function modallit() {
    var item = {
        time: document.getElementById('localtime').value,
        thing: document.getElementById('localtxt').value,
    }
    if (localStorage.getItem(tempkey) == null) {
        var date = {
            date: tempkey,
            schedule: []
        }
        date.schedule.push(item);
        localStorage.setItem(tempkey, JSON.stringify(date))
    } else {
        var items = JSON.parse(localStorage.getItem(tempkey))
        items.schedule.push(item)
        localStorage.setItem(tempkey, JSON.stringify(items))
    }
    document.getElementById('localtime').value = ''
    document.getElementById('localtxt').value = ''
}

function localcreate(el) {
    let setitem = document.getElementById('localset');
    setitem.innerHTML = ''
    el.schedule.forEach((element, key) => {
        templatecrete(element, key)
    });
    let change = document.querySelectorAll('.btn-outline-success')
    change.forEach(element => {
        element.addEventListener('click', function (e) {
            var tmpnum = e.target.value
            let labelshow = document.getElementById('localdate')
            labelshow.innerText = '日期：' + el.date
            document.getElementById('localtime').value = el.schedule[tmpnum].time
            document.getElementById('localtxt').value = el.schedule[tmpnum].thing
            let change = document.getElementById('change')
            change.classList.remove('d-none')
            change.classList.add('d-inline-block')
            change.value = e.target.value
            let save = document.getElementById('save')
            save.classList.remove('d-inline-block')
            save.classList.add('d-none')
            $('#exampleModal').modal('show')
            $('#modalitem').modal('hide')
        })
    });
    let remove = document.querySelectorAll('.btn-outline-danger')
    remove.forEach(element => {
        element.addEventListener('click', function (e) {
            var tmpnum = e.target.value
            let tmp = JSON.parse(localStorage.getItem(el.date))
            tmp.schedule.splice(tmpnum, 1)
            localStorage.setItem(el.date, JSON.stringify(tmp))
            if (!tmp.schedule.length) {
                localStorage.removeItem(el.date)
            }
            CreateTable();
            $('#modalitem').modal('hide')
        })
    });


}

function templatecrete(el, key) {
    let item = document.getElementById('templateitem')
    let setitem = document.getElementById('localset');
    let cloneContent = item.content.cloneNode(true);
    let spanadd = cloneContent.querySelectorAll('span');
    let btns = cloneContent.querySelectorAll('button')
    btns[0].value = key
    btns[1].value = key
    spanadd[0].textContent = el.time;
    spanadd[1].textContent = el.thing;
    setitem.appendChild(cloneContent)
}
localchange.addEventListener('click', function (e) {
    let tmpnum = e.target.value;
    var labelshow = document.getElementById('localdate').innerText;
    labelshow = labelshow.substring(3);
    let tmp = JSON.parse(localStorage.getItem(labelshow));
    var item = {
        time: document.getElementById('localtime').value,
        thing: document.getElementById('localtxt').value,
    }
    tmp.schedule.splice(tmpnum, 1, item);
    localStorage.setItem(labelshow, JSON.stringify(tmp));
    CreateTable();
})