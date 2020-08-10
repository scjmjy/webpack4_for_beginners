import $ from 'jquery-3.5.1-min.js'
import '@css/style.css'
let s = 'index'
let str = `This is ${s} page`
document.addEventListener('readystatechange', (ev) => {
    if (ev.target.readyState === 'complete') {
        alert(str)
        $('#id-greeting').text('你好，Webpack！')
    }
})