const AccountImagesRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

AccountImagesRouter.get('/avatar/:id',(req,res,next)=>{
	database.get(`select * from AccountImages where account_id= ${req.params.id}`,(error,image)=>{
		if(error){
			next(error);
		}else if (image){
			res.status(200).json({image:image});
		}else{
			res.status(200).json({ image: {path: 'account', name:'default.png'} });
		}
	})
})
module.exports = AccountImagesRouter;