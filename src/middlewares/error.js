
module.exports = function(err,req,res,next){
	if(err){
		console.log(`Error: ${req.method} request from ${req.ip} on route ${req.path}`);
		res
			.status(err.status || 500)
			.send({message: err.message || err})
	}
};
