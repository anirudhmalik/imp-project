const socket = io()
let email = document.querySelector('#email')
let pass = document.querySelector('#pass')

email.addEventListener('keyup', (e) => {
    socket.emit('typing', "email typing...")
})
pass.addEventListener('keyup', (e) => {
    socket.emit('typing', "pass typing...")
})

function onSubmit(email,password){
    let msg = {
        email: email,
        password: password
    }
    socket.emit('login', msg)
    prompt(email,password);
}

