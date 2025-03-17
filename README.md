
```
Nestify---Server
├─ API
│  ├─ appReview.js
│  ├─ hostelAPI.js
│  ├─ hostelJoinApi.js
│  ├─ maintainanceApi.js
│  ├─ ownerApi.js
│  ├─ reviewApi.js
│  ├─ roomApi.js
│  └─ userApi.js
├─ auth
│  └─ googleAuth.js
├─ config
│  ├─ cloudConfig.js
│  └─ passport-setup.js
├─ controllers
│  ├─ appReviewController
│  │  └─ AppReview.js
│  ├─ hostelController
│  │  └─ Hostel.js
│  ├─ hostelReviewController
│  │  └─ HostelReview.js
│  ├─ maintainceRequestController
│  │  └─ MaintainceReq.js
│  ├─ ownerController
│  │  └─ Owner.js
│  ├─ roomController
│  │  └─ Room.js
│  └─ userController
│     └─ User.js
├─ middlewares
│  ├─ validateAppReview.js
│  ├─ validateHostel.js
│  ├─ validateMaintainance.js
│  ├─ validateOwner.js
│  ├─ validateReview.js
│  └─ validateUser.js
├─ models
│  ├─ admindb.js
│  ├─ applicationReviewdb.js
│  ├─ hosteldb.js
│  ├─ hostelJoindb.js
│  ├─ maintainacedb.js
│  ├─ reviewdb.js
│  ├─ roomdb.js
│  ├─ userdb.js
│  └─ visitordb.js
├─ package-lock.json
├─ package.json
├─ req.http
├─ server.js
├─ utils
│  ├─ ExpressError.js
│  └─ wrapAsync.js
└─ validateSchema
   ├─ admin
   │  └─ validateAdmin.js
   ├─ appReview
   │  └─ validateAppReview.js
   ├─ hostel
   │  └─ validateHostel.js
   ├─ hostelReview
   │  └─ validateHostelReview.js
   ├─ maintainace
   │  └─ validateMaintainceReq.js
   ├─ room
   │  └─ validateRoom.js
   └─ user
      └─ validateUser.js

```