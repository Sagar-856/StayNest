const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const mongoose = require("mongoose");

module.exports.createReview = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // Check if listing exists
    if (!listing) {
        throw new ExpressError("Listing not found", 410);
    }
    // Check if req.body.review exists
    if (!req.body || !req.body.review) {
        throw new ExpressError("Invalid review data", 400);
    } 
    let review = new Review(req.body.review);
    review.author = req.user._id; // Set the author of the review
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async(req, res) => {
    let { id, reviewId } = req.params;
    // Convert string IDs to MongoDB ObjectId
    const listingId = new mongoose.Types.ObjectId(id);
    const reviewObjectId = new mongoose.Types.ObjectId(reviewId);
    // Remove review ID from listing's reviews array
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewObjectId } });
    // Delete the review document itself
    await Review.findByIdAndDelete(reviewObjectId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};