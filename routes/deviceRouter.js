const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');
const upload = require('../middleware/upload');

router.get('/', DeviceController.getAllDevices);
router.get('/:id', DeviceController.getDeviceById);

router.post('/',
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'model3D', maxCount: 1 }]),
    DeviceController.createDevice
);

router.put('/:id',
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'model3D', maxCount: 1 }]),
    DeviceController.updateDevice
);

router.delete('/:id', DeviceController.deleteDevice);

module.exports = router;