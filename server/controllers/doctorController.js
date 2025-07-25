// const Doctor = require("../models/doctorModel");
// const User = require("../models/userModel");
// const Notification = require("../models/notificationModel");
// const Appointment = require("../models/appointmentModel");

// const getalldoctors = async (req, res) => {
//   try {
//     let docs;
//     if (!req.locals) {
//       docs = await Doctor.find({ isDoctor: true }).populate("userId");
//     } else {
//       docs = await Doctor.find({ isDoctor: true })
//         .find({
//           _id: { $ne: req.locals },
//         })
//         .populate("userId");
//     }

//     return res.send(docs);
//   } catch (error) {
//     res.status(500).send("Unable to get doctors");
//   }
// };

// const getnotdoctors = async (req, res) => {
//   try {
//     const docs = await Doctor.find({ isDoctor: false })
//       .find({
//         _id: { $ne: req.locals },
//       })
//       .populate("userId");

//     return res.send(docs);
//   } catch (error) {
//     res.status(500).send("Unable to get non doctors");
//   }
// };

// const applyfordoctor = async (req, res) => {
//   try {
//     const alreadyFound = await Doctor.findOne({ userId: req.locals });
//     if (alreadyFound) {
//       return res.status(400).send("Application already exists");
//     }

//     const doctor = Doctor({ ...req.body.formDetails, userId: req.locals });
//     const result = await doctor.save();

//     return res.status(201).send("Application submitted successfully");
//   } catch (error) {
//     res.status(500).send("Unable to submit application");
//   }
// };

// const acceptdoctor = async (req, res) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       { _id: req.body.id },
//       { isDoctor: true, status: "accepted" }
//     );

//     const doctor = await Doctor.findOneAndUpdate(
//       { userId: req.body.id },
//       { isDoctor: true }
//     );

//     const notification = await Notification({
//       userId: req.body.id,
//       content: `Congratulations, Your application has been accepted.`,
//     });

//     await notification.save();

//     return res.status(201).send("Application accepted notification sent");
//   } catch (error) {
//     res.status(500).send("Error while sending notification");
//   }
// };

// const rejectdoctor = async (req, res) => {
//   try {
//     const details = await User.findOneAndUpdate(
//       { _id: req.body.id },
//       { isDoctor: false, status: "rejected" }
//     );
//     const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });

//     const notification = await Notification({
//       userId: req.body.id,
//       content: `Sorry, Your application has been rejected.`,
//     });

//     await notification.save();

//     return res.status(201).send("Application rejection notification sent");
//   } catch (error) {
//     res.status(500).send("Error while rejecting application");
//   }
// };

// const deletedoctor = async (req, res) => {
//   try {
//     const result = await User.findByIdAndUpdate(req.body.userId, {
//       isDoctor: false,
//     });
//     const removeDoc = await Doctor.findOneAndDelete({
//       userId: req.body.userId,
//     });
//     const removeAppoint = await Appointment.findOneAndDelete({
//       userId: req.body.userId,
//     });
//     return res.send("Doctor deleted successfully");
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).send("Unable to delete doctor");
//   }
// };

// module.exports = {
//   getalldoctors,
//   getnotdoctors,
//   deletedoctor,
//   applyfordoctor,
//   acceptdoctor,
//   rejectdoctor,
// };


const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

// ✅ Get All Approved Doctors (with populated user details)
const getalldoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({ isDoctor: true })
      .populate("userId", "firstname lastname email mobile pic gender address");

    return res.status(200).send(docs);
  } catch (error) {
    console.error("getalldoctors error:", error);
    res.status(500).send("Unable to get doctors");
  }
};

// ✅ Get All Pending Doctors
const getnotdoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({ isDoctor: false })
      .populate("userId", "firstname lastname email mobile pic gender address");

    return res.status(200).send(docs);
  } catch (error) {
    console.error("getnotdoctors error:", error);
    res.status(500).send("Unable to get non doctors");
  }
};

// ✅ Apply for Doctor Role
const applyfordoctor = async (req, res) => {
  try {
    const alreadyFound = await Doctor.findOne({ userId: req.locals });
    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }

    const doctor = new Doctor({
      ...req.body.formDetails,
      userId: req.locals,
    });

    await doctor.save();

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    console.error("applyfordoctor error:", error);
    res.status(500).send("Unable to submit application");
  }
};

// ✅ Accept Doctor Application
const acceptdoctor = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, {
      isDoctor: true,
      status: "accepted",
    });

    await Doctor.findOneAndUpdate(
      { userId: req.body.id },
      { isDoctor: true }
    );

    const notification = new Notification({
      userId: req.body.id,
      content: "🎉 Congratulations, your doctor application has been accepted!",
    });

    await notification.save();

    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    console.error("acceptdoctor error:", error);
    res.status(500).send("Error while sending acceptance notification");
  }
};

// ✅ Reject Doctor Application
const rejectdoctor = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, {
      isDoctor: false,
      status: "rejected",
    });

    await Doctor.findOneAndDelete({ userId: req.body.id });

    const notification = new Notification({
      userId: req.body.id,
      content: "❌ Sorry, your doctor application has been rejected.",
    });

    await notification.save();

    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    console.error("rejectdoctor error:", error);
    res.status(500).send("Error while rejecting application");
  }
};

// ✅ Delete Doctor and Related Appointments
const deletedoctor = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      isDoctor: false,
    });

    await Doctor.findOneAndDelete({ userId: req.body.userId });

    await Appointment.deleteMany({ doctorId: req.body.userId }); // fix here: deleting doctor-related appointments

    return res.send("Doctor deleted successfully");
  } catch (error) {
    console.error("deletedoctor error:", error);
    res.status(500).send("Unable to delete doctor");
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
};
