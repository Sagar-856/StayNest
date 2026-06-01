const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let allListings = await  Listing.find({ });
    res.render("listings/index.ejs",{ allListings });
};


module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: { path: "author" }}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");       
    }
    res.render("listings/show.ejs",{ listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = { url: url, filename: filename };
    newListing.owner = req.user._id; // 🔥 associate listing with logged-in user
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");       
    }
    res.render("listings/edit.ejs",{ listing });
};

module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {

        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url: url, filename: filename };
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req, res) => {
    let { id } =req.params;
    let listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
     req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};