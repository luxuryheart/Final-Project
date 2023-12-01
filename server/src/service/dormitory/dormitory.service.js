const {
  dormitoryModel,
  floorsModel,
  roomsModel,
} = require("../../models/dormitory/dormitory.model");
const ErrorHandler = require("../../utils/ErrorHandler");

const DormitoryCreate = async (data, user, res) => {
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
const Addfloor = async (id, amount, res) => {
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
const Addrooms = async (id, res) => {
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

// get all the rooms and floor

// flag 0 - increase floor 1
const InCreaseFloors = async (dormitoryId, res) => {
  try {
    const dormitory = await dormitoryModel.findById({ _id: dormitoryId });

    if (!dormitory) {
      return next(new ErrorHandler("Dormitory not found", 400));
    }

    if (dormitory.floors.length > 0) {
      const floorId = dormitory.floors[dormitory.floors.length - 1];
      const floorName = await floorsModel.findById({ _id: floorId });

      if (!floorName) {
        return next(new ErrorHandler(error, 400));
      }

      const floors = await floorsModel.find();

      // สร้าง array ของ floorId จาก floors
      const floorIdArray = floors.map((floor) => floor._id);

      const floorIncrease = await floorsModel.create({
        name: parseInt(floorName.name) + 1,
      });
      floorIdArray.push(floorIncrease._id);

      // เพิ่มห้องเข้าชั้นที ละ 1 ห้อง
      const rooms = await addRoom(floorIncrease);

      //อัพเดตจำนวนชั้นของหอ
      const dormitoryUpdate = await updatedDormitory(dormitory, floorIdArray)

      if (!dormitoryUpdate) {
        return next(new ErrorHandler("Dormitory update failed", 400));
      }

      res.status(201).json({
        success: true,
        message: "Dormitory update and Floor increase successfully",
        dormitoryUpdate,
        rooms,
      })

    }
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

const addRoom = async (floorIncrease) => {
  let roomIds = [];
  let room;
  let floor = await floorsModel.findById({ _id: floorIncrease._id });
  if (parseInt(floor.name) < 10) {
    for (let j = 0; j < 1; j++) {
      room = floor.name + "0" + (j + 1);
      const createdRoom = await roomsModel.create({ name: room });
      roomIds.push(createdRoom._id);
    }
  } else if (parseInt(floor.name) >= 10) {
    for (let j = 0; j < 1; j++) {
      room = floor.name + "0" + (j + 1);
      const createdRoom = await roomsModel.create({ name: room });
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

  const updatedDormitory =   await dormitoryModel.findByIdAndUpdate(
    { _id: dormitoryId._id },
    { $push: { floors: { $each: floorIds } } },
    { new: true }
  );

  return updatedDormitory;
}

// flag 1 - increase rooms on floor
const IncreaseRoom = async (floorId, res) => {
  try {
    const floor = await floorsModel.findById({ _id: floorId });

    if (floor.rooms.length > 0) {
      const floorLastId = floor.rooms[floor.rooms.length - 1]
      const roomName = await roomsModel.findById({ _id: floorLastId });
      if (parseInt(roomName.name % 10) <= 10) {
        const room = await roomsModel.create({
          name: (parseInt(roomName.name) + 1),
        })
        
        // สร้าง array ของ roomId จาก room
        let roomIdArray = floor.rooms
        roomIdArray.push(room._id)
  
        const floors = await updateFloor(floorId, roomIdArray)

        res.status(201).json({
          success: true,
          message: "Floors updated and increase room successfully",
          floors
        })
      } else {
        const room = await roomsModel.create({
          name: parseInt(roomName.name) + "0" + (parseInt(roomName.name) + 1),
        })
        
        // สร้าง array ของ roomId จาก room
        let roomIdArray = floor.rooms
        roomIdArray.push(room._id)
  
        const floors = await updateFloor(floorId, roomIdArray)

        res.status(201).json({
          success: true,
          message: "Floors updated and increase room successfully",
          floors
        })
      }

    } else {
        let roomId = []
        const floorName = floor.name
        const room = await roomsModel.create({
          name: floorName + "0" + 1
        })
        roomId.push(room._id)
        const floors = await updateFloor(floorId, roomId)

        res.status(201).json({
          success: true,
          message: "Floors updated and increase room successfully",
          floors
        })
    }
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
}

const updateFloor = async (floorId, roomIdArray) => {
  await floorsModel.findByIdAndUpdate({ _id: floorId }, {
    rooms: []
  }, { new: true })

  const floorUpdate = await floorsModel.findByIdAndUpdate(
    { _id: floorId },
    { $push: { rooms: { $each: roomIdArray } } },
    { new: true }
  )
  return floorUpdate;

}

// flag 2 - delete rooms on floor
const DeleteRoom = async (floorId, roomId, res) => {
  try {
    // ลบ room จาก floor
    const floor = await floorsModel.findByIdAndUpdate(
      floorId,
      { $pull: { rooms: roomId } },
      { new: true }
    );

    // ลบ room โดยตรง
    const room = await roomsModel.findByIdAndDelete(roomId);

    // เช็คว่ามี floor และ room หรือไม่
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
}

// flag 3 - delete floor
const DeleteFloor = async (dormitoryId, floorId, res) => {
  try {
    // หา floor และ rooms
    const floor = await floorsModel.findById(floorId);

    // ลบทุกรายการ rooms
    for (const roomId of floor.rooms) {
      await roomsModel.findByIdAndDelete(roomId);
    }

    // ลบ floor
    await floorsModel.findByIdAndDelete(floorId);

    // ลบ floorId จาก dormitory
    await dormitoryModel.findByIdAndUpdate(
      dormitoryId,
      { $pull: { floors: floorId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Floor deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

module.exports = { DormitoryCreate, Addfloor, Addrooms, InCreaseFloors, IncreaseRoom, DeleteRoom, DeleteFloor };
