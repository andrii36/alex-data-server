const Product = require('../models/product-model')

class ProductController {
    async addProduct(req, res, next) {
        try {
            const result = await Product.create(req.body.formData)
            if (result) {
                res.status(200).json({ code: 0, message: "Product created" })
            }
        } catch (error) {
            res.status(500).json({ code: 1, message: "Failed" })
        }
    }
    async updateProduct(req, res, next) {
        try {
            const result = await Product.findOneAndUpdate(
                { _id: req.query.id },
                req.body.formData,
                { new: true }
            )
            if (result) {
                res.status(200).json({ code: 0, message: "Product updated" })
            }
        } catch (error) {
            res.status(500).json({ code: 1, message: "Server error, please try again later" })
        }
    }
    async buyProduct(req, res) {
        try {
            const product = await Product.findById(req.query.id)
            if (product.available > 0) {
                await Product.findOneAndUpdate(
                    { _id: req.query.id },
                    {
                        available: product.available - req.query.sellAmount,
                        itemsSold: Number(product.itemsSold) + Number(req.query.sellAmount)
                    },
                    { new: true }
                )
                res.status(200).json({ code: 0, message: "Product purchased" })
            }else{
                res.status(400).json({ code: 1, message: "Product is not available" })
            }
        } catch (error) {
            res.status(400).json({ code: 1, message: "Error" })
        }
    }
    async getAllProducts(req, res) {
        try{
            const products = await Product.find({})
            res.status(200).json(products)
        }catch(error){
            res.status(400).json("Bad request")
        }
    }

    async getProducts(req, res) {
        try{
        const pageNumber = req.query.page
        let products
        let totalProductsCount
        if (req.body.config) {
            const title = req.body.config.title
            const regex = new RegExp(title)
            const available = req.body.config.available
            const config = { ...req.body.config }
            delete config.available
            products = await Product.find({
                ...config,
                title: { $regex: regex, $options: 'i' }
            })
            if (config.priceFrom) products = products.filter(product => Number(product.price) >= config.priceFrom)
            if (config.priceTo) products = products.filter(product => Number(product.price) <= config.priceTo)
            if (available == "Yes") products = products.filter(product => Number(product.available) > 0)
            totalProductsCount = products.length
            products = products.filter((product, ind) => {
                return ind < pageNumber * 5 && ind >= (pageNumber * 5) - 5
            })
        }
        if (!req.body.config) {
            products = await Product.find({}).limit(5).skip((pageNumber - 1) * 5)
            totalProductsCount = await Product.count()
        }
        res.status(200).json({ data: products, totalProductsCount })
        }catch(error){
            res.status(400).json("Bad request")
        }
        
    }

    async getProductsByPartNo(req, res){
        try{
            const products = await Product.find({partNumber: req.query.partNumber})
            res.status(200).json({data: products})
        }catch(error){
            res.status(404).json({ code: 1, message: "Not found" })
        }
    }

    async getOneProduct(req, res) {
        try {
            const product = await Product.findById(req.query.id)
            res.status(200).json(product)
        } catch (err) {
            res.status(404).json({ code: 1, message: "Not found" })
        }
    }
    async getSearchProducts(req, res) {
        try{
        const priceFrom = req.body.config.priceFrom
        const priceTo = req.body.config.priceTo
        const title = req.body.config.title
        const regex = new RegExp(title)
        const available = req.body.config.available
        const config = { ...req.body.config }
        delete config.available
        let products = await Product.find({
            ...config,
            title: { $regex: regex, $options: 'i' }
        })
        if (priceFrom) products = products.filter(product => Number(product.price) >= priceFrom)
        if (priceTo) products = products.filter(product => Number(product.price) <= priceTo)
        if (available == "Yes") products = products.filter(product => Number(product.available) > 0)
        res.status(200).json(products)
        }catch(error){
            res.status(400).json("Bad request")
        }
    }
    // async getSearchProductsByPage(req, res){
    //     const pageNumber = req.query.page
    //     const title = req.body.config.title
    //     const regex = new RegExp(title)
    //     const config = {...req.body.config}
    //     let totalProductsCount
    //     let products = await Product.find({
    //         ...config,
    //         title: {$regex: regex, $options: 'i'}
    //     })
    //     if(config.priceFrom) products = products.filter(product => Number(product.price) >= priceFrom)
    //     if(config.priceTo) products = products.filter(product => Number(product.price) <= priceTo)
    //     totalProductsCount = products.length
    //     products = products.filter((product, ind) => {
    //         return ind < pageNumber * 5 && ind >= (pageNumber * 5) - 5
    //     })
    //     res.status(200).json({data: products, totalProductsCount})
    // }
    async getAdvancedSearchProducts(req, res) {
        try{
        const priceFrom = req.body.formArr.priceFrom
        const priceTo = req.body.formArr.priceTo
        const available = req.body.formArr.available
        const formArr = { ...req.body.formArr }
        delete formArr.available
        let products = await Product.find(formArr)
        if (priceFrom) {
            products = products.filter(product => Number(product.price) >= priceFrom)
        }
        if (priceTo) {
            products = products.filter(product => Number(product.price) <= priceTo)
        }
        if (available == "Yes") products = products.filter(product => Number(product.available) > 0)
        res.status(200).json(products)
        }catch(error){
            res.status(400).json("Bad request")
        }
    }
    // async getAdvancedSearchProductsByPage(req, res){
    //     const pageNumber = req.query.page
    //     const priceFrom = req.body.formArr.priceFrom
    //     const priceTo = req.body.formArr.priceTo
    //     let totalProductsCount
    //     let products = await Product.find(req.body.formArr)
    //     if(priceFrom){
    //         products = products.filter(product => Number(product.price) >= priceFrom)
    //     }
    //     if(priceTo){
    //         products = products.filter(product => Number(product.price) <= priceTo)
    //     }
    //     totalProductsCount = products.length
    //     products = products.filter((product, ind) => {
    //         return ind < pageNumber * 5 && ind >= (pageNumber * 5) - 5
    //     })
    //     res.status(200).json({data: products, totalProductsCount})
    // }
    async deleteProduct(req, res) {
        try {
            await Product.deleteOne({ _id: req.body.id })
            res.status(200).json({ code: 0, message: "Item deleted successfully" })
        } catch (error) {
            res.status(500).json({ code: 1, message: "Error on server, try again later" })
        }
    }
}

module.exports = new ProductController()