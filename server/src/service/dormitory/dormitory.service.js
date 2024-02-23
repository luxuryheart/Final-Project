const { populate } = require("dotenv");
const {
  dormitoryModel,
  floorsModel,
  roomsModel,
  waterModel,
  electricalModel,
  bankModel,
  statusModel,
} = require("../../models/dormitory/dormitory.model");
const ErrorHandler = require("../../utils/ErrorHandler");
const { bookingModel } = require("../../controllers/dormitory/booking.model");
const { repairModel } = require("../../models/backoffice/repair.model");

const DormitoryCreate = async (data, user, res) => {
  try {
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }
    const dormitory = await dormitoryModel.create({
      name: data.name,
      address: data.address,
      contact: data.contact,
      promptpay: data.promptpay,
      userID: user._id,
    });

    return dormitory;
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

const CreateFloorsAndRooms = async (id, rooms, res, next) => {
  try {
    const status = await statusModel.findOne({ name: "ว่าง" });

    for (let i = 0; i < rooms.length; i++) {
      const floor = await floorsModel.create({
        name: rooms[i].floor,
      });
      const roomIds = [];

      for (let j = 0; j < rooms[i].room; j++) {
        let roomNumber = j + 1 < 10 ? "0" + (j + 1) : "" + (j + 1);
        const roomName = floor.name + roomNumber;

        const createdRoom = await roomsModel.create({
          name: roomName,
          status: status._id,
        });
        roomIds.push(createdRoom._id);
      }

      const updatedFloor = await floorsModel.findByIdAndUpdate(
        { _id: floor._id },
        { $push: { rooms: { $each: roomIds } } },
        { new: true }
      );

      await dormitoryModel.findByIdAndUpdate(
        { _id: id },
        { $push: { floors: floor._id } },
        { new: true }
      );
    }

    const dormitory = await dormitoryModel.findOne({ _id: id });

    return res.status(201).json({
      success: true,
      message: "Floors created successfully",
      dormitory,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// flag 0 - increase floor 1
const InCreaseFloors = async (dormitoryId, res) => {
  try {
    const dormitory = await dormitoryModel.findOne({ _id: dormitoryId });
    if (!dormitory) {
      return next(new ErrorHandler("Dormitory not found", 400));
    }

    if (dormitory.floors.length > 0) {
      const floorId = dormitory.floors[dormitory.floors.length - 1];
      const floorName = await floorsModel.findOne({ _id: floorId });

      if (!floorName) {
        return next(new ErrorHandler(error, 400));
      }

      const floorIdArray = dormitory.floors.map((floor) => floor._id);

      const floorIncrease = await floorsModel.create({
        name: parseInt(floorName.name) + 1,
      });
      floorIdArray.push(floorIncrease._id);

      const rooms = await addRoom(floorIncrease);

      const dormitoryUpdate = await updatedDormitory(dormitory, floorIdArray);

      if (!dormitoryUpdate) {
        return next(new ErrorHandler("Dormitory update failed", 400));
      }

      res.status(201).json({
        success: true,
        message: "Dormitory update and Floor increase successfully",
        dormitoryUpdate,
        rooms,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

const addRoom = async (floorIncrease) => {
  let roomIds = [];
  let room;
  let floor = await floorsModel.findById({ _id: floorIncrease._id });
  const status = await statusModel.findOne({ name: "ว่าง" });
  if (parseInt(floor.name) < 10) {
    for (let j = 0; j < 1; j++) {
      room = floor.name + "0" + (j + 1);
      const createdRoom = await roomsModel.create({
        name: room,
        status: status._id,
      });
      roomIds.push(createdRoom._id);
    }
  } else if (parseInt(floor.name) >= 10) {
    for (let j = 0; j < 1; j++) {
      room = floor.name + "0" + (j + 1);
      const createdRoom = await roomsModel.create({
        name: room,
        status: status._id,
      });
      roomIds.push(createdRoom._id);
    }
  }
  const updatedFloor = await floorsModel.findByIdAndUpdate(
    { _id: floorIncrease._id },
    { $push: { rooms: { $each: roomIds } } },
    { new: true }
  );

  return updatedFloor;
};

const updatedDormitory = async (dormitoryId, floorIds) => {
  await dormitoryModel.findByIdAndUpdate(
    { _id: dormitoryId._id },
    { floors: [] },
    { new: true }
  );

  const updatedDormitory = await dormitoryModel.findByIdAndUpdate(
    { _id: dormitoryId._id },
    { $push: { floors: { $each: floorIds } } },
    { new: true }
  );

  return updatedDormitory;
};

// flag 1 - increase rooms on floor
const IncreaseRoom = async (floorId, res) => {
  try {
    const floor = await floorsModel.findById({ _id: floorId });
    const status = await statusModel.findOne({ name: "ว่าง" });

    if (floor.rooms.length > 0) {
      const floorLastId = floor.rooms[floor.rooms.length - 1];
      const roomName = await roomsModel.findById({ _id: floorLastId });
      if (parseInt(roomName.name % 10) <= 10) {
        const room = await roomsModel.create({
          name: parseInt(roomName.name) + 1,
          status: status._id,
        });

        let roomIdArray = floor.rooms;
        roomIdArray.push(room._id);

        const floors = await updateFloor(floorId, roomIdArray);

        res.status(201).json({
          success: true,
          message: "Floors updated and increase room successfully",
          floors,
        });
      } else {
        const room = await roomsModel.create({
          name: parseInt(roomName.name) + "0" + (parseInt(roomName.name) + 1),
          status: status._id,
        });

        let roomIdArray = floor.rooms;
        roomIdArray.push(room._id);

        const floors = await updateFloor(floorId, roomIdArray);

        res.status(201).json({
          success: true,
          message: "Floors updated and increase room successfully",
          floors,
        });
      }
    } else {
      let roomId = [];
      const floorName = floor.name;
      const room = await roomsModel.create({
        name: floorName + "0" + 1,
        status: status._id,
      });
      roomId.push(room._id);
      const floors = await updateFloor(floorId, roomId);

      res.status(201).json({
        success: true,
        message: "Floors updated and increase room successfully",
        floors,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating",
    });
  }
};

const updateFloor = async (floorId, roomIdArray) => {
  await floorsModel.findByIdAndUpdate(
    { _id: floorId },
    {
      rooms: [],
    },
    { new: true }
  );

  const floorUpdate = await floorsModel.findByIdAndUpdate(
    { _id: floorId },
    { $push: { rooms: { $each: roomIdArray } } },
    { new: true }
  );
  return floorUpdate;
};

// flag 2 - delete rooms on floor
const DeleteRoom = async (floorId, roomId, res) => {
  try {
    const floor = await floorsModel.findOneAndUpdate(
      { _id: floorId },
      { $pull: { rooms: roomId } },
      { new: true }
    );

    const room = await roomsModel.findOneAndDelete({ _id: roomId });

    if (!floor || !room) {
      return next(new ErrorHandler("Floor or Room not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// flag 3 - delete floor
const DeleteFloor = async (dormitoryId, floorId, res) => {
  try {
    const floor = await floorsModel.findOne({ _id: floorId });

    for (const roomId of floor.rooms) {
      await roomsModel.findOneAndDelete({ _id: roomId });
    }

    await floorsModel.findOneAndDelete({ _id: floorId });

    await dormitoryModel.updateOne(
      { _id: dormitoryId },
      { $pull: { floors: floorId } }
    );

    return res.status(200).json({
      success: true,
      message: "Floor deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, 
    });
  }
};

const UpdatePriceForRoom = async (floor, roomIds, price, res) => {
  try {
    for (const roomId of roomIds) {
      await roomsModel.findByIdAndUpdate(
        { _id: roomId },
        {
          roomCharge: price.roomCharge,
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Room charge updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// flag 0 - update water price
const UpdateWaterPrice = async (floorById, roomIds, waterId, res) => {
  try {
    for (const roomId of roomIds) {
      await roomsModel.findByIdAndUpdate(
        { _id: roomId },
        {
          waterID: waterId,
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Water price updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// flag 1 - update electrical price
const UpdateElectricalPrice = async (floorById, roomIds, electricalId, res) => {
  try {
    for (const roomId of roomIds) {
      await roomsModel.findByIdAndUpdate(
        { _id: roomId },
        {
          electricID: electricalId,
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Electrical price updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

const createWaterPrice = async (value, dormitory) => {
  const dormitoryId = await dormitoryModel.findById({ _id: dormitory._id });
  for (const name of value) {
    await waterModel.create({
      name: name,
      dormitoryId: dormitoryId,
    });
  }

  return null;
};

const createElectricalPrice = async (value, dormitory) => {
  const dormitoryId = await dormitoryModel.findById({ _id: dormitory._id });
  for (const name of value) {
    await electricalModel.create({
      name: name,
      dormitoryId: dormitoryId,
    });
  }

  return null;
};

const GetAllRooms = async (dormitory, res) => {
  try {
    const dormitoryDetail = await dormitoryModel
      .findOne({ _id: dormitory._id })
      .populate({
        path: "floors",
        populate: {
          path: "rooms",
          populate: [
            { path: "waterID" },
            { path: "electricID" },
            { path: "status" },
          ],
        },
      });

    if (!dormitoryDetail) {
      return res.status(404).json({
        success: false,
        message: "Dormitory not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get all rooms successfully",
      dormitoryDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const GroupMeters = async (dormitoryId, res) => {
  try {
    const [waterMeter, electricalMeter] = await Promise.all([
      getWaterMeter(dormitoryId),
      getElectricalMeter(dormitoryId),
    ]);

    const meters = {
      waterMeter,
      electricalMeter,
    };

    if (waterMeter.length > 0 && electricalMeter.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Get all meters successfully",
        meters,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Meters not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getWaterMeter = async (dormitoryId) => {
  const waterMeter = await waterModel
    .find({ dormitoryId: dormitoryId.id })
    .exec();
  return waterMeter;
};

const getElectricalMeter = (dormitoryId) => {
  const electricalMeter = electricalModel
    .find({ dormitoryId: dormitoryId.id })
    .exec();
  return electricalMeter;
};

const UpdateElectrical = async (id, price, res) => {
  try {
    await electricalModel.findOneAndUpdate(
      { _id: id },
      { price: price },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Update meter successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const UpdateWater = async (id, price, res) => {
  try {
    await waterModel.findOneAndUpdate(
      { _id: id },
      { price: price },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Update meter successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const CreateBankAccount = async (dormitoryId,name,accountNumber,bankName,img,res) => {
  try {
    const newBank = await bankModel.create({
      dormitoryId: dormitoryId,
      name: name,
      account: accountNumber,
      bank: bankName,
      img: img,
    });

    await dormitoryModel.findOneAndUpdate(
      { _id: dormitoryId },
      { $push: { banks: newBank._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Create bank account successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const DeleteBankAccount = async (dormitoryId, bankId, res) => {
  try {
    const bank = await bankModel.findOneAndDelete({ _id: bankId });
    await dormitoryModel.findOneAndUpdate(
      { _id: dormitoryId },
      { $pull: { banks: bank._id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Delete bank account successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const GetDormitoryByUser = async (id, res) => {
  try {
    const dormitory = await dormitoryModel
      .find({ userID: id })
      .populate({
        path: "floors",
        populate: {
          path: "rooms",
          populate: [
            { path: "waterID" },
            { path: "electricID" },
            { path: "status" },
          ],
        },
      })
      .populate({ path: "banks" });
    return res.status(200).json({
      success: true,
      message: "Get dormitory successfully",
      dormitory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const GetDormitoryByID = async (id, res) => {
  try {
    const dormitory = await dormitoryModel
      .findOne({ _id: id })
      .populate({
        path: "floors",
        populate: {
          path: "rooms",
          populate: [
            { path: "waterID" },
            { path: "electricID" },
            { path: "status" },
          ],
        },
      })
      .populate({ path: "banks" });
    return res.status(200).json({
      success: true,
      message: "Get dormitory successfully",
      dormitory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const Booking = async (userId, data, res) => {
  try {
    const booking = await bookingModel.create({
      roomId: data.roomId,
      userId: userId,
      bookingDate: data.bookingDate,
      bookingStartDate: data.bookingStartDate,
      bookingAmount: data.bookingAmount,
      name: data.name,
      tel: data.phone,
      note: data.note,
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    const status = await statusModel.findOne({ name: "จอง" });

    await roomsModel.findOneAndUpdate(
      { _id: data.roomId },
      {
        status: status._id,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Booking success",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetDormitory = async (res) => {
  try {
    const dormitory = await dormitoryModel
      .find()
      .populate({
        path: "floors",
        populate: {
          path: "rooms",
          populate: [
            { path: "waterID" },
            { path: "electricID" },
            { path: "status" },
          ],
        },
      })
      .populate({ path: "banks" });
    res.status(200).json({
      success: true,
      message: "Get dormitory successfully",
      dormitory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const Repair = async (data, res) => {
  try {
    const room = await roomsModel.findOne({ _id: data.roomId });
    const repair = await repairModel.create({
      date: data.date,
      roomName: room.name,
      meetDate: data.meetDate,
      description: data.description,
    });
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Repair success",
      repair,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  Repair,
  GetDormitory,
  DormitoryCreate,
  createWaterPrice,
  createElectricalPrice,
  InCreaseFloors,
  Booking,
  CreateFloorsAndRooms,
  IncreaseRoom,
  DeleteRoom,
  DeleteFloor,
  UpdatePriceForRoom,
  UpdateWaterPrice,
  UpdateElectricalPrice,
  GetAllRooms,
  GroupMeters,
  UpdateElectrical,
  UpdateWater,
  CreateBankAccount,
  DeleteBankAccount,
  GetDormitoryByUser,
  GetDormitoryByID,
};
