import express from "express";
import bcrypt from "bcrypt";
import { uuid } from "uuidv4";
import cors from "cors";
import db from "./config.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const saltRounds = 10;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
  })
);

db.connect()
  .then(() => {
    console.log("Connected to database");
    app.listen(port, () => {
      console.log(`Server is up and running at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.message);
  });

// Set up a storage engine for multer:
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, //(5MB in this example)
    fields: 100, // number of fields
    fieldNameSize: 100, // field name size limit
    fieldSize: 10 * 1024 * 1024, // field size in bytes
  },
});

//                          Routes:

// Registration:
app.post("/registration", async (req, res) => {
  const registrationId = uuid();
  const { name, email, password, person } = req.body;
  // Check if the user has already registered.
  if (person == "Candidate") {
    const data = await db.query(
      "SELECT * FROM CANDIDATE_REGISTRATION WHERE EMAIL = $1",
      [email]
    );
    if (data.rowCount > 0) {
      res.send({
        text: `A ${person} has already been registered using that email address.If that's you try logging in else kindly use another email address.`,
      });
    } else {
      try {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error(err);
          } else {
            await db
              .query(
                "INSERT INTO CANDIDATE_REGISTRATION(name,email,password,registration_id) VALUES ($1,$2,$3,$4)",
                [name, email, hash, registrationId]
              )
              .then(
                res.send({
                  text: "Registration Success",
                  regID: registrationId,
                })
              );
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  } else if (person == "Employer") {
    const data = await db.query(
      "SELECT * FROM EMPLOYER_REGISTRATION WHERE EMAIL = $1",
      [email]
    );
    if (data.rowCount > 0) {
      res.send({
        text: `An ${person} has already been registered using that email address.If that's you try logging in else kindly use another email address.`,
      });
    } else {
      try {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error(err);
          } else {
            await db
              .query(
                "INSERT INTO EMPLOYER_REGISTRATION(name,email,password,registration_id) VALUES ($1,$2,$3,$4)",
                [name, email, hash, registrationId]
              )
              .then(
                res.send({
                  text: "Registration Success",
                  regID: registrationId,
                })
              );
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
  // const data = await db.query("SELECT * FROM CANDIDATE_REGISTRATION WHERE EMAIL = $1", [
  //   email,
  // ]);
  // if (data.rowCount > 0) {
  //   res.send({
  //     text: "A user has already been registered using that email address.If that's you try logging in else kindly use another email address.",
  //   });
  // } else {
  //   try {
  //     bcrypt.hash(password, saltRounds, async (err, hash) => {
  //       if (err) {
  //         console.error(err);
  //       } else {
  //         await db
  //           .query(
  //             "INSERT INTO CANDIDATE_REGISTRATION(name,email,password,registration_id) VALUES ($1,$2,$3,$4)",
  //             [name, email, hash, registrationId]
  //           )
  //           .then(
  //             res.send({
  //               text: "Registration Success",
  //               regID: registrationId,
  //             })
  //           );
  //       }
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
});
// Login:
app.post("/login", async (req, res) => {
  console.log(req.body);
  const email = req.body["email"];
  const password = req.body["password"];
  const person = req.body["person"];
  try {
    if (person == "Candidate") {
      const data = await db.query(
        "SELECT * FROM CANDIDATE_REGISTRATION WHERE EMAIL = $1",
        [email]
      );
      if (data.rowCount == 1) {
        const hash = data.rows[0].password;
        const regID = data.rows[0].registration_id;
        bcrypt.compare(password, hash, (err, result) => {
          if (err) {
            console.error("Error comparing", err);
          } else {
            if (result) {
              const token = jwt.sign(
                {
                  Id: data.registration_id,
                  Email: data.email,
                },
                process.env.JWT_KEY,
                { expiresIn: "1h" }
              );
              res.send({
                text: "User Validated",
                Token: token,
                registrationId: regID,
              });
            } else {
              res.send({
                text: "Invalid Credentials",
              });
            }
          }
        });
      } else {
        res.send({
          text: "There is no user with the above email id.Please re-check your email id or register below",
        });
      }
    } else if (person == "Employer") {
      console.log("Hello Employer");
      const data = await db.query(
        "SELECT * FROM EMPLOYER_REGISTRATION WHERE EMAIL = $1",
        [email]
      );
      if (data.rowCount == 1) {
        console.log(data.rows);

        const hash = data.rows[0].password;
        const regID = data.rows[0].registration_id;

        bcrypt.compare(password, hash, (err, result) => {
          if (err) {
            console.error("Error comparing", err);
          } else {
            if (result) {
              const token = jwt.sign(
                {
                  Id: data.id,
                  Email: data.email,
                },
                process.env.JWT_KEY,
                { expiresIn: "1h" }
              );
              res.send({
                text: "User Validated",
                Token: token,
                registrationId: regID,
              });
            } else {
              res.send({
                text: "Invalid Credentials",
              });
            }
          }
        });
      } else {
        res.send({
          text: "There is no user with the above email id.Please re-check your email id or register below",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
// Forgot Password:
app.post("/forgotPassword", async (req, res) => {
  const otpGenerator = () => {
    let otp = Math.floor(100000 + Math.random() * 900000); // base 6 digit value is 100k
    return otp.toString();
  };

  const { email, person } = req.body;
  const otp = otpGenerator();
  if (person == "Candidate") {
    try {
      const data = await db.query(
        "SELECT * FROM CANDIDATE_REGISTRATION WHERE EMAIL = $1",
        [email]
      );
      if (data.rowCount == 1) {
        // Setting up Node Mailer :
        let transporter = nodemailer.createTransport({
          service: process.env.AUTH_SERVICE,
          auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS,
          },
        });
        var mailOptions = {
          from: process.env.AUTH_USER,
          to: `${email}`,
          subject: "One Time Password (OTP Code) from Job Portal App",
          text: `Warm Greetings to our Candidate,\nYour OTP Code is ${otp}.Thank you for using our application.\n-Shamim Ahamed.S `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            res.send({
              text: "An Email has been sent to the g-mail. Kindly Enter your 6 digit code.",
              otp: otp,
            });
          }
        });
      } else {
        res.send({ text: "The Email has not been registered.", otp: null });
      }
    } catch (err) {
      console.log(err);
    }
  } else if (person == "Employer") {
    try {
      const data = await db.query(
        "SELECT * FROM EMPLOYER_REGISTRATION WHERE EMAIL = $1",
        [email]
      );
      if (data.rowCount == 1) {
        // Setting up Node Mailer :
        let transporter = nodemailer.createTransport({
          service: process.env.AUTH_SERVICE,
          auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS,
          },
        });
        var mailOptions = {
          from: process.env.AUTH_USER,
          to: `${email}`,
          subject: "One Time Password (OTP Code) from Job Portal App",
          text: `Warm Greetings to our HR/Employer,\nYour OTP Code is ${otp}.Thank you for using our application.\n-Shamim Ahamed.S `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            res.send({
              text: "An Email has been sent to the g-mail. Kindly Enter your 6 digit code.",
              otp: otp,
            });
          }
        });
      } else {
        res.send({ text: "The Email has not been registered.", otp: null });
      }
    } catch (err) {
      console.log(err);
    }
  }
});
// Verify OTP:
app.post("/verifyOTP", async (req, res) => {
  const mailGeneratedOTP = req.body["mailGeneratedOTP"];
  const userGeneratedOTP = req.body["userGeneratedOTP"];
  if (mailGeneratedOTP === userGeneratedOTP) {
    res.send("Successful OTP Validation.");
  } else {
    res.send({
      text: "Wrong OTP.Try Again",
    });
  }
});
// Change Password:
app.post("/changePassword", async (req, res) => {
  const newPassword = req.body["newPassword"];
  const email = req.body["Email"];
  const person = req.body["Person"];
  const saltRounds = 10;
  if (person == "Candidate") {
    try {
      bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
        await db
          .query(
            "UPDATE CANDIDATE_REGISTRATION SET PASSWORD = $1 WHERE EMAIL = $2",
            [hash, email]
          )
          .then(res.send("Password Changed Successfully"));
      });
    } catch (error) {
      console.log(error);
    }
  } else if (person == "Employer") {
    try {
      bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
        await db
          .query(
            "UPDATE EMPLOYER_REGISTRATION SET PASSWORD = $1 WHERE EMAIL = $2",
            [hash, email]
          )
          .then(res.send("Password Changed Successfully"));
      });
    } catch (error) {
      console.log(error);
    }
  }
});
// Getting info for candidate's profile updation:
app.get("/getInfo/:registrationId", async (req, res) => {
  const registrationId = req.params["registrationId"];
  try {
    const data = await db.query(
      "SELECT * FROM CANDIDATE_REGISTRATION WHERE REGISTRATION_ID=$1",
      [registrationId]
    );
    res.send(data.rows);
  } catch (error) {
    console.log(error);
  }
});
// Getting info for image and resume and other details:
app.get("/getCandidateDetails/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM CANDIDATE_DETAILS WHERE EMAIL = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const candidate = result.rows[0];
      res.send({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        address: candidate.address,
        bio: candidate.bio,
        image: candidate.image
          ? `data:image/jpeg;base64,${candidate.image}`
          : null,
        resume: candidate.resume
          ? `data:application/pdf;base64,${candidate.resume}`
          : null,
      });
    } else {
      res.status(404).send({ error: "Candidate not found." });
    }
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching candidate details." });
  }
});
// Save Candidate Details for Profile:
app.post("/saveCandidateDetails",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, email, phone, address, bio } = req.body;
    const imageFile = req.files["image"][0];
    const resumeFile = req.files["resume"][0];
    try {
      // Read image file and convert to Buffer
      const imageData = fs.readFileSync(imageFile.path);
      const imageEncoded = Buffer.from(imageData).toString("base64");

      // Read resume file and convert to Buffer
      const resumeData = fs.readFileSync(resumeFile.path);
      const resumeEncoded = Buffer.from(resumeData).toString("base64");
      await db.query(
        "INSERT INTO CANDIDATE_DETAILS(NAME, EMAIL, PHONE, ADDRESS, BIO, IMAGE, RESUME) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          name,
          email,
          phone,
          address,
          bio,
          imageEncoded, // Storing encoded image as BYTEA
          resumeEncoded, // Storing encoded resume as BYTEA
        ]
      );
      res.send({ text: "Candidate details saved successfully!" });

      // Remove uploaded files after saving to database (optional)
      fs.unlinkSync(imageFile.path);
      fs.unlinkSync(resumeFile.path);
    } catch (error) {
      console.error("Error saving candidate details:", error);
      res
        .status(500)
        .send({ error: "An error occurred while saving candidate details." });
    }
  }
);
// Update Existing Candidate Details for Profile:
app.put("/updateCandidateDetails",
  upload.fields([{ name: "image" }, { name: "resume" }]),
  async (req, res) => {
    const { email, phone, address, bio } = req.body;
    let imageEncoded = null;
    let resumeEncoded = null;

    try {
      // Check if image file is provided
      if (req.files["image"]) {
        const imageFile = fs.readFileSync(req.files["image"][0].path);
        imageEncoded = Buffer.from(imageFile).toString("base64");
        // Remove temporary file
        fs.unlinkSync(req.files["image"][0].path);
      }

      // Check if resume file is provided
      if (req.files["resume"]) {
        const resumeFile = fs.readFileSync(req.files["resume"][0].path);
        resumeEncoded = Buffer.from(resumeFile).toString("base64");
        // Remove temporary file
        fs.unlinkSync(req.files["resume"][0].path);
      }

      // Prepare the update query based on provided fields
      let updateQuery =
        "UPDATE CANDIDATE_DETAILS SET PHONE=$1, ADDRESS=$2, BIO=$3";
      const queryParams = [phone, address, bio];

      // Add image update if provided
      if (imageEncoded !== null) {
        updateQuery += ", IMAGE=$4"; // Adjusted here
        queryParams.push(imageEncoded);
      }

      // Add resume update if provided
      if (resumeEncoded !== null) {
        updateQuery += ", RESUME=$" + (queryParams.length + 1);
        queryParams.push(resumeEncoded);
      }

      // Add email for WHERE clause
      queryParams.push(email);

      // Execute the update query
      await db.query(
        updateQuery + " WHERE EMAIL = $" + queryParams.length,
        queryParams
      );

      res.send({ text: "Candidate details updated successfully!" });
    } catch (error) {
      console.error("Error updating candidate details:", error);
      res
        .status(500)
        .send({ error: "An error occurred while updating candidate details." });
    }
  }
);

