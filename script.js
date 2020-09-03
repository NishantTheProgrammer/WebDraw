const app = new Vue({
    el: '#app',
    data() {
        return {
            hamburger: false,
            dark: false,
            tool: 'pencil',
            color: '#ff0000',


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
        }
    },
});