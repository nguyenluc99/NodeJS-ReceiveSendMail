var pdfreader = require('pdfreader')
const pdf = require('pdf-parse')
const fs = require('fs')
    // var rows = {}; // indexed by y-position
    // function printRows() {
    //     Object.keys(rows) // => array of y-positions (type: float)
    //         .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    //         .forEach(y => console.log((rows[y] || []).join("")));
    // }

// new pdfreader.PdfReader().parseFileItems("./files/msg.pdf", function(err, item) {
//     console.log(12, err, item)
//         // if (!item || item.page) {
//         //     // end of file, or page
//         //     printRows();
//         //     console.log("PAGE:", item.page);
//         //     rows = {}; // clear rows for next page
//         // } else if (item.text) {
//         //     // accumulate text items into rows object, per line
//         //     (rows[item.y] = rows[item.y] || []).push(item.text);
//         // }
// });
var listName = []
var listEmail = []
var listPhone = []
var listDateOfBirth = []
var address = []
var gender = []
const filename1 = "./cv/CAO ĐỨC ĐẠI_CHUYÊN VIÊN NHÂN SỰ (1).pdf"
const filename2 = "./cv/Lê_Thị_Thanh_Nhàn_Ứng_tuyển_Chuyên.pdf"
const filename3 = "./cv/Quách Minh Hồng - NV HCNS.pdf"
fs.readFile(filename3, (error, data) => {
    if (error) return console.log(26, error)
    pdf(data).then(data => {
        let array = data.text.split('.\n')
            // console.log(36, array)
            // console.log(377, checkPhoneNumber(info[4]))
            // console.log(info[4].length)
            // console.log(40000, checkDateOfBirth(info[9]))
            // console.log(40, info)
            // console.log(40, typeof(info[4][0]))
        for (let i = 0; i < array.length; i++) {
            const element = array[i].split("\n");
            for (let j = 0; j < element.length; j++) {
                const text = element[j];
                if (checkName(text)) {
                    listName[listName.length] = checkName(text)
                } else if (checkMail(text)) {
                    listEmail[listEmail.length] = checkMail(text)
                } else if (checkPhoneNumber(text)) {
                    listPhone[listPhone.length] = checkPhoneNumber(text)
                } else if (checkDateOfBirth(text)) {
                    listDateOfBirth[listDateOfBirth.length] = checkDateOfBirth(text)
                }

            }
        }
    }).then(result => {
        console.log(52, listName)
        console.log(53, listEmail)
        console.log(54, listPhone)
        console.log(55, listDateOfBirth)
    }).catch(error => {
        console.log(31, error)
    })
})

const lastNameArray = ["Cao", "Nguyễn", "Hoàng", "LÊ", "QUÁCH"]
const additionalCha = ["Đ", "đ", "ư", "Ư", "ê", "Ê", "ô", "Ô", "ơ", "Ơ", "ă", "Ă", "â", "Â",
    "ừ", "Ừ", "ề", "Ề", "ồ", "Ồ", "ờ", "Ờ", "ằ", "Ằ", "ầ", "Ầ", "ù", "Ù", "è", "È", "ò", "Ò", "à", "À", "ì", "Ì", "ỳ", "Ỳ",
    "ứ", "Ứ", "ế", "Ế", "ố", "Ố", "ớ", "Ớ", "ắ", "Ắ", "ấ", "Ấ", "ú", "Ú", "é", "É", "ó", "Ó", "á", "Á", "í", "Í", "ý", "Ý",
    "ử", "Ử", "ể", "Ể", "ổ", "Ổ", "ở", "Ở", "ẳ", "Ẳ", "ẩ", "Ẩ", "ủ", "Ủ", "ẻ", "Ẻ", "ỏ", "Ỏ", "ả", "Ả", "ỉ", "Ỉ", "ỷ", "Ỷ",
    "ữ", "Ữ", "ễ", "Ế", "ỗ", "Ỗ", "ỡ", "Ỡ", "ẵ", "Ẵ", "ẫ", "Ẫ", "ũ", "Ũ", "ẽ", "Ẽ", "õ", "Õ", "ã", "Ã", "ĩ", "Ĩ", "ỹ", "Ỹ",
    "ự", "Ự", "ệ", "Ệ", "ộ", "Ộ", "ợ", "Ợ", "ặ", "Ặ", "ậ", "Ậ", "ụ", "Ụ", "ẹ", "Ẹ", "ọ", "Ọ", "ạ", "Ạ", "ị", "Ị", "ỵ", "Ỵ",
]

function isCha(ch) {
    return /^[A-Z]$/i.test(ch);
}

function isAlpha(ch) {
    if (additionalCha.includes(ch)) return true
    else return /^[A-Z]$/i.test(ch);
}

function isNumber(ch) {
    return (Number.isInteger(Number(ch)))
}

function isWhiteSpace(ch) {
    if (ch === ' ' || ch === '\n' || ch === '\t') return true
    return false
}

function fixName(name) {
    let finName = ""
    for (i = 0; i < name.length; i++) {
        if (isAlpha(name[i]) || isWhiteSpace(name[i])) {
            finName = finName + name[i]
        } else if (!isWhiteSpace(finName[finName.length - 1]) && finName.length) {
            finName = finName + " "
        }
    }
    let words = finName.split(" ")
    newWords = []
    for (i = 0; i < words.length; i++) {
        if (words[i] != "tên" && words[i] != "Tên" && words[i] != "họ" && words[i] != "Họ" && words[i] != "và" && words[i] != "Và") {
            newWords[newWords.length] = words[i]
        }
    }
    return newWords.join(" ")
}

