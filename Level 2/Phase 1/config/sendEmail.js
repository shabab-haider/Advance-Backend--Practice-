const sendEmail = async (email) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 10000);
    console.log("Task Completed");
  });
};

export default sendEmail;
