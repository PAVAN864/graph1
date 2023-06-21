class Product{
    constructor(id,name,brand,desc,mn,an){
        this.id=id
        this.name=name
        this.brand=brand
        this.desc=desc
        this.mn=mn
        this.an=an
    }
}

class MainGroup{
    constructor(id,name,desc){
        this.name=name
        this.desc=desc
        this.id = id
    }
}

class Group{
    constructor(id,name,desc){
        this.name=name
        this.desc=desc
        this.id = id
    }
}
class Option{
    constructor(name,price,desc,minimum,maximum){
        this.name=name
        this.desc=desc
        // this.id = id
        this.price=price
        this.maximum=maximum
        this.minimum=minimum
    }
}
class CR{
    constructor(sub_op,product,name,d){
        this.sub_op=sub_op
        this.product=product
        this.name = name
        this.d=d
    }
}
module.exports={Product,MainGroup,Group,Option,CR}