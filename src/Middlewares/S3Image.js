const { getPresignedUrl } = require("../Middlewares/S3Multer");

const getSignedImage = async (req, res) => {
    const {image} = req.query;
    try{
        const data = await getPresignedUrl(image)
        return res.status(200).json({image:data,message: 'presigned url',"success":true});
    }catch(err){
        return res.status(500).json({ message: 'Server error', error: err.message,"success":false });
    }
}

// const getSignedImagePublic = async (req, res) => {
//     const {image} = req.query;
//     try{
//         if(image.split("/")[0] !== "Public") return res.status(401).json({ message: 'Unauthorized', "success":false });
//         const data = await getPresignedUrl(image)
//         return res.status(200).json({image:data,message: 'presigned url',"success":true});
//     }catch(err){
//         return res.status(500).json({ message: 'Server error', error: err.message,"success":false });
//     }
// }

module.exports = {
    getSignedImage,
    // getSignedImagePublic
}