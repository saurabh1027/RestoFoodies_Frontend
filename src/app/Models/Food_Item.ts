export class Food_Item{
    fid:number;
	fname:string;
	price:number;
    pic:string;
    quantity:number;
    ingredients:string;
    description:string;
	vegeterian:boolean;
    ratings:string;
    ratio:number;
    keywords:string;
    cname:string;
    rid:number;
    constructor(fid:number,fname:string,price:number,pic:string,quantity:number,ingredients:string,description:string,vegeterian:boolean,ratings:string,ratio:number,keywords:string,cname:string,rid:number) {
        this.fid = fid;
        this.quantity = quantity; 
        this.rid = rid; 
        this.fname = fname; 
        this.pic = pic; 
        this.ingredients = ingredients; 
        this.description = description; 
        this.ratio = ratio; 
        this.ratings = ratings; 
        this.keywords = keywords; 
        this.cname = cname; 
        this.price = price; 
        this.vegeterian = vegeterian;   
    }
}