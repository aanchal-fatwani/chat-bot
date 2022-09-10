exports.getOverview = (req, res, next) => {
  const time = new Date();
  res.status(200).render('chat', {
    title: 'Home',
    currentTime: time.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log In'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up'
  });
};
