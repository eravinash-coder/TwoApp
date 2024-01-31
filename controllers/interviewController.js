const Interview = require('../models/interview');
const asyncHandler = require("express-async-handler");
const multer = require('multer');

const handleUpload = require('../helpers/upload')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.fields([
  { name: 'videos', maxCount: 10 },

]);


function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

exports.addInterview = asyncHandler(async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const { title} = req.body;
      let videosObjects;

    if (req.files && req.files['videos']) {
        videosObjects = await Promise.all(
        req.files['videos'].map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          return handleUpload(dataURI);
        })
      );
    }
   

    const interview = new Interview({ title, videos: videosObjects });

    await interview.save();

    res.json({
      message: 'Upload successful',
      data: interview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});


exports.getAllInterview = asyncHandler(async (req, res) => {
    console.log("page number : " + req.params.page);
    console.log("per page : " + req.params.perPage);
    var size = req.params.perPage;
    var pageNo = req.params.page; // parseInt(req.query.pageNo)
  
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
      response = {
        success: false,
        message: "invalid page number, should start with 1",
      };
      return res.json(response);
    }
  
    query.skip = size * (pageNo - 1);
    query.limit = size;
    let interviews = await Interview.find({});
    let result = await Interview.find({})
      .sort("-createdAt")
      .limit(Number(query.limit))
      .skip(Number(query.skip));
  
    res.json({
      success: true,
      count: interviews.length,
      limit: Number(query.limit),
      data: result,
    });
  });
  