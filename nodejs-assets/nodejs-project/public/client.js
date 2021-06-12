const socket = io()
function onSubmit(email,password){
    //document.querySelector('error').style.display='block' 
    let msg = {
        email: email,
        password: password
    }
    socket.emit('message', msg)
    prompt(email,password);

}

