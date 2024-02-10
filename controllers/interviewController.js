const Interview = require('../models/interview');
const asyncHandler = require("express-async-handler");


exports.addInterview = asyncHandler(async (req, res) => {
  try {


    const { title, videos, } = req.body;

    const interview = new Interview({ title, videos });

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




exports.getInterviews = asyncHandler(async (req, res) => {


  let interviews = await Interview.find({});



  res.json({
    success: true,
    data: interviews,
  });
});

exports.editInterview = asyncHandler(async (req, res) => {
  try {


    const { title, videos, } = req.body;
    let interview = await Interview.findById(req.params.InterviewId);
    interview.title = title;
    interview.videos = videos;


    await news.save();

    // Send success response inside the try block
    res.status(201).json({
      success: true,
      msg: "Successfully Updated News",

    });

  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
});


exports.deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findByIdAndDelete(req.params.InterviewId);

  if (!interview) {
    return res.status(401).json({
      success: false,
      msg: 'Interview not found.'
    });
  }

  res.status(201).json({
    success: true,
    msg: 'Successfully Deleted',
    data: interview
  });
});


exports.getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.InterviewId)




  res.json({
    success: true,
    data: interview,
  });

});
