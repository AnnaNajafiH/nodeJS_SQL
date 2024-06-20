const middleware=(number, next)=>{
    number +=1
    next(number)
}
const processData=(number)=>{
    middleware(number, (modifiedNumber)=>{
        console.log(`final result:`, modifiedNumber)
    })
}
processData(1)

