import requests
from hashlib import md5
import random
import time
import sys

base = 'http://fanyi.youdao.com'
uG = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'

# headers组装
headers = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'fanyi.youdao.com',
    'Origin': base,
    'Referer': base,
    'User-Agent': uG,
    'Cookie': 'YOUDAO_MOBILE_ACCESS_TYPE=0; OUTFOX_SEARCH_USER_ID=1888498014@10.169.0.83; JSESSIONID=aaa2jfdvBBgZp-DldJjFw'
}

# form表单组装
def formatForm(e):
    form = {
        'i': e,
        'from': 'AUTO',
        'to': 'AUTO',
        'smartresult': 'dict',
        'client': 'fanyideskweb',
        'doctype': 'json',
        'version': '2.1',
        'keyfrom': 'fanyi.web',
        'action': 'FY_BY_REALTIME',
        'typoResult': False
    }
    sign = getSign(e)
    form.update(sign)
    return form

# 生成sign
def getSign(e):
    t = md5Hash(uG)
    r = int(time.time())
    i = '%d%d'%(r, random.randint(0, 9))
    return {
        'ts': r,
        'bv': t,
        'salt': i,
        'sign': md5Hash("fanyideskweb%s%sp09@Bn{h02_BIEe]$P^nG"%(e,i))
    }

# md5 hash
def md5Hash(s):
    return md5(s.encode('utf-8')).hexdigest()


def translate(e):
    u = '{}/translate_o'.format(base)
    params = {
        'smartresult': 'dict',
        'smartresult': 'rule'
    }
    r = requests.post(url=u, headers=headers, data=formatForm(e), params=params)
    print(r.text)

if __name__ == '__main__':
    text = sys.argv[1]
    print(text)
    translate(text)