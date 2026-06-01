const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware.js");
const { validateReview , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");

//review routes

//create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete route for deleting a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;