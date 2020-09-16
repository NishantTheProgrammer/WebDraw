const app = new Vue({
    el: '#app',
    data() {
        return {
            art: [],
            name: 'draw',
            hamburger: false,
            help: false,
            dark: true,
            openModal: false,
            openOptions: [],
            tool: 'pencil',
            img: '',

            stroke: '#ff0000',
            text: 'Hello',
            fill: '#821717',
            strokeWidth: 5,
            linecap: 'butt'
        }
    },
    methods: {
        // asign blob address of uploaded image to img
        onFileChange(event) {
            const file = event.target.files[0];
            this.img = URL.createObjectURL(file);
        },
        // change tool
        selectTool(tool, event){
            this.tool = tool;
        },
        // function runs on drag
        move(event){
            switch(this.tool)
            {
                case 'line': this.drawLine(event); break;
                case 'circle': this.drawCircle(event); break;
                case 'rect': this.drawRect(event); break;
                case 'pencil': this.drawPencil(event); break;
                case 'eraser': this.drawEraser(event); break;
                case 'text': this.drawText(event); break;
                case 'img': this.drawImg(event); break;
            }
        },
        // functions runs on click on svg to insert a new SVG child object
        start(event){
            switch(this.tool)
            {
                case 'line': this.startLine(event); break;
                case 'circle': this.startCircle(event); break;
                case 'rect': this.startRect(event); break;
                case 'pencil': this.startPencil(event); break;
                case 'eraser': this.startEraser(event); break;
                case 'text': this.startText(event); break;
                case 'img': this.startImg(event); break;
            }
        },
        // starts line both starting and ending point are initially are cordinates of cursor
        startLine(event){
            this.art.push({
                tool: 'line',
                x1: event.clientX, y1: event.clientY,
                x2: event.clientX, y2: event.clientY,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth != 0 ? this.strokeWidth : 1,      // line should at least have 1 stroke width
                linecap: this.linecap,
                rotate: 0
            });
        },
        // starts rectangle x and y point are initially are cordinates of cursor height and width is also 0
        startRect(event){
            this.art.push({
                tool: 'rect',
                x: event.clientX, y: event.clientY,
                width: 0, height: 0,
                stroke: this.stroke,
                fill: this.fill,
                strokeWidth: this.strokeWidth,
                radius: 0,
                rotate: 0
            });
        },
        // starts Circle x and y point are initially are cordinates of cursor radius is zero
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
        // start polyline for pencil with first node of cursor position
        startPencil(event){
            this.art.push({
                tool: 'polyline',
                points: `${event.clientX},${event.clientY} `,
                width: this.strokeWidth != 0 ? this.strokeWidth : 1,
                stroke: this.stroke
            });
        },
        // start polyline for eraser with first node of cursor position
        startEraser(event){
            this.art.push({
                tool: 'eraser',
                points: `${event.clientX},${event.clientY} `,
                width: this.strokeWidth != 0 ? this.strokeWidth : 1
            });
        },
        // start Text
        startText(event){
            this.art.push({
                tool: 'text',
                x: event.clientX, y: event.clientY,
                text: this.text,
                size: this.strokeWidth != 0 ? this.strokeWidth : 1,
                stroke: this.stroke,
                rotate: 0
            });
        },
        // start image
        startImg(event){
            this.art.push({
                tool: 'img',
                img: this.img,
                width: 0,
                x: event.clientX, y: event.clientY,
                rotate: 0
            });
        },
        // update endpoint of line
        drawLine(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];
                lastLine.x2 = event.clientX;
                lastLine.y2 = event.clientY;
            }
        },
        // update radius of circle
        drawCircle(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastCircle = this.art[this.art.length - 1];
                
                // pythagoras theorem
                let a = Math.abs(lastCircle.x - event.clientX);
                let b = Math.abs(lastCircle.y - event.clientY);
                lastCircle.radius = Math.sqrt((a * a) + (b * b));
            }
        },
        // update height and width of the rectange
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
        // update width of the image
        drawImg(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastImg = this.art[this.art.length - 1];
                if(event.clientX - lastImg.x > 0 && event.clientY - lastImg.y > 0)
                {
                    lastImg.width = event.clientX - lastImg.x;
                }
            }
        },
        // push x,y cordinates of current cursor position of the pencil
        drawPencil(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];
                lastLine.points += `${event.clientX},${event.clientY} `;
            }
        },
        // push x,y cordinates of current cursor position of the eraser
        drawEraser(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art[this.art.length - 1];
                lastLine.points += `${event.clientX},${event.clientY} `;
            }
        },
        // update x,y cordinates of Text
        drawText(event){
            if(event.buttons == 1 || event.buttons == 3){
                let text = this.art[this.art.length - 1];
                text.x = event.clientX;
                text.y = event.clientY;
            }
        },
        // saves the art object to localStorage
        saveArt(){
            this.name = prompt('Enter File Name', this.name);
            if(this.name)
            {
                localStorage.setItem(`art_${this.name}`, JSON.stringify(app.art));
            }
        },
        // toggle open items list
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
        // retrive data from localstorage and asign to art array objects
        openArt(event){
            let key = event.target.value;
            this.name = key.substring(4, key.length)
            this.art = JSON.parse(localStorage.getItem(key));      
        },
        // import a .drw file read into text and asign the parsing result of jsonify string to art array of objects
        importArt(event){
            var fr=new FileReader(); 
            fr.onload=function(){ 
                app.art = JSON.parse(fr.result);
            } 
            fr.readAsText(event.target.files[0]); 
        },
        // jsonify art array of objects and make available to download that .drw (plain text) file
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
        // erase all the data of from artboard
        trash(){
            if(confirm("Are you sure?")){
                this.art = [];
            }
        },
        // lister for keydown events
        keydown(event){
            if(this.art.length > 0){
                let last = this.art[this.art.length - 1];
                switch(this.tool){
                    case 'rect':
                        event.key == 'ArrowDown' && last.radius > 0 ? last.radius -= 2 : '';
                        event.key == 'ArrowUp' ? last.radius += 2 : '';
                        event.key == 'ArrowLeft' ? last.rotate += 2 : '';
                        event.key == 'ArrowRight' ? last.rotate -= 2 : '';
                        event.key == 'a' ? last.x-= 2 : '';
                        event.key == 'd' ? last.x+= 2 : '';
                        event.key == 'w' ? last.y-= 2 : '';
                        event.key == 's' ? last.y+= 2 : '';
                        break;
                    case 'img':
                        event.key == 'ArrowLeft' ? last.rotate += 2 : '';
                        event.key == 'ArrowRight' ? last.rotate -= 2 : '';
                        event.key == 'a' ? last.x-= 2 : '';
                        event.key == 'd' ? last.x+= 2 : '';
                        event.key == 'w' ? last.y-= 2 : '';
                        event.key == 's' ? last.y+= 2 : '';
                        break;
                    case 'text':
                        event.key == 'ArrowLeft' ? last.rotate += 2 : '';
                        event.key == 'ArrowRight' ? last.rotate -= 2 : '';
                        event.key == 'a' ? last.x-= 2 : '';
                        event.key == 'd' ? last.x+= 2 : '';
                        event.key == 'w' ? last.y-= 2 : '';
                        event.key == 's' ? last.y+= 2 : '';
                        break;
                    case 'circle':
                        event.key == 'a' ? last.x-= 2 : '';
                        event.key == 'd' ? last.x+= 2 : '';
                        event.key == 'w' ? last.y-= 2 : '';
                        event.key == 's' ? last.y+= 2 : '';
                        break;
                }
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