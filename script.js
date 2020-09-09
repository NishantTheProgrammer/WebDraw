const app = new Vue({
    el: '#app',
    data() {
        return {
            art: [],
            name: 'draw',
            hamburger: false,
            dark: true,
            openModal: false,
            openOptions: [],
            tool: 'pencil',

            stroke: '#ff0000',
            fill: '#821717',
            strokeWidth: 5,
            linecap: 'butt'

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
                case 'eraser': this.drawEraser(event); break;
            }
        },
        start(event){

            switch(this.tool)
            {
                case 'line': this.startLine(event); break;
                case 'circle': this.startCircle(event); break;
                case 'rect': this.startRect(event); break;
                case 'pencil': this.startPencil(event); break;
                case 'eraser': this.startEraser(event); break;
            }
        },

        startLine(event){
            this.art.push({
                tool: 'line',
                x1: event.clientX, y1: event.clientY,
                x2: event.clientX, y2: event.clientY,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth != 0 ? this.strokeWidth : 1,      // line should at least have 1 stroke width
                linecap: this.linecap
            });
        },

        startRect(event){
            this.art.push({
                tool: 'rect',
                x: event.clientX, y: event.clientY,
                width: 0, height: 0,
                stroke: this.stroke,
                fill: this.fill,
                strokeWidth: this.strokeWidth,
                radius: 0
            });
        },

        startCircle(event){
            this.art.push({
                tool: 'circle',
                x: event.clientX, y: event.clientY,
                stroke: this.stroke,
                fill: this.fill,
                strokeWidth: this.strokeWidth,
                radius: 0
            });
        },

        startPencil(event){
            
            this.art.push({
                tool: 'polyline',
                points: `${event.clientX},${event.clientY} `,
                width: this.strokeWidth != 0 ? this.strokeWidth : 1,
                stroke: this.stroke
            });
        },

        startEraser(event){
            
            this.art.push({
                tool: 'eraser',
                points: `${event.clientX},${event.clientY} `,
                width: this.strokeWidth != 0 ? this.strokeWidth : 1,
                stroke: this.dark ? 'black' : 'white'
            });
        },

        drawLine(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];
                lastLine.x2 = event.clientX;
                lastLine.y2 = event.clientY;
            }
        },

        drawCircle(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastCircle = this.art[this.art.length - 1];
                // pythagoras theorem

                let a = Math.abs(lastCircle.x - event.clientX);
                let b = Math.abs(lastCircle.y - event.clientY);
                lastCircle.radius = Math.sqrt((a * a) + (b * b));
            }
        },

        drawRect(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastRect = this.art[this.art.length - 1];
                if(event.clientX - lastRect.x > 0 && event.clientY - lastRect.y > 0)
                {
                    lastRect.width = event.clientX - lastRect.x;
                    lastRect.height = event.clientY - lastRect.y;
                }
            }
        },
        drawPencil(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];
                lastLine.points += `${event.clientX},${event.clientY} `;
            }
        },

        drawEraser(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];

                lastLine.points += `${event.clientX},${event.clientY} `;
            }
        },

        saveArt(){
            this.name = prompt('Enter File Name', this.name);
            if(this.name)
            {
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
                this.art = [];
            }
        },
        keydown(event){
            if(this.tool == 'rect' && this.art.length > 0)
            {
                let lastRect = this.art[this.art.length - 1];
                event.key == 'ArrowDown' && lastRect.radius > 0 ? lastRect.radius -= 2 : '';
                event.key == 'ArrowUp' ? lastRect.radius += 2 : '';
            }
            event.key == 'z' && event.ctrlKey ? this.art.pop() : "";
            if(event.key == 's' && event.ctrlKey){
                event.preventDefault(); 
                this.saveArt();
            }
        }
    },
});


document.addEventListener("keydown", app.keydown);