app.get("/getCompanyInfo/:registrationId", async (req, res) => {
  const { registrationId } = req.params;
  console.log(registrationId);
  try {
    const result = await db.query(
      "SELECT * FROM EMPLOYER_DETAILS WHERE REGISTRATION_ID = $1",
      [registrationId]
    );

    if (result.rows.length > 0) {
      const data = result.rows[0];
      console.log(data);
      res.send({
        company: data.company,
        overview: data.overview,
        website: data.website,
        industry: data.industry,
        size: data.size,
        specialities: data.specialities,
        image: data.image ? `data:image/jpeg;base64,${data.image}` : null,
      });
    } else {
      res.status(404).send({ error: "Company not found." });
    }
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching candidate details." });
  }
});

app.post("/saveCompanyDetails",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const {
      name,
      overview,
      website,
      industry,
      size,
      specialities,
      registrationId,
    } = req.body;
    const imageFile = req.files["image"][0];
    try {
      // Read image file and convert to Buffer
      const imageData = fs.readFileSync(imageFile.path);
      const imageEncoded = Buffer.from(imageData).toString("base64");

      await db.query(
        "INSERT INTO EMPLOYER_DETAILS(COMPANY, OVERVIEW, WEBSITE, INDUSTRY, SIZE, SPECIALITIES, IMAGE,REGISTRATION_ID) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)",
        [
          name,
          overview,
          website,
          industry,
          size,
          specialities,
          imageEncoded,
          registrationId,
        ]
      );
      res.send({ text: "Company's details saved successfully!" });

      // Remove uploaded files after saving to database (optional)
      fs.unlinkSync(imageFile.path);
    } catch (error) {
      console.error("Error saving company's details:", error);
      res
        .status(500)
        .send({ error: "An error occurred while saving candidate details." });
    }
  }
);

