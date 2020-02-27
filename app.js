const methodOverride = require("method-override"),
	  bodyParser     = require("body-parser"),
	  Place 		 = require("./models/place"),
	  mongoose       = require("mongoose"),
	  express    	 = require("express"),
	  app        	 = express();
	  
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/foodspots",{useNewUrlParser: true, useCreateIndex: true});

app.get("/", (req, res)=>{
	res.render("home");
});

app.get("/places", (req, res)=>{
	Place.find({}, (err, places)=>{
		if(err)
			console.log(err);
		else
			res.render("index", {places: places});
	});
});

app.get("/places/new", (req, res)=>{
	res.render("new");
});

app.post("/places", (req, res)=>{
	const name = req.body.name,
		  image = req.body.image,
		  desc  = req.body.description;
	
	const newPlace = {name: name, image: image, description: desc}
	Place.create(newPlace, (err, place)=>{
		if(err){
			console.log(err);
			res.redirect("/places/new");
		}
		else
			res.redirect("/places");
	});
});

app.get("/places/:id", (req, res)=>{
	Place.findById(req.params.id, (err, place)=>{
		if(err)
			console.log(err);
		else
			res.render("show", {place: place});
	});
});

app.get("/places/:id/edit", (req, res)=>{
	Place.findById(req.params.id, (err, place)=>{
		if(err){
			console.log(err);
			res.redirect("/places");
		}
		else
			res.render("edit", {place: place});
	});
});

app.put("/places/:id", (req, res)=>{
	Place.findByIdAndUpdate(req.params.id, req.body.place, (err, place)=>{
		if(err)
			res.redirect("/places");
		else
			res.redirect("/places/" + req.params.id);
	});
});

app.delete("/places/:id", (req, res)=>{
	Place.findByIdAndRemove(req.params.id, (err)=>{
		if(err)
			res.redirect("/places");
		else	
			res.redirect("/places");
	});
});

app.get("*", (req, res)=>{
	app.send("Error - Page Not Found")
});

app.listen(process.env.PORT || 3000, ()=>{
	console.log("Server has started");
});