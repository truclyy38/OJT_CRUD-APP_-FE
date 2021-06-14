import axios from 'axios';
import { IClasses } from '../../@types/IClasses';
import { IRegister } from '../../@types/IRegister';
import { IUser } from "../../@types/IUser";
import { TOKEN } from '../../constansts/token';

const STUDENT_API_BASE_URL = "http://localhost:8080/api/user/role/3";
const TEACHER_API_BASE_URL = "http://localhost:8080/api/user/role/2";
const USER_API_BASE_URL = "http://localhost:8080/api/user";

const MAJOR_API_BASE_URL ="http://localhost:8080/api/major";

const CERTI_API_BASE_URL ="http://localhost:8080/api/certification";
const CLASS_API_BASE_URL ="http://localhost:8080/api/classes"

const API_COURSE ="http://localhost:8080/api/course";
const REGISTER_API_BASE_URL="http://localhost:8080/api/register"

// token:
const header = {
    headers: {
        'Authorization': `${TOKEN}`,
        'Content-Type': 'application/json'
    }
}

/**
 * Data
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

// user
export function getStudents() {
    return axios.get(STUDENT_API_BASE_URL, header);
}

export function getTeachers() {

    return axios.get(TEACHER_API_BASE_URL, header);
}

export function putUserByID(userid: any, user: IUser) {
    return axios.put(`http://localhost:8080/api/user/${userid}`, user, header)
}

export function getUserByID(userid: any) {
    return axios.get(`http://localhost:8080/api/user/${userid}`,header)
}

export function getUserByName(username: any) {
    return axios.get(`http://localhost:8080/api/user/name/${username}`,header)
}

export function getUserByStudentCode(code: string) {
    return axios.get(`http://localhost:8080/api/user/code/${code}`,header)
}

export function deleteStudent(studentid: number) {
    return axios.put(`http://localhost:8080/api/user/delete/${studentid}`, '', header);
}

// course
export function getCourse() {

    return axios.get(API_COURSE, header);
}

// class
export function getCourseByClass(semester: any, majorid:any) {

    return axios.get(`http://localhost:8080/api/course/major/${majorid}/semester/${semester}`, header);
}

// majors
export function getMajors() {

    return axios.get(MAJOR_API_BASE_URL, header);
}

export function getMajorByID(id:any) {

    return axios.get(`http://localhost:8080/api/major/${id}`,header);
}

// certification

export function getCertification() {

    return axios.get(CERTI_API_BASE_URL, header);
}

export function getCertificationByID(id:number) {

    return axios.get(`http://localhost:8080/api/certification/${id}`,header);
}

// class

export function getClasses() {

    return axios.get(CLASS_API_BASE_URL, header);
}

export function getClassByName(name: any) {

    return axios.get(`http://localhost:8080/api/classes/${name}`, header);
}

// checkExistSttudentByCode
// class
export const createClass = async (classes: IClasses) => {
    const response = await axios.post(CLASS_API_BASE_URL, classes, header);
    return await response.data;
};

// register student
export const registerStudent = async (register: IRegister) => {
    const response = await axios.post(REGISTER_API_BASE_URL, register, header);
    return await response.data;
};

// convert HTTP
export const deleteUser = async (studentId: number) => {
    const response = await axios.put(`http://localhost:8080/api/user/delete/${studentId}`, '', header);
    return await response.data
}

export const createUser = async (student: IUser) => {
    const response = await axios.post(USER_API_BASE_URL, student, header);
    return await response.data;
};

export const editUserById = async (user: IUser) => {
    const response = await axios.put(`http://localhost:8080/api/user/${user.id}`, user, header);
    return await response.data;
};

export const checkExistUser = async (id: number) => {
    const response = await axios.get(`http://localhost:8080/api/user/${id}`, header);
    return await response.data;
};

export const checkExistStudentByCode = async (code: string) => {
    const response = await axios.get(`http://localhost:8080/api/user/code/${code}`, header);
    return await response.data;
};

export const deleteClasses = async (name: number) => {
    const response = await axios.delete(`http://localhost:8080/api/classes/${name}`, header);
    return await response.data;
};



