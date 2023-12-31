const moment = require("moment");
const { contactModel } = require("../../models/backoffice/contact.model");
const { renterDetailModel } = require("../../models/backoffice/renter.model");
const { invoiceModel } = require("../../models/backoffice/invoice.model");
const {
  waterUnitModel,
  electricalUnitModel,
} = require("../../models/backoffice/unit.model");
const {
  roomsModel,
  waterModel,
  electricalModel,
} = require("../../models/dormitory/dormitory.model");

const CalculateContact = async (startDate, durationInMonths, res) => {
  // Parse the startDate using a specific format
  const parsedStartDate = moment(startDate, "YYYY-MM-DD");

  // ตรวจสอบว่า startDate ไม่ใช่วันที่อดีต
  if (parsedStartDate.isBefore(moment().startOf("day"))) {
    return res.json({
      success: false,
      message: "startDate ต้องไม่เป็นวันที่อดีต",
    });
  }

  // ตรวจสอบว่า startDate ไม่เกิน 5 วันในอนาคต
  if (parsedStartDate.isAfter(moment().add(5, "days").startOf("day"))) {
    return res.json({
      success: false,
      message: "startDate ต้องไม่เกิน 5 วันในอนาคต",
    });
  }

  const endDate = parsedStartDate.add(durationInMonths, "months");
  const date = {
    startDate: parsedStartDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
    durationInMonths,
  };

  return date;
};

const CreateContactForm = async (data, date, res) => {
  let totalPrice = data.deposit;
  if (data.minusDeposit === undefined) {
    return (totalPrice = data.deposit - data.minusDeposit);
  }

  if (await contactModel.findOne({ userId: data.userId })) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  try {
    const contact = await contactModel.create({
      name: data.userDetail.firstname + " " + data.userDetail.lastname,
      address: data.userDetail.address,
      personalId: data.personalId,
      tel: data.userDetail.tel,
      rangeContact: date.durationInMonths,
      contactStartDate: date.startDate,
      contactEndDate: date.endDate,
      deposit: data.deposit,
      minusDeposit: data.minusDeposit,
      waterMeter: data.waterMeter,
      electricalMeter: data.electricalMeter,
      userId: data.userId,
      dormitoryId: data.dormitoryId,
      floorId: data.floorId,
      roomId: data.roomId,
    });

    // TODO: ใช้เมื่อคิดว่าจะสร้าง invoice ยังไง
    // res.status(201).json({
    //   success: true,
    //   message: "Contact created successfully",
    //   contact,
    // });

    return contact;
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
      message: "Error creating contact",
    });
  }
};

// TODO: Invoice
// create invoice
const CreateInvoice = async (contact, res) => {
  const renterId = await renterDetailModel.findOne({ userId: contact.userId });

  await invoiceModel.create({
    roomId: contact.roomId,
    renterDetailId: renterId,
    dormitoryId: contact.dormitoryId,
  });

  res.status(201).json({
    success: true,
    message: "Contact created successfully",
    contact,
  });
};

// user details
const UpdateRenterDetails = async (data, res) => {
  if (!(await contactModel.findOne({ userId: data.userId }))) {
    return res.status(404).json({
      success: false,
      message: "Contact not found",
    });
  }

  const renterDatail = {
    email: data.email,
    facebook: data.facebook,
    line_id: data.lineId,
    educational_or_office: data.educationOrOffice,
    department: data.department,
    position: data.position,
    studentId_or_employeeId: data.studentOrEmployeeId,
    urgent_tel: data.urgentTel,
    relationships: data.relationships,
    tel: data.tel,
    vehicle: data.vehicle,
    note: data.note,
    userId: data.userId,
  };

  if (await renterDetailModel.findOne({ userId: data.userId })) {
    const userDetails = await renterDetailModel.findOneAndUpdate(renterDatail);

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      userDetails,
    });
  }

  const userDetails = await renterDetailModel.create(renterDatail);
  t;
  return res.status(200).json({
    success: true,
    message: "Contact updated successfully",
    userDetails,
  });
};

// water calculate
const WaterCalculate = async (data, res) => {
  for (const room of data.meterUnit) {
    const roomId = await roomsModel.findOne({ _id: room.roomId });
    const totalUnit = room.latedUnit - roomId.waterMeter;
    const water = await waterModel.findOne({ _id: room.waterId });
    const roomIsExists = await waterUnitModel.findOne({ roomId: room.roomId });

    if (water.name === "เหมาจ่ายรายเดือน") {
      await roomsModel.findOneAndUpdate(
        { _id: room.roomId },
        { waterMeter: room.latedUnit }
      );
    } else {
      if (!roomIsExists) {
        await waterUnitModel.create({
          oldUnit: roomId.oldUnit,
          latedUnit: room.latedUnit,
          totalUnit: totalUnit,
          roomId: room.roomId,
        });
      }
      await waterUnitModel.updateOne(
        { roomId: room.roomId }, // แก้ไขเป็น _id
        {
          oldUnit: room.oldUnit,
          latedUnit: room.latedUnit,
          totalUnit: totalUnit,
        }
      );
      // แก้ไขเป็น _id
      await roomsModel.findOneAndUpdate(
        { _id: room.roomId },
        { waterMeter: room.latedUnit }
      );
    }
  }

  return res.status(200).json({
    success: true,
    message: "Water updated successfully",
  });
};

const ElectricalCalculate = async (data, res) => {
  for (const room of data.meterUnit) {
    const roomId = await roomsModel.findOne({ _id: room.roomId });
    const totalUnit = room.latedUnit - roomId.electricalMeter;
    const electrical = await electricalModel.findOne({
      _id: room.electricalId,
    });
    const roomIsExists = await electricalUnitModel.findOne({
      roomId: room.roomId,
    });

    if (electrical.name === "เหมาจ่ายรายเดือน") {
      await roomsModel.findOneAndUpdate(
        { _id: room.roomId },
        { electricalMeter: room.latedUnit }
      );
    } else {
      if (!roomIsExists) {
        await electricalUnitModel.create({
          oldUnit: roomId.oldUnit,
          latedUnit: room.latedUnit,
          totalUnit: totalUnit,
          roomId: room.roomId,
        });
      }
      await electricalUnitModel.updateOne(
        { roomId: room.roomId }, // แก้ไขเป็น _id
        {
          oldUnit: room.oldUnit,
          latedUnit: room.latedUnit,
          totalUnit: totalUnit,
        }
      );
      // แก้ไขเป็น _id
      await roomsModel.findOneAndUpdate(
        { _id: room.roomId },
        { electricalMeter: room.latedUnit }
      );
    }
  }

  return res.status(200).json({
    success: true,
    message: "Electrical updated successfully",
  });
};

module.exports = {
  CalculateContact,
  CreateContactForm,
  UpdateRenterDetails,
  CreateInvoice,
  WaterCalculate,
  ElectricalCalculate,
};
