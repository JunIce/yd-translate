const request = require('request-promise')
, md5 = require('md5')
, fs = require('fs')
, Promise = require('bluebird')
, path = require('path')
, process = require('process')
, baseUrl = 'http://fanyi.youdao.com'
, uG = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';

let translateText = process.argv[2].toString()
translateTextFunc(translateText)
function translateTextFunc(e) {
    getCookieString()
    .then(s => {
        return {
            url: `${baseUrl}/translate_o`,
            params: {
                smartresult: 'dict',
                smartresult: 'rule'
            },
            headers: formatHeader(s),
            encoding: 'utf8',
            form: formatForm(e)          
        }
    })
    .then(reqObj => {
        return request.post(reqObj)
    })
    .then(res => {
        let data = JSON.parse(res)
        if(data.errorCode) {
            console.log(`error`)
            return
        }

        console.log(`translateResult: ` ,data.translateResult)
        console.log(`smartResult: ` ,data.smartResult)
    })
    
}

function formatHeader(s) {
    return {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Host': 'fanyi.youdao.com',
        'Origin': baseUrl,
        'Referer': baseUrl,
        'User-Agent': uG,
        'Cookie': s || ''
    }
}

// header 
// e 需要翻译的文字
function formatForm(e) {
    return Object.assign({}, {
        i: e,
        from: 'AUTO',
        to: 'AUTO',
        smartresult: 'dict',
        client: 'fanyideskweb',
        doctype: 'json',
        version: '2.1',
        keyfrom: 'fanyi.web',
        action: 'FY_BY_REALTIME',
        typoResult: false
    }, getSign(e))
}


// 写入文件
function writeToTxt(f, c) {
    fs.writeFileSync(f, c)
}

// 返回储存的cookie
function getCookieString() {
    // 本地cookie储存，避免每次请求cookie
    let f = path.resolve(__dirname , 'cookie.txt')
    if(fs.existsSync(f)) {
        return new Promise((resolve) => resolve(fs.readFileSync(f).toString()))
    }

    // cookie 进行储存
    let j = request.jar()
    return request.get({url: baseUrl , jar: j}).then(() => {
        let cookie_string = j.getCookieString(baseUrl)
        writeToTxt(f, cookie_string)
        return cookie_string
    })
}

// 生成sign
function getSign(e) {
    // var t = md5(uG)
    //   , r = "" + (new Date).getTime()
    //   , i = r + parseInt(10 * Math.random(), 10);
      var t = md5(uG)
      , r = 1545272201118
      , i = 15452722011180;

    return {
        ts: r,
        bv: t,
        salt: i,
        sign: md5("fanyideskweb" + e + i + "p09@Bn{h02_BIEe]$P^nG")
    }
}