function checkName(iniName) {
    let name = fixName(iniName)
    for (let i = 0; i < name.length; i++) {
        // console.log(55)
        if (!isAlpha(name[i]) && !isWhiteSpace(name[i])) return false
    }
    let nameArray = name.split(" ")
    let wordCount = nameArray.length
    if (wordCount < 2 || wordCount > 8) return false
    for (let i = 0; i < wordCount; i++) {
        const word = nameArray[i]; //.toUpperCase();
        if (lastNameArray.includes(word)) return name
    }
    return false
}

function checkPhoneNumber(iniNumber) {
    let first, number
    for (let i = 0; i < iniNumber.length; i++) {
        const index = iniNumber[i];
        // console.log(index)
        if (!isNumber(index) && !isWhiteSpace(index) && index != "." && index != "-" && index != ":") first = i //how to use isNaN(index)???????
    }
    if (first === undefined) {
        number = iniNumber
    } else {
        number = iniNumber.split("").slice(first + 1, iniNumber.length).join("")
    }
    // console.log(135, number)
    let outNum = ""
    for (let i = 0; i < number.length; i++) {
        if (!isNumber(number[i]) && !isWhiteSpace(number[i]) && number[i] != "." && number[i] != "-" && number[i] != ":") { //anything else????????
            console.log(144)
            return false
        } else if (isNumber(number[i]) && !isWhiteSpace(number[i])) {
            outNum += number[i]
        }
    }
    if (outNum.length >= 9 && outNum.length <= 11) {
        return outNum
    }
    return false
}
// console.log(148, checkPhoneNumber("Diện thoại : 0123456789"))
// console.log(149, isNaN(" "))

function checkMail(iniMail) {
    let outMail = "",
        mail
    let first //, last = iniMail.length
    for (let i = 0; i < iniMail.length; i++) {
        const index = iniMail[i];
        if (index != "." && index != '@' && !isCha(index) && isNaN(index))
            first = i
    }
    if (first === undefined) {
        mail = iniMail
    } else {
        mail = iniMail.split('').slice(first, iniMail.length).join('')
    }
    if (!mail.includes("@") || !mail.includes(".")) { // can one mail include more than one character "@"???
        return false
    }
    for (let i = 0; i < mail.length; i++) {
        if (isCha(mail[i]) || isNumber(mail[i]) || mail[i] === "@" || mail[i] === ".") {
            outMail += mail[i]
        }
    }
    return outMail
}

function checkDateOfBirth(iniDate) {
    let first
    for (let i = 0; i < iniDate.length - 1; i++) {
        const index = iniDate[i];
        if (!isNumber(index) && !isWhiteSpace(index) && index != "." && index != "-" && index != "\\" && index != "/") first = i //how to use isNaN(index)???????
    }
    if (first === undefined) {
        date = iniDate
    } else {
        date = iniDate.split("").slice(first + 1, iniDate.length).join("")
    }
    let outDate = ""
    let countNum = 0
    for (let i = 0; i < date.length; i++) {
        const index = date[i]
        if (index != "/" && index != "." && index != "\\" && index != "-" && !isWhiteSpace(index) && index != ":" && !isNumber(index)) {
            return false
        } else if (isNumber(index)) {
            countNum++
            outDate += index
        } else {
            outDate += "/"
        }
    }

    if (countNum > 5 && countNum < 9) return outDate
    else return false
}
// let testName = "..';13ed2Họ-Tên2jqak2Nguyễn123,;ld,aasda"
// console.log(106, checkPhoneNumber("0912.123 -456"))
// console.log(131, checkMail("yeuma99@gmail.com"))
// console.log(149, checkDateOfBirth("05-06/1999"))
// console.log(83, checkName(testName))


// const nbCols = 2;
// const cellPadding = 40; // each cell is padded to fit 40 characters
// const columnQuantitizer = item => parseFloat(item.x) >= 20;

// const padColumns = (array, nb) =>
//     Array.apply(null, { length: nb }).map((val, i) => array[i] || []);
// // .. because map() skips undefined elements

// const mergeCells = cells =>
//     (cells || [])
//     .map(cell => cell.text)
//     .join("") // merge cells
//     .substr(0, cellPadding)
//     .padEnd(cellPadding, " "); // padding

// const renderMatrix = matrix =>
//     (matrix || [])
//     .map((row, y) =>
//         padColumns(row, nbCols)
//         .map(mergeCells)
//         .join(" | ")
//     )
//     .join("\n");

// var table = new pdfreader.TableParser();

// // new pdfreader.PdfReader().parseFileItems(filename, function(err, item) {
// //     if (err) console.log(62, err)
// //     if (!item || item.page) {
// //         // end of file, or page
// //         console.log(65)
// //         console.log(renderMatrix(table.getMatrix()));
// //         // console.log("PAGE:", item.page);
// //         // table = new pdfreader.TableParser(); // new/clear table for next page
// //     } else if (item.text) {
// //         // accumulate text items into rows object, per line
// //         table.processItem(item, columnQuantitizer(item));
// //     }
// // });

// // new pdfreader.SequentialParser()v