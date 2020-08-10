import '@sass/style.scss'
function welcome() {
    alert('This is admin page')
}
document.addEventListener('readystatechange', (ev) => {
    if (ev.target.readyState === 'complete') {
        welcome()
    }
})