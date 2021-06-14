/**
 * validRule

 *
 * Version 1.0
 *
 * Date: 06-10-2021
 *
 * Copyright
 *
 * Modification Logs:
 * DATE                 AUTHOR          DESCRIPTION
 * -----------------------------------------------------------------------
 * 06-10-2021	         LyNTT9           Create
 */
export const validRule = {
    fullname:   {
      required: true,
      pattern: /^([a-z']+(-| )?)+$/i,
      message: "Full name don't have the symbols and much space"
      },

    majorid: {
      required: true, message: "Please choose the major id"
    },

    birthday: { required: true, message: "Please choose birthday " },

    phone: {
      required: true,
      pattern: /^0[0-9]{9}$/g,
      message: "Phone number must contain 10 numbers and start by number 0"
    },

    classname:{
      required: true, message: "Please fill Class Name"
    },

    numbertotal: {
      required: true,
      pattern:   /^\b([1-9]|[1-9][0-9]|100)\b/g,
      message: "Number of max students in class between 1-100"
    },

    semester:{
      required: true,
      pattern: /^\b([1-9]|9)\b/g,
      message: "Enter in range from 1 - 9"
    },

   studentCode:{
      pattern: /^[a-zA-Z0-9_.-]*$/g,
      message: "Student Code include letter and number"
    },

    password:{
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g,
      message: "Password must include at least 1 number, 1 uppercase letter, 1 special characters and min 8 characters"
    },

    certification:{
      required: true,
      message: "Please choose the certification"
    },
    
    gender:{
      required: true,
      message: "Please choose the gender"
    }
  }