app.put("/updateCompanyDetails",
  upload.fields([{ name: "image" }]),
  async (req, res) => {
    const {
      name,
      overview,
      website,
      industry,
      size,
      specialities,
      registrationId,
    } = req.body;
    let imageEncoded = null;

    try {
      // Check if image file is provided
      if (req.files["image"]) {
        const imageFile = fs.readFileSync(req.files["image"][0].path);
        imageEncoded = Buffer.from(imageFile).toString("base64");
        // Remove temporary file
        fs.unlinkSync(req.files["image"][0].path);
      }

      // Prepare the update query based on provided fields
      let updateQuery =
        "UPDATE EMPLOYER_DETAILS SET COMPANY=$1, OVERVIEW=$2, WEBSITE=$3,INDUSTRY=$4,SIZE=$5,SPECIALITIES=$6";
      const queryParams = [
        name,
        overview,
        website,
        industry,
        size,
        specialities,
      ];

      // Add image update if provided
      if (imageEncoded !== null) {
        updateQuery += ", IMAGE=$7"; // Adjusted here
        queryParams.push(imageEncoded);
      }

      // Add email for WHERE clause
      queryParams.push(registrationId);

      // Execute the update query
      await db.query(
        updateQuery + " WHERE REGISTRATION_ID = $" + queryParams.length,
        queryParams
      );

      res.send({ text: "Company's details updated successfully!" });
    } catch (error) {
      console.error("Error updating Company's details:", error);
      res
        .status(500)
        .send({ error: "An error occurred while updating Company's details." });
    }
  }
);

