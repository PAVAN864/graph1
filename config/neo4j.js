const neo4j = require("neo4j-driver")

module.exports=()=>{
    const driver = neo4j.driver('neo4j+s://64ae932f.databases.neo4j.io', neo4j.auth.basic('neo4j', 'uMvj5qpGRhEIDSaNGBHXBWU0aE-KZQpxM5GkQ0khxQo'));
    const session = driver.session()
    return session
}