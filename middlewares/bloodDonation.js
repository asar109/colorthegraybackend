exports.checkBloodDonationDue = (req, res, next) => {
  const lastDonationDate = new Date(req.user.lastDonationDate);
  const currentDate = new Date();
  const differenceInMonths =
    (currentDate.getFullYear() - lastDonationDate.getFullYear()) * 12 +
    (currentDate.getMonth() - lastDonationDate.getMonth());
  if (differenceInMonths >= 3) {
    req.user.elegibilty = true;
  } else {
    req.user.elegibilty = false;
  }
  next();
};
