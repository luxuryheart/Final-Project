const CatchAsyncError = require("../../middleware/catchAsyncErrors");
const { contactModel } = require("../../models/backoffice/contact.model");
const ErrorHandler = require("../../utils/ErrorHandler");
const moment = require("moment");
const backofficeService = require("../../service/backoffice/backoffice.service");
const { roomsModel, dormitoryModel } = require("../../models/dormitory/dormitory.model");
const { renterDetailModel } = require("../../models/backoffice/renter.model");
const { waterUnitModel, electricalUnitModel } = require("../../models/backoffice/unit.model");

// ทำสัญญาด้วย admin
const CreateContact = CatchAsyncError(async (req, res, next) => {
  try {
    const data = ({ userId, userDetail, personalId, durationInMonth, startDate, flag, deposit,
      minusDeposit, waterMeter, electricalMeter, note, dormitoryId, floorId, roomId
    } = req.body);

    const formattedPersonalId = await formatPersonalId(data.personalId);

    const parsedStartDate = moment(startDate, "YYYY-MM-DD");

    if (data.flag !== undefined && data.flag === "0") {
      var date = await backofficeService.CalculateContact(
        parsedStartDate,
        data.durationInMonth,
        res
      );
    }

    data.personalId = formattedPersonalId;

    const contact = await backofficeService.CreateContactForm(data, date, res);

  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

const formatPersonalId = (personalId) => {
  const formatted = personalId
    .toString()
    .replace(/(\d{1})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
  return formatted;
};

// renter details
const UpdateRenterDetails = CatchAsyncError(async (req, res, next) => {
	try {
		const data = { email, facebook, lineId, educationOrOffice, department, position, studentOrEmployeeId, 
			urgentTel, relationships, tel, vehicle, note, roomId
		} = req.body;

    const userId = req.user._id
    console.log(userId);

		await backofficeService.UpdateRenterDetails(data, userId, res)

	} catch (error) {
		return next(new ErrorHandler(error, 500));
	}
});

// water unit and electrical unit
const MeterCalculate = CatchAsyncError(async (req, res, next) => {
    try {
        const data = { dormitoryId, floorId, meterUnit, flag } = req.body;

        // อัพเดตค่าน้ำตามหน่วย Unit
        if (data.flag === "0") {
            await backofficeService.WaterCalculate(data, res);
        }

        // อัพเดตค่าไฟตามหน่วย Unit
        if (data.flag === "1") {
          await backofficeService.ElectricalCalculate(data, res);
        }

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

// TODO: สร้าง invoice เองจากหน้า backoffice admin กดสร้าง invoice ตามห้องแต่ละเดือนเองเลย
const CreateInvoice = CatchAsyncError(async(req, res, next) => {
    try {
		const { roomId, dormitoryId } = req.body;

		const dormitory = await dormitoryModel.findOne({ _id: dormitoryId });
		const room = await roomsModel.findOne({ _id: roomId });
		// TDOD: ใช้จริงตอนปรับ model room กับ user แล้ว
		// const user = await userModel.findOne({ room: roomId });
		const renterDetail = await renterDetailModel.findOne({ userId: "6566206ff1f9248f3aef9013" });
		const waterUnit = await waterUnitModel.findOne({ roomId: roomId });
		const electricalUnit = await electricalUnitModel.findOne({ roomId: roomId });

		const data = {
			dormitory,
			room,
			renterDetail,
			waterUnit,
			electricalUnit
		}

		await backofficeService.CreateInvoice(data, res);

	} catch (error) {	
		return next(new ErrorHandler(error, 500));
	}
})

const GetRenterDetail = CatchAsyncError(async(req, res, next) => {
    try {
        const { id } = req.params;

       await backofficeService.GetRenterDetail(id, res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
})

// TODO: สร้าง contact details กับ bill details
const ContactPayment = CatchAsyncError(async (req, res, next) => {
  try {
    const { contactBill, contactData, dormitoryId } = req.body

	const userId = req.user._id
	
	// สร้าง contact bill 
	const contactPayment = await backofficeService.ContactPayment(contactBill, userId, dormitoryId, res);
	
	// สร้างสัญญาเช่า (contact)
	const formattedPersonalId = await formatPersonalId(contactData.personalId);
	const parsedStartDate = moment(contactData.startDate, "YYYY-MM-DD");

    if (contactData.flag !== undefined && contactData.flag === "0") {
      var date = await backofficeService.CalculateContact(
        parsedStartDate,
        contactData.durationInMonth,
        res
      );
    }

    contactData.personalId = formattedPersonalId;
	if (contactPayment.paid === true) {
		const contact = await backofficeService.CreateContactForm(contactData, userId, date, res);
    if (contact) {
      await backofficeService.CreateRenterDeatails(userId, contactData, res)
    }
	} else {
		await backofficeService.DeleteContactPayment(contactPayment._id, res)
	}

  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
});

const GetVehicle = CatchAsyncError(async (req, res, next) => {
  try {
    await backofficeService.GetVehicle(res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

// ดึงข้อมูลห้องด้วยการ filter ชั้น
const GetFLoorFilter = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetFloorFilter(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetFloorById = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetFloorById(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

module.exports = { CreateContact, UpdateRenterDetails, MeterCalculate, CreateInvoice, GetRenterDetail, ContactPayment, GetVehicle, GetFLoorFilter, GetFloorById }
