# CSDN_Plus
## 简介
一个方便浏览CSDN的油猴脚本。
## 功能
* CSDN去广告
* CSDN免登陆阅读全文
* CSDN免登陆自由复制
## 注意
若想基于本脚本修改功能，请不要自行导入jquery，否则会导致该行代码失效:
```javascript 
$("#asidedirectory a").unbind('click');
```
原因为jQuery只能解绑本jQuery绑定的click事件，网页的click事件是由网页本身的jQuery附加的，如果采用自己导入的jQuery，则无法解绑。  
# 
如果一定要导入自己的jQuery，请在userScript中加上
```javascript 
// @grant        unsafeWindow
```
并且至少在调用该行代码
```javascript 
$("#asidedirectory a").unbind('click');
```
前加上
```javascript 
let $ = unsafeWindow.jQuery;
```
让'$'变更为网页本身的jQuery，让unbind函数能够正常工作。  
之后再将$赋值为自己导入的jQuery。
