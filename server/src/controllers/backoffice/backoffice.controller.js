const CatchAsyncError = require("../../middleware/catchAsyncErrors");
const { contactModel } = require("../../models/backoffice/contact.model");
const ErrorHandler = require("../../utils/ErrorHandler");
const moment = require("moment");
const backofficeService = require("../../service/backoffice/backoffice.service");
const { roomsModel, dormitoryModel } = require("../../models/dormitory/dormitory.model");
const { renterDetailModel } = require("../../models/backoffice/renter.model");

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

const CreateInvoice = CatchAsyncError(async(req, res, next) => {
    try {
		const { roomId, dormitoryId } = req.body;
		const dormitory = await dormitoryModel.findOne({ _id: dormitoryId });
		const room = await roomsModel.findOne({ _id: roomId });
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

const ContactPayment = CatchAsyncError(async (req, res, next) => {
  try {
    const { contactBill, contactData, dormitoryId } = req.body

	const userId = contactData.userId
	
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
      await backofficeService.CreateRenterDeatails(userId, dormitoryId, contactData, res)
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

const GetWaterUnits = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetWaterUnits(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetElectricUnits = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetElectricUnits(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const CreateMeterUnit = CatchAsyncError(async (req, res, next) => {
  try {
    const { date, dormitoryId } = req.body;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return
  }
  const [year, month, day] = date.split("-");

  const dateData = {
    day: day,
    month: month,
    year: year,
    date: date,
  }
  console.log(day, month, year);
    await backofficeService.CreateMeterUnit(dateData, dormitoryId, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const CreateElectricUnitPerMonth = CatchAsyncError(async (req, res, next) => {
  try {
    const { date, dormitoryId } = req.body;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return
    }
    const [year, month, day] = date.split("-");
    
    const dateData = {
      day: day,
      month: month,
      year: year,
      date: date,
    }
    await backofficeService.CreateElectricalMeterUnit(dateData, dormitoryId, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

//create invoice
const CreateInvoiced = CatchAsyncError(async (req, res, next) => {
  try {
    const { date, roomId, dormitoryId } = req.body;
    
    const [year, month, day] = date.split("-");
    
    const dateData = {
      day: day,
      month: month,
      year: year,
      date: date,
    }
    await backofficeService.CreateInvoiced(dormitoryId, roomId, dateData, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateInvoicedList = CatchAsyncError(async (req, res, next) => {
  try {
    const { invoiceId, roomId, dormitoryId, list } = req.body;
    await backofficeService.UpdateInvoicedList(invoiceId, roomId, list, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetRoomByMeterUnit = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, dormitoryId } = req.query
    
    const [year, month] = date.split("-");
    
    const dateData = {
      year: year,
      month: month,
      date: date,
    }
    await backofficeService.GetRoomByMeterUnit(id, dateData, dormitoryId, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateMeterUnit = CatchAsyncError(async (req, res, next) => {
  try { 
    const data = req.body;
    await backofficeService.UpdateMeterUnit(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetElectricalMeterUnit = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, dormitoryId } = req.query
    
    const [year, month] = date.split("-");
    
    const dateData = {
      year: year,
      month: month,
      date: date,
    }
    await backofficeService.GetElectricalMeterUnit(id, dateData, dormitoryId, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateElectricUnitPerMonth = CatchAsyncError(async (req, res, next) => {
  try { 
    const data = req.body;
    await backofficeService.UpdateElectricUnit(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetInvoicedList = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query
    const [year, month] = date.split("-");
    const newDate = {
      year: year,
      month: month,
      date: date,
    }
    await backofficeService.GetInvoicedList(id, newDate, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetInvoicedByID = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetInvoicedByID(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const DeleteInvoicedList = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { index, listid } = req.query
    await backofficeService.DeleteInvoicedList(index, listid, id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateList = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    await backofficeService.UpdateList(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const DeleteInvoiced = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.DeleteInvoiced(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetDormitoryByID = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetDormitoryByID(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateDormitory = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    await backofficeService.UpdateDormitory(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const DeleteDormitory = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.DeleteDormitory(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateBank = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    await backofficeService.UpdateBank(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const DeleteBank = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dormitoryid } = req.query
    await backofficeService.DeleteBank(id, dormitoryid, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateListData = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    await backofficeService.UpdateListData(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetUserByDormitoryID = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetUserByDormitoryID(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const PaymentByAdmin = CatchAsyncError(async (req, res, next) => {
  try {
    const { data } = req.body;
    await backofficeService.PaymentByAdmin(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetPaymentByAdmin = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetPaymentByAdmin(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const BankTransferPayment = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    if (data.flag === "1") {
      await backofficeService.BankTransferPayment(data, res);
    } else if (data.flag === "2") {
      await backofficeService.CancelPayment(data, res);
    }
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const BookingByAdmin = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    await backofficeService.BookingByAdmin(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetBookingByRoomID = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetBookingByRoomID(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const CancelBookingByAdmin = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomId } = req.query;
    await backofficeService.CancelBookingByAdmin(id, roomId, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetContactByRoomID = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetContactByRoomID(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const CancelContactByID = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomId } = req.query
    await backofficeService.CancelContactByID(id, roomId, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateBookingByAdmin = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    await backofficeService.UpdateBookingByAdmin(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetRenterByDormitoryID = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    await backofficeService.GetRenterByDormitoryID(id, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const DisconnectUser = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    await backofficeService.DisconnectUser(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const CreateInvoicedAll = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    const [year, month, day] = data.date.split("-");
    
    const dateData = {
      day: day,
      month: month,
      year: year,
      date: data.date,
    }
    await backofficeService.CreateInvoicedAll(data, dateData, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const RepairByAdmin  = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    await backofficeService.RepairByAdmin(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetRepair = CatchAsyncError(async (req, res, next) => {
  try {
    const { status } = req.query;
    await backofficeService.GetRepair(status, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const UpdateRepairByAdmin = CatchAsyncError(async (req, res, next) => {
  try {
    const data = req.body;
    await backofficeService.UpdateRepairByAdmin(data, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

const GetInvoiceFilter = CatchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, date } = req.query;
    const [ year, month ] = date.split("-");
    const newDate = {
      year: year,
      month: month,
      date: date
    }
    await backofficeService.GetInvoiceFilter(id, status, newDate, res);
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
})

module.exports = { 
  CreateContact, UpdateRenterDetails, MeterCalculate,
  CreateInvoice, GetRenterDetail, ContactPayment,
  GetVehicle, GetFLoorFilter, GetFloorById,
  GetWaterUnits, GetElectricUnits, CreateMeterUnit,
  GetElectricalMeterUnit, CreateInvoiced, CreateElectricUnitPerMonth,
  UpdateInvoicedList, GetRoomByMeterUnit, UpdateMeterUnit,
  UpdateElectricUnitPerMonth, GetInvoicedList, GetInvoicedByID,
  DeleteInvoicedList, UpdateList, DeleteInvoiced,
  GetDormitoryByID, UpdateDormitory, DeleteDormitory,
  UpdateBank, DeleteBank, UpdateListData, GetUserByDormitoryID,
  PaymentByAdmin, GetPaymentByAdmin, BankTransferPayment,
  BookingByAdmin, GetBookingByRoomID, CancelBookingByAdmin,
  GetContactByRoomID, CancelContactByID, UpdateBookingByAdmin,
  GetRenterByDormitoryID, DisconnectUser, CreateInvoicedAll,
  RepairByAdmin, GetRepair, UpdateRepairByAdmin,
  GetInvoiceFilter,
};
