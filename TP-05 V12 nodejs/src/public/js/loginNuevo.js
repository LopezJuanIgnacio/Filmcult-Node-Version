const validar = (expresion, input, campo)=>{
    var error = document.querySelector(`.error${campo}`);
    const nombre = input;
    if(nombre.value === "" || nombre.value === null || expresion.test(input.value) == false){
        error.classList.replace("d-none", "d-block")
        campos[campo] = false;
    }else{
        error.classList.replace("d-block", "d-none")
        campos[campo] = true;
    } 
    console.log(campo ,campos[campo])
}
const logearte = async (e)=>{
    switch(e.target.name){
        case "username":
            validar(expresiones.usuario, e.target, "Usuario");
        break;
        case "password":
            validar(expresiones.password, e.target, "Contra");
        break;
        case "mail":
            validar(expresiones.mail, e.target, "Mail");
        break;
        case "password2":
            validar(expresiones.password, e.target, "Contra2");
        break;
        case "mail2":
            validar(expresiones.mail, e.target, "Mail2");
        break;
        case "customFile":
            validar(expresiones.file, e.target, "File");
        break;
        case "Comentario":
            validar(expresiones.comentario, e.target, "Comentario");
        break
    }
}
const campos = {
	Usuario: false,
	Contra: false,
	Mail: false,
    Contra2: false,
    Mail2: false,
    customFile: false,
    Comentario: false,
}
const expresiones = {
	usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
	password: /^.{6,12}$/, // 6 a 12 digitos.
	mail: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, //algo@algo.algo
    file: /^[a-zA-Z0-9_.+-]/,
    comentario: /^.{4,255}$/
}
const form = document.querySelector("#form")
const formReg = document.querySelector("#formReg")
const inputs = document.querySelectorAll("#form input")
const inputsReg = document.querySelectorAll("#formReg input")
document.querySelector(".file").addEventListener("change", logearte)
inputs.forEach((input)=>{
    input.addEventListener("keyup", logearte);
    input.addEventListener("blur", logearte);
})
inputsReg.forEach((input)=>{
    input.addEventListener("keyup", logearte);
    input.addEventListener("blur", logearte);
})
const cargar = ar =>{
    const reader = new FileReader();
    reader.readAsArrayBuffer(ar)
    reader.addEventListener("load", e=>{
        if(document.querySelector(".imgResultado") !== null) document.querySelector(".imgResultado").remove()
        let file = new Blob([new Uint8Array(e.currentTarget.result)],{type: "image"})
        let url = URL.createObjectURL(file)
        let img = document.createElement("img")
        img.setAttribute("src", url)
        img.setAttribute("Width", "400rem")
        img.setAttribute("height", "400rem")
        img.classList.add("imgResultado", "ml-5")
        document.querySelector(".divImgResultado").appendChild(img)
    })
}
document.querySelector(".file").addEventListener("change",(e)=>{
    cargar(document.querySelector(".file").files[0])
})
form.addEventListener("submit", async e =>{
    if(campos.Contra && campos.Mail) console.log("logueado")
    else{
        document.querySelector('.mensaje-fallo').classList.remove('d-none');
        e.preventDefault();
    }
})
formReg.addEventListener("submit", async e =>{
    e.preventDefault();
    console.log(campos.Contra2, campos.Mail2, campos.Usuario, campos.File)
    if(campos.Contra2 && campos.Mail2 && campos.Usuario && campos.File){
        let email = document.querySelector("#email2").value;
        let contra = document.querySelector("#password2").value;
        let nombre = document.querySelector("#username").value;
        let file = document.querySelector(".file").files[0];
        const formData = new FormData()
        formData.append('mail', email)
        formData.append('username', nombre)
        formData.append('password', contra)
        formData.append('File', file)
        await fetch('/login/register', {
            method: 'POST',
            body: formData
        }).then(()=>{
            document.querySelector('.mensaje-exito2').classList.remove("d-none");
            document.querySelector('.mensaje-fallo2').classList.add('d-none')
            document.querySelector(".errorFile").classList.add("d-none")
            setTimeout(()=>{
                window.location.pathname = "/"
            }, 3000)
        })
        .catch(error => {
            console.error(error)
            document.querySelector('.mensaje-fallo2').classList.remove('d-none')
        })
	}else document.querySelector('.mensaje-fallo2').classList.remove('d-none');
})
window.addEventListener("load", ()=>{
    $("#login").modal('show');
    document.querySelector("#registro").addEventListener("click",()=>{
        $("#registracion").modal('show');
    })
})