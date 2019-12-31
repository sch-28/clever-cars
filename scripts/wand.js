class Wand {
    constructor(x1, y1, x2, y2, außen) {
        this.a = new Vektor(x1, y1);
        this.b = new Vektor(x2, y2);
        this.vek = new Vektor(x2 - x1, y2 - y1);
        /* this.vek2 = new Vektor(this.vek.x / this.vek.dist(), this.vek.y / this.vek.dist());
        this.links = new Vektor(this.a.x - (-this.vek2.y * 50), this.a.y + (-this.vek2.x * 50));
        this.rechts = new Vektor(this.a.x + (-this.vek2.y * 50), this.a.y - (-this.vek2.x * 50));
        this.linksO = new Vektor(this.b.x - (-this.vek2.y * 50), this.b.y + (-this.vek2.x * 50));
        this.rechtsO = new Vektor(this.b.x + (-this.vek2.y * 50), this.b.y - (-this.vek2.x * 50));
        this.before = wände[wände.length - 1];;
        this.außen = außen; */
    }


    show() {
      //  if (this.außen) {
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.moveTo(this.a.x,this.a.y);
            ctx.lineTo(this.b.x,this.b.y);
            ctx.stroke();
        /* } else {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.lineWidth = 4;
            if (wände.indexOf(this) == 0 || wände.length == 0) {
                ctx.moveTo(this.links.x, this.links.y);
                ctx.lineTo(this.linksO.x, this.linksO.y);
                ctx.moveTo(this.rechts.x, this.rechts.y);
                ctx.lineTo(this.rechtsO.x, this.rechtsO.y);
                ctx.stroke();
            } else {
                ctx.moveTo(this.before.linksO.x, this.before.linksO.y);
                ctx.lineTo(this.b.x - (-this.vek2.y * 50), this.b.y + (-this.vek2.x * 50));
                ctx.moveTo(this.before.rechtsO.x, this.before.rechtsO.y);
                ctx.lineTo(this.b.x + (-this.vek2.y * 50), this.b.y - (-this.vek2.x * 50));
                ctx.stroke();
            }
        } */
    }
}