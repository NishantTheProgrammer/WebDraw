const app = new Vue({
    el: '#app',
    data() {
        return {
            name: 'draw',
            hamburger: false,
            dark: true,
            openModal: false,
            openOptions: [],
            tool: 'circle',


            stroke: '#ff0000',
            fill: '#821717',
            strokeWidth: 5,
            linecap: 'butt',

            art: {
                line: [],
                rect: [],
                circle: []
            }
        }
    },
    methods: {
        selectTool(tool, event){
            this.tool = tool;
        },
        move(event){
            switch(this.tool)
            {
                case 'line': this.drawLine(event); break;
                case 'circle': this.drawCircle(event); break;
                case 'rect': this.drawRect(event); break;
                case 'pencil': this.drawPencil(event); break;
            }
        },
        start(event){

            switch(this.tool)
            {
                case 'line': this.startLine(event); break;
                case 'circle': this.startCircle(event); break;
                case 'rect': this.startRect(event); break;
                case 'pencil': this.drawPencil(event); break;
            }
        },

        startLine(event){
            this.art.line.push({
                x1: event.clientX, y1: event.clientY,
                x2: event.clientX, y2: event.clientY,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth != 0 ? this.strokeWidth : 1,      // line should at least have 1 stroke width
                linecap: this.linecap
            });
        },

        startRect(event){
            this.art.rect.push({
                x: event.clientX, y: event.clientY,
                width: 0, height: 0,
                stroke: this.stroke,
                fill: this.fill,
                strokeWidth: this.strokeWidth,
                radius: 0
            });
        },

        startCircle(event){
            this.art.circle.push({
                x: event.clientX, y: event.clientY,
                stroke: this.stroke,
                fill: this.fill,
                strokeWidth: this.strokeWidth,
                radius: 0
            });
            console.log(this.art.circle)
        },



        drawLine(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art.line[this.art.line.length - 1];
                lastLine.x2 = event.clientX;
                lastLine.y2 = event.clientY;
            }
        },
        drawCircle(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastCircle = this.art.circle[this.art.circle.length - 1];
                // pythagoras theorem

                let a = Math.abs(lastCircle.x - event.clientX);
                let b = Math.abs(lastCircle.y - event.clientY);
                lastCircle.radius = Math.sqrt((a * a) + (b * b));
            }
        },
        drawRect(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastRect = this.art.rect[this.art.rect.length - 1];
                if(event.clientX - lastRect.x > 0 && event.clientY - lastRect.y > 0)
                {
                    lastRect.width = event.clientX - lastRect.x;
                    lastRect.height = event.clientY - lastRect.y;
                }
            }
        },
        drawPencil(event){
            console.log('drawing pencil', event.clientX);
        },
        saveArt(){
            this.name = prompt('Enter File Name', this.name);
            if(this.name)
            {
                console.log(this.name);
                localStorage.setItem(`art_${this.name}`, JSON.stringify(app.art));
            }
        },
        showOpen(){
            this.openModal = !this.openModal;
            if(this.openModal){
                for(let i in localStorage)
                {
                    if(i.substring(0, 4) === 'art_')
                    {
                        this.openOptions.push(i);
                    }
                }
            } 
        },
        openArt(event){
            let key = event.target.value;
            this.name = key.substring(4, key.length)
            this.art = JSON.parse(localStorage.getItem(key));
            
        },
        
        importArt(event){
            var fr=new FileReader(); 
            fr.onload=function(){ 
                app.art = JSON.parse(fr.result);
            } 
            fr.readAsText(event.target.files[0]); 
        },

        exportArt(){
            
            var textFile = null,
            makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain'});
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }
            textFile = window.URL.createObjectURL(data);
            return textFile;
            };

            var file_path = `host/path/${this.name}.drw`;
            var a = document.createElement('A');
            a.href = makeTextFile(JSON.stringify(app.art));
            a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);      
        },
        trash(){
            if(confirm("Are you sure?")){
                this.art.line = [];
                this.art.rect = [];
                this.art.circle = [];
            }
        },
        keydown(event){
            if(this.tool == 'rect' && this.art.rect.length > 0)
            {
                let lastRect = this.art.rect[this.art.rect.length - 1];
                event.key == 'ArrowDown' && lastRect.radius > 0 ? lastRect.radius -= 2 : '';
                event.key == 'ArrowUp' ? lastRect.radius += 2 : '';
                console.log(lastRect.radius)
            }
        }
    },
});


document.addEventListener("keydown", app.keydown);