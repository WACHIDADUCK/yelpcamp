const express = require("express");
const router = express.Router();


router.route("/", (req,res)=>{
    res.render ("/maps/maps")
})

module.exports = router;