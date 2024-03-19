var express = require('express');
var router = express.Router();

// thêm model
const Distributors = require('../models/distributors')
const Fruits = require('../models/fruits');
const fruits = require('../models/fruits');

//Api thêm distribution
router.post('/add-distributor', async (req, res) => {
    try {
        const data = req.body;
        const newDistributor = new Distributors({
            name: data.name
        });

        const result = await newDistributor.save();

        if (result) {
            res.json({
                "status": 200,
                "message": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "message": "Thêm thất bại",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

//Api thêm fruit
router.post('/add-fruit', async (req, res) => {
    try {
        const data = req.body;
        const newFruid = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = await newFruid.save();
        if(result){
            res.json({
                "status": 200,
                "message": "Thêm thành công",
                "data": result
            })
        }else{
            res.json({
                "status": 400,
                "message": "Thêm thất bại",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/get-list-fruit', async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401);

    let payload;
    JWT.verify(token, SECRETKEY, (err, _payload) => {
        if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401)
        if (err) return res.sendStatus(403)

        payload = _payload
    })
    console.log(payload)

    try {
        const data = await Fruits.find().populate("id_distributor");
        res.json({
            "status": 200,
            "messenger": "Danh sach fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
});

router.get('/get-fruit-by-id/:id', async(req, res) => {
    try {
        const{id} = req.params
        const data = await Fruits.findById(id).populate('id_distributor');
        res.json({
            "status": 200,
            "message": "Lấy danh sách thành công",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/get-list-fruit-in-price', async (req, res) => {
    try {
        const { price_start, price_end } = req.query;
        const query = { price: {$gte: price_start, $lte: price_end} }
        const data =  await fruits.find(query, 'name quantity price id_distributor')
            .populate('id_distributor')
            .sort({quantity: -1})
            .skip(0)
            .limit(2)
        res.json({
            "status": 200,
            "message": "Lấy danh sách thành công",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/get-list-fruit-have-name-a-or-x', async (req,res) => {
    try {
        const query = {$or: [
            {name: {$regex: 'T'}},
            {name: {$regex: 'X'}},
        ]}
        const data = await Fruits.find(query, 'name quantity price id_distributor')
                                        .populate('id_distributor')
        res.json({
            "status": 200,
            "message": "Lấy danh sách thành công",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})

router.put('/update-fruit-by-id/:id', async(req,res) => {
    try {
        const {id} = req.params
        const data = req.body;
        const updateFruit = await Fruits.findById(id)
        let result = null;
        if(updateFruit){
            updateFruit.name = data.name ?? updateFruit.name,
            updateFruit.quantity = data.quantity ?? updateFruit.quantity,
            updateFruit.price = data.price ?? updateFruit.price,
            updateFruit.status = data.status ?? updateFruit.status,
            updateFruit.image = data.image ?? updateFruit.image,
            updateFruit.description = data.description ?? updateFruit.description,
            updateFruit.id_distributor = data.id_distributor ?? updateFruit.id_distributor,
            result = await updateFruit.save()
        }

        if(result){
            res.json({
                "status": 200,
                "message": "Cập nhật thành công",
                "data": result
            })
        }else{
            res.json({
                "status": 400,
                "message": "Cập nhật thất bại",
                "data": []
            })
        }
    } catch (error) {
        
    }
})

router.delete('/destroy-fruit-by-id/:id', async (req, res) => {
    try {
        const {id} = req.params
        const result = await Fruits.findByIdAndDelete(id);;
        if(result){
            res.json({
                "status": 200,
                "message": "Xóa thành công",
                "data": result
            })
        }else{
            res.json({
                "status": 400,
                "message": "Xóa thất bại",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

const Upload = require('../config/common/upload');
router.post('/add-fruit-with-file-inage', Upload.array('image', 5), async (req, res) => {
    try {
        const data = req.body;
        const {files} = req
        const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`)

        const newFruid = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage,
            description: data.description,
            id_distributor: data.id_distributor
        })

        const result = await newFruid.save();
        if(result){
            res.json({
                "status": 200,
                "message": "Thêm thành công",
                "data": result
            })
        }else{
            res.json({
                "status": 400,
                "message": "Thêm thất bại",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

const User = require('../models/users');
const Transporter = require('../config/common/mail')
router.post('/register-send-email', Upload.single('avatar'), async(req, res) => {
    try {
        const data = req.body;
        const {file} = req
        const newUser = User({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        });
        const result = await newUser.save();
        if(result)
        {
            const mailOptions = {
                from: 'thien2k4pro@gmail.com',
                to: result.email,
                subject: 'Đăng ký thành công',
                text: 'Cảm ơn bạn đã đăng ký'
            };

            await Transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
            res.json({
                "status": 200,
                "message": "Đăng ký thành công",
                "data": result
            })
        }else{
            res.json({
                "status": 400,
                "message": "Đăng ký thất bại",
                "data": []
            })
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
})

const JWT = require('jsonwebtoken');
const e = require('express');
const users = require('../models/users');
const SECRETKEY = "FPTPOLYTECHNIC"
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await users.findOne({ username, password });
        if (user) {
            const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1h' });
            const refeshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1h' });
            res.json({
                "status": 200,
                "messenger": "Dang nhap thanh cong",
                "data": user,
                "token": token,
                "refeshToken": refeshToken
            })
        } else {

            res.json({
                "status": 400,
                "messenger": "Loi dang nhap",
                "data": [],
            })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;