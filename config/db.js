const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const local = "mongodb://localhost:27017/MyDatabase"
const atlat = "mongodb+srv://QLTC:242004@atlascluster.apnwmen.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"
const connect = async () => {
    try {
        await mongoose.connect(local,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        console.log('connect success');
    } catch (error) {
        console.log(error);
        console.log('connect fail');
    }
}
module.exports = { connect }