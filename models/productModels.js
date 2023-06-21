const neo4j = require("../config/neo4j")
const {Product, Group,Option,CR} = require("./models")
global.p_id = ""
const productgroupquery = async()=>{
    const session=neo4j()
    try{
        const result= await session.run(`match(p:ProductGroup)-[r:ProductGroupToProductGroup]->(q) where not (p.name="WINCH" or p.name="HOIST" or p.name="ELEC" or p.name="DRIVE" or p.name="ExpertMode") with p.name as r, q.name as q,p.id as id, q.id as pg_id,p.Category as c,p.Description as d return r,q,id,pg_id,c,d`)
        return result.records.map((record)=>{
            const source = record.get('r')
            const id = record.get('id')
            const desti = record.get('q')
            const prod_id = record.get('pg_id')
            const cat = record.get('c')
            const Desc=record.get('d')
            return {
                name : source,
                pgname:desti,
                pg_ids: prod_id,
                id: id,
                c:cat,
                desc:Desc
            }
        })
    }finally{
        await session.close()
    }
}
const Productbyproductgroupid = (pg_id)=>{
    const session=neo4j()
    const params = {pg_id}
    const query =`match(p:ProductGroup)-[:ProductGroupsTo]->(q) where p.name=$pg_id with p.name as m,q.name as n,p.id as o,q.desc as d,q.ModelNumber as mn,q.Assemblynumber as an,q.brand as brand return brand,an,mn,m,n,o,d`
    return session.run(query,params)
    .then(result=>{
        const record = result.records
        let a =[];
        for(let i=0; i<record.length;i++){
        if(Object.keys(record).length!=0 && record.constructor){
            const prod = record[i].get('m')
            const name = record[i].get('n')
            const pgid = record[i].get('o')
            const desc = record[i].get('d')
            const brand = record[i].get('brand')
            const mn = record[i].get('mn')
            const an = record[i].get('an')
            const Prod = new Product(pgid,name,brand,desc,mn,an)
            a.push(Prod)
        }
        else{
            throw new Error(`ProductGroup with ${pg_id} not found`)
        
    }}
    return a
    }).catch(error =>{
        throw error
    })
}
const PToMGToGToOp=(p_id)=>{
    const session = neo4j()
    const params = {p_id}
    const query = `match(p:Product{name:$p_id})<-[:CR]-(o:Options)<-[:Has_Options]-(g) with collect(distinct o.name) as o,collect(g.name) as g,o.desc as d,o.maximum as max,o.minimum as min,o.price as pr,p.name as p return o,g,d,max,min,pr,p`
    return session.run(query,params)
    .then(result=>{
        const record = result.records
        for(let i=0; i<record.length;i++){
            if(Object.keys(record).length!=0 && record.constructor){
                console.log(record)
                const o = record[i].get("o");
                const d = record[i].get("d");
                const desc = record[i].get("g");
                const max= record[i].get('max')
                const min= record[i].get('min')
                const price = record[i].get('pr')
                const prod = record[i].get('p')
                const Options = new Option(o,price,d,min,max,prod)
                const map = {};

     for (let i = 0; i < desc.length; i++) {
         const key = desc[i];
         const value = Options;
         if (map.hasOwnProperty(key)) {
         map[key].push(value);
        } else {
         map[key] = [value];
        }
     }
         return map;
          }else{
                throw new Error(`Product with ${product_id} not found`)
            }
        }
    }).catch(error=>{
        throw error
    })
}
// const PToMGToGToOp=(p_id)=>{
//     const session = neo4j()
//     const params = {p_id}
//     const query = `match(p:Product{name:$p_id})<-[:CR]-(o:Options)<-[:Has_Options]-(g) with collect(distinct o.name) as o,collect(g.name) as g,o.desc as d,o.maximum as max,o.minimum as min,o.price as pr return o,g,d,max,min,pr`
//     return session.run(query,params)
//     .then(result=>{
//         const record = result.records
        
//         for(let i=0; i<record.length;i++){
//             if(Object.keys(record).length!=0 && record.constructor){
//                 console.log(record)
//                 const o = record[i].get("o");
//                 const d = record[i].get("d");
//                 const desc = record[i].get("g");
//                 const max= record[i].get('max')
//                 const min= record[i].get('min')
//                 const price = record[i].get('pr')
//                 const Options = new Option(o,price,d,min,max)
//                 const map = {};

// for (let i = 0; i < desc.length; i++) {
//   const key = desc[i];
//   const value = Options;
  
//   if (map.hasOwnProperty(key)) {
//     map[key].push(value);
//   } else {
//     map[key] = [value];
//   }
// }

//                 return map;
//                 // console.log(a)
//             }else{
//                 throw new Error(`Product with ${product_id} not found`)
//             }
//         }
        
//     }).catch(error=>{
//         throw error
//     })
// }
const ProductsToMainGroup = (p_id)=>{
    const session = neo4j()
    const params = {p_id}
    console.log(p_id)
    const query = `match (p:Product)-[:Has_Feature_Bundles]->(q)
    where p.name= $p_id
    with p.name as pname, q.name as mgname, q.desc as d return pname,mgname,d`
    return session.run(query,params)
    .then(result=>{
        const record = result.records
        
        for(let i=0; i<record.length;i++){
            if(record){
                console.log(record)
                const mgname = record[i].get("mgname");
                const pname = record[i].get("pname");
                const desc = record[i].get("d");
                return {mgname:mgname,pname:pname,desc:desc};
                // console.log(a)
            }else{
                throw new Error(`Product with ${product_id} not found`)
            }
        }
        
    }).catch(error=>{
        throw error
    })
}

