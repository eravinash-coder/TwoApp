const Member = require('../models/Member');
const Association = require('../models/Association');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const excel = require('exceljs');
const multer = require('multer');
const admin = require('firebase-admin');
const { send } = require('../utils/mailer');



exports.register = async (req, res) => {
  try {
    const associationId = req.user.associationId;
    const { name, email, password } = req.body;

    const memberExists = await Member.findOne({ associationId ,email })

    if (memberExists) {
      return res.status(400).json({
        success: false,
        msg: 'Entered email id already registered with this Association. Login to continue'
      })
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
    const member = await Member.findOne({associationId, email });
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
    console.log(error.message);
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
  const associationId = "65d6cbde7ebd64000882efec";
  try {

    await runMiddleware(req, res, myUploadMiddleware);
    const workbook = new excel.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);
    const data = [];
    for (let i = 1; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const email = row.getCell(4).value;
      
      const existingMember = await Member.findOne({ associationId, email });

      if (existingMember) {
        console.log(existingMember);
        continue; // Skip insertion if email already exists
      }
      const name = row.getCell(2).value;
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

     const membersend = await newMember.save();

     if(membersend){
      const to = email;
      const subject = 'Login Password';
      const html = `Hello ${name},\n\nYour password for registration is: ${password} <br/> Thank you for registering with us. `;

      await send(to, subject, html);

     }

    }
    res.send('Data import complete');
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).send('Error importing data');
  }
});

const serviceAccount = require('../utils/serviceAccountKey.json'); // Path to your Firebase service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendNotification= asyncHandler(async (req, res) => {
  const { title,body } = req.body;
  const associationId = req.user.associationId;

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
    // responses.forEach((response, index) => {
    //   if (response) {
    //     console.log('Successfully sent message to member:', members[index]._id);
    //   } else {
    //     console.error('Failed to send message to member:', members[index]._id);
    //   }
    // });

    res.status(200).send('Notifications sent successfully');
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).send('Error sending notifications');
  }
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  try {

    const { email, associationId } = req.body;

    const memberExists = await Member.findOne({ associationId, email });
    if (!memberExists) {
      return res.status(400).json({
        success: false,
        msg: 'Entered email id Not registered with this association'
      });
    }
    const name = memberExists.name;
    const firstName = name.split(' ')[0];
    const password = firstName+"@12345";
    const hashedPassword = await bcrypt.hash(password, 10);
    const _id = memberExists._id;
    const member = await Member.findByIdAndUpdate(_id, {password:hashedPassword},{ new: true });
    if (member) {
      const to = email;
      const subject = 'Forgot Password';
      const html = `Hello ${name},\n\nYour password for Login is: ${password} <br/> Thank you for registering with us. `;

      await send(to, subject, html);
    }
    res.status(200).json({
      success: true,
      msg: 'Reset password email sent',
      data:member
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});