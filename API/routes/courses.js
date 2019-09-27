const express = require("express");
const authUser = require("../auth");
const { User, Course, sequelize } = require("../models");
const router = express.Router();
const { check, validationResult } = require('express-validator');

// update sequelize model queries for the Courses endpoint GET routes to filter out the following properties
const filter = {
  include: [
    {
      model: User,
      attributes: { exclude: ["password", "createdAt", "updatedAt"] }
    }
  ],
  attributes: { exclude: ["createdAt", "updatedAt"] }
};
//returns a list of courses(including the user that owns each course)
router.get("/courses", async (req, res) => {
  const allCourses = await Course.findAll(filter);
  res.status(200).json(allCourses);
});

//Returns a the course(including the user that owns the course) for the provided course ID
router.get("/courses/:id", async (req, res, next) => {
  let err = {};
  const courses = await Course.findByPk(req.params.id, filter);
  if (courses == null) {
    err.message = "Course not found";
    err.status = 404; // Status Not Found
    next(err);
  } else {
    res.status(200).json(courses);
  }
});

router.post('/courses', authUser, async ( req, res, next ) => {
  const { title, description, estimatedTime, materialsNeeded } = req.body;
  const userId = req.currentUser.id
  
  try{

      await Course.create({
          title,
          description,
          estimatedTime,
          materialsNeeded,
          userId
      });

      res.location(`${req.originalUrl}/${req.currentUser.id}`);
      res.status(201);
      res.end();
} catch (err) {

  if(err.name === 'SequelizeValidationError'){
      err.message = err.errors.map(val => val.message);    
      err.status = 400;
  }

  next(err);
  }
});




// Updates a course and returns no content
router.put("/courses/:id", authUser, async (req, res, next) => {
  const { title, description, estimatedTime, materialsNeeded } = req.body;
  const userId = req.currentUser.id;
  const err = new Error();

  try {
    const course = await Course.findByPk(req.params.id, filter);
    //if object is empty throw error
    if (Object.keys(req.body).length === 0) {
      err.status = 400; //Bad Request-The server cannot or will not process the request due to an apparent client error
      err.message = "No empty objects";
      throw err;
    } else if (course === null) {
      err.status = 404; //Not Found-The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
      err.message = "I'm sorry, unable to update due to courses not found";
      throw err;
    } else {
      const courseUserId = course.toJSON().User.id;

      if (userId === courseUserId) {
        await Course.update(
          {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId
          },
          {
            where: {
              id: `${req.params.id}`,
              userId: `${userId}`
            }
          }
        );

        res.status(204).end();  //No content-The server successfully processed the request and is not returning any content
      } else {
        err.status = 403; //Forbidden-The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource
        err.message = "Unable to update other users's courses";
        throw err;
      }
    }
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      err.message = err.errors.map(val => val.message);
      err.status = 400; //Bad Request-The server cannot or will not process the request due to an apparent client error
    }

    next(err);
  }
});

//Deletes a course and returns no content
router.delete("/courses/:id", authUser, async (req, res, next) => {
  try {
    const userid = req.currentUser.id;
    const course = await Course.findByPk(req.params.id, filter);
    console.log(`Output => : course`, course);
    const err = new Error();

    if (course === null) {
      err.status = 404;// NOT FOUND STATUS
      err.message = "I'm sorry, unable to delete due to courses not found";
      throw err;
    } else {
      const courseUserId = course.toJSON().User.id;

      if (userid === courseUserId) {
        await Course.destroy({
          where: {
            id: `${req.params.id}`
          }
        });

        res.status(204).end();  // NO CONTENT STATUS
      } else {
        err.status = 403; // FORBIDDEN STATUS
        err.message = "Unable to delete other users's courses";
        throw err;
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;