const {CompatibilityRules,desc,PToMGToGToOp,productgroupquery,Productbyproductgroupid,ProductsToMainGroup,MainGroupToGroup,GroupsToOptions, CompatibilityRule}= require("../models/productModels")

const getProductGroup = async(req,res,next)=>{
    try{
        const pg= await productgroupquery()
        // console.log(pg)
        res.json(pg)
    }catch(err){
        next(err)
    }
}
const getProductsbyProductGroupId = async(req,res)=>{
    const pg_id = req.params.pg_id
    console.log(pg_id)
    Productbyproductgroupid(pg_id).then(prod =>{
        res.json(prod)
    }).catch(error=>{
        res.status(500).json({error: error.message})
    })
} 

const getProductToMainGroup = async(req,res)=>{
    const p_id = req.params.p_id
    PToMGToGToOp(p_id).then(result=>{
        res.json(result)
    }).catch(error=>{
        res.status(500).json({error:error.message})
    })
}
const getGroupsByMainGroup = async(req,res)=>{
    const mg_id = req.params.mg_id
    MainGroupToGroup(mg_id).then(result=>{
        res.json(result)
    }).catch(error=>{
        res.status(500).json({error:error.message})
    })
}
const getDesc = async(req,res)=>{
    const o_id = req.params.o_id
    desc(o_id).then(result=>{
        res.json(result)
    }).catch(error=>{
        res.status(500).json({error:error.message})
    })
}
const getOptionsByGroup = async(req,res)=>{
    const g_id = req.params.g_id
    GroupsToOptions(g_id).then(result=>{
        res.json(result)
    }).catch(error=>{
        res.status(500).json({error:error.message})
    })
}
const getCR = async(req,res)=>{
    const o_id = req.params.o_id
    CompatibilityRule(o_id).then(result=>{
    res.json(result)
}).catch(error=>{
    res.status(500).json({error:error.message})
})
}
const getCRs = async(req,res)=>{
    const o_id = req.params.o_id
    CompatibilityRules(o_id).then(result=>{
    res.json(result)
}).catch(error=>{
    res.status(500).json({error:error.message})
})
}

module.exports={getCRs,getDesc,getProductGroup,getProductsbyProductGroupId,getProductToMainGroup,getGroupsByMainGroup,getOptionsByGroup,getCR}
