module.exports = {
  isLoggedIn : (req,res,next) => {
    // console.log(req);
    return (req.user[0].dataValues._id) ?  next() : res.redirect('/login');
  }
}
