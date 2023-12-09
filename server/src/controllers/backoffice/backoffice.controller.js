const CatchAsyncError = require("../../middleware/catchAsyncErrors");
const { contactModel } = require("../../models/backoffice/contact.model");
const ErrorHandler = require("../../utils/ErrorHandler");
const moment = require("moment");
const backofficeService = require("../../service/backoffice/backoffice.service");

// ทำสัญญาด้วย admin
const CreateContact = CatchAsyncError(async (req, res, next) => {
  try {
    const data = ({ userId, userDetail, personalId, durationInMonth, startDate, flag, deposit,
      minusDeposit, waterMeter, electricalMeter, note, dormitoryId, floorId, roomId
    } = req.body);

    const formattedPersonalId = await formatPersonalId(data.personalId);

    // Explicitly parse startDate with the specified format
    const parsedStartDate = moment(startDate, "YYYY-MM-DD");

    if (data.flag !== undefined && data.flag === "0") {
      // Call the CalculateContact function with the parsed startDate
      var date = await backofficeService.CalculateContact(
        parsedStartDate,
        data.durationInMonth,
        res
      );
    }

    data.personalId = formattedPersonalId;

    const contact = await backofficeService.CreateContactForm(data, date, res);

    await backofficeService.CreateInvoice(contact, res);

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
			urgentTel, relationships, tel, vehicle, note, userId
		} = req.body;

		await backofficeService.UpdateRenterDetails(data, res)

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

module.exports = { CreateContact, UpdateRenterDetails, MeterCalculate }
