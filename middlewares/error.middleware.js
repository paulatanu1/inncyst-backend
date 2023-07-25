const {ErrorResponse} = require("../utils")

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    // console.log(err.stack.red);
    // console.log(err.name.red);
    console.log(err.stack.red);

    if(err.code === 11000){
        error = new ErrorResponse(`Duplicate entry found`, 400)
    }

    if(err.name === "CastError"){
        error = new ErrorResponse(`Not found with id ${err.value}`, 404)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal Server Error'
    })
}

module.exports = errorHandler;