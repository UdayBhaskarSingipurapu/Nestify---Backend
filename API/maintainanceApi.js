const express = require('express');

const router = express.Router({mergeParams : true});
// const {isUser, isOwner} = require('../middlewares/authentication/auth');
const User = require('../models/userdb');
const {getAll, createNewRequest, editMaintainceReq, deleteMaintainceReq} = require('../controllers/maintainceRequestController/MaintainceReq');
const wrapAsync = require('../utils/wrapAsync');
const { validateMaintanceReq } = require('../middlewares/validateMaintainance');

router.get('/all/:hosteId', getAll)

router.post('/:id/:hostelId/new', validateMaintanceReq, wrapAsync(createNewRequest));

router.put('/:id/edit', wrapAsync(editMaintainceReq))

router.delete('/:id/delete', wrapAsync(deleteMaintainceReq));


module.exports = router;
