function display() { 
    if(document.getElementById('GFG').checked) {
        document.getElementById("disp").innerHTML
            = document.getElementById("GFG").value
            + " radio button checked";
    }
    else if(document.getElementById('HTML').checked) {
        document.getElementById("disp").innerHTML
            = document.getElementById("HTML").value
            + " radio button checked";  
    }
    else if(document.getElementById('JS').checked) {
        document.getElementById("disp").innerHTML
            = document.getElementById("JS").value
            + " radio button checked";  
    }
    else {
        document.getElementById("disp").innerHTML
            = "No one selected";
    }
}