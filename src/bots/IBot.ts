import Course from '../models/Course';

export default interface IBot {
    start(): Promise<void>,
    stop(): Promise<void>,
    getCourses(): Promise<Course[]>
}