const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");
const saveImgPng = document.querySelector(".save-img-png");
const checkImgNormal = document.querySelector("#checkImgNormal");
saveImgPng.style.opacity = "1";


ctx = canvas.getContext("2d");

let prevMouseX , prevMouseY , snapshot

isDrawing = false;

selectedTool = "brush";

brushWidth = 5;

selectedColor = "#000";

let checkImageTow = true;
let checkImageThree = true;

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0 , 0 , canvas.width , canvas.height);
    ctx.fillStyle = selectedColor;
};

const stopDraw = () => {
    isDrawing = false;
};

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const drawRect = (e) => {
    if(fillColor.checked) {
        return ctx.fillRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }

    ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);

};

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX) , 2) + Math.pow((prevMouseY - e.offsetY) , 2));

    ctx.arc(prevMouseX , prevMouseY , radius , 0 , 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke(); 
};
const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX , prevMouseY);
    ctx.lineTo(e.offsetX , e.offsetY);

    ctx.lineTo(prevMouseX * 2 - e.offsetX , e.offsetY);
    ctx.closePath();

    fillColor.checked ? ctx.fill() : ctx.stroke();
    
};

const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX , prevMouseY);
    ctx.lineTo(e.offsetX , e.offsetY);

    ctx.stroke();
}

const starDraw = (e) => {

    isDrawing = true;

    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;

    ctx.beginPath(); 

    ctx.lineWidth = brushWidth;

    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    snapshot = ctx.getImageData(0 , 0 , canvas.width , canvas.height);
};

const drawing = (e) => {
    if(!isDrawing) return;

    ctx.putImageData(snapshot , 0 , 0);


    if(selectedTool === "brush" || selectedTool === "eraser") { 
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY); 
        ctx.stroke();

    } else if(selectedTool === "rectangle") {
        drawRect(e);
    } else if(selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    } else if (selectedTool === "line") {
        drawLine(e);
    }

};

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    })
});

sizeSlider.addEventListener("change" , () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click" , () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");

        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change" , () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click" , () => {
    ctx.clearRect(0 , 0 , canvas.width , canvas.height);

    if(saveImg.style.opacity == "1") {
        setCanvasBackground();
    }
});

saveImg.addEventListener("click" , () => {
    if(saveImg.style.opacity == "1") {
        const link = document.createElement("a");
        link.download = `${Date.now()}.jpg`;
        link.href = canvas.toDataURL();
        link.click();
    }
});

saveImgPng.addEventListener("click" , () => {
    if(saveImgPng.style.opacity == "1") {
        const link = document.createElement("a");
        link.download = `${Date.now()}.jpg`;
        link.href = canvas.toDataURL();
        link.click();
    }
});

checkImgNormal.addEventListener("click" , () => {
    
    var checkResult = window.confirm("Please note that if you activate this tick after applying the changes, all your changes will be deleted, and this will also happen if you activate and deactivate the tick again.");
    if (checkResult) {
        if (checkImageThree) {
            saveImg.style.opacity = "1";
            setCanvasBackground();
            checkImageTow = false;
            checkImageThree = false;
            saveImgPng.style.opacity = ".6";
        }
        checkImgNormal.checked = true;
        
    } else {
        if (checkImageTow) {
            saveImg.style.opacity = ".6";
            checkImgNormal.checked = false;
            checkImageThree = true;
            saveImgPng.style.opacity = "1";
        }
        if (!checkImageTow) {
            location.reload();
            checkImgNormal.checked = false;
            checkImageTow = true;
            checkImageThree = true;
        }
    }
});

canvas.addEventListener("mousedown" , starDraw);

canvas.addEventListener("mousemove" , drawing);

canvas.addEventListener("mouseleave" , () => {
    if (isDrawing) {
        stopDraw();
    }
});

canvas.addEventListener("mouseup" , () => isDrawing = false);



