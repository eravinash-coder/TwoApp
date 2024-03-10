const Member = require('../models/Member');
const Association = require('../models/Association');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const excel = require('exceljs');
const multer = require('multer');

exports.register = async (req, res) => {
  try {
    const associationId = req.user.associationId;
    const { name, email, password } = req.body;

    const memberExists = await Member.findOne({ email })

    if (memberExists) {
      return res.status(400).json({
        success: false,
        msg: 'Entered email id already registered with us. Login to continue'
      })
    }

    const associationExists = await Association.findById(associationId);
    if (!associationExists) {
      return res.status(404).send('Association not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const member = new Member({ associationId, name, email, password: hashedPassword });
    await member.save();
    res.status(201).send('Member registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { associationId, email, password , FmcToken} = req.body;
    console.log(req.body);
    const member = await Member.findOne({ email });
    if (associationId && String(member.associationId) !== associationId) {
      throw new Error('Member does not belong to the specified association');
    }

    if (!member || !(await bcrypt.compare(password, member.password))) {
      throw new Error('Invalid login credentials');
    }
    if (FmcToken && FmcToken !== member.FmcToken) {
      member.FmcToken = FmcToken;
      await member.save();
    }


    const token = jwt.sign({ memberId: member._id }, 'userNewsApp');
    res.send({ token, member });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

exports.getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.memberId)




  res.json({
    success: true,
    data: member,
  });

});


exports.getMember = asyncHandler(async (req, res) => {

  const associationId = req.user.associationId;
  
  let member = await Member.find({ associationId });



  res.json({
    success: true,
    data: member,
  });
});

exports.editMember = asyncHandler(async (req, res) => {
  try {


    let member = await Member.findById(req.params.memberId);

    if (!member) {
      return res.status(401).json({
        success: false,
        msg: 'Category not found.'
      })
    }
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    member = await Member.findByIdAndUpdate(req.params.memberId, { name, email, password: hashedPassword }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: member, msg: 'Successfully updated' });


  } catch (error) {
    // Send error response inside the catch block
    res.status(400).json({ success: false, msg: error.message });
  }
});


exports.deleteMember = asyncHandler(async (req, res) => {

  const member = await Member.findByIdAndDelete(req.params.memberId);

  if (!member) {
    return res.status(401).json({
      success: false,
      msg: 'Member not found.'
    });
  }

  res.status(201).json({
    success: true,
    msg: 'Successfully Deleted',
    data: member
  });
});


const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single('excelFile');

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};
exports.addMemberBulk = asyncHandler(async (req, res) => {
  const associationId = req.user.associationId;
  try {

    await runMiddleware(req, res, myUploadMiddleware);
    const workbook = new excel.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);
    const data = [];
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const emails = row.getCell(2).value;
      const email = emails.split(';')[0];
      const existingMember = await Member.findOne({ email });

      if (existingMember) {

        continue; // Skip insertion if email already exists
      }
      const name = row.getCell(1).value;
      const firstName = name.split(' ')[0];
      const password = firstName + "@12345";

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new member instance
      const newMember = new Member({
        associationId,
        name,
        email,
        password: hashedPassword // Store the hashed password
      });

      await newMember.save();

    }
    res.send('Data import complete');
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).send('Error importing data');
  }
});



exports.sendNotification('/send-notification', async (req, res) => {
  const { associationId, title,body } = req.body;

  try {
    // Find all members with the given associationId
    const members = await Member.find({ associationId });

    if (!members || members.length === 0) {
      return res.status(404).send('No members found for the association');
    }

    // Prepare notification message
    const message = {
      notification: {
        title,
        body
      },
    };

    // Send notifications to each member's device
    const responses = await Promise.all(
      members.map(async (member) => {
        if (member.FmcToken) {
          message.token = member.FmcToken;
          return admin.messaging().send(message);
        }
      })
    );

    // Handle responses
    responses.forEach((response, index) => {
      if (response) {
        console.log('Successfully sent message to member:', members[index]._id);
      } else {
        console.error('Failed to send message to member:', members[index]._id);
      }
    });

    res.status(200).send('Notifications sent successfully');
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).send('Error sending notifications');
  }
});