app.post("/jobPosting", async (req, res) => {
  console.log(req.body);
  try {
    await db
      .query(
        "INSERT INTO JOBS(EMPLOYMENT_TYPE,SKILLSET,RESPONSIBILITIES,SALARY,LOCATION,REGISTRATION_ID,TITLE)VALUES($1,$2,$3,$4,$5,$6,$7)",
        [
          req.body["employmentType"],
          req.body["skillset"],
          req.body["responsibilities"],
          req.body["salaryRange"],
          req.body["location"],
          req.body["registrationId"],
          req.body["jobTitle"],
        ]
      )
      .then(() => {
        res.send({
          text: "Registered job details.",
        });
      });
  } catch (error) {
    console.log(error);
    res.send({
      text: "Could not register job details.",
    });
  }
});
// same regId but multiple jobs...
app.get("/jobsInfo/:registrationId", async (req, res) => {
  const { registrationId } = req.params;
  try {
    const response = await db.query(
      "SELECT * FROM JOBS WHERE REGISTRATION_ID=$1",
      [registrationId]
    );
    const jobs = response.rows.map((job) => {
      return {
        ...job,
        image: job.image
          ? `data:image/jpeg;base64,${Buffer.from(job.image).toString(
              "base64"
            )}`
          : null,
      };
    });
    res.send(jobs);
  } catch (error) {
    console.log(error);
  }
});
app.get("/getJobDetails/:serialNo", async (req, res) => {
  const { serialNo } = req.params;
  try {
    const response = await db.query("SELECT * FROM JOBS WHERE SNO=$1", [
      serialNo,
    ]);
    res.send(response.rows);
  } catch (error) {
    console.log(error);
  }
});
app.put("/updateJobDetails/:serialNo", async (req, res) => {
  const { serialNo } = req.params;
  try {
    const response = await db.query(
      "UPDATE JOBS SET EMPLOYMENT_TYPE=$1,SKILLSET=$2,RESPONSIBILITIES=$3,SALARY=$4,LOCATION=$5,TITLE=$6 WHERE SNO=$7",
      [
        req.body["employment_type"],
        req.body["skillset"],
        req.body["responsibilities"],
        req.body["salary"],
        req.body["location"],
        req.body["Title"],
        serialNo,
      ]
    );
    res.send({ text: "Job details updated successfully!" });
  } catch (error) {
    console.log(error);
  }
});
app.delete("/deleteJob/:serialNo", async (req, res) => {
  const { serialNo } = req.params;
  try {
    const response = await db.query(
      "DELETE FROM JOBS WHERE SNO = $1 RETURNING *",
      [serialNo]
    );
    if (response.rowCount > 0) {
      res.send({ success: true });
    } else {
      res.status(404).send({ error: "Job not found." });
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the job." });
  }
});
// Listing all Jobs on Candidate Homepage:
app.get("/listAllJobs", async (req, res) => {
  console.log("Request received!");
  try {
    const response = await db.query(
      "SELECT JOBS.SNO, COMPANY, SIZE, EMPLOYER_DETAILS.IMAGE, EMPLOYMENT_TYPE, SKILLSET, RESPONSIBILITIES, SALARY, LOCATION, TITLE FROM EMPLOYER_DETAILS INNER JOIN JOBS ON EMPLOYER_DETAILS.REGISTRATION_ID=JOBS.REGISTRATION_ID"
    );
    const jobs = response.rows.map((job) => {
      return {
        ...job,
        image: `data:image/jpeg;base64,${job.image}`,
      };
    });
    res.send(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});
app.post("/jobApplication",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  async (req, res) => {
    const { registrationId, name, email, phone, address, company, title } =
      req.body;
    const imageProcess = Buffer.from(
      req.body.image.replace(/^data:image\/jpeg;base64,/, ""),
      "base64"
    );
    const resumeProcess = Buffer.from(
      Buffer.from(
        req.body.resume.replace(/^data:application\/pdf;base64,/, ""),
        "base64"
      )
    );

    try {
      await db.query(
        "INSERT INTO APPLICATION_MANAGER(REGISTRATION_ID, IMAGE, NAME, EMAIL, PHONE, ADDRESS, RESUME, COMPANY, TITLE) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          registrationId,
          imageProcess,
          name,
          email,
          phone,
          address,
          resumeProcess,
          company,
          title,
        ]
      );
      res.send({ text: "Application saved successfully!" });
    } catch (error) {
      console.error("Error saving your application:", error);
      res
        .status(500)
        .send({ error: "An error occurred while saving your application." });
    }
  }
);
app.get("/CompaniesApplied/:registrationId", async (req, res) => {
  const { registrationId } = req.params;
  try {
    const response = await db.query(
      "SELECT * FROM APPLICATION_MANAGER WHERE REGISTRATION_ID=$1",
      [registrationId]
    );
    const jobs = response.rows.map((job) => {
      return {
        ...job,
        image: job.image
          ? `data:image/jpeg;base64,${Buffer.from(job.image).toString(
              "base64"
            )}`
          : null,
        resume: job.resume
          ? `data:application/pdf;base64,${Buffer.from(job.resume).toString(
              "base64"
            )}`
          : null,
      };
    });
    res.send(jobs);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/deleteApplication", async (req, res) => {
  const { sno } = req.body;
  try {
    await db.query("DELETE FROM APPLICATION_MANAGER WHERE SNO = $1", [sno]);
    res.send({ text: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the application." });
  }
});

app.get("/applicationInfo/:company", async (req, res) => {
  const { company } = req.params;
  try {
    const response = await db.query(
      "SELECT * FROM APPLICATION_MANAGER WHERE COMPANY=$1",
      [company]
    );
    const jobs = response.rows.map((job) => {
      return {
        ...job,
        image: job.image
          ? `data:image/jpeg;base64,${Buffer.from(job.image).toString(
              "base64"
            )}`
          : null,
        resume: job.resume
          ? `data:application/pdf;base64,${Buffer.from(job.resume).toString(
              "base64"
            )}`
          : null,
      };
    });
    res.send(jobs);
  } catch (error) {
    console.log(error); 
  }
});
// Rejecting a candidate's Application: 
app.post('/rejectApplication',async(req,res)=>{
  const sno=req.body.sno;
  try {
    await db.query('DELETE FROM APPLICATION_MANAGER WHERE SNO=$1',[sno])
    .then(()=>{
      res.send({
        text:"Candidate's Application has been rejected successfully."
      })
    })

    

  } catch (error) {
    console.log(error)
  }
})