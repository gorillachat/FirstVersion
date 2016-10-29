

module.exports = {
  isLoggedIn : (req,res,next) => {
      console.log(req.cookies, 'this is the cookies on the session controller');
     if (!req.cookies.user_id){
       console.log('this should redirect!');
       res.redirect('/login');
       res.end();
     } else next();
  }
}
