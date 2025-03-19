import { Injectable } from '@angular/core';
// import LeaderLine from 'LeaderLine';

declare const LeaderLine:any;

@Injectable({ providedIn: 'root' })
export class ArrowService {
    private lines: Map<string, any> = new Map(); // ✅ Store multiple arrows

    constructor() {}

    // ✅ Function to draw an arrow between two elements by ID
    async drawArrow(fromId: string, toId: string, arrowId: string = 'defaultArrow') {
        const fromElement = document.getElementById(fromId);
        // const fromElement = document.querySelector(fromId);

        const toElement = document.getElementById(toId);
        // const toElement = document.querySelector(toId);

        console.log(`drawing arrow ${fromId} to ${toId}`);

        if (!fromElement || !toElement) {
            if(!fromElement){
                console.warn(`from element not found ${fromId}`);
            } 

            if(!toElement){
                console.warn(`to element not found ${toId}`);
            }

            // console.warn(`⚠️ ArrowService: Elements not found: ${fromId}, ${toId}`);
            return;
        }

        // ✅ Remove old arrow if it exists
        this.removeArrow(arrowId);

        // ✅ Draw the new arrow
        const line = new LeaderLine(fromElement, toElement, {
            path: 'fluid', // ✅ Curved path like `ng-walkthrough`
            startPlug: 'behind',
            endPlug: 'arrow2',
            color: '#ffffff',
            size: 1,
            startSocket: 'right', 
            endSocket: 'left',
            startPlugColor: '#ffffff',
            endPlugColor: '#ffffff',
            startPlugSize: 1,
            endPlugSize: 2,
            dropShadow: true
        });

        line.setOptions

        this.lines.set(arrowId, line); // ✅ Store reference to remove later
        console.log(this.lines);
    }

    // ✅ Remove an arrow by ID
    removeArrow(arrowId: string) {
        console.log("removing arrow with id:", arrowId);
        if (this.lines.has(arrowId)) {
            this.lines.get(arrowId).remove();
            this.lines.delete(arrowId);
        }

        console.log(this.lines);
    }

    removeAll(){
        console.log(this.lines);
        Array.from(this.lines.keys())
            .forEach(el => {
                this.lines.get(el).hide();
                this.lines.get(el).remove();
        });

        this.lines.clear();

        console.log(this.lines);
    }

    // ✅ Redraw all arrows (e.g., when resizing window)
    updateArrows() {
        this.lines.forEach(line => line.position());
    }
}