const {
  dormitoryModel,
  floorsModel,
  roomsModel,
} = require("../../models/dormitory/dormitory.model");
const ErrorHandler = require("../../utils/ErrorHandler");

const dormitoryCreate = async (data, user, res) => {
  try {
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const dormitory = await dormitoryModel.create({
      name: data.name,
      address: data.address,
      contact: data.contact,
      userID: user.id,
    });

    return dormitory;
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// add floor
const addfloor = async (id, amount, res) => {
  try {
    // ลูปสร้างชั้นตามจำนวนที่ input
    let floorIds = [];
    for (let i = 0; i < amount; i++) {
      const floor = await floorsModel.create({
        name: i + 1,
      });
      floorIds.push(floor._id);
    }

    // เพ่ิมชั้นไปที่หอ
    await dormitoryModel.findByIdAndUpdate(
      { _id: id },
      { $push: { floors: { $each: floorIds } } },
      { new: true }
    );

    const updatedDormitory = await dormitoryModel
      .findById(id)
      .populate("floors");

    return floorIds;
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// add default rooms in floor
const addrooms = async (id, res) => {
  try {
    // สร้างห้อง
    let roomIds = [];
    let room;
    for (let i = 0; i < id.length; i++) {
      let floor = await floorsModel.findById({ _id: id[i] });
      if (parseInt(floor.name) < 10) {
        for (let j = 0; j < 5; j++) {
          room = floor.name + "0" + (j + 1);
          const createdRoom = await roomsModel.create({ name: room });
          roomIds.push(createdRoom._id);
        }
      } else if (parseInt(floor.name) >= 10) {
        for (let j = 0; j < 5; j++) {
          room = floor.name + "0" + (j + 1);
          const createdRoom = await roomsModel.create({ name: room });
          roomIds.push(createdRoom._id);
        }
      }
      const updatedFloor = await floorsModel.findByIdAndUpdate(
        { _id: id[i] },
        { $push: { rooms: { $each: roomIds } } },
        { new: true }
      );
      roomIds = [];
    }

    const dormitory = await getDormitory();

    res.status(200).json({
      success: true,
      message: "Dormitory created successfully",
      dormitory,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// get all dormitory and floor and room
const getDormitory = async () => {
  try {
    // ดึงข้อมูลทั้งหมดของ dormitory พร้อม populate floors และ userID
    const dormitories = await dormitoryModel
      .find()
      .populate({
        path: "floors",
        populate: {
          path: "rooms",
          model: "Room",
        },
      })
      .populate("userID", "-password");

    // เตรียมข้อมูลที่จะส่งกลับ
    const data = dormitories.map((dormitory) => {
      const floors = dormitory.floors.map((floor) => {
        // ดึงข้อมูลของห้อง (rooms) ของแต่ละชั้น (floor)
        const rooms = floor.rooms.map((room) => {
          return {
            // ข้อมูลของห้อง
            _id: room._id,
            name: room.name,
            roomCharge: room.roomCharge,
            enabled: room.enabled,
            waterID: room.waterID,
            electricID: room.electricID,
            status: room.status,
            // อื่น ๆ ที่ต้องการนำเข้าไป
          };
        });

        return {
          // ข้อมูลของชั้น
          _id: floor._id,
          name: floor.name,
          // เพิ่มข้อมูลของห้อง (rooms)
          rooms: rooms,
          // อื่น ๆ ที่ต้องการนำเข้าไป
        };
      });

      return {
        // ข้อมูลของ dormitory
        _id: dormitory._id,
        name: dormitory.name,
        // ข้อมูลที่เพิ่มเติมของ floors และ userID
        floors: floors,
        userID: dormitory.userID,
        // อื่น ๆ ที่ต้องการนำเข้าไป
      };
    });

    return data;
  } catch (error) {
    // หากเกิดข้อผิดพลาดในการดึงข้อมูล
    return next(new ErrorHandler(error, 500));
  }
};

module.exports = { dormitoryCreate, addfloor, addrooms };
