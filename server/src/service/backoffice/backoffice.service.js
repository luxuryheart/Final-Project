const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const {
  contactModel,
  contactPaymentModel,
} = require("../../models/backoffice/contact.model");
const {
  renterDetailModel,
  vehicleModel,
} = require("../../models/backoffice/renter.model");
const {
  invoiceModel,
  invoicedModel,
} = require("../../models/backoffice/invoice.model");
const {
  waterUnitModel,
  electricalUnitModel,
} = require("../../models/backoffice/unit.model");
const {
  roomsModel,
  waterModel,
  electricalModel,
  statusModel,
  dormitoryModel,
  floorsModel,
  bankModel,
} = require("../../models/dormitory/dormitory.model");
const {
  meterUnitModel,
  meterPerMonthModel,
  electricalMeterUnitModel,
  electricalMeterPerMonthModel,
} = require("../../models/backoffice/meterUnit.model");
const { paymentModel } = require("../../models/payment/payment.model");
const { userInDormitoryModel } = require("../../models/dormitory/userindormitory.model");
const { bookingModel } = require("../../controllers/dormitory/booking.model");
const { populate } = require("dotenv");
const { repairModel } = require("../../models/backoffice/repair.model");

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

const CreateContactForm = async (data, userId, date, res) => {
  let totalPrice = data.deposit;
  if (data.refundAmount !== undefined) {
    totalPrice = data.deposit - data.refundAmount;
  }

  const status = await statusModel.findOne({ name: "มีผู้เช่า" });

  if (await contactModel.findOne({ roomId: data.roomId })) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  try {
    const contact = await contactModel.create({
      name: data.name,
      address: data.address,
      personalId: data.personalId,
      tel: data.tel,
      rangeContact: date.durationInMonths,
      contactStartDate: date.startDate,
      contactEndDate: date.endDate,
      deposit: data.deposit,
      minusDeposit: data.refundAmount,
      waterMeter: data.waterMeter,
      electricalMeter: data.electricalMeter,
      userId: userId,
      dormitoryId: data.dormitoryId,
      floorId: data.floorId,
      roomId: data.roomId,
    });
    if (data.waterTypeId === "" || data.waterTypeId === undefined || data.electricalTypeId === "" || data.electricalTypeId === undefined) {
      await roomsModel.findOneAndUpdate(
        { _id: data.roomId },
        {
          status: status._id,
          waterMeter: data.waterMeter,
          electricalMeter: data.electricalMeter,
        }
      );
    } else {
      await roomsModel.findOneAndUpdate(
        { _id: data.roomId },
        {
          status: status._id,
          waterMeter: data.waterMeter,
          electricalMeter: data.electricalMeter,
          waterID: data.waterTypeId,
          electricID: data.electricalTypeId,
        }
      );
    }

    await bookingModel.findOneAndDelete({ roomId: data.roomId });
    
    await meterUnitModel.findOneAndUpdate(
      { roomId: data.roomId },
      {
        $set: {
          initialReading: data.waterMeter,
          finalReading: 0,
          consumption: 0,
        },
      }
    )
    await electricalMeterUnitModel.findOneAndUpdate(
      { roomId: data.roomId },
      {
        $set: {
          initialReading: data.electricalMeter,
          finalReading: 0,
          consumption: 0,
        },
      }
    )
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
const CreateInvoice = async (data, res) => {
  try {
    const water = await waterModel.findOne({ _id: data.room.waterID });
    const electrical = await electricalModel.findOne({
      _id: data.room.electricID,
    });

    const waterPrice =
      water.name === "คิดตามหน่วยจริง"
        ? data.waterUnit.totalUnit * water.price
        : water.price;

    const electricalPrice =
      electrical.name === "คิดตามหน่วยจริง"
        ? data.electricalUnit.totalUnit * electrical.price
        : electrical.price;

    const totalPrice = waterPrice + electricalPrice;

    await invoiceModel.create({
      roomId: data.room._id,
      renterDetailId: data.renterDetail._id,
      "description.roomDesc.roomPrice": data.room.roomCharge,
      "description.waterDesc.waterPrice": waterPrice,
      "description.electricalDesc.electricalPrice": electricalPrice,
      totalPrice: totalPrice,
      grandTotal: totalPrice,
      dormitoryId: data.dormitoryId,
    });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// user details
const UpdateRenterDetails = async (data, userId, res) => {
  if (!(await contactModel.findOne({ roomId: data.roomId }))) {
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
    userId: userId,
  };

  if (await renterDetailModel.findOne({ roomId: data.roomId })) {
    const userDetails = await renterDetailModel.findOneAndUpdate(
      { roomId: data.roomId },
      renterDatail,
      { new: true }
    );

    console.log(userDetails);

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      userDetails,
    });
  }

  const userDetails = await renterDetailModel.create(renterDatail);
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
    const water = await waterModel.findOne({ _id: room.waterID });
    const roomIsExists = await waterUnitModel.findOne({ roomId: room.roomId });

    // TODO: ทำเช็คว่ามี invoice ยังถ้ามีแล้วให้อัปเดต ถ้ายังไม่มีให้ผ่านไปก่อน
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
      _id: room.electricID,
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

const GetRenterDetail = async (id, res) => {
  const renter = await renterDetailModel.findOne({ roomId: id });
  if (!renter) {
    return res.status(404).json({
      success: false,
      message: "Renter not found",
      renter: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Renter detail",
    renter,
  });
};

const ContactPayment = async (contactBill, userId, dormitoryId, res) => {
  const contact = await contactPaymentModel.create({
    userId: userId,
    lists: contactBill.list,
    total: contactBill.total,
    paymentType: contactBill.paymentType,
    paymentDate: contactBill.paymentDate,
    account: contactBill.account,
    paid: contactBill.paid,
    dormitoryId: dormitoryId,
  });
  const contactPayment = await contactPaymentModel.findOne({
    _id: contact._id,
  });
  return contactPayment;
};

const DeleteContactPayment = async (id, res) => {
  await contactPaymentModel.deleteOne({ _id: id });
  return res.status(200).json({
    success: true,
    message: "Contact deleted successfully because paid is false",
  });
};

const CreateRenterDeatails = async (userId, dormitoryId, contactData, res) => {
  const renter = await renterDetailModel.create({
    userId: userId,
    roomId: contactData.roomId,
    dormitoryId: dormitoryId,
  });
  return res.status(200).json({
    success: true,
    message: "Renter created successfully",
    renter,
  });
};

const GetVehicle = async (res) => {
  const vehicles = await vehicleModel.find({}).exec();
  if (!vehicles) {
    return res.status(404).json({
      success: false,
      message: "Vehicle not found",
      vehicles: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Vehicle detail",
    vehicles,
  });
};

const GetFloorFilter = async (floorId, res) => {
  try {
    const floors = await floorsModel
      .findOne({ _id: floorId })
      .populate({ path: "rooms", populate: { path: "status" } });
    if (!floors) {
      return res.status(404).json({
        success: false,
        message: "Floor not found",
        floors: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Floor detail",
      floors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      floors: null,
    });
  }
};

const GetFloorById = async (dormitoryId, res) => {
  const dormitory = await dormitoryModel
    .findOne({ _id: dormitoryId })
    .populate({ path: "floors" });
  const floors = dormitory.floors;
  if (!dormitory) {
    return res.status(404).json({
      success: false,
      message: "Dormitory not found",
      floors: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Floor detail",
    floors,
  });
};

// get unit
const GetWaterUnits = async (dormitoryId, res) => {
  try {
    const waterUnits = await waterUnitModel.find({ dormitoryId: dormitoryId });
    if (!waterUnits || waterUnits.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Water unit not found",
        waterUnits: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Water unit detail",
      waterUnits,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const GetElectricUnits = async (dormitoryId, res) => {
  try {
    const electricUnits = await electricalUnitModel.find({
      dormitoryId: dormitoryId,
    });
    if (!electricUnits || electricUnits.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Electric unit not found",
        electricUnits: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Electric unit detail",
      electricUnits,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const CreateMeterUnit = async (dateDate, dormitoryId, res) => {
  try {
    // Check if the date is not in the past
    const currentDate = new Date();
    if (dateDate.date < currentDate) {
      return res.status(404).json({
        success: false,
        message: "Date should not be in the past",
        date: null,
      });
    }

    // Find dormitory
    const dormitory = await dormitoryModel
      .findOne({ _id: dormitoryId })
      .populate("floors");
    if (!dormitory || !dormitory.floors || dormitory.floors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dormitory not found or missing valid floors",
        dormitory: null,
      });
    }

    const floorIds = [];
    for (let i = 0; i < dormitory.floors.length; i++) {
      floorIds.push(dormitory.floors[i]);
    }

    const roomsIds = [];
    for (let i = 0; i < floorIds.length; i++) {
      for (let j = 0; j < floorIds[i].rooms.length; j++) {
        roomsIds.push(floorIds[i].rooms[j]);
      }
    }
    // for (let i = 0; i < roomsIds.length; i++) {
    //   await meterUnitModel.create({
    //     roomId: roomsIds[i],
    //     month: dateDate.month,
    //     year: dateDate.year,
    //     initialReading: roomsIds[i].waterMeter || 0,
    //     finalReading: 0,
    //     consumption: 0,
    //     meterType: "water"
    //   })
    // }

    const roomsArray = await roomsModel.find({ _id: { $in: roomsIds } });

    for (const roomId of roomsArray) {
      await meterUnitModel.create({
        roomId: roomId,
        month: dateDate.month,
        year: dateDate.year,
        initialReading: roomId.waterMeter || 0,
        finalReading: 0,
        consumption: 0,
        meterType: "water",
      });
    }

    const meterUnit = await meterUnitModel.find({
      month: dateDate.month,
      year: dateDate.year,
      meterType: "water",
    });
    const meterUnitPerMonth = await meterPerMonthModel.create({
      date: dateDate,
      meterUnitId: meterUnit,
      dormitoryId: dormitoryId,
    });

    if (!meterUnitPerMonth) {
      return res.status(404).json({
        success: false,
        message: "Meter unit not found",
        meterUnitPerMonth: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meter units created successfully",
      meterUnitPerMonth,
      meterUnit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const CreateElectricalMeterUnit = async (dateData, dormitoryId, res) => {
  try {
    const currentDate = new Date();
    if (dateData.date < currentDate) {
      return res.status(404).json({
        success: false,
        message: "Date should not be in the past",
        date: null,
      });
    }

    // Find dormitory
    const dormitory = await dormitoryModel
      .findOne({ _id: dormitoryId })
      .populate("floors");
    if (!dormitory || !dormitory.floors || dormitory.floors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dormitory not found or missing valid floors",
        dormitory: null,
      });
    }

    const floorIds = [];
    for (let i = 0; i < dormitory.floors.length; i++) {
      floorIds.push(dormitory.floors[i]);
    }

    const roomsIds = [];
    for (let i = 0; i < floorIds.length; i++) {
      for (let j = 0; j < floorIds[i].rooms.length; j++) {
        roomsIds.push(floorIds[i].rooms[j]);
      }
    }
    const roomsArray = await roomsModel.find({ _id: { $in: roomsIds } });

    for (const roomId of roomsArray) {
      await electricalMeterUnitModel.create({
        roomId: roomId,
        month: dateData.month,
        year: dateData.year,
        initialReading: roomId.electricalMeter || 0,
        finalReading: 0,
        consumption: 0,
        meterType: "electrical",
      });
    }

    const meterUnit = await electricalMeterUnitModel.find({
      month: dateData.month,
      year: dateData.year,
      meterType: "electrical",
    });
    const meterUnitPerMonth = await electricalMeterPerMonthModel.create({
      date: dateData,
      electricalMeterUnitId: meterUnit,
      dormitoryId: dormitoryId,
    });

    if (!meterUnitPerMonth) {
      return res.status(404).json({
        success: false,
        message: "Meter unit not found",
        meterUnitPerMonth: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meter units created successfully",
      meterUnitPerMonth,
      meterUnit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// create invoice
const CreateInvoiced = async (dormitoryId, roomId, dateData, res) => {
  try {
    const meterUnit = await meterPerMonthModel
      .findOne({
        dormitoryId: dormitoryId,
        "date.month": dateData.month,
        "date.year": dateData.year,
      })
      .populate({
        path: "meterUnitId",
        match: { roomId: roomId },
        populate: {
          path: "roomId",
          populate: [{ path: "waterID" }, { path: "electricID" }],
        },
      });

    if (!meterUnit) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
        meterUnit: null,
      });
    }

    const electricalUnit = await electricalMeterPerMonthModel
      .findOne({
        dormitoryId: dormitoryId,
        "date.month": dateData.month,
        "date.year": dateData.year,
      })
      .populate({
        path: "electricalMeterUnitId",
        match: { roomId: roomId },
        populate: {
          path: "roomId",
          populate: [{ path: "waterID" }, { path: "electricID" }],
        },
      });

    const meterStatus = meterUnit.meterUnitId[0].invoiceStatus;
    const meterType = meterUnit.meterUnitId[0].roomId.waterID.name;
    const electricalType = electricalUnit.electricalMeterUnitId[0].roomId.electricID.name;
    const electricalStatus = electricalUnit.electricalMeterUnitId[0].invoiceStatus;


    const lists = [
      {
        description: "ค่าห้องเช่า",
        meter: null,
        amount: 1,
        unit: "เดือน",
        price: meterUnit.meterUnitId[0].roomId.roomCharge,
        total: meterUnit.meterUnitId[0].roomId.roomCharge,
      },
      {
        description: "ค่าไฟฟ้า",
        meter: `${electricalUnit.electricalMeterUnitId[0].initialReading} - ${
          electricalUnit.electricalMeterUnitId[0].finalReading
        } ${electricalType === "คิดตามหน่วยจริง" ? "" : "เหมาจ่ายรายเดือน"}`,
        amount:
          electricalType === "คิดตามหน่วยจริง"
            ? electricalUnit.electricalMeterUnitId[0].consumption
            : 1,
        unit: electricalType === "คิดตามหน่วยจริง" ? "ยูนิต" : "เดือน",
        price: electricalUnit.electricalMeterUnitId[0].roomId.electricID.price,
        total:
          electricalType === "คิดตามหน่วยจริง"
            ? electricalUnit.electricalMeterUnitId[0].consumption *
              electricalUnit.electricalMeterUnitId[0].roomId.electricID.price
            : electricalUnit.electricalMeterUnitId[0].roomId.electricID.price,
      },
      {
        description: "ค่าน้ำ",
        meter: `${meterUnit.meterUnitId[0].initialReading} - ${
          meterUnit.meterUnitId[0].finalReading
        } ${meterType === "คิดตามหน่วยจริง" ? "" : "เหมาจ่ายรายเดือน"}`,
        amount:
          meterType === "คิดตามหน่วยจริง"
            ? meterUnit.meterUnitId[0].consumption
            : 1,
        unit: meterType === "คิดตามหน่วยจริง" ? "ยูนิต" : "เดือน",
        price: meterUnit.meterUnitId[0].roomId.waterID.price,
        total:
          meterType === "คิดตามหน่วยจริง"
            ? meterUnit.meterUnitId[0].consumption *
              meterUnit.meterUnitId[0].roomId.waterID.price
            : meterUnit.meterUnitId[0].roomId.waterID.price,
      },
    ];

    const renterDetail = await renterDetailModel.findOne({ roomId: roomId });

    if (!meterStatus && !electricalStatus) {
      const invoice = await invoicedModel.create({
        roomId: roomId,
        renterDetailId: renterDetail._id,
        "date.day": dateData.day,
        "date.month": dateData.month,
        "date.year": dateData.year,
        "date.date": dateData.date,
        lists: lists,
        total: lists[0].total + lists[1].total + lists[2].total,
        discount: 0,
        grandTotal: lists[0].total + lists[1].total + lists[2].total,
        dormitoryId: dormitoryId,
      });
      await meterUnitModel.findOneAndUpdate(
        { _id: meterUnit.meterUnitId[0]._id },
        { invoiceStatus: true },
        { new: true }
      );
      await electricalMeterUnitModel.findOneAndUpdate(
        { _id: electricalUnit.electricalMeterUnitId[0]._id },
        { invoiceStatus: true },
        { new: true }
      );

      if (!invoice) {
        return res.status(500).json({
          success: false,
          message: "สร้างใบเสร็จไม่สำเร็จ",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Meter unit detail",
        meterUnit,
        electricalUnit,
        invoice,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "มีใบเสร็จแล้ว",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const UpdateInvoicedList = async (invoiceId, roomId, list, res) => {
  try {
    const invoice = await invoicedModel.findOne({
      _id: invoiceId,
      roomId: roomId,
    });
    const invoiceLists = invoice.lists;
    invoiceLists.push(list);
    let totalPrice = 0;
    for (const item of invoiceLists) {
      totalPrice += item.total;
    }
    const invoiceUpdate = await invoicedModel.findOneAndUpdate(
      { _id: invoiceId, roomId: roomId },
      {
        $set: {
          lists: invoiceLists,
          total: totalPrice,
          grandTotal: totalPrice,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Update success",
      invoice: invoiceUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetRoomByMeterUnit = async (floorId, dateData, dormitoryId, res) => {
  try {
    const meterUnit = await meterPerMonthModel
      .findOne({
        dormitoryId: dormitoryId,
        "date.month": dateData.month,
        "date.year": dateData.year,
      })
      .populate({
        path: "meterUnitId",
        populate: {
          path: "roomId",
          populate: [
            { path: "electricID" },
            { path: "waterID" },
            { path: "status" },
          ],
        },
      })
      .populate({
        path: "dormitoryId",
        populate: {
          path: "floors",
          match: { _id: floorId },
          populate: { path: "rooms" },
        },
      });

    if (!meterUnit) {
      return res.status(404).json({
        success: false,
        message: "Meter unit not found",
        meterUnit: null,
      });
    }

    const dormitory = await dormitoryModel
      .findOne({ _id: dormitoryId })
      .populate({
        path: "floors",
        match: { _id: floorId },
        populate: { path: "rooms" },
      });

    const meterUnitRoom = [];
    for (const meter of meterUnit.meterUnitId) {
      for (const floor of dormitory.floors) {
        for (const room of floor.rooms) {
          if (room._id.toString() === meter.roomId._id.toString()) {
            meterUnitRoom.push(meter);
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Room detail by meter unit success",
      meterUnitRoom,
      meterUnit,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const UpdateMeterUnit = async (data, res) => {
  try {
    for (const meter of data.meterUnit) {
      const totalPrice = meter.finalReading - meter.initialReading;
      await meterUnitModel.findOneAndUpdate(
        { _id: meter._id },
        {
          $set: {
            initialReading: meter.initialReading,
            finalReading: meter.finalReading,
            consumption: totalPrice < 0 ? 0 : totalPrice,
          },
        },
        { new: true }
      );
      if (meter.roomId._id === data.roomId) {
        await roomsModel.findOneAndUpdate(
          { _id: data.roomId },
          { $set: { waterMeter: meter.finalReading } },
          { new: true }
        );
      }
    }
    return res.status(200).json({
      success: true,
      message: "Update success",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const GetElectricalMeterUnit = async (floorId, dateData, dormitoryId, res) => {
  try {
    const electricalMeterUnit = await electricalMeterPerMonthModel
    .findOne({
      dormitoryId: dormitoryId,
      "date.month": dateData.month,
      "date.year": dateData.year,
    })
    .populate({
      path: "electricalMeterUnitId",
      populate: {
        path: "roomId",
        populate: [
          { path: "electricID" },
          { path: "waterID" },
          { path: "status" },
        ],
      },
    })
    .populate({
      path: "dormitoryId",
      populate: {
        path: "floors",
        match: { _id: floorId },
        populate: { path: "rooms" },
      },
    });

  if (!electricalMeterUnit) {
    return res.status(404).json({
      success: false,
      message: "Meter unit not found",
      electricalMeterUnit: null,
    });
  }

  const dormitory = await dormitoryModel
    .findOne({ _id: dormitoryId })
    .populate({
      path: "floors",
      match: { _id: floorId },
      populate: { path: "rooms" },
    });

  const electricalMeterUnitRoom = [];
  for (const elecMeter of electricalMeterUnit.electricalMeterUnitId) {
    for (const floor of dormitory.floors) {
      for (const room of floor.rooms) {
        if (room._id.toString() === elecMeter.roomId._id.toString()) {
          electricalMeterUnitRoom.push(elecMeter);
        }
      }
    }
  }

  return res.status(200).json({
    success: true,
    message: "Room detail by meter unit success",
    electricalMeterUnitRoom,
    electricalMeterUnit,
  });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const UpdateElectricUnit = async (data, res) => {
  try {
    for (const meter of data.electricalMeterUnit) {
      const totalPrice = meter.finalReading - meter.initialReading;
      await electricalMeterUnitModel.findOneAndUpdate(
        { _id: meter._id },
        {
          $set: {
            initialReading: meter.initialReading,
            finalReading: meter.finalReading,
            consumption: totalPrice < 0 ? 0 : totalPrice,
          },
        },
        { new: true }
      );
      if (meter.roomId._id === data.roomId) {
        await roomsModel.findOneAndUpdate(
          { _id: data.roomId },
          { $set: { electricalMeter: meter.finalReading } },
          { new: true }
        );
      }
    }
    return res.status(200).json({
      success: true,
      message: "Update success",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

const GetInvoicedList = async (dormitoryId, date, res) => {
  try {
    const invoice = await invoicedModel
      .find({ dormitoryId: dormitoryId, "date.month": date.month, "date.year": date.year })
      .populate({
        path: "dormitoryId",
        populate: {
          path: "floors",
          populate: { path: "rooms" },
        },
      })
      .populate({
        path: "roomId",
        populate: [
          { path: "waterID" },
          { path: "electricID" },
          { path: "status" },
        ]
      })
      .populate({
        path: "renterDetailId",
        populate: { path: "userId" },
      })
      console.log(invoice);
    return res.status(200).json({
      success: true,
      message: "Get invoice list success",
      invoice,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

const GetInvoicedByID = async (invoicedId, res) => {
  try {
    const invoice = await invoicedModel
      .findOne({ _id: invoicedId })
      .populate({
        path: "dormitoryId",
        populate: {
          path: "floors",
          populate: { path: "rooms" },
        },
      })
      .populate({
        path: "roomId",
        populate: [
          { path: "waterID" },
          { path: "electricID" },
          { path: "status" },
        ]
      })
      .populate({
        path: "renterDetailId",
        populate: { path: "userId" },
      })
    return res.status(200).json({
      success: true,
      message: "Get invoice list success",
      invoice,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

const DeleteInvoicedList = async (index, listid, id, res) => {
  try {
    const invoice = await invoicedModel.findOne({ _id: id });

    // ตรวจสอบว่ารายการที่ต้องการลบมีอยู่ในใบแจ้งหนี้หรือไม่
    if (invoice && invoice.lists[index]._id.toString() === listid) {
      // ลบรายการ
      invoice.lists.splice(index, 1);

      // คำนวณราคารวมใหม่
      let totalPrice = 0;
      invoice.lists.forEach(item => {
        totalPrice += item.total;
      });

      // ปรับปรุงราคารวมและราคารวมทั้งหมดของใบแจ้งหนี้
      invoice.total = totalPrice;
      invoice.grandTotal = totalPrice;

      // บันทึกการเปลี่ยนแปลงโดยใช้ findOneAndUpdate
      await invoicedModel.findOneAndUpdate({ _id: id }, { lists: invoice.lists, total: invoice.total, grandTotal: invoice.grandTotal });

      console.log("Delete success");
      return res.status(200).json({ success: true, message: "Delete success" });
    } else {
      return res.status(404).json({ success: false, message: "List not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const DeleteInvoiced = async (id, res) => {
  try {
    const invoiced = await invoicedModel.findOne({ _id: id });

    await meterUnitModel.findOneAndUpdate({ roomId: invoiced.roomId, month: invoiced.date.month, year: invoiced.date.year }, { invoiceStatus: false }, { new: true });
    await electricalMeterUnitModel.findOneAndUpdate({ roomId: invoiced.roomId, month: invoiced.date.month, year: invoiced.date.year }, { invoiceStatus: false }, { new: true });

    await invoicedModel.deleteOne({ _id: id });

    return res.status(200).json({ success: true, message: "Delete success" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const GetDormitoryByID = async (dormitoryId, res) => {
  try {
    const dormitory = await dormitoryModel
      .findOne({ _id: dormitoryId })
      .populate({
        path: "floors",
        populate: { path: "rooms" },
      });
    return res.status(200).json({
      success: true,
      message: "Get dormitory success",
      dormitory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

const UpdateDormitory = async (data, res) => {
  try {
    const dormitory = await dormitoryModel.findOneAndUpdate(
      { _id: data._id },
      {
        name: data.name,
        address: data.address,
        contact: data.contact,
        promptpay: data.promptpay,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Update dormitory success",
      dormitory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

const DeleteDormitory = async (id, res) => {
  try {
    const invoice = await invoicedModel.find({ dormitoryId: id });
    if (invoice && invoice.length > 0) {
      const payment = await paymentModel.find({ invoiceId: { $in: invoice.map(item => item._id) } });
      if (payment && payment.length > 0) {
        await paymentModel.deleteMany({ invoiceId: { $in: invoice.map(item => item._id) } });
      }
      await invoicedModel.deleteMany({ dormitoryId: id });
    }
    const meterUnit = await meterPerMonthModel.find({ dormitoryId: id });
    if (meterUnit && meterUnit.length > 0) {
      for (const item of meterUnit) {
        for (const meter of item.meterUnitId){
          await meterUnitModel.deleteOne({ _id: meter });
        }
        await meterPerMonthModel.deleteOne({ _id: item._id });
      }
    } 
    const electricalUnit = await electricalMeterPerMonthModel.find({ dormitoryId: id });
    if (electricalUnit && electricalUnit.length > 0) {
      for (const item of electricalUnit) {
        for (const meter of item.electricalMeterUnitId){
          await electricalMeterUnitModel.deleteOne({ _id: meter });
        }
        await electricalMeterPerMonthModel.deleteOne({ _id: item._id });
      }
    }
    const contactPayment = await contactPaymentModel.find({ dormitoryId: id });
    if (contactPayment && contactPayment.length > 0) {
      await contactPaymentModel.deleteMany({ dormitoryId: id });
    }
    const contact = await contactModel.find({ dormitoryId: id });
    if (contact && contact.length > 0) {
      await contactModel.deleteMany({ dormitoryId: id });
    }
    const renter = await renterDetailModel.find({ dormitoryId: id });
    if (renter && renter.length > 0) {
      await renterDetailModel.deleteMany({ dormitoryId: id });
    }
    const userInDormitory = await userInDormitoryModel.find({ dormitoryId: id });
    if (userInDormitory && userInDormitory.length > 0) {
      await userInDormitoryModel.deleteMany({ dormitoryId: id });
    }
    const water = await waterModel.find({ dormitoryId: id });
    if (water && water.length > 0) {
      await waterModel.deleteMany({ dormitoryId: id });
    }
    const electrical = await electricalModel.find({ dormitoryId: id });
    if (electrical && electrical.length > 0) {
      await electricalModel.deleteMany({ dormitoryId: id });
    }
    const bank = await bankModel.find({ dormitoryId: id });
    if (bank && bank.length > 0) {
      await bankModel.deleteMany({ dormitoryId: id });
    }
    const dormitory = await dormitoryModel.findOne({ _id: id });
    if (dormitory) {
      for (const floor of dormitory.floors) {
        const floors = await floorsModel.findOne({ _id: floor });
        for (const room of floors.rooms) {
          await roomsModel.deleteOne({ _id: room });
        }
        await floorsModel.deleteOne({ _id: floor });
      }
    }
    await dormitoryModel.deleteOne({ _id: id });
      
    return res.status(200).json({ success: true, message: "Delete success" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const UpdateBank = async(data, res) => {
  try {
    const bank = await bankModel.findOneAndUpdate(
      { _id: data.bankId },
      {
        name: data.name,
        account: data.account,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Update bank success",
      bank
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

const DeleteBank = async(id, dormitoryId, res) => {
  try {
    const bank = await bankModel.findOneAndDelete({ _id: id });
    await dormitoryModel.findOneAndUpdate({ _id: dormitoryId }, { $pull: { banks: id } }, { new: true });
    return res.status(200).json({
      success: true,
      message: "Delete bank success",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
const UpdateListData = async (data, res) => {
  try {
    const invoice = await invoicedModel.findOne({ _id: data.invoiceId });

    if (invoice) {
        // อัปเดตค่าใน subdocument
        invoice.lists[data.index].description = data.description;
        invoice.lists[data.index].amount = data.amount;
        invoice.lists[data.index].price = data.price;
        invoice.lists[data.index].total = data.amount * data.price;
        invoice.lists[data.index].grandTotal = data.amount * data.price

      // คำนวณ grandTotal จากค่าใน subdocument
      let totalPrice = 0;
      invoice.lists.forEach(item => {
        totalPrice += item.total;
      });

      // อัปเดต grandTotal ในเอกสารหลัก
      await invoicedModel.findOneAndUpdate(
        { _id: data.invoiceId },
        { $set: { "grandTotal": totalPrice, "lists.$[elem].description": data.description, "lists.$[elem].amount": data.amount, "lists.$[elem].price": data.price, "lists.$[elem].total": data.amount * data.price } },
        { new: true, arrayFilters: [{ "elem._id": data.listId }] }
      );

      return res.status(200).json({
        success: true,
        message: "Update list success",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const GetUserByDormitoryID = async (id, res) => {
  try {
    const user = await userInDormitoryModel.findOne({ dormitoryId: id })
      .populate({
        path: "userId",
        populate: { path: "role" }
      })
    return res.status(200).json({
      success: true,
      message: "Get user success",
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const PaymentByAdmin = async (data, res) => {
  try {
    // อัปเดต grandTotal ในใบแจ้งหนี้
    const invoice = await invoicedModel.findOneAndUpdate(
      { _id: data.invoiceId },
      { $set: { grandTotal: data.grandTotal - data.amount } },
      { new: true } // เพิ่ม option new เพื่อให้ return document ที่อัปเดตแล้วออกมา
    );

    const orderId = uuidv4();
    // สร้างรายการชำระเงินใหม่
    const payment = await paymentModel.create({
      invoiceId: data.invoiceId,
      date: data.date,
      price: data.amount,
      paymentType: "cash",
      userId: data.userId,
      orderId: orderId,
      sessionId: uuidv4(),
    });

    if (invoice) {
      if (invoice.grandTotal > 0) {
        // หากยอดคงเหลือในใบแจ้งหนี้ยังมากกว่าศูนย์
        payment.price = invoice.grandTotal;
        await payment.save();
      } else if (invoice.grandTotal === 0) {
        // หากยอดคงเหลือในใบแจ้งหนี้เป็นศูนย์ แสดงว่าชำระเงินครบแล้ว
        payment.price = data.amount;
        payment.status = "completed";
        await payment.save();

        // invoice.total = data.amount;
        invoice.grandTotal = invoice.total;
        invoice.invoiceStatus = "paid";
        await invoicedModel.findOneAndUpdate({ _id: data.invoiceId }, invoice, { new: true }); // ใช้ findByIdAndUpdate แทนการ save()
        
      }

      return res.status(200).json({
        success: true,
        message: "Payment success",
        payment,
        invoice,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetPaymentByAdmin = async (id, res) => {
  try {
    const payment = await paymentModel.findOne({ invoiceId: id });
    return res.status(200).json({
      success: true,
      message: "Get payment success",
      payment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const BankTransferPayment = async (data, res) => {
  try {
    const payment = await paymentModel.findOneAndUpdate({ invoiceId: data.invoiceId }, {
      $set: {
        status: "completed",
      }
    }, { new: true });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    await invoicedModel.findOneAndUpdate({ _id: data.invoiceId }, {
      $set: {
        invoiceStatus: "paid",
      }
    })
    return res.status(200).json({
      success: true,
      message: "Payment success",
      payment
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const CancelPayment = async (data, res) => {
  try {
    const payment = await paymentModel.findOneAndUpdate({ invoiceId: data.invoiceId }, {
      $set: {
        status: "cancelled",
        img: "",
      }
    }, { new: true });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    await invoicedModel.findOneAndUpdate({ _id: data.invoiceId }, {
      $set: {
        invoiceStatus: "unpaid",
      }
    })
    return res.status(200).json({
      success: true,
      message: "Payment success",
      payment
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const BookingByAdmin = async (data, res) => {
  try {
      const booking = await bookingModel.create({
        roomId: data.roomId,
        userId: data.userId,
        bookingDate: data.bookingDate,
        bookingStartDate: data.bookingStartDate,
        bookingAmount: data.bookingAmount,
        name: data.name,
        tel: data.phone,
        note: data.note
      });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    const status = await statusModel.findOne({ name: "จอง" });

    await roomsModel.findOneAndUpdate({ _id: data.roomId }, {
      status: status._id
    })
    return res.status(200).json({
      success: true,
      message: "Booking success",
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const GetBookingByRoomID = async (id, res) => {
  try {
    const booking = await bookingModel.findOne({ roomId: id })
      .populate({
        path: "roomId",
        populate: {
          path: "status"
        }
      })
      .populate({ path: "userId" });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
        booking: null
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get booking success",
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const CancelBookingByAdmin = async (id, roomId, res) => {
  try {
    const booking = await bookingModel.findOneAndDelete({ _id: id, roomId: roomId });
    const status = await statusModel.findOne({ name: "ว่าง" });
    await roomsModel.findOneAndUpdate({ _id: roomId }, {
      status: status._id
    }, { new: true })
    return res.status(200).json({
      success: true,
      message: "Cancel booking success",
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const GetContactByRoomID = async (id, res) => {
  try {
    const contact = await contactModel.findOne({ roomId: id })
      .populate({
        path: "roomId",
        populate: [{
          path: "status",
          path: "electricID",
          path: "waterID"
        }]
      })
      .populate({ path: "userId" });
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
        contact: null
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get contact success",
      contact
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const CancelContactByID = async (id, roomId, res) => {
  try {
    const contact = await contactModel.findOneAndDelete({ _id: id, roomId: roomId });
    await renterDetailModel.findOneAndDelete({ roomId: roomId });
    const status = await statusModel.findOne({ name: "ว่าง" });
    await roomsModel.findOneAndUpdate({ _id: roomId }, {
      status: status._id
    }, { new: true })
    return res.status(200).json({
      success: true,
      message: "Cancel contact success",
      contact
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

const UpdateBookingByAdmin = async (data, res) => {
  try {
    const booking = await bookingModel.findOneAndUpdate(
      { _id: data.bookingId },
      {
        name: data.name,
        tel: data.phone,
        bookingDate: data.bookingDate,
        bookingStartDate: data.bookingStartDate,
        bookingAmount: data.bookingAmount,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Update booking success",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetRenterByDormitoryID = async(id, res) => {
  try {
    const renter = await renterDetailModel.find({ dormitoryId: id })
      .populate({
        path: "roomId",
        populate: [{
          path: "status",
          path: "electricID",
          path: "waterID"
        }]
      })
      .populate({
        path: "userId",
        populate: [{
          path: "role",
          path: "status"
        }]
      })
    if (!renter) {
      return res.status(404).json({
        success: false,
        message: "Renter not found",
        renter: null
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get renter success",
      renter
    });
  } catch (error) {
    console.log(error);
  }
}

const DisconnectUser = async(data, res) => {
  try {
    const userInDormitory = await userInDormitoryModel.findOne({ dormitoryId: data.dormitoryId });

    if (!userInDormitory) {
        return res.status(404).json({
            success: false,
            message: "User in dormitory not found",
            userInDormitory: null,
        });
    }

    const newDormitoryConnect = await userInDormitoryModel.findOneAndUpdate({ dormitoryId: data.dormitoryId } ,{
        userId: userInDormitory.userId.filter((id) => id.toString() !== data.userId),
    })
    return res.status(200).json({
        success: true,
        message: "Dormitory connection successfully",
        newDormitoryConnect
    });
} catch (error) {
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
}

const CreateInvoicedAll = async (data, dateData, res) => {
  try {
    for (const meter of data.meterId) {
      try {
        const meterUnit = await meterPerMonthModel.findOne({
          dormitoryId: data.dormitoryId,
          "date.month": dateData.month,
          "date.year": dateData.year,
        }).populate({
          path: "meterUnitId",
          match: { roomId: meter.roomId._id },
          populate: { path: "roomId", populate: [{ path: "waterID" }, { path: "electricID" }] },
        });

        if (!meterUnit) {
          return res.status(404).json({
            success: false,
            message: "Room not found",
            meterUnit: null,
          });
        }

        const electricalUnit = await electricalMeterPerMonthModel.findOne({
          dormitoryId: data.dormitoryId,
          "date.month": dateData.month,
          "date.year": dateData.year,
        }).populate({
          path: "electricalMeterUnitId",
          match: { roomId: data.elecId.find(elec => elec.roomId._id === meter.roomId._id).roomId._id },
          populate: { path: "roomId", populate: [{ path: "waterID" }, { path: "electricID" }] },
        });

        const meterStatus = meterUnit.meterUnitId[0].invoiceStatus;
        const meterType = meterUnit.meterUnitId[0].roomId.waterID.name;
        const electricalType = electricalUnit.electricalMeterUnitId[0].roomId.electricID.name;
        const electricalStatus = electricalUnit.electricalMeterUnitId[0].invoiceStatus;

        const lists = [
          {
            description: "ค่าห้องเช่า",
            meter: null,
            amount: 1,
            unit: "เดือน",
            price: meterUnit.meterUnitId[0].roomId.roomCharge,
            total: meterUnit.meterUnitId[0].roomId.roomCharge,
          },
          {
            description: "ค่าไฟฟ้า",
            meter: `${electricalUnit.electricalMeterUnitId[0].initialReading} - ${
              electricalUnit.electricalMeterUnitId[0].finalReading
            } ${electricalType === "คิดตามหน่วยจริง" ? "" : "เหมาจ่ายรายเดือน"}`,
            amount: electricalType === "คิดตามหน่วยจริง"
              ? electricalUnit.electricalMeterUnitId[0].consumption
              : 1,
            unit: electricalType === "คิดตามหน่วยจริง" ? "ยูนิต" : "เดือน",
            price: electricalUnit.electricalMeterUnitId[0].roomId.electricID.price,
            total: electricalType === "คิดตามหน่วยจริง"
              ? electricalUnit.electricalMeterUnitId[0].consumption *
              electricalUnit.electricalMeterUnitId[0].roomId.electricID.price
              : electricalUnit.electricalMeterUnitId[0].roomId.electricID.price,
          },
          {
            description: "ค่าน้ำ",
            meter: `${meterUnit.meterUnitId[0].initialReading} - ${
              meterUnit.meterUnitId[0].finalReading
            } ${meterType === "คิดตามหน่วยจริง" ? "" : "เหมาจ่ายรายเดือน"}`,
            amount: meterType === "คิดตามหน่วยจริง"
              ? meterUnit.meterUnitId[0].consumption
              : 1,
            unit: meterType === "คิดตามหน่วยจริง" ? "ยูนิต" : "เดือน",
            price: meterUnit.meterUnitId[0].roomId.waterID.price,
            total: meterType === "คิดตามหน่วยจริง"
              ? meterUnit.meterUnitId[0].consumption *
              meterUnit.meterUnitId[0].roomId.waterID.price
              : meterUnit.meterUnitId[0].roomId.waterID.price,
          },
        ];

        const renterDetail = await renterDetailModel.findOne({ roomId: meter.roomId._id });

        if (!meterStatus && !electricalStatus) {
          const invoice = await invoicedModel.create({
            roomId: meter.roomId._id,
            renterDetailId: renterDetail._id,
            "date.day": dateData.day,
            "date.month": dateData.month,
            "date.year": dateData.year,
            "date.date": dateData.date,
            lists: lists,
            total: lists[0].total + lists[1].total + lists[2].total,
            discount: 0,
            grandTotal: lists[0].total + lists[1].total + lists[2].total,
            dormitoryId: data.dormitoryId,
          });
          await meterUnitModel.findOneAndUpdate(
            { _id: meterUnit.meterUnitId[0]._id },
            { invoiceStatus: true },
            { new: true }
          );
          await electricalMeterUnitModel.findOneAndUpdate(
            { _id: electricalUnit.electricalMeterUnitId[0]._id },
            { invoiceStatus: true },
            { new: true }
          );

          if (!invoice) {
            return res.status(500).json({
              success: false,
              message: "สร้างใบเสร็จไม่สำเร็จ",
            });
          }
        } else {
          return res.status(500).json({
            success: false,
            message: "มีใบเสร็จแล้ว",
          });
        }

      } catch (error) {
        console.log(error);
      }
    }
    return res.status(200).json({
      success: true,
      message: "Meter unit detail",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const RepairByAdmin  = async (data, res) => {
  try {
    const repair = await repairModel.create(data);
    if (!repair) {
      return res.status(500).json({
        success: false,
        message: "สร้างการซ่อมไม่สำเร็จ",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Repair detail",
    });
  } catch (error) {
    console.log(error);
  }
}
const GetRepair = async (status, res) => {
  try {
    const repair = await repairModel.find({ status: status });
    if (!repair) {
      return res.status(500).json({
        success: false,
        message: "ไม่พบการซ่อม",
        repair: null
      });
    }
    return res.status(200).json({
      success: true,
      message: "Repair detail",
      repair
    });
  } catch (error) {
    console.log(error);
  }
}

const UpdateRepairByAdmin = async (data, res) => {
  try {
    const repair = await repairModel.findOneAndUpdate({ _id: data.id }, {
      status: data.status
    }, { new: true });
    if (!repair) {
      return res.status(500).json({
        success: false,
        message: "ไม่พบการซ่อม",
        repair: null
      });
    }
    return res.status(200).json({
      success: true,
      message: "Repair detail",
      repair
    });
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  CalculateContact, CreateContactForm, UpdateRenterDetails,
  CreateInvoice, WaterCalculate, ElectricalCalculate,
  GetRenterDetail, ContactPayment, DeleteContactPayment,
  CreateRenterDeatails, GetVehicle, GetFloorFilter,
  GetFloorById, GetWaterUnits, GetElectricUnits,
  CreateMeterUnit, GetElectricalMeterUnit, CreateInvoiced,
  CreateElectricalMeterUnit, UpdateInvoicedList, GetRoomByMeterUnit,
  UpdateMeterUnit, UpdateElectricUnit, GetInvoicedList,
  GetInvoicedByID, DeleteInvoicedList, DeleteInvoiced,
  GetDormitoryByID, UpdateDormitory, DeleteDormitory,
  UpdateBank, DeleteBank, UpdateListData,
  GetUserByDormitoryID, PaymentByAdmin, GetPaymentByAdmin,
  BankTransferPayment, CancelPayment, BookingByAdmin,
  GetBookingByRoomID, CancelBookingByAdmin, GetContactByRoomID,
  CancelContactByID, UpdateBookingByAdmin, GetRenterByDormitoryID,
  DisconnectUser, CreateInvoicedAll, RepairByAdmin,
  GetRepair, UpdateRepairByAdmin
};