const MainGroupToGroup = (mg_id)=>{
    const session=neo4j()
    const params = {mg_id}
    const query =`match(p:MainGroup)-[:Has_features]->(q) where p.name=$mg_id with p.name as m,q.name as n, q.desc as d return m,n,d`
    return session.run(query,params)
    .then(result=>{
        const record = result.records
        let a=[]
        for(let i=0; i<record.length;i++){
        if(record){
            const prod = record[i].get('m')
            const name = record[i].get('n')
            const desc = record[i].get('d')
            let b = {mg:prod,groups:name,desc:desc}
            a.push(b);
        }
        else{
            throw new Error(`MainGroup with ${mg_id} not found`)
        }}
        return a
    }).catch(error =>{
        throw error
    })
}
// const GroupsToOptions = (g_id)=>{
//     const session=neo4j()
//     const params = {g_id}
//     const query =`match(p:Group)-[:Has_Options]->(q) where p.name=$g_id with p.name as m,q as n return m,n`
//     return session.run(query,params)
//     .then(result=>{
//         const record = result.records[0]
//         if(record){
//             const prod = record.get('m')
//             const name = record.get('n')["properties"]
//             return {g:prod,Options:name}
//         }
//         else{
//             throw new Error(`Group with ${g_id} not found`)
//         }
//     }).catch(error =>{
//         throw error
//     })
// }
const GroupsToOptions = (g_id)=>{
    const session=neo4j()
    const params = {g_id}
    const query =`match(p:Group)-[:Has_Options]->(q)-[:CR]->(r) where p.name=$g_id with p.name as m,p.desc as desc,p.price as price,q as n, r.name as pname return m,n,price,desc,pname`
    return session.run(query,params)
    .then(result=>{
    const record = result.records
    let a=[]
    for(let i=0; i<record.length;i++){
        if(record){
            const prod = record[i].get('m')
            const name = record[i].get('n')["properties"]["name"]
            const price= record[i].get('n')["properties"]["price"]
            const desc = record[i].get('n')["properties"]["desc"]
            const pname = record[i].get("pname")
            let b = {prod:prod,name:name,price:price,desc:desc,pname:pname}
            a.push(b)
            // return a
           }
            else{
                  throw new Error(`Group with ${g_id} not found`)
           }
    }
    return a
    }).catch(error =>{
      throw error
})
}

// const CompatibilityRule=(o_id)=>{

//     const session=neo4j()
//     const params = {o_id}
//     const query = `match(o:Options)<-[:CR]-(p:Options)
//     where o.name=$o_id
//     return o,p`
//     return session.run(query,params)
//     .then(result=>{
//     const record = result.records
//     let a=[]
//     for(let i=0; i<record.length;i++){
//     if(record){
//             const sub_op = record[i].get('p')["properties"]["name"]
//             a.push(sub_op)
//      }
//        else{
//             throw new Error(`Options with ${o_id} not found`)
//      }
      
//    }
//      return {op:o_id,sub_op:a}
      
//   }).catch(error =>{
//      throw error
//    })
//   }
const desc = (o_id)=>{
    const session = neo4j()
    const params= {o_id}
    const query = `match(o) where o.name= $o_id with o.desc as d return d`
    return session.run(query,params)
    .then(result=>{
        const record = result.records[0]
        if(record){
            const des = record.get('d')
            return {des}
         }
            else{
             throw new Error(`Options with ${o_id} not found`)
         }
    })
}
const CompatibilityRule=(o_id)=>{
    const session=neo4j()
    const params = {o_id}
    const name = o_id
    const query = `match(o:Options)<-[:CR]-(p:Options)
    where o.name=$o_id
    with o.name as o,collect(p.name) as q,o.desc as d
    return o,q,d`
    return session.run(query,params)
    .then(result=>{
    const record = result.records
    let a=[]
    // const M_op = record.get('o')["properties"]["name"]
    for(let i=0; i<record.length;i++){
    if(record){
    const d = record[i].get('d')
    const sub_op = record[i].get('o')
    const product = record[i].get('q')
    // const CRs = new CR(sub_op,product,name,d)
    a.push({o:sub_op,q:product,d:d})
 }
    else{
     throw new Error(`Options with ${o_id} not found`)
 }
 }
 return a
   
 }).catch(error =>{
        throw error
 })
 }

 const CompatibilityRules=(o_id)=>{
    const session=neo4j()
    const params = {o_id}
    const name = o_id
    const query = `
    match(o)-[:CR]-(q:Product)
    where o.name=$o_id
    with collect(o.name) as o,q.name as q
    return o,q`
    return session.run(query,params)
    .then(result=>{
    const record = result.records
    let a=[]
    // const M_op = record.get('o')["properties"]["name"]
    for(let i=0; i<record.length;i++){
    if(record){
    // const d = record[i].get('d')
    const sub_op = record[i].get('o')
    const product = record[i].get('q')
    // const CRs = new CR(sub_op,product,name,d)
    a.push({sub_op:sub_op,product:product})
 }
    else{
     throw new Error(`Options with ${o_id} not found`)
 }
 }
 return a
   
 }).catch(error =>{
        throw error
 })
 }
      
//     console.log(p_id)  
    
    
module.exports = {CompatibilityRules,desc,PToMGToGToOp,productgroupquery,Productbyproductgroupid,ProductsToMainGroup,MainGroupToGroup,GroupsToOptions,CompatibilityRule}
