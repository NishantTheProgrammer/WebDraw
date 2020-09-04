const app = new Vue({
    el: '#app',
    data() {
        return {
            hamburger: false,
            dark: true,
            openModal: false,
            openOptions: [],
            tool: 'line',
            color: '#ff0000',
            name: 'draw',

            art: {
                line: []
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
                case 'square': this.drawSquare(event); break;
                case 'pencil': this.drawPencil(event); break;
            }
        },
        start(event){
            this.art.line.push({
                x1: event.clientX, y1: event.clientY,
                x2: event.clientX, y2: event.clientY,
                color: this.color,
                width: 5
            });
        },
        drawLine(event){
            if(event.buttons == 1 || event.buttons == 3){
                let lastLine = this.art.line[this.art.line.length - 1];
                lastLine.x2 = event.clientX;
                lastLine.y2 = event.clientY;
            }
        },
        drawCircle(event){
            console.log('drawing circle', event.clientX);
        },
        drawSquare(event){
            console.log('drawing square', event.clientX);
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
            }
        }

    },
});