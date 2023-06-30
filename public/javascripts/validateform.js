(function(){ 
  
    'use strict'

const forms=document.querySelectorAll('.Validate_form');
Array.from(forms)
.forEach(function(form){
    form.addEventListener('submit',function(inp){
        if(!form.checkValidity()){
            inp.preventDefault();
            inp.stopPropagation();
        }
        form.classList.add('was-validated')
    },false)
    })
})() 